"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    Network,
    ShoppingCart,
    FileText,
    Package,
    Truck,
    ChevronDown,
    ChevronUp,
    Download,
    ExternalLink,
    Star,
    CheckCircle,
    Clock,
    Shield,
    ArrowRight,
    Calculator,
    Check,
} from "lucide-react";
import { mockProducts, Product } from "@/lib/mock-products";
import { CompatibilityChecker } from "@/components/product/CompatibilityChecker";
import { RackCalculator } from "@/components/tools/RackCalculator";
import { useCartStore } from "@/lib/cart-store";

export default function ProductDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const product = mockProducts.find((p) => p.slug === slug);

    const [selectedImage, setSelectedImage] = useState(0);
    const [specsOpen, setSpecsOpen] = useState(true);
    const [qty, setQty] = useState(1);
    const [cep, setCep] = useState("");
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [showAddedToast, setShowAddedToast] = useState(false);
    const addItem = useCartStore((s) => s.addItem);

    function handleAddToCart() {
        if (!product) return;
        addItem(product, qty);
        setShowAddedToast(true);
        setTimeout(() => setShowAddedToast(false), 2500);
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                        Produto não encontrado
                    </h2>
                    <p className="text-[var(--color-text-muted)] mb-4">
                        O produto que você procura não existe ou foi removido.
                    </p>
                    <Link href="/produtos" className="btn-primary text-sm">
                        Ver Catálogo
                    </Link>
                </div>
            </div>
        );
    }

    // Cross-sell: products from same category
    const crossSell = mockProducts
        .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
        .slice(0, 4);

    // Complementary products from other categories
    const complementary = mockProducts
        .filter((p) => p.categorySlug !== product.categorySlug)
        .slice(0, 4);

    const relatedProducts = crossSell.length > 0 ? crossSell : complementary;

    const priceVista = (product.price * 0.95).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            {/* Breadcrumb */}
            <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)]">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <nav className="text-xs text-[var(--color-text-dim)]">
                        <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
                        <span className="mx-2">›</span>
                        <Link href="/produtos" className="hover:text-[var(--color-primary)] transition-colors">Produtos</Link>
                        <span className="mx-2">›</span>
                        <Link href={`/produtos?category=${product.categorySlug}`} className="hover:text-[var(--color-primary)] transition-colors">
                            {product.category}
                        </Link>
                        <span className="mx-2">›</span>
                        <span className="text-[var(--color-text)]">{product.name}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* ═══════════════════════════════════
            TOP SECTION — Gallery + Buy Box
           ═══════════════════════════════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
                    {/* Left — Gallery */}
                    <div>
                        {/* Main image */}
                        <div className="aspect-square bg-[var(--color-bg-elevated)] rounded-2xl flex items-center justify-center border border-[var(--color-border)] mb-4 overflow-hidden relative group">
                            <div className="relative w-full h-full bg-white rounded-xl overflow-hidden flex items-center justify-center">
                                {product.images[selectedImage] ? (
                                    <Image
                                        src={product.images[selectedImage]}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                    />
                                ) : (
                                    <Network size={80} className="text-[var(--color-border-hover)]" />
                                )}
                            </div>
                            {/* Stock badge */}
                            <span className={`absolute top-4 left-4 badge-stock ${product.stockStatus === "IN_STOCK" ? "badge-stock-available" : "badge-stock-order"
                                }`}>
                                <span className={`w-2 h-2 rounded-full pulse-dot ${product.stockStatus === "IN_STOCK" ? "bg-[var(--color-accent)]" : "bg-[var(--color-warning)]"
                                    }`} />
                                {product.stockLabel}
                            </span>
                            {product.isNew && (
                                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold uppercase">
                                    Novo
                                </span>
                            )}
                        </div>

                        {/* Thumbnail strip */}
                        {product.images.length > 0 ? (
                            <div className="grid grid-cols-5 gap-2">
                                {product.images.map((imageUrl, i) => (
                                    <button
                                        key={`${product.id}-${i}`}
                                        onClick={() => setSelectedImage(i)}
                                        className={`aspect-square rounded-xl border bg-white overflow-hidden transition-all ${selectedImage === i
                                            ? "border-[var(--color-primary)]"
                                            : "border-[var(--color-border)] hover:border-[var(--color-border-hover)]"
                                            }`}
                                    >
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={imageUrl}
                                                alt={`${product.name} ${i + 1}`}
                                                fill
                                                className="object-contain p-1"
                                                sizes="96px"
                                            />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-5 gap-2">
                                {["Frente", "Traseira", "Lateral", "Interface", "No Rack"].map((label, i) => (
                                    <button
                                        key={label}
                                        onClick={() => setSelectedImage(i)}
                                        className={`aspect-square rounded-xl border flex items-center justify-center text-[10px] text-[var(--color-text-dim)] transition-all ${selectedImage === i
                                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                                            : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-hover)]"
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right — Product Info + Buy Box */}
                    <div>
                        {/* Category */}
                        <p className="text-sm text-[var(--color-primary)] font-medium mb-2">
                            {product.category}
                        </p>

                        {/* Title */}
                        <h1 className="text-2xl lg:text-3xl font-bold text-[var(--color-text)] mb-3 leading-tight">
                            {product.name}
                        </h1>

                        {/* SKU / Part Number */}
                        <div className="flex items-center gap-4 mb-4">
                            <span className="font-mono-sku text-sm">SKU: {product.sku}</span>
                            <span className="font-mono-sku text-sm">Part: {product.partNumber}</span>
                        </div>

                        {/* Quick specs */}
                        <div className="bg-[var(--color-bg-elevated)] rounded-xl p-4 mb-6 border border-[var(--color-border)]">
                            <ul className="space-y-2">
                                {Object.entries(product.specs).slice(0, 5).map(([key, value]) => (
                                    <li key={key} className="flex items-start gap-2 text-sm">
                                        <span className="text-[var(--color-text-muted)] min-w-[120px] shrink-0">{key}:</span>
                                        <span className="font-medium text-[var(--color-text)]">{value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ═══ BUY BOX ═══ */}
                        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
                            {/* Price */}
                            <div className="mb-5">
                                <p className="text-sm text-[var(--color-text-muted)] mb-1">
                                    À vista no PIX <span className="text-[var(--color-accent)] font-semibold">(-5%)</span>
                                </p>
                                <p className="text-3xl font-extrabold text-[var(--color-text)]">
                                    {priceVista}
                                </p>
                                <div className="mt-2 pt-2 border-t border-[var(--color-border)]">
                                    <p className="text-base font-semibold text-[var(--color-text)]">
                                        {product.priceFormatted}
                                    </p>
                                    {product.installment && (
                                        <p className="text-sm text-[var(--color-text-muted)]">
                                            em {product.installment} sem juros
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Stock status */}
                            <div className={`flex items-center gap-2 mb-5 p-3 rounded-lg ${product.stockStatus === "IN_STOCK"
                                ? "bg-[#ECFDF5] border border-[#A7F3D0]"
                                : "bg-[#FFFBEB] border border-[#FDE68A]"
                                }`}>
                                {product.stockStatus === "IN_STOCK" ? (
                                    <>
                                        <CheckCircle size={18} className="text-[var(--color-accent)]" />
                                        <div>
                                            <p className="text-sm font-semibold text-[var(--color-accent)]">Em Estoque</p>
                                            <p className="text-xs text-[var(--color-accent-dark)]">Envio em até 24h</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Clock size={18} className="text-[var(--color-warning)]" />
                                        <div>
                                            <p className="text-sm font-semibold text-[var(--color-warning)]">Sob Encomenda</p>
                                            <p className="text-xs text-amber-700">Prazo estimado: 5-15 dias</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Quantity */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-sm text-[var(--color-text-muted)]">Qtd:</span>
                                <div className="flex items-center border border-[var(--color-border)] rounded-lg">
                                    <button
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                        className="px-3 py-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                                    >
                                        −
                                    </button>
                                    <span className="px-4 py-1.5 text-sm font-semibold text-[var(--color-text)] border-x border-[var(--color-border)]">
                                        {qty}
                                    </span>
                                    <button
                                        onClick={() => setQty(qty + 1)}
                                        className="px-3 py-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleAddToCart}
                                    className="btn-success w-full flex items-center justify-center gap-2 text-base !py-4"
                                >
                                    <ShoppingCart size={20} />
                                    Adicionar ao Carrinho
                                </button>
                                <button
                                    onClick={() => setShowQuoteModal(true)}
                                    className="btn-outline w-full flex items-center justify-center gap-2 text-sm"
                                >
                                    <FileText size={16} />
                                    Solicitar Orçamento em Lote
                                </button>
                            </div>

                            {/* Shipping */}
                            <div className="mt-5 pt-5 border-t border-[var(--color-border)]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Truck size={16} className="text-[var(--color-text-muted)]" />
                                    <span className="text-sm font-medium text-[var(--color-text)]">Calcular frete</span>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="CEP"
                                        value={cep}
                                        onChange={(e) => setCep(e.target.value)}
                                        maxLength={9}
                                        className="flex-1 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]"
                                    />
                                    <button className="btn-outline-muted text-sm !py-2 !px-4">
                                        Calcular
                                    </button>
                                </div>
                                <p className="text-xs text-[var(--color-text-dim)] mt-2 flex items-center gap-1">
                                    <Package size={12} />
                                    Retirada em mãos disponível — São Paulo, SP
                                </p>
                            </div>

                            {/* Trust badges */}
                            <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex items-center gap-4 text-xs text-[var(--color-text-dim)]">
                                <span className="flex items-center gap-1">
                                    <Shield size={12} className="text-[var(--color-accent)]" />
                                    Garantia 12 meses
                                </span>
                                <span className="flex items-center gap-1">
                                    <Star size={12} className="text-amber-400" />
                                    Produto original
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════
            SPECS TABLE
           ═══════════════════════════════════ */}
                <div className="mb-16">
                    <button
                        onClick={() => setSpecsOpen(!specsOpen)}
                        className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-[var(--color-border)] shadow-sm hover:border-[var(--color-border-hover)] transition-colors"
                    >
                        <h2 className="text-xl font-bold text-[var(--color-text)]">
                            Especificações Técnicas
                        </h2>
                        {specsOpen ? (
                            <ChevronUp size={20} className="text-[var(--color-text-dim)]" />
                        ) : (
                            <ChevronDown size={20} className="text-[var(--color-text-dim)]" />
                        )}
                    </button>

                    {specsOpen && (
                        <div className="bg-white border border-t-0 border-[var(--color-border)] rounded-b-2xl overflow-hidden">
                            <table className="w-full">
                                <tbody>
                                    {Object.entries(product.specs).map(([key, value], i) => (
                                        <tr
                                            key={key}
                                            className={`${i % 2 === 0 ? "bg-[var(--color-bg-elevated)]" : "bg-white"
                                                }`}
                                        >
                                            <td className="px-6 py-3.5 text-sm font-medium text-[var(--color-text-muted)] w-1/3 border-r border-[var(--color-border)]">
                                                {key}
                                            </td>
                                            <td className="px-6 py-3.5 text-sm text-[var(--color-text)] font-medium">
                                                {value}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* ═══════════════════════════════════
            COMPATIBILITY CHECKER (GBIC/SFP only)
           ═══════════════════════════════════ */}
                {product.categorySlug === "gbics-sfp" && (
                    <div className="mb-16">
                        <CompatibilityChecker
                            productPartNumber={product.partNumber}
                        />
                    </div>
                )}

                {/* ═══════════════════════════════════
            DOWNLOADS
           ═══════════════════════════════════ */}
                <div className="mb-16">
                    <h2 className="text-xl font-bold text-[var(--color-text)] mb-6">
                        Downloads e Recursos
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { icon: Download, label: "Datasheet Oficial", detail: "PDF, 2.1 MB", type: "pdf" },
                            { icon: Download, label: "Manual de Instalação Rápida", detail: "PDF, 850 KB", type: "pdf" },
                            { icon: Download, label: "Guia de Compatibilidade GBICs", detail: "PDF, 1.3 MB", type: "pdf" },
                            { icon: ExternalLink, label: "Firmware mais recente", detail: "Site Huawei", type: "link" },
                            { icon: Calculator, label: "Dimensões para projeto", detail: "DWG/PDF", type: "pdf" },
                        ].map((item) => (
                            <button
                                key={item.label}
                                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-md transition-all text-left group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                                    <item.icon size={18} className="text-red-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                                        {item.label}
                                    </p>
                                    <p className="text-xs text-[var(--color-text-dim)]">{item.detail}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ═══════════════════════════════════
            CROSS-SELLING
           ═══════════════════════════════════ */}
                {relatedProducts.length > 0 && (
                    <div className="mb-16">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-[var(--color-text)] mb-1">
                                    Complete sua instalação
                                </h2>
                                <p className="text-sm text-[var(--color-text-muted)]">
                                    Recomendados para {product.name}
                                </p>
                            </div>
                            <Link
                                href="/produtos"
                                className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium flex items-center gap-1 transition-colors"
                            >
                                Ver mais
                                <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {relatedProducts.map((p) => (
                                <Link
                                    key={p.id}
                                    href={`/produtos/${p.slug}`}
                                    className="product-card rounded-xl overflow-hidden group block"
                                >
                                    <div className="aspect-[4/3] bg-[var(--color-bg-elevated)] flex items-center justify-center border-b border-[var(--color-border)]">
                                        {p.images[0] ? (
                                            <div className="relative w-full h-full bg-white">
                                                <Image
                                                    src={p.images[0]}
                                                    alt={p.name}
                                                    fill
                                                    className="object-contain p-3"
                                                    sizes="(max-width: 1024px) 50vw, 25vw"
                                                />
                                            </div>
                                        ) : (
                                            <Network size={28} className="text-[var(--color-border-hover)]" />
                                        )}
                                    </div>
                                    <div className="p-3 bg-white">
                                        <p className="text-[10px] text-[var(--color-primary)] font-medium mb-0.5">
                                            {p.category}
                                        </p>
                                        <h4 className="text-xs font-semibold text-[var(--color-text)] mb-1 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                                            {p.name}
                                        </h4>
                                        <p className="text-sm font-bold text-[var(--color-text)]">
                                            {p.priceFormatted}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════
            RACK CALCULATOR
           ═══════════════════════════════════ */}
                <div className="mb-16">
                    <RackCalculator />
                </div>
            </div>

            {/* ═══════════════════════════════════
          QUOTE MODAL (simple)
         ═══════════════════════════════════ */}
            {showQuoteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/30" onClick={() => setShowQuoteModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-xl border border-[var(--color-border)] max-w-lg w-full p-8">
                        <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
                            Solicitar Orçamento em Lote
                        </h3>
                        <p className="text-sm text-[var(--color-text-muted)] mb-6">
                            Preencha os dados abaixo para receber um orçamento personalizado de {product.name}.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-[var(--color-text-muted)] mb-1 block">Quantidade</label>
                                <input
                                    type="number"
                                    defaultValue={10}
                                    min={1}
                                    className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-[var(--color-text-muted)] mb-1 block">CNPJ</label>
                                <input
                                    type="text"
                                    placeholder="00.000.000/0001-00"
                                    className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-[var(--color-text-muted)] mb-1 block">E-mail</label>
                                <input
                                    type="email"
                                    placeholder="seu@email.com"
                                    className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-[var(--color-text-muted)] mb-1 block">Observações</label>
                                <textarea
                                    rows={3}
                                    placeholder="Detalhes do projeto, prazo, etc."
                                    className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] resize-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button className="btn-primary flex-1 text-sm">
                                    Enviar Orçamento
                                </button>
                                <button
                                    onClick={() => setShowQuoteModal(false)}
                                    className="btn-outline-muted text-sm"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast notification */}
            {showAddedToast && (
                <div className="fixed bottom-6 right-6 z-50 animate-[fadeInUp_0.3s_ease-out] bg-white border border-[var(--color-border)] rounded-xl shadow-xl px-5 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                        <Check size={16} className="text-[var(--color-success)]" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-[var(--color-text)]">Adicionado ao carrinho</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{qty}x {product.name}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
