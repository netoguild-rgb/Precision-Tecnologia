"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowUpDown, Grid3X3, List, SlidersHorizontal, X } from "lucide-react";
import { FilterSidebar, FilterChips } from "@/components/catalog/FilterSidebar";
import { ProductCard } from "@/components/product/ProductCard";
import { buildFilterGroups, CatalogApiProduct, Product, toCatalogProduct } from "@/lib/catalog";

type SortOption = "name" | "price-asc" | "price-desc" | "stock";

export default function CatalogPage() {
    return (
        <Suspense fallback={<CatalogPageFallback />}>
            <CatalogPageContent />
        </Suspense>
    );
}

function CatalogPageFallback() {
    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            <div className="max-w-7xl mx-auto px-4 py-10">
                <p className="text-sm text-[var(--color-text-muted)]">Carregando catalogo...</p>
            </div>
        </div>
    );
}

function CatalogPageContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category");
    const initialStock = searchParams.get("stockStatus");
    const isFeatured = searchParams.get("featured") === "true";
    const isNew = searchParams.get("isNew") === "true";
    const searchQuery = searchParams.get("search") || "";

    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(() => {
        const initial: Record<string, string[]> = {};
        if (initialCategory) initial.category = [initialCategory];
        if (initialStock) initial.stockStatus = [initialStock];
        return initial;
    });

    const [sortBy, setSortBy] = useState<SortOption>("name");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    const filterGroups = useMemo(
        () => buildFilterGroups(products),
        [products]
    );

    useEffect(() => {
        let cancelled = false;

        async function loadProducts() {
            setLoadingProducts(true);
            try {
                const res = await fetch("/api/products?limit=200", { cache: "no-store" });
                if (!res.ok) throw new Error("Falha ao buscar catálogo");

                const data = await res.json();
                const mapped = (data.products || []).map((product: CatalogApiProduct) =>
                    toCatalogProduct(product)
                );

                if (!cancelled) {
                    setProducts(mapped);
                }
            } catch {
                if (!cancelled) {
                    setProducts([]);
                }
            } finally {
                if (!cancelled) {
                    setLoadingProducts(false);
                }
            }
        }

        loadProducts();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleFilterChange = (key: string, value: string, checked: boolean) => {
        setActiveFilters((prev) => {
            const current = prev[key] || [];
            if (checked) {
                return { ...prev, [key]: [...current, value] };
            }
            const next = current.filter((v) => v !== value);
            if (next.length === 0) {
                const copy = { ...prev };
                delete copy[key];
                return copy;
            }
            return { ...prev, [key]: next };
        });
    };

    const clearAllFilters = () => setActiveFilters({});

    // Filter products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Featured / New from URL
        if (isFeatured) result = result.filter((p) => p.featured);
        if (isNew) result = result.filter((p) => p.isNew);

        // Text search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter((p) =>
                p.name.toLowerCase().includes(q) ||
                p.sku.toLowerCase().includes(q) ||
                p.partNumber.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                p.categorySlug.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                Object.values(p.specs).some((v) => String(v).toLowerCase().includes(q))
            );
        }

        // Category filter
        if (activeFilters.category?.length) {
            result = result.filter((p) =>
                activeFilters.category.includes(p.categorySlug)
            );
        }

        // Stock filter
        if (activeFilters.stockStatus?.length) {
            result = result.filter((p) =>
                activeFilters.stockStatus.includes(p.stockStatus)
            );
        }

        // Ports filter
        if (activeFilters.ports?.length) {
            result = result.filter(
                (p) => p.ports && activeFilters.ports.includes(String(p.ports))
            );
        }

        // PoE filter
        if (activeFilters.poe?.length) {
            result = result.filter(
                (p) => p.poe !== undefined && activeFilters.poe.includes(String(p.poe))
            );
        }

        // Manageable filter
        if (activeFilters.manageable?.length) {
            result = result.filter(
                (p) =>
                    p.manageable !== undefined &&
                    activeFilters.manageable.includes(String(p.manageable))
            );
        }

        // Speed filter
        if (activeFilters.speed?.length) {
            result = result.filter(
                (p) => p.speed && activeFilters.speed.includes(p.speed)
            );
        }

        // Sort
        result.sort((a: Product, b: Product) => {
            switch (sortBy) {
                case "price-asc":
                    return a.price - b.price;
                case "price-desc":
                    return b.price - a.price;
                case "stock": {
                    const rank: Record<string, number> = {
                        IN_STOCK: 0,
                        LOW_STOCK: 1,
                        ON_ORDER: 2,
                        OUT_OF_STOCK: 3,
                    };
                    return (rank[a.stockStatus] ?? 9) - (rank[b.stockStatus] ?? 9);
                }
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        return result;
    }, [products, activeFilters, sortBy, isFeatured, isNew, searchQuery]);

    const pageTitle = searchQuery
        ? `Resultados para "${searchQuery}"`
        : isFeatured
            ? "Produtos em Destaque"
            : isNew
                ? "Novidades"
                : activeFilters.category?.length === 1
                    ? products.find((p) => p.categorySlug === activeFilters.category[0])?.category || "Produtos"
                    : "Catálogo";

    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            {/* Page Header */}
            <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)]">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <nav className="text-xs text-[var(--color-text-dim)] mb-3">
                        <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">
                            Home
                        </Link>
                        <span className="mx-2">›</span>
                        <span className="text-[var(--color-text)]">{pageTitle}</span>
                    </nav>
                    <h1 className="text-3xl font-bold text-[var(--color-text)]">{pageTitle}</h1>
                    <p className="text-[var(--color-text-muted)] mt-1">
                        {filteredProducts.length} produto{filteredProducts.length !== 1 ? "s" : ""} encontrado{filteredProducts.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Mobile filter toggle */}
                <div className="lg:hidden mb-4">
                    <button
                        onClick={() => setMobileFiltersOpen(true)}
                        className="btn-outline-muted w-full flex items-center justify-center gap-2 text-sm"
                    >
                        <SlidersHorizontal size={16} />
                        Filtros
                    </button>
                </div>

                {/* Mobile filter drawer */}
                {mobileFiltersOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div
                            className="absolute inset-0 bg-black/30"
                            onClick={() => setMobileFiltersOpen(false)}
                        />
                        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-[var(--color-text)]">Filtros</h3>
                                <button
                                    onClick={() => setMobileFiltersOpen(false)}
                                    className="p-1 hover:bg-[var(--color-bg-elevated)] rounded-lg"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <FilterSidebar
                                filterGroups={filterGroups}
                                activeFilters={activeFilters}
                                onFilterChange={handleFilterChange}
                                onClearAll={clearAllFilters}
                                totalResults={filteredProducts.length}
                            />
                        </div>
                    </div>
                )}

                <div className="flex gap-8">
                    {/* Desktop sidebar */}
                    <div className="hidden lg:block">
                        <FilterSidebar
                            filterGroups={filterGroups}
                            activeFilters={activeFilters}
                            onFilterChange={handleFilterChange}
                            onClearAll={clearAllFilters}
                            totalResults={filteredProducts.length}
                        />
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                        {/* Active filter chips */}
                        <FilterChips
                            activeFilters={activeFilters}
                            filterGroups={filterGroups}
                            onRemove={(key, value) => handleFilterChange(key, value, false)}
                            onClearAll={clearAllFilters}
                        />

                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--color-border)]">
                            {/* Sort */}
                            <div className="flex items-center gap-2">
                                <ArrowUpDown size={14} className="text-[var(--color-text-dim)]" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                    className="text-sm bg-transparent border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
                                >
                                    <option value="name">Nome (A-Z)</option>
                                    <option value="price-asc">Menor preço</option>
                                    <option value="price-desc">Maior preço</option>
                                    <option value="stock">Disponibilidade</option>
                                </select>
                            </div>

                            {/* View mode */}
                            <div className="hidden sm:flex items-center gap-1 border border-[var(--color-border)] rounded-lg p-0.5">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-1.5 rounded-md transition-colors ${viewMode === "grid"
                                        ? "bg-[var(--color-primary)] text-white"
                                        : "text-[var(--color-text-dim)] hover:text-[var(--color-text)]"
                                        }`}
                                >
                                    <Grid3X3 size={16} />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-1.5 rounded-md transition-colors ${viewMode === "list"
                                        ? "bg-[var(--color-primary)] text-white"
                                        : "text-[var(--color-text-dim)] hover:text-[var(--color-text)]"
                                        }`}
                                >
                                    <List size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {loadingProducts ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="skeleton-card">
                                        <div className="skeleton-image skeleton" />
                                        <div className="p-5">
                                            <div className="skeleton skeleton-line-sm mb-3" style={{ width: '40%' }} />
                                            <div className="skeleton skeleton-line" style={{ width: '80%' }} />
                                            <div className="skeleton skeleton-line" style={{ width: '60%' }} />
                                            <div className="mt-4 flex items-end justify-between">
                                                <div className="skeleton skeleton-price" />
                                                <div className="skeleton" style={{ width: '5rem', height: '2.25rem', borderRadius: '0.75rem' }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div
                                className={
                                    viewMode === "grid"
                                        ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                                        : "space-y-4"
                                }
                            >
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg-elevated)] flex items-center justify-center mx-auto mb-4">
                                    <SlidersHorizontal size={24} className="text-[var(--color-text-dim)]" />
                                </div>
                                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                                    Nenhum produto encontrado
                                </h3>
                                <p className="text-sm text-[var(--color-text-muted)] mb-4">
                                    {searchQuery
                                        ? `Nenhum resultado para "${searchQuery}". Tente outro termo.`
                                        : "Tente ajustar seus filtros para ver mais resultados."}
                                </p>
                                <button
                                    onClick={clearAllFilters}
                                    className="btn-primary text-sm"
                                >
                                    Limpar filtros
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
