"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Plus, Minus, X, Package, Loader2 } from "lucide-react";
import { CatalogApiProduct, Product, toCatalogProduct } from "@/lib/catalog";

export interface QuoteItem {
    product: Product;
    quantity: number;
}

interface QuoteProductSelectorProps {
    items: QuoteItem[];
    onItemsChange: (items: QuoteItem[]) => void;
}

export function QuoteProductSelector({ items, onItemsChange }: QuoteProductSelectorProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function loadProducts() {
            setLoadingProducts(true);
            try {
                const res = await fetch("/api/products?limit=200", { cache: "no-store" });
                if (!res.ok) throw new Error("Falha ao carregar produtos");

                const data = await res.json();
                const mapped = (data.products || []).map((p: CatalogApiProduct) =>
                    toCatalogProduct(p)
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

    const filteredProducts = products.filter((p) => {
        const alreadyAdded = items.some((item) => item.product.id === p.id);
        if (alreadyAdded) return false;
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.partNumber.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        );
    });

    // Group by category
    const grouped = filteredProducts.reduce<Record<string, Product[]>>((acc, p) => {
        if (!acc[p.category]) acc[p.category] = [];
        acc[p.category].push(p);
        return acc;
    }, {});

    function addProduct(product: Product) {
        onItemsChange([...items, { product, quantity: 1 }]);
        setSearchQuery("");
        setIsDropdownOpen(false);
        inputRef.current?.blur();
    }

    function removeItem(productId: string) {
        onItemsChange(items.filter((item) => item.product.id !== productId));
    }

    function updateQuantity(productId: string, delta: number) {
        onItemsChange(
            items.map((item) => {
                if (item.product.id === productId) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            })
        );
    }

    function setQuantity(productId: string, value: number) {
        onItemsChange(
            items.map((item) => {
                if (item.product.id === productId) {
                    return { ...item, quantity: Math.max(1, value) };
                }
                return item;
            })
        );
    }

    const totalEstimado = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
        <div className="space-y-4">
            {/* Search / Add product */}
            <div ref={dropdownRef} className="relative">
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Adicionar produto
                </label>
                <div className="relative">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]"
                    />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Buscar por nome, SKU ou categoria..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsDropdownOpen(true);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[var(--color-text)] placeholder-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
                    />
                </div>

                {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-[var(--color-border)] max-h-72 overflow-y-auto z-50">
                        {loadingProducts ? (
                            <div className="px-4 py-6 text-center text-sm text-[var(--color-text-muted)]">
                                <Loader2 size={20} className="mx-auto mb-2 animate-spin" />
                                Carregando produtos...
                            </div>
                        ) : Object.keys(grouped).length === 0 ? (
                            <div className="px-4 py-6 text-center text-sm text-[var(--color-text-muted)]">
                                <Package size={24} className="mx-auto mb-2 opacity-40" />
                                {searchQuery
                                    ? "Nenhum produto encontrado"
                                    : "Todos os produtos já foram adicionados"}
                            </div>
                        ) : (
                            Object.entries(grouped).map(([category, products]) => (
                                <div key={category}>
                                    <div className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-dim)] bg-[var(--color-bg-elevated)] sticky top-0">
                                        {category}
                                    </div>
                                    {products.map((product) => (
                                        <button
                                            key={product.id}
                                            onClick={() => addProduct(product)}
                                            className="w-full text-left px-4 py-2.5 hover:bg-[var(--color-bg-elevated)] transition-colors flex items-center justify-between gap-3"
                                        >
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-[var(--color-text)] truncate">
                                                    {product.name}
                                                </p>
                                                <p className="text-xs text-[var(--color-text-dim)] font-mono-sku">
                                                    SKU: {product.sku} · {product.partNumber}
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-sm font-semibold text-[var(--color-primary)]">
                                                    {product.priceFormatted}
                                                </p>
                                                <span
                                                    className={`text-[10px] font-medium ${product.stockStatus === "IN_STOCK"
                                                            ? "text-[var(--color-success)]"
                                                            : product.stockStatus === "ON_ORDER"
                                                                ? "text-[var(--color-warning)]"
                                                                : "text-[var(--color-danger)]"
                                                        }`}
                                                >
                                                    {product.stockLabel}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Items list */}
            {items.length > 0 && (
                <div className="space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-dim)]">
                        Itens da cotação ({items.length})
                    </div>

                    <div className="space-y-2">
                        {items.map((item) => (
                            <div
                                key={item.product.id}
                                className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center gap-3 quote-item-card"
                            >
                                {/* Product info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[var(--color-text)] truncate">
                                        {item.product.name}
                                    </p>
                                    <p className="text-xs text-[var(--color-text-dim)] font-mono-sku">
                                        SKU: {item.product.sku}
                                    </p>
                                </div>

                                {/* Quantity stepper */}
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center border border-[var(--color-border)] rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => updateQuantity(item.product.id, -1)}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-[var(--color-bg-card-hover)] transition-colors text-[var(--color-text-muted)]"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <input
                                            type="number"
                                            min={1}
                                            value={item.quantity}
                                            onChange={(e) =>
                                                setQuantity(item.product.id, parseInt(e.target.value) || 1)
                                            }
                                            className="w-12 h-8 text-center text-sm font-medium border-x border-[var(--color-border)] bg-white text-[var(--color-text)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <button
                                            onClick={() => updateQuantity(item.product.id, 1)}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-[var(--color-bg-card-hover)] transition-colors text-[var(--color-text-muted)]"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    {/* Subtotal */}
                                    <p className="text-sm font-semibold text-[var(--color-text)] w-28 text-right">
                                        {(item.product.price * item.quantity).toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        })}
                                    </p>

                                    {/* Remove */}
                                    <button
                                        onClick={() => removeItem(item.product.id)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-[var(--color-text-dim)] hover:text-[var(--color-danger)] transition-colors"
                                        title="Remover item"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
                        <span className="text-sm font-medium text-[var(--color-text-muted)]">
                            Total estimado (antes de descontos)
                        </span>
                        <span className="text-lg font-bold text-[var(--color-primary)]">
                            {totalEstimado.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            })}
                        </span>
                    </div>
                    <p className="text-xs text-[var(--color-text-dim)]">
                        * Valores de referência. O preço final será informado na cotação personalizada com descontos de volume.
                    </p>
                </div>
            )}
        </div>
    );
}
