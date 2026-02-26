export type CatalogStockStatus =
    | "IN_STOCK"
    | "LOW_STOCK"
    | "ON_ORDER"
    | "OUT_OF_STOCK";

export interface Product {
    id: string;
    name: string;
    slug: string;
    category: string;
    categorySlug: string;
    sku: string;
    partNumber: string;
    price: number;
    priceFormatted: string;
    installment: string;
    stockStatus: CatalogStockStatus;
    stockLabel: string;
    description: string;
    specs: Record<string, string>;
    ports?: number;
    speed?: string;
    manageable?: boolean;
    poe?: boolean;
    poeWatts?: number;
    connectorType?: string;
    fiberType?: string;
    distance?: string;
    wifiStandard?: string;
    featured?: boolean;
    isNew?: boolean;
    images: string[];
}

export interface FilterOption {
    label: string;
    value: string;
    count: number;
}

export interface FilterGroup {
    key: string;
    label: string;
    type: "checkbox" | "radio" | "range";
    options: FilterOption[];
}

interface ApiProductImage {
    url: string;
    alt?: string | null;
    isPrimary?: boolean;
    sortOrder?: number;
}

interface ApiProductSpec {
    label: string;
    value: string;
    group?: string | null;
}

interface ApiCategory {
    name: string;
    slug: string;
}

interface ApiProduct {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    shortDesc?: string | null;
    sku: string;
    partNumber?: string | null;
    model?: string | null;
    brand?: string | null;
    price: string | number;
    stockStatus: string;
    isFeatured?: boolean;
    isNew?: boolean;
    images?: ApiProductImage[];
    specs?: ApiProductSpec[];
    category?: ApiCategory | null;
}

export type CatalogApiProduct = ApiProduct;

const fallbackImageBySlug: Record<string, string> = {
    "cloudengine-s5735-l24t4x-v2": "/images/products/cloudengine-s5735-l-v2.png",
    "cloudengine-s5735-l48t4x-v2": "/images/products/switch-48p.png",
    "cloudengine-s12700e-4": "/images/products/cloudengine-s12700e-8.png",
    "netengine-ar650": "/images/products/netengine-ar650.png",
    "netengine-ar6300": "/images/products/netengine-ar650.png",
    "airengine-5773-22p": "/images/products/airengine-5773-22p.png",
    "airengine-6760-x1": "/images/products/airengine-8760-x1-pro.png",
    "sfp-1g-lx-10km": "/images/products/sfp-plus-10g-lr-10km.png",
    "sfp-plus-10g-lr-10km": "/images/products/sfp-plus-10g-lr-10km.png",
    "sfp-plus-10g-sr-300m": "/images/products/sfp-plus-10g-lr-10km.png",
    "qsfp28-100g-lr4-10km": "/images/products/sfp-plus-10g-lr-10km.png",
    "patch-cord-cat6-utp-1m-azul": "/images/products/patch-cord-utp-cat6-1-5m-azul.jpg",
    "patch-cord-cat6-utp-3m-azul": "/images/products/patch-cord-utp-cat6-1-5m-azul.jpg",
    "patch-cord-fibra-sm-lc-lc-3m": "/images/products/patch-cord-fibra-sm-lc-lc-3m.jpg",
    "patch-panel-cat6-24-portas": "/images/products/patch-panel-24p-cat6-utp-1u.jpg",
    "patch-panel-cat6-48-portas": "/images/products/patch-panel-24p-cat6-utp-1u.jpg",
    "dio-fibra-optica-24-fibras": "/images/products/patch-panel-24p-cat6-utp-1u.jpg",
    "conector-rj45-cat6-50un": "/images/products/patch-cord-utp-cat6-1-5m-azul.jpg",
    "keystone-cat6-femea-10un": "/images/products/patch-cord-utp-cat6-1-5m-azul.jpg",
    "hisecengine-usg6510e": "/images/products/hisecengine-usg6500e.png",
};

