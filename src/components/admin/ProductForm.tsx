"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ImageUploader } from "./ImageUploader";
import { SpecsEditor } from "./SpecsEditor";

interface ImageItem {
    url: string;
    alt?: string;
}

interface SpecItem {
    label: string;
    value: string;
    group?: string;
}

interface CategoryOption {
    id: string;
    name: string;
    slug: string;
}

interface ProductFormProps {
    productId?: string; // If editing
}

function generateSlug(name: string) {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

function applySkuMask(value: string) {
    return value
        .toUpperCase()
        .replace(/[^A-Z0-9\-_.]/g, "");
}

function applyPartNumberMask(value: string) {
    return value
        .toUpperCase()
        .replace(/[^A-Z0-9\-./]/g, "");
}

function parseLocaleNumber(value: string): number | null {
    const cleaned = value
        .replace(/[R$\s]/g, "")
        .replace(/\./g, "")
        .replace(",", ".")
        .trim();

    if (!cleaned) return null;

    const numeric = Number(cleaned);
    return Number.isFinite(numeric) ? numeric : null;
}

function applyCurrencyMask(value: string) {
    const numeric = parseLocaleNumber(value);
    if (numeric === null) return "";

    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(numeric);
}

function applyIntegerMask(value: string) {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";
    return String(parseInt(digits, 10));
}

function applyDecimalMask(value: string, maxDecimals = 2) {
    const sanitized = value.replace(/[^\d.,]/g, "").replace(/\./g, ",");
    if (!sanitized) return "";

    const [intRaw, decimalRaw = ""] = sanitized.split(",");
    const intPart = intRaw.replace(/\D/g, "");
    const decimalPart = decimalRaw.replace(/\D/g, "").slice(0, maxDecimals);

    if (!intPart && !decimalPart) return "";
    if (!decimalPart) return intPart || "0";

    return `${intPart || "0"},${decimalPart}`;
}

function parseMaskedInteger(value: string) {
    const digits = value.replace(/\D/g, "");
    if (!digits) return 0;
    return parseInt(digits, 10);
}

function parseMaskedDecimal(value: string): number | null {
    const cleaned = value.replace(/\./g, "").replace(",", ".").trim();
    if (!cleaned) return null;

    const numeric = Number(cleaned);
    return Number.isFinite(numeric) ? numeric : null;
}

export function ProductForm({ productId }: ProductFormProps) {
    const router = useRouter();
    const isEditing = !!productId;

    // Form state
    const [name, setName] = useState("");
    const [sku, setSku] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [shortDesc, setShortDesc] = useState("");
    const [price, setPrice] = useState("");
    const [comparePrice, setComparePrice] = useState("");
    const [costPrice, setCostPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [brand, setBrand] = useState("Huawei");
    const [partNumber, setPartNumber] = useState("");
    const [productModel, setProductModel] = useState("");
    const [weight, setWeight] = useState("");
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const [depth, setDepth] = useState("");
    const [stockQty, setStockQty] = useState("0");
    const [stockStatus, setStockStatus] = useState("ON_ORDER");
    const [leadTimeDays, setLeadTimeDays] = useState("");
    const [status, setStatus] = useState("ACTIVE");
    const [isFeatured, setIsFeatured] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDesc, setMetaDesc] = useState("");
    const [images, setImages] = useState<ImageItem[]>([]);
    const [specs, setSpecs] = useState<SpecItem[]>([]);

    // UI state
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(isEditing);
    const [error, setError] = useState("");

    // Auto-generate slug from name
    useEffect(() => {
        if (!isEditing && name) {
            setSlug(generateSlug(name));
        }
    }, [name, isEditing]);

    // Load categories
    useEffect(() => {
        fetch("/api/admin/categories")
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data)) setCategories(data);
            })
            .catch(console.error);
    }, []);

    // Load product data for editing
    useEffect(() => {
        if (!productId) return;
        setLoading(true);
        fetch(`/api/admin/products/${productId}`)
            .then((r) => r.json())
            .then((p) => {
                setName(p.name || "");
                setSku(p.sku || "");
                setSlug(p.slug || "");
                setDescription(p.description || "");
                setShortDesc(p.shortDesc || "");
                setPrice(applyCurrencyMask(String(p.price || "")));
                setComparePrice(applyCurrencyMask(String(p.comparePrice || "")));
                setCostPrice(applyCurrencyMask(String(p.costPrice || "")));
                setCategoryId(p.categoryId || "");
                setBrand(p.brand || "Huawei");
                setPartNumber(p.partNumber || "");
                setProductModel(p.model || "");
                setWeight(applyDecimalMask(String(p.weight || ""), 3));
                setWidth(applyDecimalMask(String(p.width || ""), 2));
                setHeight(applyDecimalMask(String(p.height || ""), 2));
                setDepth(applyDecimalMask(String(p.depth || ""), 2));
                setStockQty(applyIntegerMask(String(p.stockQty || 0)));
                setStockStatus(p.stockStatus || "ON_ORDER");
                setLeadTimeDays(applyIntegerMask(String(p.leadTimeDays || "")));
                setStatus(p.status || "ACTIVE");
                setIsFeatured(p.isFeatured || false);
                setIsNew(p.isNew || false);
                setMetaTitle(p.metaTitle || "");
                setMetaDesc(p.metaDesc || "");
                setImages(
                    (p.images || []).map((img: { url: string; alt?: string }) => ({
                        url: img.url,
                        alt: img.alt || "",
                    }))
                );
                setSpecs(
                    (p.specs || []).map((s: { label: string; value: string; group?: string }) => ({
                        label: s.label,
                        value: s.value,
                        group: s.group || "",
                    }))
                );
            })
            .catch(() => setError("Erro ao carregar produto"))
            .finally(() => setLoading(false));
    }, [productId]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!name || !sku || !slug || !price || !categoryId) {
            setError("Preencha todos os campos obrigatórios");
            return;
        }

        const parsedPrice = parseLocaleNumber(price);
        if (parsedPrice === null) {
            setError("Preencha um preÃ§o de venda vÃ¡lido");
            return;
        }

        const parsedComparePrice = parseLocaleNumber(comparePrice);
        const parsedCostPrice = parseLocaleNumber(costPrice);
        const parsedWeight = parseMaskedDecimal(weight);
        const parsedWidth = parseMaskedDecimal(width);
        const parsedHeight = parseMaskedDecimal(height);
        const parsedDepth = parseMaskedDecimal(depth);

        setSaving(true);
        try {
            const body = {
                name,
                sku,
                slug,
                description: description || null,
                shortDesc: shortDesc || null,
                price: parsedPrice,
                comparePrice: parsedComparePrice,
                costPrice: parsedCostPrice,
                categoryId,
                brand,
                partNumber: partNumber || null,
                model: productModel || null,
                weight: parsedWeight,
                width: parsedWidth,
                height: parsedHeight,
                depth: parsedDepth,
                stockQty: parseMaskedInteger(stockQty),
                stockStatus,
                leadTimeDays: leadTimeDays ? parseMaskedInteger(leadTimeDays) : null,
                status,
                isFeatured,
                isNew,
                metaTitle: metaTitle || null,
                metaDesc: metaDesc || null,
                images,
                specs: specs.filter((s) => s.label && s.value),
            };

            const url = isEditing
                ? `/api/admin/products/${productId}`
                : "/api/admin/products";
            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Erro ao salvar produto");
            }

            router.push("/admin/produtos");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao salvar");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-[var(--color-primary)]" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/produtos"
                        className="p-2 rounded-lg hover:bg-[var(--color-bg-elevated)] transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">
                        {isEditing ? "Editar Produto" : "Novo Produto"}
                    </h1>
                </div>
                <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary flex items-center gap-2"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? "Salvando..." : "Salvar Produto"}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 text-sm">
                    {error}
                </div>
            )}

            {/* Basic Info */}
            <div className="admin-card">
                <h2 className="admin-card-title">Informações Básicas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="admin-label">Nome do Produto *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="admin-input"
                            placeholder="Ex: Switch Huawei S5735-L48T4S-A1"
                            required
                        />
                    </div>
                    <div>
                        <label className="admin-label">SKU *</label>
                        <input
                            type="text"
                            value={sku}
                            onChange={(e) => setSku(applySkuMask(e.target.value))}
                            className="admin-input"
                            placeholder="Ex: HW-S5735-48T"
                            required
                        />
                    </div>
                    <div>
                        <label className="admin-label">Slug (URL) *</label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(generateSlug(e.target.value))}
                            className="admin-input"
                            placeholder="switch-huawei-s5735"
                            required
                        />
                    </div>
                    <div>
                        <label className="admin-label">Part Number</label>
                        <input
                            type="text"
                            value={partNumber}
                            onChange={(e) => setPartNumber(applyPartNumberMask(e.target.value))}
                            className="admin-input"
                            placeholder="98012021"
                        />
                    </div>
                    <div>
                        <label className="admin-label">Modelo</label>
                        <input
                            type="text"
                            value={productModel}
                            onChange={(e) => setProductModel(e.target.value)}
                            className="admin-input"
                            placeholder="S5735-L48T4S-A1"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="admin-label">Descrição Curta</label>
                        <input
                            type="text"
                            value={shortDesc}
                            onChange={(e) => setShortDesc(e.target.value)}
                            className="admin-input"
                            placeholder="Resumo para listagem"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="admin-label">Descrição Completa</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="admin-input min-h-[120px]"
                            placeholder="Descrição detalhada do produto..."
                        />
                    </div>
                </div>
            </div>

            {/* Pricing */}
            <div className="admin-card">
                <h2 className="admin-card-title">Preços</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="admin-label">Preço de Venda (BRL) *</label>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={price}
                            onChange={(e) => setPrice(applyCurrencyMask(e.target.value))}
                            className="admin-input"
                            placeholder="R$ 0,00"
                            required
                        />
                    </div>
                    <div>
                        <label className="admin-label">Preço Comparativo (De)</label>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={comparePrice}
                            onChange={(e) => {
                                const value = e.target.value;
                                setComparePrice(value ? applyCurrencyMask(value) : "");
                            }}
                            className="admin-input"
                            placeholder="R$ 0,00"
                        />
                    </div>
                    <div>
                        <label className="admin-label">Preço de Custo</label>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={costPrice}
                            onChange={(e) => {
                                const value = e.target.value;
                                setCostPrice(value ? applyCurrencyMask(value) : "");
                            }}
                            className="admin-input"
                            placeholder="R$ 0,00"
                        />
                    </div>
                </div>
            </div>

            {/* Classification */}
            <div className="admin-card">
                <h2 className="admin-card-title">Classificação</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="admin-label">Categoria *</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="admin-input"
                            required
                        >
                            <option value="">Selecione...</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="admin-label">Marca</label>
                        <input
                            type="text"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className="admin-input"
                            placeholder="Huawei"
                        />
                    </div>
                </div>
            </div>

            {/* Stock */}
            <div className="admin-card">
                <h2 className="admin-card-title">Estoque</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="admin-label">Quantidade</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={stockQty}
                            onChange={(e) => setStockQty(applyIntegerMask(e.target.value))}
                            className="admin-input"
                        />
                    </div>
                    <div>
                        <label className="admin-label">Status de Estoque</label>
                        <select
                            value={stockStatus}
                            onChange={(e) => setStockStatus(e.target.value)}
                            className="admin-input"
                        >
                            <option value="IN_STOCK">Pronta Entrega</option>
                            <option value="LOW_STOCK">Poucas Unidades</option>
                            <option value="ON_ORDER">Sob Encomenda</option>
                            <option value="OUT_OF_STOCK">Indisponível</option>
                        </select>
                    </div>
                    <div>
                        <label className="admin-label">Prazo de Entrega (dias)</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={leadTimeDays}
                            onChange={(e) => setLeadTimeDays(applyIntegerMask(e.target.value))}
                            className="admin-input"
                            placeholder="Para sob encomenda"
                        />
                    </div>
                </div>
            </div>

            {/* Images */}
            <div className="admin-card">
                <h2 className="admin-card-title">Imagens</h2>
                <ImageUploader images={images} onChange={setImages} />
            </div>

            {/* Specs */}
            <div className="admin-card">
                <h2 className="admin-card-title">Especificações Técnicas</h2>
                <SpecsEditor specs={specs} onChange={setSpecs} />
            </div>

            {/* Physical dimensions */}
            <div className="admin-card">
                <h2 className="admin-card-title">Dimensões Físicas</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="admin-label">Peso (kg)</label>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={weight}
                            onChange={(e) => setWeight(applyDecimalMask(e.target.value, 3))}
                            className="admin-input"
                            placeholder="0,000"
                        />
                    </div>
                    <div>
                        <label className="admin-label">Largura (cm)</label>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={width}
                            onChange={(e) => setWidth(applyDecimalMask(e.target.value, 2))}
                            className="admin-input"
                            placeholder="0,00"
                        />
                    </div>
                    <div>
                        <label className="admin-label">Altura (cm)</label>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={height}
                            onChange={(e) => setHeight(applyDecimalMask(e.target.value, 2))}
                            className="admin-input"
                            placeholder="0,00"
                        />
                    </div>
                    <div>
                        <label className="admin-label">Profundidade (cm)</label>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={depth}
                            onChange={(e) => setDepth(applyDecimalMask(e.target.value, 2))}
                            className="admin-input"
                            placeholder="0,00"
                        />
                    </div>
                </div>
            </div>

            {/* Status & Flags */}
            <div className="admin-card">
                <h2 className="admin-card-title">Status & Visibilidade</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="admin-label">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="admin-input"
                        >
                            <option value="ACTIVE">Ativo</option>
                            <option value="INACTIVE">Inativo</option>
                            <option value="DISCONTINUED">Descontinuado</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-6 md:col-span-2 pt-6">
                        <label className="admin-checkbox-label">
                            <input
                                type="checkbox"
                                checked={isFeatured}
                                onChange={(e) => setIsFeatured(e.target.checked)}
                                className="admin-checkbox"
                            />
                            Produto em Destaque
                        </label>
                        <label className="admin-checkbox-label">
                            <input
                                type="checkbox"
                                checked={isNew}
                                onChange={(e) => setIsNew(e.target.checked)}
                                className="admin-checkbox"
                            />
                            Novidade
                        </label>
                    </div>
                </div>
            </div>

            {/* SEO */}
            <div className="admin-card">
                <h2 className="admin-card-title">SEO</h2>
                <div className="space-y-4">
                    <div>
                        <label className="admin-label">Meta Título</label>
                        <input
                            type="text"
                            value={metaTitle}
                            onChange={(e) => setMetaTitle(e.target.value)}
                            className="admin-input"
                            placeholder="Título para mecanismos de busca"
                        />
                    </div>
                    <div>
                        <label className="admin-label">Meta Descrição</label>
                        <textarea
                            value={metaDesc}
                            onChange={(e) => setMetaDesc(e.target.value)}
                            className="admin-input min-h-[80px]"
                            placeholder="Descrição para mecanismos de busca (até 160 caracteres)"
                        />
                    </div>
                </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pb-8">
                <Link href="/admin/produtos" className="btn-outline-muted">
                    Cancelar
                </Link>
                <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary flex items-center gap-2"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? "Salvando..." : "Salvar Produto"}
                </button>
            </div>
        </form>
    );
}
