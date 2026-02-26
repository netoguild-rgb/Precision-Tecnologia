import Link from "next/link";
import Image from "next/image";
import { Network, Package } from "lucide-react";
import { Product } from "@/lib/mock-products";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link
            href={`/produtos/${product.slug}`}
            className="product-card rounded-2xl overflow-hidden group block"
        >
            {/* Image */}
            <div className="aspect-[4/3] bg-[var(--color-bg-elevated)] flex items-center justify-center p-6 relative overflow-hidden border-b border-[var(--color-border)]">
                <div className="relative w-full h-full rounded-xl bg-white overflow-hidden flex items-center justify-center">
                    {product.images[0] ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
                    ) : (
                        <Network size={40} className="text-[var(--color-border-hover)]" />
                    )}
                </div>

                {/* Stock badge */}
                <span
                    className={`absolute top-3 left-3 badge-stock ${product.stockStatus === "IN_STOCK"
                            ? "badge-stock-available"
                            : product.stockStatus === "ON_ORDER"
                                ? "badge-stock-order"
                                : "badge-stock-out"
                        }`}
                >
                    <span
                        className={`w-1.5 h-1.5 rounded-full pulse-dot ${product.stockStatus === "IN_STOCK"
                                ? "bg-[var(--color-accent)]"
                                : product.stockStatus === "ON_ORDER"
                                    ? "bg-[var(--color-warning)]"
                                    : "bg-[var(--color-danger)]"
                            }`}
                    />
                    {product.stockLabel}
                </span>

                {/* New badge */}
                {product.isNew && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase">
                        Novo
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="p-4 bg-white">
                <p className="text-xs text-[var(--color-primary)] font-medium mb-1">
                    {product.category}
                </p>
                <h4 className="font-semibold text-sm mb-1 text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                </h4>
                <p className="font-mono-sku mb-3">SKU: {product.sku}</p>

                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-lg font-bold text-[var(--color-text)]">
                            {product.priceFormatted}
                        </p>
                        {product.installment && (
                            <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                                {product.installment} s/ juros
                            </p>
                        )}
                    </div>
                    <span className="btn-primary !py-2 !px-3 text-xs flex items-center gap-1.5">
                        <Package size={13} />
                        Comprar
                    </span>
                </div>
            </div>
        </Link>
    );
}
