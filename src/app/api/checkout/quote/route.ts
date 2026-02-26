import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
    type CheckoutProfile,
    loadPaymentPolicyConfigFromDb,
    resolvePaymentPolicy,
} from "@/lib/payments";

type QuoteItemInput = {
    productId: string;
    quantity: number;
};

function toValidItems(raw: unknown): QuoteItemInput[] {
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
        .filter((item): item is QuoteItemInput => item !== null);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const items = toValidItems(body.items);
        const manualAmount = Number(body.amount);
        const profile = (body.profile === "B2B" ? "B2B" : "B2C") as CheckoutProfile;
        const hasApprovedCredit = Boolean(body.hasApprovedCredit);
        const creditLimitRemaining =
            body.creditLimitRemaining == null ? null : Number(body.creditLimitRemaining);
        const isFirstPurchase = Boolean(body.isFirstPurchase);
        const isRecurringCharge = Boolean(body.isRecurringCharge);

        let amount = Number.isFinite(manualAmount) && manualAmount > 0 ? manualAmount : 0;

        if (items.length > 0) {
            const products = await prisma.product.findMany({
                where: { id: { in: items.map((item) => item.productId) }, status: "ACTIVE" },
                select: { id: true, price: true, name: true },
            });

            const productMap = new Map(products.map((product) => [product.id, product]));
            const missing = items.filter((item) => !productMap.has(item.productId));
            if (missing.length > 0) {
                return NextResponse.json(
                    {
                        error: "Um ou mais itens nao estao disponiveis",
                        missingProductIds: missing.map((item) => item.productId),
                    },
                    { status: 400 }
                );
            }

            amount = items.reduce((sum, item) => {
                const product = productMap.get(item.productId);
                if (!product) return sum;
                return sum + Number(product.price) * item.quantity;
            }, 0);
        }

        if (!Number.isFinite(amount) || amount <= 0) {
            return NextResponse.json(
                { error: "Informe um amount valido ou itens validos" },
                { status: 400 }
            );
        }

        const config = await loadPaymentPolicyConfigFromDb();
        const policy = resolvePaymentPolicy(
            {
                profile,
                amount,
                hasApprovedCredit,
                creditLimitRemaining,
                isFirstPurchase,
                isRecurringCharge,
            },
            config
        );

        return NextResponse.json({
            amount,
            profile,
            policy,
        });
    } catch (error) {
        console.error("Error generating checkout quote:", error);
        return NextResponse.json({ error: "Erro ao gerar simulacao de pagamento" }, { status: 500 });
    }
}

