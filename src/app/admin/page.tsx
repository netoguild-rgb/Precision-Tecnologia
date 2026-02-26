"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Package,
    FolderOpen,
    TrendingUp,
    AlertCircle,
    Plus,
    PackageCheck,
    PackageX,
    Loader2,
    ShoppingCart,
    ClipboardList,
    Truck,
} from "lucide-react";

interface Stats {
    totalProducts: number;
    activeProducts: number;
    inStockProducts: number;
    outOfStockProducts: number;
    totalCategories: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    fetch("/api/admin/products?limit=1000"),
                    fetch("/api/admin/categories"),
                ]);

                const productsData = await productsRes.json();
                const categoriesData = await categoriesRes.json();

                const products = productsData.products || [];
                setStats({
                    totalProducts: productsData.pagination?.total || products.length,
                    activeProducts: products.filter((p: { status: string }) => p.status === "ACTIVE").length,
                    inStockProducts: products.filter((p: { stockStatus: string }) => p.stockStatus === "IN_STOCK").length,
                    outOfStockProducts: products.filter((p: { stockStatus: string }) => p.stockStatus === "OUT_OF_STOCK").length,
                    totalCategories: Array.isArray(categoriesData) ? categoriesData.length : 0,
                });
            } catch {
                setStats({
                    totalProducts: 0,
                    activeProducts: 0,
                    inStockProducts: 0,
                    outOfStockProducts: 0,
                    totalCategories: 0,
                });
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-[var(--color-primary)]" />
            </div>
        );
    }

    const cards = [
        {
            label: "Total de Produtos",
            value: stats?.totalProducts || 0,
            icon: Package,
            color: "var(--color-primary)",
            bg: "#EEF2FF",
        },
        {
            label: "Produtos Ativos",
            value: stats?.activeProducts || 0,
            icon: TrendingUp,
            color: "var(--color-accent)",
            bg: "#ECFDF5",
        },
        {
            label: "Em Estoque",
            value: stats?.inStockProducts || 0,
            icon: PackageCheck,
            color: "var(--color-success)",
            bg: "#F0FDF4",
        },
        {
            label: "Esgotados",
            value: stats?.outOfStockProducts || 0,
            icon: PackageX,
            color: "var(--color-danger)",
            bg: "#FEF2F2",
        },
        {
            label: "Categorias",
            value: stats?.totalCategories || 0,
            icon: FolderOpen,
            color: "var(--color-warning)",
            bg: "#FFF7ED",
        },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">Dashboard</h1>
                    <p className="text-sm text-[var(--color-text-muted)]">
                        Visão geral do catálogo
                    </p>
                </div>
                <Link href="/admin/produtos/novo" className="btn-primary flex items-center gap-2">
                    <Plus size={16} />
                    Novo Produto
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div key={card.label} className="admin-card !p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs text-[var(--color-text-muted)] mb-1">
                                        {card.label}
                                    </p>
                                    <p className="text-2xl font-bold text-[var(--color-text)]">
                                        {card.value}
                                    </p>
                                </div>
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: card.bg }}
                                >
                                    <Icon size={20} style={{ color: card.color }} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick actions */}
            <div className="admin-card">
                <h2 className="admin-card-title">Ações Rápidas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Link
                        href="/admin/produtos/novo"
                        className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-blue-50/50 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center group-hover:bg-[var(--color-primary)]/20 transition-colors">
                            <Plus size={18} className="text-[var(--color-primary)]" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[var(--color-text)]">Novo Produto</p>
                            <p className="text-xs text-[var(--color-text-dim)]">Cadastrar produto</p>
                        </div>
                    </Link>
                    <Link
                        href="/admin/produtos"
                        className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-blue-50/50 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center group-hover:bg-[var(--color-primary)]/20 transition-colors">
                            <Package size={18} className="text-[var(--color-primary)]" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[var(--color-text)]">Ver Produtos</p>
                            <p className="text-xs text-[var(--color-text-dim)]">Gerenciar catálogo</p>
                        </div>
                    </Link>
                    <Link
                        href="/admin/categorias"
                        className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-blue-50/50 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center group-hover:bg-[var(--color-primary)]/20 transition-colors">
                            <FolderOpen size={18} className="text-[var(--color-primary)]" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[var(--color-text)]">Categorias</p>
                            <p className="text-xs text-[var(--color-text-dim)]">Organizar catálogo</p>
                        </div>
                    </Link>
                </div>
            </div>

            {stats?.totalProducts === 0 && (
                <div className="admin-card mt-6 text-center py-10">
                    <AlertCircle size={32} className="mx-auto text-[var(--color-warning)] mb-3" />
                    <h3 className="text-lg font-semibold text-[var(--color-text)] mb-1">
                        Nenhum produto cadastrado
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] mb-4">
                        Comece cadastrando seu primeiro produto no catálogo.
                    </p>
                    <Link href="/admin/produtos/novo" className="btn-primary inline-flex items-center gap-2">
                        <Plus size={16} />
                        Cadastrar Primeiro Produto
                    </Link>
                </div>
            )}
        </div>
    );
}
