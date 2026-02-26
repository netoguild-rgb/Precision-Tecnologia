import { OrderStatus, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { authSecret } from "@/lib/auth-secret";
import { isSuperAdminUser } from "@/lib/super-admin";

const ALLOWED_STATUSES: OrderStatus[] = [
    OrderStatus.PENDING,
    OrderStatus.PAID,
    OrderStatus.PROCESSING,
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED,
    OrderStatus.REFUNDED,
];

function normalizeNullableString(input: unknown, maxLength: number): string | null {
    if (input == null) return null;
    const value = String(input).trim();
    if (!value) return null;
    return value.slice(0, maxLength);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = (await getToken({
            req: request,
            secret: authSecret,
        })) as { id?: string; email?: string } | null;

        if (!token?.id && !token?.email) {
            return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
        }

        const authUser = token.id
            ? await prisma.user.findUnique({
                where: { id: String(token.id) },
                select: { role: true, email: true },
            })
            : await prisma.user.findUnique({
                where: { email: String(token?.email).toLowerCase() },
                select: { role: true, email: true },
            });

        if (!isSuperAdminUser(authUser)) {
            return NextResponse.json(
                { error: "Somente super admin pode editar a entrega" },
                { status: 403 }
            );
        }

        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "ID de pedido invalido" }, { status: 400 });
        }

        const body = await request.json();
        const deliveryDescription =
            body.deliveryDescription === undefined
                ? undefined
                : normalizeNullableString(body.deliveryDescription, 1200);
        const shippingMethod =
            body.shippingMethod === undefined
                ? undefined
                : normalizeNullableString(body.shippingMethod, 120);
        const trackingCode =
            body.trackingCode === undefined
                ? undefined
                : normalizeNullableString(body.trackingCode, 120);

        let status: OrderStatus | undefined;
        if (body.status !== undefined) {
            const normalizedStatus = String(body.status).toUpperCase() as OrderStatus;
            if (!ALLOWED_STATUSES.includes(normalizedStatus)) {
                return NextResponse.json({ error: "Status de pedido invalido" }, { status: 400 });
            }
            status = normalizedStatus;
        }

        const existing = await prisma.order.findUnique({
            where: { id },
            select: {
                id: true,
                shippedAt: true,
                deliveredAt: true,
            },
        });

        if (!existing) {
            return NextResponse.json({ error: "Pedido nao encontrado" }, { status: 404 });
        }

        const data: Prisma.OrderUpdateInput = {};
        if (deliveryDescription !== undefined) data.notes = deliveryDescription;
        if (shippingMethod !== undefined) data.shippingMethod = shippingMethod;
        if (trackingCode !== undefined) data.trackingCode = trackingCode;
        if (status) data.status = status;

        if (status === OrderStatus.SHIPPED && !existing.shippedAt) {
            data.shippedAt = new Date();
        }
        if (status === OrderStatus.DELIVERED) {
            if (!existing.shippedAt) {
                data.shippedAt = new Date();
            }
            if (!existing.deliveredAt) {
                data.deliveredAt = new Date();
            }
        }

        if (Object.keys(data).length === 0) {
            return NextResponse.json(
                { error: "Nenhum campo valido para atualizar" },
                { status: 400 }
            );
        }

        const order = await prisma.order.update({
            where: { id },
            data,
            select: {
                id: true,
                orderNumber: true,
                notes: true,
                shippingMethod: true,
                trackingCode: true,
                status: true,
                shippedAt: true,
                deliveredAt: true,
                updatedAt: true,
            },
        });

        return NextResponse.json({ order });
    } catch (error) {
        console.error("Error updating delivery info:", error);
        return NextResponse.json(
            { error: "Erro ao atualizar descricao da entrega" },
            { status: 500 }
        );
    }
}

