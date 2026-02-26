import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/products/[slug] - Detalhe do produto
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const product = await prisma.product.findFirst({
            where: { slug, status: "ACTIVE" },
            include: {
                category: true,
                images: { orderBy: { sortOrder: "asc" } },
                specs: { orderBy: { sortOrder: "asc" } },
                documents: true,
                variants: true,
            },
        });

        if (!product) {
            return NextResponse.json(
                { error: "Produto não encontrado" },
                { status: 404 }
            );
        }

        // Buscar produtos relacionados da mesma categoria
        const related = await prisma.product.findMany({
            where: {
                categoryId: product.categoryId,
                id: { not: product.id },
                status: "ACTIVE",
            },
            include: {
                images: {
                    orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
                    take: 1,
                },
                category: { select: { id: true, name: true, slug: true } },
            },
            take: 4,
        });

        return NextResponse.json({ product, related });
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json(
            { error: "Erro ao buscar produto" },
            { status: 500 }
        );
    }
}
