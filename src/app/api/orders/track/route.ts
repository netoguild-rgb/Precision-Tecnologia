import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function normalizeOrderNumber(input: string): string {
    return input.trim().toUpperCase().replace(/\s+/g, "");
}

function normalizeEmail(input: string): string {
    return input.trim().toLowerCase();
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const orderNumber = normalizeOrderNumber(String(body?.orderNumber ?? ""));
        const email = normalizeEmail(String(body?.email ?? ""));

        if (!orderNumber || !email) {
            return NextResponse.json(
                { error: "Informe numero do pedido e email" },
                { status: 400 }
            );
        }

        const order = await prisma.order.findFirst({
            where: {
                orderNumber,
                user: { email },
            },
            select: {
                id: true,
                orderNumber: true,
                createdAt: true,
                updatedAt: true,
                subtotal: true,
                discount: true,
                shipping: true,
                tax: true,
                total: true,
                status: true,
                paymentMethod: true,
                paymentStatus: true,
                paymentReference: true,
                paymentExpiresAt: true,
                paidAt: true,
                shippingMethod: true,
                trackingCode: true,
                shippedAt: true,
                deliveredAt: true,
                items: {
                    select: {
                        id: true,
                        productName: true,
                        productSku: true,
                        quantity: true,
                        unitPrice: true,
                        totalPrice: true,
                    },
                    orderBy: { id: "asc" },
                },
            },
        });

        if (!order) {
            return NextResponse.json(
                { error: "Pedido nao encontrado para os dados informados" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            order,
        });
    } catch (error) {
        console.error("Error tracking order:", error);
        return NextResponse.json(
            { error: "Erro ao consultar rastreamento" },
            { status: 500 }
        );
    }
}

