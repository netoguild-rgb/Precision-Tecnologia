import type { Prisma, StockStatus } from "@prisma/client";
import prisma from "@/lib/prisma";

export type AssistantProductSuggestion = {
    id: string;
    slug: string;
    name: string;
    sku: string;
    brand: string;
    shortDesc: string | null;
    price: number;
    stockStatus: StockStatus;
    image: string | null;
};

const STOPWORDS = new Set([
    "de",
    "da",
    "do",
    "das",
    "dos",
    "para",
    "com",
    "sem",
    "uma",
    "um",
    "e",
    "ou",
    "que",
    "por",
    "em",
    "no",
    "na",
]);

function normalizeText(input: string): string {
    return input
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function extractTerms(input: string): string[] {
    const normalized = normalizeText(input);
    if (!normalized) return [];

    return normalized
        .split(/[^a-z0-9]+/g)
        .filter((token) => token.length >= 3 && !STOPWORDS.has(token))
        .slice(0, 6);
}

function dedupeStrings(values: string[]): string[] {
    return [...new Set(values.filter(Boolean))];
}

function containsInsensitive(value: string) {
    return {
        contains: value,
        mode: "insensitive" as const,
    };
}

function buildWhereTerms(query: string): Prisma.ProductWhereInput[] {
    const trimmed = query.trim();
    const terms = dedupeStrings([trimmed, ...extractTerms(trimmed)]).slice(0, 7);

    const whereTerms: Prisma.ProductWhereInput[] = [];
    for (const term of terms) {
        whereTerms.push({
            OR: [
                { name: containsInsensitive(term) },
                { shortDesc: containsInsensitive(term) },
                { description: containsInsensitive(term) },
                { sku: containsInsensitive(term) },
                { partNumber: containsInsensitive(term) },
                { brand: containsInsensitive(term) },
            ],
        });
    }

    return whereTerms;
}

export async function findCatalogSuggestions(query: string, limit = 5): Promise<AssistantProductSuggestion[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const whereTerms = buildWhereTerms(trimmed);
    if (whereTerms.length === 0) return [];

    const products = await prisma.product.findMany({
        where: {
            status: "ACTIVE",
            OR: whereTerms,
        },
        orderBy: [{ isFeatured: "desc" }, { stockQty: "desc" }, { createdAt: "desc" }],
        take: Math.min(Math.max(limit, 1), 8),
        select: {
            id: true,
            slug: true,
            name: true,
            sku: true,
            brand: true,
            shortDesc: true,
            price: true,
            stockStatus: true,
            images: {
                orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
                take: 1,
                select: { url: true },
            },
        },
    });

    return products.map((product) => ({
        id: product.id,
        slug: product.slug,
        name: product.name,
        sku: product.sku,
        brand: product.brand,
        shortDesc: product.shortDesc,
        price: Number(product.price),
        stockStatus: product.stockStatus,
        image: product.images[0]?.url ?? null,
    }));
}

function stockLabel(stockStatus: StockStatus): string {
    switch (stockStatus) {
        case "IN_STOCK":
            return "pronta entrega";
        case "LOW_STOCK":
            return "estoque baixo";
        case "ON_ORDER":
            return "sob encomenda";
        case "OUT_OF_STOCK":
            return "indisponivel";
        default:
            return "status indefinido";
    }
}

export function buildCatalogContextText(products: AssistantProductSuggestion[]): string {
    if (products.length === 0) {
        return "Catalogo relevante: nenhum produto encontrado para a busca atual.";
    }

    const lines = products.map((product, index) => {
        const price = product.price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });

        return [
            `${index + 1}. ${product.name}`,
            `slug=${product.slug}`,
            `sku=${product.sku}`,
            `marca=${product.brand}`,
            `preco=${price}`,
            `estoque=${stockLabel(product.stockStatus)}`,
        ].join(" | ");
    });

    return `Catalogo relevante:\n${lines.join("\n")}`;
}
