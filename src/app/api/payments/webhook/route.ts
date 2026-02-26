import { PaymentStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { mapPaymentStatusToOrderStatus } from "@/lib/payments";

type WebhookBody = {
    eventId?: string;
    eventType?: string;
    provider?: string;
    providerPaymentId?: string;
    orderId?: string;
    status?: string;
    amount?: number;
    message?: string;
    raw?: unknown;
};

function normalizePaymentStatus(status?: string, eventType?: string): PaymentStatus | null {
    const normalizedStatus = String(status || "").toUpperCase();
    const normalizedEvent = String(eventType || "").toLowerCase();

    if (["PAID", "SUCCEEDED", "SUCCESS"].includes(normalizedStatus)) return PaymentStatus.PAID;
    if (["PROCESSING", "REQUIRES_ACTION"].includes(normalizedStatus)) return PaymentStatus.PROCESSING;
    if (["FAILED", "FAILURE", "CANCELED", "CANCELLED"].includes(normalizedStatus)) {
        return PaymentStatus.FAILED;
    }
    if (["EXPIRED"].includes(normalizedStatus)) return PaymentStatus.EXPIRED;
    if (["REFUNDED"].includes(normalizedStatus)) return PaymentStatus.REFUNDED;
    if (["PENDING"].includes(normalizedStatus)) return PaymentStatus.PENDING;

    if (normalizedEvent.includes("succeeded") || normalizedEvent.includes("paid")) {
        return PaymentStatus.PAID;
    }
    if (normalizedEvent.includes("refund")) return PaymentStatus.REFUNDED;
    if (normalizedEvent.includes("expired")) return PaymentStatus.EXPIRED;
    if (normalizedEvent.includes("fail")) return PaymentStatus.FAILED;
    if (normalizedEvent.includes("process")) return PaymentStatus.PROCESSING;

    return null;
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as WebhookBody;
        const provider = body.provider || "STRIPE";
        const providerPaymentId = body.providerPaymentId;
        const orderId = body.orderId;
        const eventType = body.eventType || "webhook.unknown";
        const eventId = body.eventId || `${provider}-${Date.now()}`;
        const idempotencyKey = `${provider}:${eventId}`;
        const normalizedStatus = normalizePaymentStatus(body.status, eventType);

        if (!providerPaymentId && !orderId) {
            return NextResponse.json(
                { error: "providerPaymentId ou orderId e obrigatorio" },
                { status: 400 }
            );
        }

        if (!normalizedStatus) {
            return NextResponse.json({ error: "status nao reconhecido" }, { status: 400 });
        }

        const duplicate = await prisma.paymentAttempt.findFirst({
            where: { idempotencyKey },
            select: { id: true, orderId: true },
        });
        if (duplicate) {
            return NextResponse.json({
                ok: true,
                alreadyProcessed: true,
                orderId: duplicate.orderId,
            });
        }

        const order = await prisma.order.findFirst({
            where: providerPaymentId
                ? { providerPaymentId }
                : { id: orderId },
            select: { id: true, status: true },
        });

        if (!order) {
            return NextResponse.json({ error: "Pedido nao encontrado" }, { status: 404 });
        }

        const mappedOrderStatus = mapPaymentStatusToOrderStatus(normalizedStatus);

        const updated = await prisma.$transaction(async (tx) => {
            await tx.paymentAttempt.create({
                data: {
                    orderId: order.id,
                    provider,
                    eventType,
                    status: normalizedStatus,
                    externalId: providerPaymentId || order.id,
                    idempotencyKey,
                    amount: typeof body.amount === "number" ? body.amount : undefined,
                    currency: "BRL",
                    payload: body.raw ?? body,
                    errorMessage: body.message || null,
                    processedAt: new Date(),
                },
            });

            return tx.order.update({
                where: { id: order.id },
                data: {
                    paymentStatus: normalizedStatus,
                    status: mappedOrderStatus || undefined,
                    paidAt: normalizedStatus === PaymentStatus.PAID ? new Date() : undefined,
                    paymentError:
                        normalizedStatus === PaymentStatus.FAILED ? body.message || "Falha no pagamento" : null,
                },
                select: {
                    id: true,
                    orderNumber: true,
                    status: true,
                    paymentStatus: true,
                    paidAt: true,
                },
            });
        });

        return NextResponse.json({ ok: true, order: updated });
    } catch (error) {
        console.error("Error handling payment webhook:", error);
        return NextResponse.json({ error: "Erro ao processar webhook de pagamento" }, { status: 500 });
    }
}

