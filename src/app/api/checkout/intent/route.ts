import { Prisma, PaymentMethod } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth-user";
import {
    type CheckoutPaymentMethod,
    generateOrderNumber,
    loadPaymentPolicyConfigFromDb,
    loadPaymentSettingsMap,
    resolvePaymentPolicy,
} from "@/lib/payments";

type IntentItemInput = {
    productId: string;
    quantity: number;
};

type AddressInput = {
    label?: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
    isDefault?: boolean;
};

const ALLOWED_METHODS: CheckoutPaymentMethod[] = [
    "PIX",
    "CREDIT_CARD",
    "BOLETO",
    "BANK_TRANSFER",
    "B2B_INVOICE",
];

function toValidItems(raw: unknown): IntentItemInput[] {
    if (!Array.isArray(raw)) return [];

    return raw
        .map((item) => {
            if (!item || typeof item !== "object") return null;
            const productId = "productId" in item ? String(item.productId ?? "") : "";
            const quantityValue = "quantity" in item ? Number(item.quantity) : 0;
            const quantity = Number.isFinite(quantityValue) ? Math.floor(quantityValue) : 0;
            if (!productId || quantity <= 0) return null;
            return { productId, quantity };
        })
        .filter((item): item is IntentItemInput => item !== null);
}

function toAddress(raw: unknown): AddressInput | null {
    if (!raw || typeof raw !== "object") return null;
    const data = raw as Record<string, unknown>;

    const required = ["street", "number", "neighborhood", "city", "state", "zipCode"];
    for (const key of required) {
        if (!data[key] || typeof data[key] !== "string") return null;
    }

    return {
        label: typeof data.label === "string" ? data.label : "Endereco de entrega",
        street: String(data.street),
        number: String(data.number),
        complement: typeof data.complement === "string" ? data.complement : undefined,
        neighborhood: String(data.neighborhood),
        city: String(data.city),
        state: String(data.state),
        zipCode: String(data.zipCode),
        country: typeof data.country === "string" ? data.country : "BR",
        isDefault: Boolean(data.isDefault),
    };
}

function parseMethod(raw: unknown): CheckoutPaymentMethod | null {
    if (typeof raw !== "string") return null;
    const method = raw.toUpperCase() as CheckoutPaymentMethod;
    return ALLOWED_METHODS.includes(method) ? method : null;
}

function toPrismaMethod(method: CheckoutPaymentMethod): PaymentMethod {
    return method as PaymentMethod;
}

function isUniqueOrderError(error: unknown): boolean {
    return (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002" &&
        Array.isArray(error.meta?.target) &&
        (error.meta?.target as string[]).includes("orderNumber")
    );
}

