"use client";

import { FormEvent, useMemo, useState } from "react";
import {
    AlertTriangle,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Copy,
    CreditCard,
    Hash,
    Loader2,
    Mail,
    Package,
    Search,
    ShieldCheck,
    Truck,
} from "lucide-react";

type TrackOrderResponse = {
    order: {
        id: string;
        orderNumber: string;
        createdAt: string;
        updatedAt: string;
        subtotal: string | number;
        discount: string | number;
        shipping: string | number;
        tax: string | number;
        total: string | number;
        status:
            | "PENDING"
            | "PAID"
            | "PROCESSING"
            | "SHIPPED"
            | "DELIVERED"
            | "CANCELLED"
            | "REFUNDED";
        paymentMethod: "PIX" | "CREDIT_CARD" | "BOLETO" | "BANK_TRANSFER" | "B2B_INVOICE";
        paymentStatus: "PENDING" | "PROCESSING" | "PAID" | "FAILED" | "REFUNDED" | "EXPIRED";
        paymentReference: string | null;
        paymentExpiresAt: string | null;
        paidAt: string | null;
        notes: string | null;
        shippingMethod: string | null;
        trackingCode: string | null;
        shippedAt: string | null;
        deliveredAt: string | null;
        items: Array<{
            id: string;
            productName: string;
            productSku: string;
            quantity: number;
            unitPrice: string | number;
            totalPrice: string | number;
        }>;
    };
    permissions?: {
        canEditDelivery?: boolean;
    };
};

type Step = {
    id: string;
    title: string;
    subtitle: string;
    active: boolean;
    icon: typeof Package;
};

function toNumber(value: string | number | null | undefined): number {
    if (typeof value === "number") return value;
    if (typeof value === "string") return Number(value);
    return 0;
}

