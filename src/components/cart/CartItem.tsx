"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Network } from "lucide-react";
import { CartItem as CartItemType } from "@/lib/cart-store";

interface CartItemProps {
    item: CartItemType;
    compact?: boolean;
    onUpdateQuantity: (productId: string, quantity: number) => void;
    onRemove: (productId: string) => void;
}

export function CartItemCard({ item, compact = false, onUpdateQuantity, onRemove }: CartItemProps) {
    const { product, quantity } = item;
    const subtotal = product.price * quantity;

    return (
        <div className="cart-item flex gap-3 p-3 bg-white border border-[var(--color-border)] rounded-xl hover:border-[var(--color-border-hover)] transition-all">
            {/* Thumbnail */}
            <Link
                href={`/produtos/${product.slug}`}
                className={`shrink-0 bg-[var(--color-bg-elevated)] rounded-lg overflow-hidden flex items-center justify-center border border-[var(--color-border)] ${compact ? "w-14 h-14" : "w-20 h-20"
                    }`}
            >
                {product.images[0] ? (
                    <div className="relative w-full h-full">
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-contain p-1"
                            sizes={compact ? "56px" : "80px"}
                        />
                    </div>
                ) : (
                    <Network size={compact ? 16 : 24} className="text-[var(--color-border-hover)]" />
                )}
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <Link
                    href={`/produtos/${product.slug}`}
                    className="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors line-clamp-2 leading-tight"
                >
                    {product.name}
                </Link>
                {!compact && (
                    <p className="text-xs text-[var(--color-text-dim)] font-mono-sku mt-0.5">
                        SKU: {product.sku}
                    </p>
                )}

                <div className="flex items-center justify-between mt-2 gap-2">
                    {/* Quantity stepper */}
                    <div className="flex items-center border border-[var(--color-border)] rounded-lg overflow-hidden">
                        <button
                            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                            disabled={quantity <= 1}
                            className="w-7 h-7 flex items-center justify-center hover:bg-[var(--color-bg-card-hover)] transition-colors text-[var(--color-text-muted)] disabled:opacity-30"
                        >
                            <Minus size={12} />
                        </button>
                        <span className="w-8 h-7 flex items-center justify-center text-xs font-semibold border-x border-[var(--color-border)] text-[var(--color-text)]">
                            {quantity}
                        </span>
                        <button
                            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-[var(--color-bg-card-hover)] transition-colors text-[var(--color-text-muted)]"
                        >
                            <Plus size={12} />
                        </button>
                    </div>

                    {/* Subtotal + Remove */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[var(--color-text)]">
                            {subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </span>
                        <button
                            onClick={() => onRemove(product.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-[var(--color-text-dim)] hover:text-[var(--color-danger)] transition-colors"
                            title="Remover"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
