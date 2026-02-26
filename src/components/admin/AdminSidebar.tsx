"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    FolderOpen,
    ArrowLeft,
    Settings,
} from "lucide-react";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/produtos", label: "Produtos", icon: Package },
    { href: "/admin/categorias", label: "Categorias", icon: FolderOpen },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="admin-sidebar">
            {/* Logo */}
            <div className="admin-sidebar-header">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] flex items-center justify-center">
                        <Settings size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-[var(--color-text)]">
                            Precision Admin
                        </h1>
                        <p className="text-[10px] text-[var(--color-text-dim)]">
                            Painel de Gestão
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="admin-sidebar-nav">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`admin-nav-item ${isActive ? "admin-nav-item-active" : ""}`}
                        >
                            <Icon size={18} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Back to store */}
            <div className="admin-sidebar-footer">
                <Link
                    href="/"
                    className="admin-nav-item text-[var(--color-text-dim)] hover:text-[var(--color-primary)]"
                >
                    <ArrowLeft size={18} />
                    Voltar à Loja
                </Link>
            </div>
        </aside>
    );
}
