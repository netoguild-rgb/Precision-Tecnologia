"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { useCartStore, cartTotalItems, cartTotalPrice } from "@/lib/cart-store";
import { CartItemCard } from "./CartItem";

export function CartDrawer() {
    const { items, isDrawerOpen, closeDrawer, updateQuantity, removeItem, clearCart } = useCartStore();
    const totalItems = useCartStore(cartTotalItems);
    const totalPrice = useCartStore(cartTotalPrice);

    // Lock body scroll when drawer is open
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isDrawerOpen]);

    // Close on Escape
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") closeDrawer();
        }
        if (isDrawerOpen) {
            window.addEventListener("keydown", handleKeyDown);
            return () => window.removeEventListener("keydown", handleKeyDown);
        }
    }, [isDrawerOpen, closeDrawer]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-[60] bg-black/30 transition-opacity duration-300 ${isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={closeDrawer}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isDrawerOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-2">
                        <ShoppingBag size={20} className="text-[var(--color-primary)]" />
                        <h2 className="text-lg font-bold text-[var(--color-text)]">Carrinho</h2>
                        {totalItems > 0 && (
                            <span className="px-2 py-0.5 text-xs font-bold bg-[var(--color-primary)] text-white rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={closeDrawer}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--color-bg-elevated)] transition-colors text-[var(--color-text-muted)]"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                {items.length === 0 ? (
                    /* Empty state */
                    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                        <div className="w-20 h-20 bg-[var(--color-bg-elevated)] rounded-2xl flex items-center justify-center mb-5">
                            <ShoppingBag size={32} className="text-[var(--color-text-dim)]" />
                        </div>
                        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                            Seu carrinho está vazio
                        </h3>
                        <p className="text-sm text-[var(--color-text-muted)] mb-6">
                            Explore nossos produtos e encontre as melhores soluções para sua rede.
                        </p>
                        <Link
                            href="/produtos"
                            onClick={closeDrawer}
                            className="btn-primary text-sm flex items-center gap-2"
                        >
                            Explorar Produtos
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Items list */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                            {items.map((item) => (
                                <CartItemCard
                                    key={item.product.id}
                                    item={item}
                                    compact
                                    onUpdateQuantity={updateQuantity}
                                    onRemove={removeItem}
                                />
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-[var(--color-border)] px-5 py-4 space-y-4">
                            {/* Total */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[var(--color-text-muted)]">Subtotal</span>
                                <span className="text-xl font-bold text-[var(--color-text)]">
                                    {totalPrice.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </span>
                            </div>

                            <p className="text-xs text-[var(--color-text-dim)]">
                                Frete calculado no checkout
                            </p>

                            {/* CTA buttons */}
                            <div className="space-y-2">
                                <Link
                                    href="/carrinho"
                                    onClick={closeDrawer}
                                    className="btn-success w-full flex items-center justify-center gap-2 text-sm !py-3"
                                >
                                    Finalizar Compra
                                    <ArrowRight size={16} />
                                </Link>
                                <Link
                                    href="/carrinho"
                                    onClick={closeDrawer}
                                    className="btn-outline w-full flex items-center justify-center gap-2 text-sm !py-3"
                                >
                                    Ver Carrinho Completo
                                </Link>
                            </div>

                            {/* Clear cart */}
                            <button
                                onClick={clearCart}
                                className="w-full text-xs text-[var(--color-text-dim)] hover:text-[var(--color-danger)] transition-colors flex items-center justify-center gap-1 py-1"
                            >
                                <Trash2 size={12} />
                                Limpar carrinho
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
