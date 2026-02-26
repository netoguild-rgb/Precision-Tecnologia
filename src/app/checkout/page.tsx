"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import type { CheckoutPaymentMethod } from "@/lib/payments";

type QuoteResponse = {
    amount: number;
    profile: "B2C" | "B2B";
    policy: {
        methods: Array<{
            method: CheckoutPaymentMethod;
            enabled: boolean;
            reason?: string;
        }>;
        prioritizedMethods: CheckoutPaymentMethod[];
        pixDiscountPercent: number;
        maxInstallments: number;
        noInterestInstallments: number;
        require3DS: boolean;
        notes: string[];
        b2bInvoiceTermsDays: number[];
    };
};

type IntentResponse = {
    orderId: string;
    orderNumber: string;
    amounts: {
        subtotal: number;
        discount: number;
        shipping: number;
        tax: number;
        total: number;
    };
    payment: {
        method: CheckoutPaymentMethod;
        status: string;
        provider: string;
        providerPaymentId: string;
        paymentReference: string | null;
        paymentExpiresAt: string | null;
        installments: number;
        invoiceDueDays: number | null;
        require3DS: boolean;
    };
    nextAction: string;
};

export default function CheckoutPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const items = useCartStore((state) => state.items);
    const clearCart = useCartStore((state) => state.clearCart);

    const [quote, setQuote] = useState<QuoteResponse | null>(null);
    const [quoteLoading, setQuoteLoading] = useState(false);
    const [quoteError, setQuoteError] = useState("");

    const [selectedMethod, setSelectedMethod] = useState<CheckoutPaymentMethod | "">("");
    const [installments, setInstallments] = useState(1);
    const [invoiceDueDays, setInvoiceDueDays] = useState<number | "">("");
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [result, setResult] = useState<IntentResponse | null>(null);

    const [address, setAddress] = useState({
        label: "Endereco Principal",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
    });

    const checkoutItems = useMemo(
        () => items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
        [items]
    );

    useEffect(() => {
        if (items.length === 0) return;

        async function loadQuote() {
            setQuoteLoading(true);
            setQuoteError("");

            try {
                const res = await fetch("/api/checkout/quote", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        items: checkoutItems,
                        profile: "B2C",
                    }),
                });

                const data = (await res.json()) as QuoteResponse & { error?: string };
                if (!res.ok) {
                    setQuoteError(data.error || "Nao foi possivel calcular opcoes de pagamento");
                    return;
                }

                setQuote(data);
                const firstMethod = data.policy.prioritizedMethods[0] || "";
                setSelectedMethod(firstMethod);
                setInstallments(1);
                setInvoiceDueDays(data.policy.b2bInvoiceTermsDays[0] ?? "");
            } catch {
                setQuoteError("Erro ao carregar opcoes de pagamento");
            } finally {
                setQuoteLoading(false);
            }
        }

        loadQuote();
    }, [checkoutItems, items.length]);

    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    async function handleCreateOrder(e: React.FormEvent) {
        e.preventDefault();
        setSubmitError("");

        if (status !== "authenticated") {
            router.push("/login?callbackUrl=/checkout");
            return;
        }

        if (!selectedMethod) {
            setSubmitError("Selecione um metodo de pagamento");
            return;
        }

        if (!address.street || !address.number || !address.neighborhood || !address.city || !address.state || !address.zipCode) {
            setSubmitError("Preencha os dados de endereco");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/checkout/intent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-idempotency-key": `checkout-${Date.now()}`,
                },
                body: JSON.stringify({
                    items: checkoutItems,
                    paymentMethod: selectedMethod,
                    installments,
                    invoiceDueDays: invoiceDueDays || undefined,
                    address,
                }),
            });

            const data = (await res.json()) as IntentResponse & { error?: string };
            if (!res.ok) {
                setSubmitError(data.error || "Falha ao criar pedido");
                return;
            }

            setResult(data);
            clearCart();
        } catch {
            setSubmitError("Falha ao finalizar pedido");
        } finally {
            setSubmitting(false);
        }
    }

    if (items.length === 0 && !result) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-[var(--color-text)]">Checkout</h1>
                <p className="text-[var(--color-text-muted)] mt-3">Seu carrinho esta vazio.</p>
                <Link href="/produtos" className="btn-primary inline-flex mt-6">
                    Voltar aos produtos
                </Link>
            </div>
        );
    }

    if (result) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
                    <div className="flex items-center gap-2 text-green-700 mb-3">
                        <CheckCircle2 size={18} />
                        <h1 className="font-bold text-lg">Pedido criado com sucesso</h1>
                    </div>
                    <p className="text-sm text-green-900">Pedido: <strong>{result.orderNumber}</strong></p>
                    <p className="text-sm text-green-900">Metodo: <strong>{result.payment.method}</strong></p>
                    {result.payment.paymentReference && (
                        <p className="text-sm text-green-900">
                            Referencia: <strong>{result.payment.paymentReference}</strong>
                        </p>
                    )}
                    <p className="text-sm text-green-900 mt-2">{result.nextAction}</p>
                </div>

                <div className="mt-6 flex gap-3">
                    <Link href="/produtos" className="btn-outline-muted">Continuar comprando</Link>
                    <Link href={`/api/orders/${result.orderId}`} className="btn-primary">
                        Ver pedido (API)
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[var(--color-text)]">Checkout</h1>
                <p className="text-sm text-[var(--color-text-muted)]">
                    {status === "authenticated"
                        ? `Comprando como ${session?.user?.email}`
                        : "Entre para finalizar seu pedido"}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <form onSubmit={handleCreateOrder} className="lg:col-span-2 space-y-5">
                    <section className="admin-card">
                        <h2 className="admin-card-title">Endereco de entrega</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input className="admin-input" placeholder="Rua" value={address.street} onChange={(e) => setAddress((s) => ({ ...s, street: e.target.value }))} />
                            <input className="admin-input" placeholder="Numero" value={address.number} onChange={(e) => setAddress((s) => ({ ...s, number: e.target.value }))} />
                            <input className="admin-input" placeholder="Bairro" value={address.neighborhood} onChange={(e) => setAddress((s) => ({ ...s, neighborhood: e.target.value }))} />
                            <input className="admin-input" placeholder="Cidade" value={address.city} onChange={(e) => setAddress((s) => ({ ...s, city: e.target.value }))} />
                            <input className="admin-input" placeholder="UF" maxLength={2} value={address.state} onChange={(e) => setAddress((s) => ({ ...s, state: e.target.value.toUpperCase() }))} />
                            <input className="admin-input" placeholder="CEP" value={address.zipCode} onChange={(e) => setAddress((s) => ({ ...s, zipCode: e.target.value }))} />
                            <input className="admin-input md:col-span-2" placeholder="Complemento (opcional)" value={address.complement} onChange={(e) => setAddress((s) => ({ ...s, complement: e.target.value }))} />
                        </div>
                    </section>

                    <section className="admin-card">
                        <h2 className="admin-card-title">Pagamento</h2>

                        {quoteLoading && (
                            <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                                <Loader2 size={16} className="animate-spin" />
                                Carregando metodos...
                            </div>
                        )}

                        {quoteError && (
                            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                                {quoteError}
                            </div>
                        )}

                        {quote && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {quote.policy.methods.map((method) => (
                                        <label
                                            key={method.method}
                                            className={`border rounded-lg p-3 text-sm ${
                                                method.enabled ? "cursor-pointer border-[var(--color-border)]" : "opacity-50 border-red-200"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                className="mr-2"
                                                disabled={!method.enabled}
                                                checked={selectedMethod === method.method}
                                                onChange={() => setSelectedMethod(method.method)}
                                            />
                                            {method.method}
                                            {!method.enabled && method.reason && (
                                                <span className="block text-xs mt-1 text-red-600">{method.reason}</span>
                                            )}
                                        </label>
                                    ))}
                                </div>

                                {selectedMethod === "CREDIT_CARD" && (
                                    <div>
                                        <label className="admin-label">Parcelas</label>
                                        <select
                                            className="admin-input"
                                            value={installments}
                                            onChange={(e) => setInstallments(Number(e.target.value))}
                                        >
                                            {Array.from({ length: quote.policy.maxInstallments }, (_, i) => i + 1).map((n) => (
                                                <option key={n} value={n}>
                                                    {n}x {n <= quote.policy.noInterestInstallments ? "sem juros" : "com juros"}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {selectedMethod === "B2B_INVOICE" && quote.policy.b2bInvoiceTermsDays.length > 0 && (
                                    <div>
                                        <label className="admin-label">Prazo faturado</label>
                                        <select
                                            className="admin-input"
                                            value={invoiceDueDays}
                                            onChange={(e) => setInvoiceDueDays(Number(e.target.value))}
                                        >
                                            {quote.policy.b2bInvoiceTermsDays.map((days) => (
                                                <option key={days} value={days}>
                                                    {days} dias
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {quote.policy.notes.length > 0 && (
                                    <div className="space-y-1">
                                        {quote.policy.notes.map((note) => (
                                            <p key={note} className="text-xs text-[var(--color-text-muted)]">
                                                • {note}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    {submitError && (
                        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                            <AlertCircle size={16} />
                            {submitError}
                        </div>
                    )}

                    <button type="submit" className="btn-success w-full !py-4" disabled={submitting || quoteLoading}>
                        {submitting ? "Criando pedido..." : "Confirmar pedido"}
                    </button>
                </form>

                <aside className="admin-card h-fit">
                    <h2 className="admin-card-title">Resumo</h2>
                    <div className="space-y-2 text-sm">
                        {items.map((item) => (
                            <div key={item.product.id} className="flex justify-between gap-2">
                                <span className="text-[var(--color-text-muted)] truncate">
                                    {item.quantity}x {item.product.name}
                                </span>
                                <span className="font-medium">
                                    {(item.product.price * item.quantity).toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                        <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>
                                {subtotal.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                            </span>
                        </div>
                        {quote && selectedMethod === "PIX" && (
                            <div className="flex justify-between text-sm text-green-700 mt-2">
                                <span>Desconto PIX</span>
                                <span>-{quote.policy.pixDiscountPercent}%</span>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}