function toNumber(value: string | number | null | undefined) {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    const parsed = Number(value ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function getInstallment(price: number) {
    if (price < 50) return "";
    const maxInstallments = price >= 500 ? 12 : price >= 150 ? 6 : 3;
    const installmentValue = price / maxInstallments;
    return `${maxInstallments}x ${formatCurrency(installmentValue)}`;
}

function normalizeStockStatus(status: string): CatalogStockStatus {
    if (
        status === "IN_STOCK" ||
        status === "LOW_STOCK" ||
        status === "ON_ORDER" ||
        status === "OUT_OF_STOCK"
    ) {
        return status;
    }
    return "ON_ORDER";
}

function getStockLabel(status: CatalogStockStatus) {
    switch (status) {
        case "IN_STOCK":
            return "Em Estoque";
        case "LOW_STOCK":
            return "Poucas Unidades";
        case "ON_ORDER":
            return "Sob Encomenda";
        case "OUT_OF_STOCK":
            return "Indisponível";
        default:
            return "Sob Encomenda";
    }
}

function extractSpecsMap(specs: ApiProductSpec[] | undefined, shortDesc?: string | null) {
    const map: Record<string, string> = {};
    for (const spec of specs ?? []) {
        if (!spec.label || !spec.value) continue;
        map[spec.label] = spec.value;
    }
    if (Object.keys(map).length === 0 && shortDesc) {
        map.Resumo = shortDesc;
    }
    return map;
}

function extractPorts(specs: Record<string, string>) {
    const portsText = specs.Portas;
    if (!portsText) return undefined;
    const match = portsText.match(/\d{1,3}/);
    return match ? parseInt(match[0], 10) : undefined;
}

function extractSpeed(specs: Record<string, string>) {
    return specs.Velocidade || specs.Throughput || specs["Switching Capacity"] || undefined;
}

function extractPoe(specs: Record<string, string>) {
    const poeText = specs.PoE || specs["PoE+"];
    if (!poeText) return undefined;
    if (/não|nao/i.test(poeText)) return false;
    return /poe/i.test(poeText);
}

export function getFallbackProductImage(slug: string) {
    return fallbackImageBySlug[slug];
}

export function toCatalogProduct(apiProduct: ApiProduct): Product {
    const price = toNumber(apiProduct.price);
    const stockStatus = normalizeStockStatus(apiProduct.stockStatus);
    const specs = extractSpecsMap(apiProduct.specs, apiProduct.shortDesc);

    const imageUrls = (apiProduct.images ?? [])
        .map((img) => img.url)
        .filter(Boolean);
    const fallbackImage = getFallbackProductImage(apiProduct.slug);
    const images = imageUrls.length > 0 ? imageUrls : fallbackImage ? [fallbackImage] : [];

    return {
        id: apiProduct.id,
        name: apiProduct.name,
        slug: apiProduct.slug,
        category: apiProduct.category?.name || "Produtos",
        categorySlug: apiProduct.category?.slug || "produtos",
        sku: apiProduct.sku,
        partNumber: apiProduct.partNumber || apiProduct.model || apiProduct.sku,
        price,
        priceFormatted: formatCurrency(price),
        installment: getInstallment(price),
        stockStatus,
        stockLabel: getStockLabel(stockStatus),
        description: apiProduct.description || apiProduct.shortDesc || "Sem descrição disponível",
        specs,
        ports: extractPorts(specs),
        speed: extractSpeed(specs),
        poe: extractPoe(specs),
        featured: Boolean(apiProduct.isFeatured),
        isNew: Boolean(apiProduct.isNew),
        images,
    };
}

export function buildFilterGroups(products: Product[]): FilterGroup[] {
    const categoryCounts = new Map<string, { label: string; count: number }>();
    const stockCounts = new Map<CatalogStockStatus, number>([
        ["IN_STOCK", 0],
        ["LOW_STOCK", 0],
        ["ON_ORDER", 0],
        ["OUT_OF_STOCK", 0],
    ]);

    for (const product of products) {
        const currentCategory = categoryCounts.get(product.categorySlug);
        if (currentCategory) {
            currentCategory.count += 1;
        } else {
            categoryCounts.set(product.categorySlug, {
                label: product.category,
                count: 1,
            });
        }

        stockCounts.set(
            product.stockStatus,
            (stockCounts.get(product.stockStatus) ?? 0) + 1
        );
    }

    const categoryOptions = Array.from(categoryCounts.entries())
        .map(([value, info]) => ({
            value,
            label: info.label,
            count: info.count,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

    const stockOrder: CatalogStockStatus[] = [
        "IN_STOCK",
        "LOW_STOCK",
        "ON_ORDER",
        "OUT_OF_STOCK",
    ];
    const stockOptions = stockOrder
        .map((status) => ({
            value: status,
            label: getStockLabel(status),
            count: stockCounts.get(status) ?? 0,
        }))
        .filter((option) => option.count > 0);

    const groups: FilterGroup[] = [];
    if (categoryOptions.length > 0) {
        groups.push({
            key: "category",
            label: "Categoria",
            type: "checkbox",
            options: categoryOptions,
        });
    }

    if (stockOptions.length > 0) {
        groups.push({
            key: "stockStatus",
            label: "Disponibilidade",
            type: "checkbox",
            options: stockOptions,
        });
    }

    return groups;
}
