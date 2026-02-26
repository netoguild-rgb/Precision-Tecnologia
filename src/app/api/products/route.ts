import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/products - Listar produtos com filtros
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        const brand = searchParams.get("brand");
        const stockStatus = searchParams.get("stockStatus");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const sortBy = searchParams.get("sortBy") || "createdAt";
        const sortOrder = searchParams.get("sortOrder") || "desc";
        const featured = searchParams.get("featured");

        // Construir filtros
        const where: Record<string, unknown> = {
            status: "ACTIVE",
        };

        if (category) {
            where.category = { slug: category };
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { sku: { contains: search, mode: "insensitive" } },
                { partNumber: { contains: search, mode: "insensitive" } },
            ];
        }

        if (brand) {
            where.brand = brand;
        }

        if (stockStatus) {
            where.stockStatus = stockStatus;
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) (where.price as Record<string, unknown>).gte = parseFloat(minPrice);
            if (maxPrice) (where.price as Record<string, unknown>).lte = parseFloat(maxPrice);
        }

        if (featured === "true") {
            where.isFeatured = true;
        }

        // Ordenação
        const orderBy: Record<string, string> = {};
        if (sortBy === "price") {
            orderBy.price = sortOrder;
        } else if (sortBy === "name") {
            orderBy.name = sortOrder;
        } else {
            orderBy.createdAt = sortOrder;
        }

        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: { select: { id: true, name: true, slug: true } },
                    images: {
                        orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
                        take: 1,
                    },
                },
                orderBy,
                skip,
                take: limit,
            }),
            prisma.product.count({ where }),
        ]);

        return NextResponse.json({
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { error: "Erro ao buscar produtos" },
            { status: 500 }
        );
    }
}
