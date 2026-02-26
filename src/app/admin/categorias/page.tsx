"use client";

import { useEffect, useState } from "react";
import { Plus, FolderOpen, Loader2 } from "lucide-react";

interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    isActive: boolean;
    _count: { products: number };
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/categories");
            const data = await res.json();
            if (Array.isArray(data)) setCategories(data);
        } catch {
            console.error("Error loading categories");
        } finally {
            setLoading(false);
        }
    }

    function generateSlug(value: string) {
        return value
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!name || !slug) return;
        setSaving(true);
        try {
            const res = await fetch("/api/admin/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, slug }),
            });

            if (res.ok) {
                setName("");
                setSlug("");
                setShowForm(false);
                loadCategories();
            } else {
                const data = await res.json();
                alert(data.error || "Erro ao criar categoria");
            }
        } catch {
            alert("Erro ao criar categoria");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">Categorias</h1>
                    <p className="text-sm text-[var(--color-text-muted)]">
                        {categories.length} categoria{categories.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={16} />
                    Nova Categoria
                </button>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="admin-card mb-6">
                    <h2 className="admin-card-title">Nova Categoria</h2>
                    <form onSubmit={handleCreate} className="flex gap-3 items-end">
                        <div className="flex-1">
                            <label className="admin-label">Nome</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setSlug(generateSlug(e.target.value));
                                }}
                                placeholder="Ex: Switches"
                                className="admin-input"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="admin-label">Slug</label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(generateSlug(e.target.value))}
                                placeholder="switches"
                                className="admin-input"
                                required
                            />
                        </div>
                        <button type="submit" disabled={saving} className="btn-primary shrink-0">
                            {saving ? <Loader2 size={16} className="animate-spin" /> : "Criar"}
                        </button>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="admin-card !p-0 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 size={24} className="animate-spin text-[var(--color-primary)]" />
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-16">
                        <FolderOpen size={32} className="mx-auto text-[var(--color-text-dim)] mb-3" />
                        <p className="text-sm text-[var(--color-text-muted)]">Nenhuma categoria</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Slug</th>
                                <th>Produtos</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat) => (
                                <tr key={cat.id}>
                                    <td className="font-medium">{cat.name}</td>
                                    <td>
                                        <span className="font-mono text-xs text-[var(--color-text-muted)]">
                                            {cat.slug}
                                        </span>
                                    </td>
                                    <td>{cat._count.products}</td>
                                    <td>
                                        <span
                                            className="admin-badge"
                                            style={{
                                                color: cat.isActive ? "var(--color-accent)" : "var(--color-text-dim)",
                                                backgroundColor: cat.isActive ? "rgba(14, 165, 233, 0.1)" : "rgba(148, 163, 184, 0.1)",
                                            }}
                                        >
                                            {cat.isActive ? "Ativa" : "Inativa"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