export async function POST(request: NextRequest) {
    try {
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
        }

        const body = await request.json();
        const items = toValidItems(body.items);
        const paymentMethod = parseMethod(body.paymentMethod);
        const installmentsRaw = Number(body.installments);
        const installments = Number.isFinite(installmentsRaw) ? Math.floor(installmentsRaw) : 1;
        const invoiceDueDaysRaw = Number(body.invoiceDueDays);
        const invoiceDueDays = Number.isFinite(invoiceDueDaysRaw)
            ? Math.floor(invoiceDueDaysRaw)
            : null;
        const notes = typeof body.notes === "string" ? body.notes : null;
        const addressInput = toAddress(body.address);
        const idempotencyKey =
            request.headers.get("x-idempotency-key") ||
            (typeof body.idempotencyKey === "string" ? body.idempotencyKey : null);

        if (!paymentMethod) {
            return NextResponse.json({ error: "Metodo de pagamento invalido" }, { status: 400 });
        }

        if (items.length === 0) {
            return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
        }

        const products = await prisma.product.findMany({
            where: { id: { in: items.map((item) => item.productId) }, status: "ACTIVE" },
            select: {
                id: true,
                sku: true,
                name: true,
                price: true,
                stockQty: true,
            },
        });

        const productMap = new Map(products.map((product) => [product.id, product]));
        const missingProductIds = items
            .filter((item) => !productMap.has(item.productId))
            .map((item) => item.productId);
        if (missingProductIds.length > 0) {
            return NextResponse.json(
                {
                    error: "Um ou mais produtos nao foram encontrados",
                    missingProductIds,
                },
                { status: 400 }
            );
        }

        const insufficientStock = items
            .map((item) => {
                const product = productMap.get(item.productId);
                if (!product) return null;
                if (product.stockQty <= 0) return null;
                return item.quantity > product.stockQty
                    ? { productId: item.productId, available: product.stockQty, requested: item.quantity }
                    : null;
            })
            .filter((item) => item !== null);
        if (insufficientStock.length > 0) {
            return NextResponse.json(
                {
                    error: "Quantidade solicitada maior que estoque disponivel",
                    insufficientStock,
                },
                { status: 400 }
            );
        }

        const subtotal = items.reduce((sum, item) => {
            const product = productMap.get(item.productId);
            if (!product) return sum;
            return sum + Number(product.price) * item.quantity;
        }, 0);

        const profile = user.cnpj ? "B2B" : "B2C";
        const config = await loadPaymentPolicyConfigFromDb();
        const policy = resolvePaymentPolicy(
            {
                profile,
                amount: subtotal,
                hasApprovedCredit: Boolean(user.cnpj),
                creditLimitRemaining: null,
                isFirstPurchase: user.orders.length === 0,
                isRecurringCharge: false,
            },
            config
        );

        const selectedMethod = policy.methods.find((method) => method.method === paymentMethod);
        if (!selectedMethod?.enabled) {
            return NextResponse.json(
                {
                    error: selectedMethod?.reason || "Metodo nao permitido para este pedido",
                },
                { status: 400 }
            );
        }

        let addressId = user.addresses[0]?.id ?? null;
        if (addressInput) {
            const address = await prisma.address.create({
                data: {
                    userId: user.id,
                    label: addressInput.label,
                    street: addressInput.street,
                    number: addressInput.number,
                    complement: addressInput.complement || null,
                    neighborhood: addressInput.neighborhood,
                    city: addressInput.city,
                    state: addressInput.state,
                    zipCode: addressInput.zipCode,
                    country: addressInput.country || "BR",
                    isDefault: Boolean(addressInput.isDefault),
                },
            });
            addressId = address.id;
        }

        if (!addressId) {
            return NextResponse.json(
                { error: "Informe um endereco para finalizar a compra" },
                { status: 400 }
            );
        }

        if (paymentMethod === "B2B_INVOICE" && !policy.b2bInvoiceTermsDays.length) {
            return NextResponse.json(
                { error: "Faturamento B2B indisponivel" },
                { status: 400 }
            );
        }

        const sanitizedInstallments =
            paymentMethod === "CREDIT_CARD"
                ? Math.min(Math.max(installments || 1, 1), policy.maxInstallments)
                : 1;

        const selectedInvoiceDueDays =
            paymentMethod === "B2B_INVOICE"
                ? invoiceDueDays && policy.b2bInvoiceTermsDays.includes(invoiceDueDays)
                    ? invoiceDueDays
                    : policy.b2bInvoiceTermsDays[0]
                : null;

        if (paymentMethod === "B2B_INVOICE" && !selectedInvoiceDueDays) {
            return NextResponse.json(
                { error: "Prazo de faturamento invalido" },
                { status: 400 }
            );
        }

        const discount =
            paymentMethod === "PIX"
                ? Number(((subtotal * policy.pixDiscountPercent) / 100).toFixed(2))
                : 0;

        const shipping = 0;
        const tax = 0;
        const total = Number((subtotal - discount + shipping + tax).toFixed(2));

        const settingsMap = await loadPaymentSettingsMap();
        const providerCode = settingsMap.payment_provider || "STRIPE";
        const now = new Date();
        const pixExpirationMinutes = Number(settingsMap.pix_expiration_minutes || "30");
        const boletoDueDays = Number(settingsMap.boleto_due_days || "2");

        let paymentExpiresAt: Date | null = null;
        if (paymentMethod === "PIX") {
            paymentExpiresAt = new Date(now.getTime() + pixExpirationMinutes * 60 * 1000);
        } else if (paymentMethod === "BOLETO") {
            paymentExpiresAt = new Date(now.getTime() + boletoDueDays * 24 * 60 * 60 * 1000);
        } else if (paymentMethod === "B2B_INVOICE" && selectedInvoiceDueDays) {
            paymentExpiresAt = new Date(now.getTime() + selectedInvoiceDueDays * 24 * 60 * 60 * 1000);
        }

        const providerPaymentId = `pending_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
        const paymentReference =
            paymentMethod === "PIX"
                ? `PIX-${providerPaymentId.slice(-8).toUpperCase()}`
                : paymentMethod === "BOLETO"
                    ? `BOL-${providerPaymentId.slice(-8).toUpperCase()}`
                    : paymentMethod === "B2B_INVOICE"
                        ? `FAT-${providerPaymentId.slice(-8).toUpperCase()}`
                        : null;

        let orderId = "";
        let orderNumber = "";
        for (let attempt = 0; attempt < 3; attempt += 1) {
            const generatedOrderNumber = await generateOrderNumber();

            try {
                const created = await prisma.order.create({
                    data: {
                        orderNumber: generatedOrderNumber,
                        userId: user.id,
                        addressId,
                        subtotal,
                        shipping,
                        discount,
                        tax,
                        total,
                        paymentMethod: toPrismaMethod(paymentMethod),
                        paymentStatus: "PENDING",
                        paymentProvider: providerCode,
                        providerPaymentId,
                        paymentReference,
                        paymentExpiresAt,
                        installments: sanitizedInstallments,
                        invoiceDueDays: selectedInvoiceDueDays,
                        notes,
                        items: {
                            create: items.map((item) => {
                                const product = productMap.get(item.productId);
                                if (!product) {
                                    throw new Error("Product mapping inconsistency");
                                }
                                const unitPrice = Number(product.price);
                                return {
                                    productId: item.productId,
                                    productName: product.name,
                                    productSku: product.sku,
                                    quantity: item.quantity,
                                    unitPrice,
                                    totalPrice: Number((unitPrice * item.quantity).toFixed(2)),
                                };
                            }),
                        },
                    },
                    select: { id: true, orderNumber: true },
                });

                orderId = created.id;
                orderNumber = created.orderNumber;
                break;
            } catch (error) {
                if (attempt < 2 && isUniqueOrderError(error)) {
                    continue;
                }
                throw error;
            }
        }

        if (!orderId) {
            return NextResponse.json(
                { error: "Nao foi possivel criar o pedido" },
                { status: 500 }
            );
        }

        const attemptPayload = JSON.parse(
            JSON.stringify({
                paymentMethod,
                installments: sanitizedInstallments,
                invoiceDueDays: selectedInvoiceDueDays,
                policy,
            })
        ) as Prisma.InputJsonValue;

        await prisma.paymentAttempt.create({
            data: {
                orderId,
                provider: providerCode,
                eventType: "checkout.intent.created",
                status: "PENDING",
                externalId: providerPaymentId,
                idempotencyKey,
                amount: total,
                currency: "BRL",
                payload: attemptPayload,
            },
        });

        return NextResponse.json(
            {
                orderId,
                orderNumber,
                profile,
                amounts: {
                    subtotal,
                    discount,
                    shipping,
                    tax,
                    total,
                },
                payment: {
                    method: paymentMethod,
                    status: "PENDING",
                    provider: providerCode,
                    providerPaymentId,
                    paymentReference,
                    paymentExpiresAt,
                    installments: sanitizedInstallments,
                    invoiceDueDays: selectedInvoiceDueDays,
                    require3DS: policy.require3DS && paymentMethod === "CREDIT_CARD",
                },
                nextAction:
                    paymentMethod === "PIX"
                        ? "Gerar QR Code Pix com o provider selecionado"
                        : paymentMethod === "BOLETO"
                            ? "Gerar boleto e apresentar linha digitavel"
                            : paymentMethod === "CREDIT_CARD"
                                ? "Criar PaymentIntent e coletar dados de cartao"
                                : paymentMethod === "B2B_INVOICE"
                                    ? "Aguardar aprovacao comercial para faturamento"
                                    : "Aguardar confirmacao bancaria",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating checkout intent:", error);
        return NextResponse.json({ error: "Erro ao criar intent de checkout" }, { status: 500 });
    }
}
