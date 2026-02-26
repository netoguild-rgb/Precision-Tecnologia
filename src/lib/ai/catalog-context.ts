import type { Prisma, StockStatus } from "@prisma/client";
import prisma from "@/lib/prisma";

type ProductWithContext = {
    id: string;
    slug: string;
    name: string;
    sku: string;
    brand: string;
    shortDesc: string | null;
    description: string | null;
    price: Prisma.Decimal;
    stockStatus: StockStatus;
    category: {
        id: string;
        name: string;
        slug: string;
    };
    images: Array<{ url: string }>;
    specs: Array<{
        group: string | null;
        label: string;
        value: string;
    }>;
};

export type AssistantProductSpec = {
    group: string | null;
    label: string;
    value: string;
};

export type AssistantProductSuggestion = {
    id: string;
    slug: string;
    name: string;
    sku: string;
    brand: string;
    shortDesc: string | null;
    description: string | null;
    price: number;
    stockStatus: StockStatus;
    categoryId: string;
    categoryName: string;
    categorySlug: string;
    image: string | null;
    specs: AssistantProductSpec[];
};

export type AssistantCategoryMatch = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
};

export type CatalogKnowledge = {
    categories: AssistantCategoryMatch[];
    primaryProducts: AssistantProductSuggestion[];
    complementaryProducts: AssistantProductSuggestion[];
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
    "os",
    "as",
    "ao",
]);

const COMPLEMENTARY_CATEGORY_MAP: Record<string, string[]> = {
    switches: ["gbics-sfp", "patch-panels", "patch-cords", "conectores"],
    roteadores: ["firewalls", "gbics-sfp", "patch-cords", "conectores"],
    "access-points": ["switches", "patch-cords", "conectores"],
    "gbics-sfp": ["switches", "patch-cords", "patch-panels"],
    "patch-cords": ["patch-panels", "conectores"],
    "patch-panels": ["patch-cords", "conectores"],
    conectores: ["patch-cords", "patch-panels"],
    firewalls: ["switches", "roteadores"],
};

function normalizeText(input: string): string {
    return input
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function containsInsensitive(value: string) {
    return {
        contains: value,
        mode: "insensitive" as const,
    };
}

function dedupeStrings(values: string[]): string[] {
    return [...new Set(values.filter(Boolean))];
}

function extractTerms(input: string): string[] {
    const normalized = normalizeText(input);
    if (!normalized) return [];

    const tokens = normalized
        .split(/[^a-z0-9]+/g)
        .filter((token) => token.length >= 3 && !STOPWORDS.has(token));

    return dedupeStrings(tokens).slice(0, 8);
}

function extractCategoryHints(input: string): string[] {
    const normalized = normalizeText(input);
    const hints: string[] = [];

    if (/switch|poe|vlan|core|uplink/.test(normalized)) hints.push("switches");
    if (/roteador|router|sdwan|wan/.test(normalized)) hints.push("roteadores");
    if (/access point|wifi|wi-fi|wireless|ap\b/.test(normalized)) hints.push("access-points");
    if (/sfp|gbic|qsfp|fibra|optico|optica|10g|25g|40g|100g/.test(normalized)) hints.push("gbics-sfp");
    if (/patch cord|cordao|corda[oã]/.test(normalized)) hints.push("patch-cords");
    if (/patch panel|painel/.test(normalized)) hints.push("patch-panels");
    if (/conector|rj45|keystone|tomada/.test(normalized)) hints.push("conectores");
    if (/firewall|seguranca|ips|utm/.test(normalized)) hints.push("firewalls");
    if (/datacenter|data center/.test(normalized)) hints.push("switches", "gbics-sfp", "firewalls");

    return dedupeStrings(hints);
}

function mapProduct(product: ProductWithContext): AssistantProductSuggestion {
    return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        sku: product.sku,
        brand: product.brand,
        shortDesc: product.shortDesc,
        description: product.description,
        price: Number(product.price),
        stockStatus: product.stockStatus,
        categoryId: product.category.id,
        categoryName: product.category.name,
        categorySlug: product.category.slug,
        image: product.images[0]?.url ?? null,
        specs: product.specs.slice(0, 10).map((spec) => ({
            group: spec.group,
            label: spec.label,
            value: spec.value,
        })),
    };
}

async function queryProducts(where: Prisma.ProductWhereInput, take: number): Promise<AssistantProductSuggestion[]> {
    const products = await prisma.product.findMany({
        where,
        orderBy: [{ isFeatured: "desc" }, { stockQty: "desc" }, { createdAt: "desc" }],
        take,
        select: {
            id: true,
            slug: true,
            name: true,
            sku: true,
            brand: true,
            shortDesc: true,
            description: true,
            price: true,
            stockStatus: true,
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
            images: {
                orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
                take: 1,
                select: { url: true },
            },
            specs: {
                orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
                take: 12,
                select: {
                    group: true,
                    label: true,
                    value: true,
                },
            },
        },
    });

    return products.map(mapProduct);
}

