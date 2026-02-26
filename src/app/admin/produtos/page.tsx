"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Package,
    Filter,
} from "lucide-react";

interface ProductRow {
    id: string;
    name: string;
    sku: string;
    price: number;
    stockQty: number;
    stockStatus: string;
    status: string;
    isFeatured: boolean;
    isNew: boolean;
    category: { id: string; name: string } | null;
    images: { url: string; alt?: string }[];
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

const stockLabels: Record<string, { label: string; color: string }> = {
    IN_STOCK: { label: "Em estoque", color: "var(--color-accent)" },
    LOW_STOCK: { label: "Poucas und.", color: "var(--color-warning)" },
    ON_ORDER: { label: "Sob encomenda", color: "var(--color-warning)" },
    OUT_OF_STOCK: { label: "Indisponível", color: "var(--color-danger)" },
};

const statusLabels: Record<string, { label: string; color: string }> = {
    ACTIVE: { label: "Ativo", color: "var(--color-accent)" },
    INACTIVE: { label: "Inativo", color: "var(--color-text-dim)" },
    DISCONTINUED: { label: "Descontinuado", color: "var(--color-danger)" },
};

export default function AdminProductsPage() {
    const [products, setProducts] = useState<ProductRow[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    const loadProducts = useCallback(async (page = 1, searchTerm = "") => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: "20",
            });
            if (searchTerm) params.set("search", searchTerm);

            const res = await fetch(`/api/admin/products?${params}`);
            const data = await res.json();

            setProducts(data.products || []);
            setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
        } catch {
            console.error("Error loading products");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        loadProducts(1, search);
    }

    async function handleDelete(id: string, name: string) {
        if (!confirm(`Tem certeza que deseja excluir "${name}"?`)) return;
        setDeleting(id);
        try {
            const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
            if (res.ok) {
                loadProducts(pagination.page, search);
            } else {
                alert("Erro ao excluir produto");
            }
        } catch {
            alert("Erro ao excluir produto");
        } finally {
            setDeleting(null);
        }
    }

    function formatPrice(price: number) {
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">Produtos</h1>
                    <p className="text-sm text-[var(--color-text-muted)]">
                        {pagination.total} produto{pagination.total !== 1 ? "s" : ""} cadastrado{pagination.total !== 1 ? "s" : ""}
                    </p>
                </div>
                <Link href="/admin/produtos/novo" className="btn-primary flex items-center gap-2">
                    <Plus size={16} />
                    Novo Produto
                </Link>
            </div>

            {/* Search */}
            <div className="admin-card !p-3 mb-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por nome, SKU ou part number..."
                            className="admin-input !pl-10"
                        />
                    </div>
                    <button type="submit" className="btn-primary px-4">
                        <Filter size={16} />
                    </button>
                </form>
            </div>

            {/* Table */}
            <div className="admin-card !p-0 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 size={24} className="animate-spin text-[var(--color-primary)]" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-16">
                        <Package size={32} className="mx-auto text-[var(--color-text-dim)] mb-3" />
                        <p className="text-sm text-[var(--color-text-muted)]">
                            {search ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Produto</th>
                                    <th>SKU</th>
                                    <th>Preço</th>
                                    <th>Estoque</th>
                                    <th>Status</th>
                                    <th>Categoria</th>
                                    <th className="text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => {
                                    const stock = stockLabels[product.stockStatus] || stockLabels.ON_ORDER;
                                    const st = statusLabels[product.status] || statusLabels.ACTIVE;
                                    return (
                                        <tr key={product.id}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg border border-[var(--color-border)] overflow-hidden bg-white shrink-0 relative">
                                                        {product.images[0]?.url ? (
                                                            <Image
                                                                src={product.images[0].url}
                                                                alt={product.name}
                                                                fill
                                                                className="object-contain p-1"
                                                                sizes="40px"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Package size={16} className="text-[var(--color-text-dim)]" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-[var(--color-text)] truncate max-w-[200px]">
                                                            {product.name}
                                                        </p>
                                                        <div className="flex gap-1 mt-0.5">
                                                            {product.isFeatured && (
                                                                <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                                                                    Destaque
                                                                </span>
                                                            )}
                                                            {product.isNew && (
                                                                <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">
                                                                    Novo
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="font-mono text-xs text-[var(--color-text-muted)]">
                                                    {product.sku}
                                                </span>
                                            </td>
                                            <td className="font-medium">{formatPrice(product.price)}</td>
                                            <td>
                                                <div className="flex items-center gap-1.5">
                                                    <span
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ backgroundColor: stock.color }}
                                                    />
                                                    <span className="text-xs">{stock.label}</span>
                                                    <span className="text-xs text-[var(--color-text-dim)]">
                                                        ({product.stockQty})
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span
                                                    className="admin-badge"
                                                    style={{
                                                        color: st.color,
                                                        backgroundColor: st.color + "15",
                                                    }}
                                                >
                                                    {st.label}
                                                </span>
                                            </td>
                                            <td className="text-xs text-[var(--color-text-muted)]">
                                                {product.category?.name || "—"}
                                            </td>
                                            <td>
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={`/admin/produtos/${product.id}/editar`}
                                                        className="p-2 rounded-lg hover:bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                                                    >
                                                        <Pencil size={15} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id, product.name)}
                                                        disabled={deleting === product.id}
                                                        className="p-2 rounded-lg hover:bg-red-50 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors disabled:opacity-50"
                                                    >
                                                        {deleting === product.id ? (
                                                            <Loader2 size={15} className="animate-spin" />
                                                        ) : (
                                                            <Trash2 size={15} />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)]">
                        <p className="text-xs text-[var(--color-text-muted)]">
                            Página {pagination.page} de {pagination.totalPages}
                        </p>
                        <div className="flex gap-1">
                            <button
                                onClick={() => loadProducts(pagination.page - 1, search)}
                                disabled={pagination.page <= 1}
                                className="p-1.5 rounded-lg hover:bg-[var(--color-bg-elevated)] disabled:opacity-30"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => loadProducts(pagination.page + 1, search)}
                                disabled={pagination.page >= pagination.totalPages}
                                className="p-1.5 rounded-lg hover:bg-[var(--color-bg-elevated)] disabled:opacity-30"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
