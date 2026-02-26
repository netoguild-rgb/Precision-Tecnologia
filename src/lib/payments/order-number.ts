import prisma from "@/lib/prisma";

function extractCounter(orderNumber: string): number {
    const match = orderNumber.match(/PT-(\d{4})-(\d{6})$/);
    if (!match) return 0;
    return Number(match[2]) || 0;
}

export async function generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `PT-${year}-`;

    const lastOrder = await prisma.order.findFirst({
        where: { orderNumber: { startsWith: prefix } },
        orderBy: { orderNumber: "desc" },
        select: { orderNumber: true },
    });

    const lastCounter = lastOrder ? extractCounter(lastOrder.orderNumber) : 0;
    const nextCounter = String(lastCounter + 1).padStart(6, "0");
    return `${prefix}${nextCounter}`;
}