function formatCurrency(value: string | number): string {
    return toNumber(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function formatDate(value: string | null | undefined): string {
    if (!value) return "-";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "-";
    return parsed.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function applyOrderMask(value: string): string {
    const raw = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (raw.length <= 2) return raw;
    if (raw.length <= 6) return `${raw.slice(0, 2)}-${raw.slice(2)}`;
    return `${raw.slice(0, 2)}-${raw.slice(2, 6)}-${raw.slice(6, 12)}`;
}

function statusLabel(status: TrackOrderResponse["order"]["status"]): string {
    switch (status) {
        case "PENDING":
            return "Aguardando pagamento";
        case "PAID":
            return "Pagamento aprovado";
        case "PROCESSING":
            return "Em separacao";
        case "SHIPPED":
            return "Em transporte";
        case "DELIVERED":
            return "Entregue";
        case "CANCELLED":
            return "Cancelado";
        case "REFUNDED":
            return "Reembolsado";
        default:
            return status;
    }
}

function statusColor(status: TrackOrderResponse["order"]["status"]): string {
    switch (status) {
        case "DELIVERED":
            return "bg-emerald-100 text-emerald-700 border-emerald-200";
        case "SHIPPED":
            return "bg-blue-100 text-blue-700 border-blue-200";
        case "PROCESSING":
            return "bg-amber-100 text-amber-700 border-amber-200";
        case "PAID":
            return "bg-cyan-100 text-cyan-700 border-cyan-200";
        case "PENDING":
            return "bg-slate-100 text-slate-700 border-slate-200";
        case "CANCELLED":
            return "bg-red-100 text-red-700 border-red-200";
        case "REFUNDED":
            return "bg-violet-100 text-violet-700 border-violet-200";
        default:
            return "bg-slate-100 text-slate-700 border-slate-200";
    }
}

export default function RastreamentoPage() {
    const [orderNumber, setOrderNumber] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<TrackOrderResponse["order"] | null>(null);
    const [copied, setCopied] = useState(false);
    const [canEditDelivery, setCanEditDelivery] = useState(false);
    const [deliveryDescription, setDeliveryDescription] = useState("");
    const [shippingMethodInput, setShippingMethodInput] = useState("");
    const [trackingCodeInput, setTrackingCodeInput] = useState("");
    const [statusInput, setStatusInput] = useState<TrackOrderResponse["order"]["status"]>("PENDING");
    const [savingDelivery, setSavingDelivery] = useState(false);
    const [saveDeliveryError, setSaveDeliveryError] = useState("");
    const [saveDeliverySuccess, setSaveDeliverySuccess] = useState("");

    const timeline = useMemo<Step[]>(() => {
        if (!result) return [];

        const isPaidStage = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED", "REFUNDED"].includes(result.status) ||
            result.paymentStatus === "PAID";
        const isPickingStage = ["PROCESSING", "SHIPPED", "DELIVERED"].includes(result.status);
        const isShippedStage = ["SHIPPED", "DELIVERED"].includes(result.status);
        const isDeliveredStage = result.status === "DELIVERED";

        return [
            {
                id: "created",
                title: "Pedido recebido",
                subtitle: formatDate(result.createdAt),
                active: true,
                icon: Package,
            },
            {
                id: "paid",
                title: "Pagamento confirmado",
                subtitle: result.paidAt ? formatDate(result.paidAt) : "Aguardando confirmacao",
                active: isPaidStage,
                icon: CreditCard,
            },
            {
                id: "processing",
                title: "Em separacao",
                subtitle: isPickingStage ? "Pedido em preparacao" : "Aguardando etapa anterior",
                active: isPickingStage,
                icon: Clock3,
            },
            {
                id: "shipped",
                title: "Em transporte",
                subtitle: result.shippedAt ? formatDate(result.shippedAt) : "Ainda nao enviado",
                active: isShippedStage,
                icon: Truck,
            },
            {
                id: "delivered",
                title: "Entregue",
                subtitle: result.deliveredAt ? formatDate(result.deliveredAt) : "Entrega em andamento",
                active: isDeliveredStage,
                icon: CheckCircle2,
            },
        ];
    }, [result]);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setCopied(false);
        setResult(null);
        setCanEditDelivery(false);
        setSaveDeliveryError("");
        setSaveDeliverySuccess("");

        if (!orderNumber || !email) {
            setError("Preencha numero do pedido e email");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/orders/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderNumber,
                    email,
                }),
            });

            const data = (await res.json()) as TrackOrderResponse & { error?: string };
            if (!res.ok) {
                setError(data.error || "Nao foi possivel localizar o pedido");
                return;
            }

            setResult(data.order);
            setDeliveryDescription(data.order.notes || "");
            setShippingMethodInput(data.order.shippingMethod || "");
            setTrackingCodeInput(data.order.trackingCode || "");
            setStatusInput(data.order.status);
            setCanEditDelivery(Boolean(data.permissions?.canEditDelivery));
        } catch {
            setError("Erro de conexao ao consultar pedido");
        } finally {
            setLoading(false);
        }
    }

    async function copyTrackingCode() {
        if (!result?.trackingCode) return;
        try {
            await navigator.clipboard.writeText(result.trackingCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            setCopied(false);
        }
    }

    async function handleSaveDelivery() {
        if (!result) return;

        setSaveDeliveryError("");
        setSaveDeliverySuccess("");
        setSavingDelivery(true);

        try {
            const res = await fetch(`/api/admin/orders/${result.id}/delivery`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    deliveryDescription,
                    shippingMethod: shippingMethodInput,
                    trackingCode: trackingCodeInput,
                    status: statusInput,
                }),
            });

            const data = (await res.json()) as {
                error?: string;
                order?: {
                    notes: string | null;
                    shippingMethod: string | null;
                    trackingCode: string | null;
                    status: TrackOrderResponse["order"]["status"];
                    shippedAt: string | null;
                    deliveredAt: string | null;
                    updatedAt: string;
                };
            };

            if (!res.ok || !data.order) {
                setSaveDeliveryError(data.error || "Nao foi possivel salvar a entrega");
                return;
            }

            setResult((prev) =>
                prev
                    ? {
                        ...prev,
                        notes: data.order?.notes ?? null,
                        shippingMethod: data.order?.shippingMethod ?? null,
                        trackingCode: data.order?.trackingCode ?? null,
                        status: data.order?.status ?? prev.status,
                        shippedAt: data.order?.shippedAt ?? prev.shippedAt,
                        deliveredAt: data.order?.deliveredAt ?? prev.deliveredAt,
                        updatedAt: data.order?.updatedAt ?? prev.updatedAt,
                    }
                    : prev
            );

            setSaveDeliverySuccess("Atualizacao da entrega salva com sucesso");
        } catch {
            setSaveDeliveryError("Erro ao salvar atualizacao");
        } finally {
            setSavingDelivery(false);
        }
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            <section className="border-b border-[var(--color-border)] bg-gradient-to-b from-[var(--color-bg-elevated)] to-white">
                <div className="max-w-5xl mx-auto px-4 py-10">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)] mb-2">
                        Suporte ao cliente
                    </p>
                    <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-2">
                        Rastrear Pedido
                    </h1>
                    <p className="text-[var(--color-text-muted)] max-w-2xl">
                        Consulte o status da sua compra em tempo real com numero do pedido e email usado na compra.
                    </p>
                </div>
            </section>

            <section className="max-w-5xl mx-auto px-4 py-8">
                <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 md:p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
                        <label className="block">
                            <span className="text-xs font-medium text-[var(--color-text-muted)] mb-1.5 inline-flex items-center gap-1">
                                <Hash size={12} />
                                Numero do pedido
                            </span>
                            <input
                                type="text"
                                placeholder="PT-2026-000123"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(applyOrderMask(e.target.value))}
                                className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
                                maxLength={14}
                                required
                            />
                        </label>

                        <label className="block">
                            <span className="text-xs font-medium text-[var(--color-text-muted)] mb-1.5 inline-flex items-center gap-1">
                                <Mail size={12} />
                                Email da compra
                            </span>
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                                className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
                                required
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary h-[44px] mt-auto flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                            {loading ? "Consultando..." : "Rastrear"}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                            <AlertTriangle size={14} />
                            {error}
                        </div>
                    )}
                </div>

                {result && (
                    <div className="mt-6 space-y-5">
                        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 md:p-6 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-[var(--color-text-dim)] mb-1">
                                        Pedido
                                    </p>
                                    <h2 className="text-2xl font-bold text-[var(--color-text)]">{result.orderNumber}</h2>
                                    <p className="text-sm text-[var(--color-text-muted)] mt-1 inline-flex items-center gap-1.5">
                                        <CalendarDays size={14} />
                                        Criado em {formatDate(result.createdAt)}
                                    </p>
                                </div>
                                <div className="text-left md:text-right">
                                    <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold border ${statusColor(result.status)}`}>
                                        {statusLabel(result.status)}
                                    </span>
                                    <p className="text-xs text-[var(--color-text-dim)] mt-2">
                                        Pagamento: {result.paymentStatus}
                                    </p>
                                    <p className="text-sm font-semibold text-[var(--color-text)] mt-1">
                                        Total: {formatCurrency(result.total)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            <div className="lg:col-span-2 bg-white border border-[var(--color-border)] rounded-2xl p-5 md:p-6 shadow-sm">
                                <h3 className="text-base font-semibold text-[var(--color-text)] mb-5">Linha do tempo</h3>
                                <div className="space-y-4">
                                    {timeline.map((step, index) => {
                                        const Icon = step.icon;
                                        return (
                                            <div key={step.id} className="flex items-start gap-3">
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className={`w-9 h-9 rounded-full border flex items-center justify-center ${
                                                            step.active
                                                                ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                                                                : "bg-white border-[var(--color-border)] text-[var(--color-text-dim)]"
                                                        }`}
                                                    >
                                                        <Icon size={15} />
                                                    </div>
                                                    {index < timeline.length - 1 && (
                                                        <span
                                                            className={`mt-1 w-px h-7 ${
                                                                step.active ? "bg-[var(--color-primary)]/30" : "bg-[var(--color-border)]"
                                                            }`}
                                                        />
                                                    )}
                                                </div>
                                                <div className="pt-1">
                                                    <p className={`text-sm font-semibold ${step.active ? "text-[var(--color-text)]" : "text-[var(--color-text-dim)]"}`}>
                                                        {step.title}
                                                    </p>
                                                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{step.subtitle}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
                                <h3 className="text-base font-semibold text-[var(--color-text)]">Entrega</h3>
                                <div className="text-sm">
                                    <p className="text-[var(--color-text-muted)]">Transportadora</p>
                                    <p className="font-medium text-[var(--color-text)]">
                                        {result.shippingMethod || "A definir"}
                                    </p>
                                </div>
                                <div className="text-sm">
                                    <p className="text-[var(--color-text-muted)]">Codigo de rastreio</p>
                                    {result.trackingCode ? (
                                        <div className="mt-1 flex items-center gap-2">
                                            <code className="text-xs bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-2 py-1">
                                                {result.trackingCode}
                                            </code>
                                            <button
                                                onClick={copyTrackingCode}
                                                className="text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] inline-flex items-center gap-1"
                                            >
                                                <Copy size={12} />
                                                {copied ? "Copiado" : "Copiar"}
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="font-medium text-[var(--color-text)]">Ainda nao disponivel</p>
                                    )}
                                </div>
                                <div className="text-sm">
                                    <p className="text-[var(--color-text-muted)]">Metodo de pagamento</p>
                                    <p className="font-medium text-[var(--color-text)]">{result.paymentMethod}</p>
                                </div>
                                <div className="text-sm">
                                    <p className="text-[var(--color-text-muted)]">Descricao da entrega</p>
                                    <p className="font-medium text-[var(--color-text)]">
                                        {result.notes || "Sem observacoes de entrega"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {canEditDelivery && (
                            <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 md:p-6 shadow-sm">
                                <h3 className="text-base font-semibold text-[var(--color-text)] inline-flex items-center gap-2">
                                    <ShieldCheck size={16} className="text-[var(--color-primary)]" />
                                    Atualizacao manual da entrega (super admin)
                                </h3>
                                <p className="text-xs text-[var(--color-text-muted)] mt-1 mb-4">
                                    Essas alteracoes ficam visiveis para o cliente no rastreamento.
                                </p>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-medium text-[var(--color-text-muted)] mb-1.5 block">
                                            Descricao da entrega
                                        </label>
                                        <textarea
                                            value={deliveryDescription}
                                            onChange={(e) => setDeliveryDescription(e.target.value)}
                                            className="w-full min-h-[90px] bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
                                            placeholder="Ex: Pedido separado e aguardando coleta da transportadora."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-medium text-[var(--color-text-muted)] mb-1.5 block">
                                                Transportadora
                                            </label>
                                            <input
                                                type="text"
                                                value={shippingMethodInput}
                                                onChange={(e) => setShippingMethodInput(e.target.value)}
                                                className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
                                                placeholder="Ex: Jadlog"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-[var(--color-text-muted)] mb-1.5 block">
                                                Codigo de rastreio
                                            </label>
                                            <input
                                                type="text"
                                                value={trackingCodeInput}
                                                onChange={(e) => setTrackingCodeInput(e.target.value.toUpperCase())}
                                                className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
                                                placeholder="Ex: BR123456789"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-[var(--color-text-muted)] mb-1.5 block">
                                            Status do pedido
                                        </label>
                                        <select
                                            value={statusInput}
                                            onChange={(e) => setStatusInput(e.target.value as TrackOrderResponse["order"]["status"])}
                                            className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
                                        >
                                            <option value="PENDING">PENDING</option>
                                            <option value="PAID">PAID</option>
                                            <option value="PROCESSING">PROCESSING</option>
                                            <option value="SHIPPED">SHIPPED</option>
                                            <option value="DELIVERED">DELIVERED</option>
                                            <option value="CANCELLED">CANCELLED</option>
                                            <option value="REFUNDED">REFUNDED</option>
                                        </select>
                                    </div>

                                    {saveDeliveryError && (
                                        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                                            {saveDeliveryError}
                                        </div>
                                    )}
                                    {saveDeliverySuccess && (
                                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                                            {saveDeliverySuccess}
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={handleSaveDelivery}
                                        disabled={savingDelivery}
                                        className="btn-primary w-full md:w-auto inline-flex items-center justify-center gap-2"
                                    >
                                        {savingDelivery && <Loader2 size={14} className="animate-spin" />}
                                        {savingDelivery ? "Salvando..." : "Salvar atualizacao de entrega"}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 md:p-6 shadow-sm">
                            <h3 className="text-base font-semibold text-[var(--color-text)] mb-4">
                                Itens do pedido ({result.items.length})
                            </h3>
                            <div className="space-y-3">
                                {result.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between gap-3 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-[var(--color-text)]">{item.productName}</p>
                                            <p className="text-xs text-[var(--color-text-muted)]">SKU: {item.productSku}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-[var(--color-text-muted)]">{item.quantity}x</p>
                                            <p className="text-sm font-semibold text-[var(--color-text)]">{formatCurrency(item.totalPrice)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