function buildProductSearchClauses(input: {
    query: string;
    terms: string[];
    categoryIds: string[];
}): Prisma.ProductWhereInput[] {
    const clauses: Prisma.ProductWhereInput[] = [];

    for (const term of input.terms) {
        clauses.push({
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

    const trimmed = input.query.trim();
    if (trimmed.length >= 4) {
        clauses.push({
            OR: [
                { slug: containsInsensitive(trimmed) },
                { sku: containsInsensitive(trimmed) },
                { name: containsInsensitive(trimmed) },
            ],
        });
    }

    for (const categoryId of input.categoryIds) {
        clauses.push({ categoryId });
    }

    return clauses;
}

function dedupeProducts(products: AssistantProductSuggestion[]): AssistantProductSuggestion[] {
    const byId = new Map<string, AssistantProductSuggestion>();
    for (const product of products) {
        if (!byId.has(product.id)) {
            byId.set(product.id, product);
        }
    }
    return [...byId.values()];
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

function formatSpecs(specs: AssistantProductSpec[]): string {
    if (specs.length === 0) return "sem especificacoes tecnicas cadastradas";
    return specs
        .slice(0, 8)
        .map((spec) => `${spec.label}: ${spec.value}`)
        .join("; ");
}

async function findMatchingCategories(query: string): Promise<AssistantCategoryMatch[]> {
    const terms = extractTerms(query);
    const hints = extractCategoryHints(query);

    const or: Prisma.CategoryWhereInput[] = [];
    for (const term of terms) {
        or.push({ name: containsInsensitive(term) });
        or.push({ slug: containsInsensitive(term) });
        or.push({ description: containsInsensitive(term) });
    }

    if (hints.length > 0) {
        or.push({ slug: { in: hints } });
    }

    if (or.length === 0) return [];

    return prisma.category.findMany({
        where: {
            isActive: true,
            OR: or,
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        take: 8,
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
        },
    });
}

async function findPrimaryProducts(
    query: string,
    categories: AssistantCategoryMatch[]
): Promise<AssistantProductSuggestion[]> {
    const terms = extractTerms(query);
    const categoryIds = categories.map((category) => category.id);
    const clauses = buildProductSearchClauses({
        query,
        terms,
        categoryIds,
    });

    if (clauses.length === 0) return [];

    const primary = await queryProducts(
        {
            status: "ACTIVE",
            OR: clauses,
        },
        6
    );

    if (primary.length > 0) return primary;

    if (categoryIds.length === 0) return [];

    return queryProducts(
        {
            status: "ACTIVE",
            categoryId: { in: categoryIds },
        },
        6
    );
}

function getComplementaryCategorySlugs(
    categories: AssistantCategoryMatch[],
    primaryProducts: AssistantProductSuggestion[]
): string[] {
    const sourceSlugs = dedupeStrings([
        ...categories.map((category) => category.slug),
        ...primaryProducts.map((product) => product.categorySlug),
    ]);

    const targets: string[] = [];
    for (const sourceSlug of sourceSlugs) {
        const mapped = COMPLEMENTARY_CATEGORY_MAP[sourceSlug] ?? [];
        targets.push(...mapped);
    }

    return dedupeStrings(targets);
}

async function findComplementaryProducts(
    categories: AssistantCategoryMatch[],
    primaryProducts: AssistantProductSuggestion[]
): Promise<AssistantProductSuggestion[]> {
    const targetSlugs = getComplementaryCategorySlugs(categories, primaryProducts);
    if (targetSlugs.length === 0) return [];

    const primaryIds = primaryProducts.map((product) => product.id);
    const complementary = await queryProducts(
        {
            status: "ACTIVE",
            id: primaryIds.length > 0 ? { notIn: primaryIds } : undefined,
            category: { slug: { in: targetSlugs } },
        },
        6
    );

    return complementary;
}

export async function findCatalogKnowledge(query: string): Promise<CatalogKnowledge> {
    const trimmed = query.trim();
    if (!trimmed) {
        return {
            categories: [],
            primaryProducts: [],
            complementaryProducts: [],
        };
    }

    const categories = await findMatchingCategories(trimmed);
    const primaryProducts = await findPrimaryProducts(trimmed, categories);
    const complementaryProducts = await findComplementaryProducts(categories, primaryProducts);

    return {
        categories,
        primaryProducts: dedupeProducts(primaryProducts).slice(0, 6),
        complementaryProducts: dedupeProducts(complementaryProducts).slice(0, 6),
    };
}

export function buildCatalogContextText(knowledge: CatalogKnowledge): string {
    const sections: string[] = [];

    if (knowledge.categories.length > 0) {
        const categoryLines = knowledge.categories.map(
            (category, index) =>
                `${index + 1}. ${category.name} | slug=${category.slug} | descricao=${category.description ?? "sem descricao"}`
        );
        sections.push(`Categorias relacionadas:\n${categoryLines.join("\n")}`);
    } else {
        sections.push("Categorias relacionadas: nenhuma categoria encontrada para a pergunta.");
    }

    if (knowledge.primaryProducts.length > 0) {
        const productLines = knowledge.primaryProducts.map((product, index) => {
            const price = product.price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            });

            return [
                `${index + 1}. ${product.name}`,
                `slug=${product.slug}`,
                `sku=${product.sku}`,
                `categoria=${product.categoryName}`,
                `marca=${product.brand}`,
                `preco=${price}`,
                `estoque=${stockLabel(product.stockStatus)}`,
                `descricao=${product.shortDesc ?? product.description ?? "sem descricao"}`,
                `specs=${formatSpecs(product.specs)}`,
            ].join(" | ");
        });

        sections.push(`Produtos principais do catalogo:\n${productLines.join("\n")}`);
    } else {
        sections.push("Produtos principais do catalogo: nenhum produto encontrado para a pergunta.");
    }

    if (knowledge.complementaryProducts.length > 0) {
        const complementaryLines = knowledge.complementaryProducts.map((product, index) => {
            const price = product.price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            });

            return [
                `${index + 1}. ${product.name}`,
                `slug=${product.slug}`,
                `sku=${product.sku}`,
                `categoria=${product.categoryName}`,
                `preco=${price}`,
                `estoque=${stockLabel(product.stockStatus)}`,
            ].join(" | ");
        });

        sections.push(`Produtos complementares do catalogo:\n${complementaryLines.join("\n")}`);
    } else {
        sections.push("Produtos complementares do catalogo: nenhum complementar relevante encontrado.");
    }

    return sections.join("\n\n");
}
