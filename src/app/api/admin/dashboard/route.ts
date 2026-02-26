import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const soldStatuses = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

        const [
            totalProducts,
            activeProducts,
            inStockProducts,
            outOfStockProducts,
            supplierRequestedProducts,
            totalCategories,
            soldAggregate,
            ordersInDelivery,
        ] = await Promise.all([
            prisma.product.count(),
            prisma.product.count({ where: { status: "ACTIVE" } }),
            prisma.product.count({ where: { stockStatus: "IN_STOCK" } }),
            prisma.product.count({ where: { stockStatus: "OUT_OF_STOCK" } }),
            prisma.product.count({ where: { stockStatus: "ON_ORDER" } }),
            prisma.category.count(),
            prisma.orderItem.aggregate({
                _sum: { quantity: true },
                where: {
                    order: {
                        status: {
                            in: soldStatuses,
                        },
                    },
                },
            }),
            prisma.order.count({
                where: { status: "SHIPPED" },
            }),
        ]);

        return NextResponse.json({
            totalProducts,
            activeProducts,
            inStockProducts,
            outOfStockProducts,
            supplierRequestedProducts,
            totalCategories,
            soldUnits: soldAggregate._sum.quantity ?? 0,
            inDeliveryOrders: ordersInDelivery,
        });
    } catch (error) {
        console.error("Error loading dashboard stats:", error);
        return NextResponse.json({ error: "Erro ao carregar dashboard" }, { status: 500 });
    }
}
