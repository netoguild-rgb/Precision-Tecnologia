"use client";

import Link from "next/link";
import {
    ShoppingBag,
    ArrowLeft,
    ArrowRight,
    Truck,
    Package,
    Shield,
    CreditCard,
    Trash2,
} from "lucide-react";
import { useCartStore, cartTotalItems, cartTotalPrice } from "@/lib/cart-store";
import { CartItemCard } from "@/components/cart/CartItem";
import { useState } from "react";

export default function CarrinhoPage() {
    const { items, updateQuantity, removeItem, clearCart } = useCartStore();
    const totalItems = useCartStore(cartTotalItems);
    const totalPrice = useCartStore(cartTotalPrice);
    const [cep, setCep] = useState("");

    const pixDiscount = totalPrice * 0.05;
    const priceWithPix = totalPrice - pixDiscount;

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
                <div className="w-24 h-24 bg-[var(--color-bg-elevated)] rounded-3xl flex items-center justify-center mb-6">
                    <ShoppingBag size={40} className="text-[var(--color-text-dim)]" />
                </div>
                <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                    Seu carrinho está vazio
                </h1>
                <p className="text-[var(--color-text-muted)] mb-8 max-w-md">
                    Explore nosso catálogo e encontre as melhores soluções em infraestrutura de rede.
                </p>
                <Link href="/produtos" className="btn-primary flex items-center gap-2 text-base">
                    <ArrowLeft size={18} />
                    Explorar Produtos
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            {/* Breadcrumb */}
            <div className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)]">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <nav className="text-xs text-[var(--color-text-dim)]">
                        <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
                        <span className="mx-2">›</span>
                        <span className="text-[var(--color-text)]">Carrinho</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-text)]">Carrinho</h1>
                        <p className="text-sm text-[var(--color-text-muted)]">{totalItems} {totalItems === 1 ? "item" : "itens"}</p>
                    </div>
                    <button
                        onClick={clearCart}
                        className="text-sm text-[var(--color-text-dim)] hover:text-[var(--color-danger)] transition-colors flex items-center gap-1.5"
                    >
                        <Trash2 size={14} />
                        Limpar carrinho
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Items */}
                    <div className="lg:col-span-2 space-y-3">
                        {items.map((item) => (
                            <CartItemCard
                                key={item.product.id}
                                item={item}
                                onUpdateQuantity={updateQuantity}
                                onRemove={removeItem}
                            />
                        ))}

                        {/* Continue shopping */}
                        <div className="pt-4">
                            <Link
                                href="/produtos"
                                className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium flex items-center gap-1.5 transition-colors"
                            >
                                <ArrowLeft size={14} />
                                Continuar comprando
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 shadow-sm sticky top-28">
                            <h2 className="text-lg font-bold text-[var(--color-text)] mb-5">
                                Resumo do Pedido
                            </h2>

                            {/* Items summary */}
                            <div className="space-y-2 mb-4 pb-4 border-b border-[var(--color-border)]">
                                {items.map((item) => (
                                    <div key={item.product.id} className="flex justify-between text-sm">
                                        <span className="text-[var(--color-text-muted)] truncate mr-2">
                                            {item.quantity}x {item.product.name}
                                        </span>
                                        <span className="text-[var(--color-text)] font-medium shrink-0">
                                            {(item.product.price * item.quantity).toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            })}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Subtotal */}
                            <div className="space-y-2 mb-4 pb-4 border-b border-[var(--color-border)]">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[var(--color-text-muted)]">Subtotal</span>
                                    <span className="text-[var(--color-text)] font-medium">
                                        {totalPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                    </span>
                                </div>

                                {/* Shipping */}
                                <div className="flex items-center gap-2 mt-3">
                                    <Truck size={14} className="text-[var(--color-text-dim)] shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="CEP"
                                        value={cep}
                                        onChange={(e) => setCep(e.target.value)}
                                        maxLength={9}
                                        className="flex-1 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
                                    />
                                    <button className="btn-outline-muted text-xs !py-1.5 !px-3">
                                        Calcular
                                    </button>
                                </div>
                            </div>

                            {/* PIX discount */}
                            <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-green-700 font-medium">À vista no PIX (-5%)</span>
                                    <span className="text-green-700 font-bold">
                                        {priceWithPix.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                    </span>
                                </div>
                                <p className="text-xs text-green-600">
                                    Economia de {pixDiscount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </p>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-base font-semibold text-[var(--color-text)]">Total</span>
                                <div className="text-right">
                                    <p className="text-2xl font-extrabold text-[var(--color-text)]">
                                        {totalPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                    </p>
                                    {items[0]?.product.installment && (
                                        <p className="text-xs text-[var(--color-text-muted)]">
                                            em até 12x sem juros
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* CTA */}
                            <Link
                                href="/checkout"
                                className="btn-success w-full flex items-center justify-center gap-2 text-base !py-4"
                            >
                                Finalizar Compra
                                <ArrowRight size={18} />
                            </Link>

                            {/* Trust badges */}
                            <div className="mt-5 pt-4 border-t border-[var(--color-border)] grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 text-xs text-[var(--color-text-dim)]">
                                    <Shield size={14} className="text-[var(--color-accent)] shrink-0" />
                                    Pagamento seguro
                                </div>
                                <div className="flex items-center gap-2 text-xs text-[var(--color-text-dim)]">
                                    <Package size={14} className="text-[var(--color-accent)] shrink-0" />
                                    Garantia 12 meses
                                </div>
                                <div className="flex items-center gap-2 text-xs text-[var(--color-text-dim)]">
                                    <CreditCard size={14} className="text-[var(--color-accent)] shrink-0" />
                                    12x sem juros
                                </div>
                                <div className="flex items-center gap-2 text-xs text-[var(--color-text-dim)]">
                                    <Truck size={14} className="text-[var(--color-accent)] shrink-0" />
                                    Frete para todo Brasil
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
