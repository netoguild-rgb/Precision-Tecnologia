import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/products — List with pagination, search, filters
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const search = searchParams.get("search") || "";
        const categoryId = searchParams.get("categoryId");
        const status = searchParams.get("status");
        const stockStatus = searchParams.get("stockStatus");

        const where: Record<string, unknown> = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { sku: { contains: search, mode: "insensitive" } },
                { partNumber: { contains: search, mode: "insensitive" } },
            ];
        }

        if (categoryId) where.categoryId = categoryId;
        if (status) where.status = status;
        if (stockStatus) where.stockStatus = stockStatus;

        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: { select: { id: true, name: true, slug: true } },
                    images: { orderBy: { sortOrder: "asc" }, take: 1 },
                    _count: { select: { specs: true, images: true } },
                },
                orderBy: { updatedAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.product.count({ where }),
        ]);

        return NextResponse.json({
            products,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error("Error listing products:", error);
        return NextResponse.json({ error: "Erro ao listar produtos" }, { status: 500 });
    }
}

// POST /api/admin/products — Create product
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            name, sku, slug, description, shortDesc,
            price, comparePrice, costPrice,
            categoryId, brand, partNumber, model: productModel,
            weight, width, height, depth,
            stockQty, stockStatus, leadTimeDays,
            status, isFeatured, isNew,
            metaTitle, metaDesc,
            images, specs,
        } = body;

        // Validate required fields
        if (!name || !sku || !slug || !price || !categoryId) {
            return NextResponse.json(
                { error: "Campos obrigatórios: nome, SKU, slug, preço, categoria" },
                { status: 400 }
            );
        }

        // Check unique constraints
        const existing = await prisma.product.findFirst({
            where: { OR: [{ sku }, { slug }] },
        });
        if (existing) {
            return NextResponse.json(
                { error: `Já existe um produto com o SKU "${sku}" ou slug "${slug}"` },
                { status: 409 }
            );
        }

        const product = await prisma.product.create({
            data: {
                name,
                sku,
                slug,
                description: description || null,
                shortDesc: shortDesc || null,
                price,
                comparePrice: comparePrice || null,
                costPrice: costPrice || null,
                categoryId,
                brand: brand || "Huawei",
                partNumber: partNumber || null,
                model: productModel || null,
                weight: weight || null,
                width: width || null,
                height: height || null,
                depth: depth || null,
                stockQty: stockQty || 0,
                stockStatus: stockStatus || "ON_ORDER",
                leadTimeDays: leadTimeDays || null,
                status: status || "ACTIVE",
                isFeatured: isFeatured || false,
                isNew: isNew || false,
                metaTitle: metaTitle || null,
                metaDesc: metaDesc || null,
                images: images?.length
                    ? {
                        create: images.map((img: { url: string; alt?: string }, i: number) => ({
                            url: img.url,
                            alt: img.alt || name,
                            sortOrder: i,
                            isPrimary: i === 0,
                        })),
                    }
                    : undefined,
                specs: specs?.length
                    ? {
                        create: specs.map((spec: { label: string; value: string; group?: string }, i: number) => ({
                            label: spec.label,
                            value: spec.value,
                            group: spec.group || null,
                            sortOrder: i,
                        })),
                    }
                    : undefined,
            },
            include: {
                category: true,
                images: true,
                specs: true,
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
    }
}
