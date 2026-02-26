import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/categories - Listar categorias
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            where: { isActive: true, parentId: null },
            include: {
                children: {
                    where: { isActive: true },
                    orderBy: { sortOrder: "asc" },
                    include: {
                        _count: { select: { products: true } },
                    },
                },
                _count: { select: { products: true } },
            },
            orderBy: { sortOrder: "asc" },
        });

        return NextResponse.json({ categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: "Erro ao buscar categorias" },
            { status: 500 }
        );
    }
}
