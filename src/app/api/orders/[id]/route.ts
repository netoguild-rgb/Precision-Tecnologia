import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-user";
import prisma from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
        }

        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "ID de pedido invalido" }, { status: 400 });
        }

        const order = await prisma.order.findFirst({
            where: {
                id,
                ...(user.role === "ADMIN" ? {} : { userId: user.id }),
            },
            include: {
                address: true,
                items: {
                    include: {
                        product: {
                            include: {
                                images: {
                                    orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
                                    take: 1,
                                },
                            },
                        },
                    },
                },
                paymentAttempts: {
                    orderBy: { createdAt: "desc" },
                    take: 20,
                },
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Pedido nao encontrado" }, { status: 404 });
        }

        return NextResponse.json({ order });
    } catch (error) {
        console.error("Error loading order:", error);
        return NextResponse.json({ error: "Erro ao carregar pedido" }, { status: 500 });
    }
}

