import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/categories — List all categories
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { sortOrder: "asc" },
            include: {
                _count: { select: { products: true } },
            },
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error("Error listing categories:", error);
        return NextResponse.json({ error: "Erro ao listar categorias" }, { status: 500 });
    }
}

// POST /api/admin/categories — Create category
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, slug, description, icon, image } = body;

        if (!name || !slug) {
            return NextResponse.json(
                { error: "Nome e slug são obrigatórios" },
                { status: 400 }
            );
        }

        const existing = await prisma.category.findUnique({ where: { slug } });
        if (existing) {
            return NextResponse.json(
                { error: `Categoria com slug "${slug}" já existe` },
                { status: 409 }
            );
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug,
                description: description || null,
                icon: icon || null,
                image: image || null,
            },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json({ error: "Erro ao criar categoria" }, { status: 500 });
    }
}
