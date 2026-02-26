"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Search,
    ShoppingCart,
    User,
    Menu,
    X,
    ChevronDown,
    Zap,
    Phone,
} from "lucide-react";

const categories = [
    { name: "Switches", slug: "switches", icon: "🔌" },
    { name: "Roteadores", slug: "roteadores", icon: "📡" },
    { name: "Access Points", slug: "access-points", icon: "📶" },
    { name: "GBICs / SFP", slug: "gbics-sfp", icon: "🔗" },
    { name: "Patch Cords", slug: "patch-cords", icon: "🔌" },
    { name: "Patch Panels", slug: "patch-panels", icon: "📋" },
    { name: "Conectores", slug: "conectores", icon: "🔧" },
    { name: "Firewalls", slug: "firewalls", icon: "🛡️" },
];

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <header className="sticky top-0 z-50">
            {/* Top bar — Blue Royal */}
            <div className="bg-[var(--color-primary-dark)] text-white text-xs py-1.5">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <span className="flex items-center gap-1.5">
                        <Zap size={12} />
                        Frete grátis para compras acima de R$ 5.000
                    </span>
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/rastreamento" className="hover:underline">
                            Rastrear Pedido
                        </Link>
                        <span>|</span>
                        <Link href="/contato" className="hover:underline">
                            Contato
                        </Link>
                        <span>|</span>
                        <span className="flex items-center gap-1">
                            <Phone size={11} />
                            (11) 4002-8922
                        </span>
                    </div>
                </div>
            </div>

            {/* Main header — White Glass */}
            <div className="glass border-b border-[var(--color-border)]">
                <div className="max-w-7xl mx-auto px-4 py-2">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo — Precision Tecnologia + Huawei Partner */}
                        <Link href="/" className="flex items-center gap-3 sm:gap-4 shrink-0 group min-w-0">
                            <Image
                                src="/images/precision-logo-cropped.png"
                                alt="Precision Tecnologia"
                                width={802}
                                height={230}
                                className="h-20 sm:h-24 md:h-28 w-auto max-w-[260px] sm:max-w-[340px] md:max-w-[420px] logo-precision"
                                priority
                            />
                            <div className="h-14 sm:h-16 w-px bg-[var(--color-border)] hidden sm:block" />
                            <Image
                                src="/images/huawei-logo.png"
                                alt="Huawei Enterprise Partner"
                                width={80}
                                height={26}
                                className="h-6 sm:h-7 w-auto hidden sm:block opacity-60 group-hover:opacity-100 transition-opacity"
                                priority
                            />
                        </Link>

                        {/* Search bar */}
                        <div className="flex-1 max-w-xl hidden md:block">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar switches, APs, GBICs, patch cords..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl py-2.5 pl-4 pr-12 text-sm text-[var(--color-text)] placeholder-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
                                />
                                <button className="absolute right-1 top-1 bottom-1 px-3 bg-[var(--color-primary)] rounded-lg text-white hover:bg-[var(--color-primary-dark)] transition-colors">
                                    <Search size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <Link
                                href="/conta"
                                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--color-bg-elevated)] transition-colors text-sm"
                            >
                                <User size={18} className="text-[var(--color-text-muted)]" />
                                <div className="text-left">
                                    <p className="text-[10px] text-[var(--color-text-muted)]">
                                        Minha Conta
                                    </p>
                                    <p className="text-xs font-medium text-[var(--color-text)]">Entrar</p>
                                </div>
                            </Link>

                            <Link
                                href="/carrinho"
                                className="relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--color-bg-elevated)] transition-colors"
                            >
                                <ShoppingCart
                                    size={20}
                                    className="text-[var(--color-text-muted)]"
                                />
                                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[var(--color-accent)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    0
                                </span>
                            </Link>

                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2 rounded-lg hover:bg-[var(--color-bg-elevated)] transition-colors"
                            >
                                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Category nav */}
                <nav className="hidden md:block border-t border-[var(--color-border)]">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center gap-0">
                            {/* All categories dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() => setIsCategoriesOpen(true)}
                                onMouseLeave={() => setIsCategoriesOpen(false)}
                            >
                                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors">
                                    <Menu size={16} />
                                    Categorias
                                    <ChevronDown size={14} />
                                </button>

                                {isCategoriesOpen && (
                                    <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-[var(--color-border)] py-2 z-50">
                                        {categories.map((cat) => (
                                            <Link
                                                key={cat.slug}
                                                href={`/produtos?category=${cat.slug}`}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg-elevated)] transition-colors"
                                            >
                                                <span className="text-lg">{cat.icon}</span>
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Quick links */}
                            <Link
                                href="/produtos?stockStatus=IN_STOCK"
                                className="px-4 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors flex items-center gap-1.5"
                            >
                                <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] pulse-dot" />
                                Pronta Entrega
                            </Link>
                            <Link
                                href="/produtos?featured=true"
                                className="px-4 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                            >
                                Destaques
                            </Link>
                            <Link
                                href="/produtos?isNew=true"
                                className="px-4 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                            >
                                Novidades
                            </Link>
                            <Link
                                href="/cotacao"
                                className="px-4 py-2 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium transition-colors"
                            >
                                Solicitar Cotação B2B
                            </Link>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-[var(--color-border)] shadow-lg">
                    <div className="px-4 py-3">
                        <div className="relative mb-3">
                            <input
                                type="text"
                                placeholder="Buscar produtos..."
                                className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl py-2.5 pl-4 pr-10 text-sm"
                            />
                            <Search
                                size={16}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]"
                            />
                        </div>
                        <div className="space-y-1">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.slug}
                                    href={`/produtos?category=${cat.slug}`}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text)] hover:bg-[var(--color-bg-elevated)] transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <span>{cat.icon}</span>
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
