import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { authSecret } from "@/lib/auth-secret";
import { isSuperAdminUser } from "@/lib/super-admin";

function normalizeOrderNumber(input: string): string {
    return input.trim().toUpperCase().replace(/\s+/g, "");
}

function normalizeEmail(input: string): string {
    return input.trim().toLowerCase();
}

export async function POST(request: NextRequest) {
    try {
        const token = (await getToken({
            req: request,
            secret: authSecret,
        })) as { id?: string; email?: string } | null;

        let canEditDelivery = false;
        if (token?.id || token?.email) {
            const user = token.id
                ? await prisma.user.findUnique({
                    where: { id: String(token.id) },
                    select: { role: true, email: true },
                })
                : await prisma.user.findUnique({
                    where: { email: String(token.email).toLowerCase() },
                    select: { role: true, email: true },
                });

            canEditDelivery = isSuperAdminUser(user);
        }

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
                notes: true,
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
            permissions: {
                canEditDelivery,
            },
        });
    } catch (error) {
        console.error("Error tracking order:", error);
        return NextResponse.json(
            { error: "Erro ao consultar rastreamento" },
            { status: 500 }
        );
    }
}
