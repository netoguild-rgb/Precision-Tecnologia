import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { del } from "@vercel/blob";

// GET /api/admin/products/[id]
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                images: { orderBy: { sortOrder: "asc" } },
                specs: { orderBy: { sortOrder: "asc" } },
                documents: true,
            },
        });

        if (!product) {
            return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ error: "Erro ao buscar produto" }, { status: 500 });
    }
}

// PUT /api/admin/products/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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

        // Check uniqueness (excluding self)
        if (sku || slug) {
            const conditions = [];
            if (sku) conditions.push({ sku });
            if (slug) conditions.push({ slug });

            const existing = await prisma.product.findFirst({
                where: { OR: conditions, NOT: { id } },
            });
            if (existing) {
                return NextResponse.json(
                    { error: "SKU ou slug já existe em outro produto" },
                    { status: 409 }
                );
            }
        }

        // Update product
        const product = await prisma.product.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(sku !== undefined && { sku }),
                ...(slug !== undefined && { slug }),
                ...(description !== undefined && { description: description || null }),
                ...(shortDesc !== undefined && { shortDesc: shortDesc || null }),
                ...(price !== undefined && { price }),
                ...(comparePrice !== undefined && { comparePrice: comparePrice || null }),
                ...(costPrice !== undefined && { costPrice: costPrice || null }),
                ...(categoryId !== undefined && { categoryId }),
                ...(brand !== undefined && { brand }),
                ...(partNumber !== undefined && { partNumber: partNumber || null }),
                ...(productModel !== undefined && { model: productModel || null }),
                ...(weight !== undefined && { weight: weight || null }),
                ...(width !== undefined && { width: width || null }),
                ...(height !== undefined && { height: height || null }),
                ...(depth !== undefined && { depth: depth || null }),
                ...(stockQty !== undefined && { stockQty }),
                ...(stockStatus !== undefined && { stockStatus }),
                ...(leadTimeDays !== undefined && { leadTimeDays: leadTimeDays || null }),
                ...(status !== undefined && { status }),
                ...(isFeatured !== undefined && { isFeatured }),
                ...(isNew !== undefined && { isNew }),
                ...(metaTitle !== undefined && { metaTitle: metaTitle || null }),
                ...(metaDesc !== undefined && { metaDesc: metaDesc || null }),
            },
        });

        // Update images if provided
        if (images !== undefined) {
            // Delete old images
            await prisma.productImage.deleteMany({ where: { productId: id } });
            // Create new images
            if (images.length > 0) {
                await prisma.productImage.createMany({
                    data: images.map((img: { url: string; alt?: string }, i: number) => ({
                        productId: id,
                        url: img.url,
                        alt: img.alt || name || product.name,
                        sortOrder: i,
                        isPrimary: i === 0,
                    })),
                });
            }
        }

        // Update specs if provided
        if (specs !== undefined) {
            await prisma.productSpec.deleteMany({ where: { productId: id } });
            if (specs.length > 0) {
                await prisma.productSpec.createMany({
                    data: specs.map((spec: { label: string; value: string; group?: string }, i: number) => ({
                        productId: id,
                        label: spec.label,
                        value: spec.value,
                        group: spec.group || null,
                        sortOrder: i,
                    })),
                });
            }
        }

        // Re-fetch with relations
        const updated = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                images: { orderBy: { sortOrder: "asc" } },
                specs: { orderBy: { sortOrder: "asc" } },
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ error: "Erro ao atualizar produto" }, { status: 500 });
    }
}

// DELETE /api/admin/products/[id]
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Fetch images to delete from Blob
        const images = await prisma.productImage.findMany({
            where: { productId: id },
        });

        // Delete product (cascades images, specs, documents)
        await prisma.product.delete({ where: { id } });

        // Delete blobs
        for (const img of images) {
            try {
                await del(img.url);
            } catch {
                // Ignore blob deletion errors
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ error: "Erro ao deletar produto" }, { status: 500 });
    }
}
