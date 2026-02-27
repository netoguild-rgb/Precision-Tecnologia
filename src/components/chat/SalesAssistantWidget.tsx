"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, SendHorizontal, X } from "lucide-react";

type AssistantSuggestion = {
    slug: string;
    name: string;
    sku: string;
    price: number;
    stockStatus: string;
    image?: string | null;
};

type AssistantReply = {
    reply: string;
    suggestions?: AssistantSuggestion[];
    complementarySuggestions?: AssistantSuggestion[];
    categories?: Array<{ name: string; slug: string }>;
    providerLimited?: boolean;
    error?: string;
};

type ChatMessage = {
    id: string;
    role: "assistant" | "user";
    content: string;
    suggestions?: AssistantSuggestion[];
    complementarySuggestions?: AssistantSuggestion[];
    categories?: Array<{ name: string; slug: string }>;
    providerLimited?: boolean;
};

const SESSION_STORAGE_KEY = "precision_sales_assistant_session";
const GREETING_REGEX = /^(oi|ola|ol[aá]|bom dia|boa tarde|boa noite|e ai|e aí)$/i;
const QUICK_PROMPTS = [
    "Preciso de switch 24 portas para empresa",
    "Quero cotacao para 10 access points Wi-Fi 6",
    "Preciso de GBIC 10G para fibra monomodo",
];

function formatCurrency(value: number): string {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function createSessionId(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function stockLabel(stockStatus: string): string {
    switch (stockStatus) {
        case "IN_STOCK":
            return "Pronta entrega";
        case "LOW_STOCK":
            return "Estoque baixo";
        case "ON_ORDER":
            return "Sob encomenda";
        case "OUT_OF_STOCK":
            return "Indisponivel";
        default:
            return stockStatus;
    }
}

export function SalesAssistantWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [sessionId, setSessionId] = useState("");
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "welcome",
            role: "assistant",
            content:
                "Oi, sou o assistente comercial da Precision. Posso indicar produtos, compatibilidade e cotacao B2B.",
        },
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const existing =
            typeof window !== "undefined"
                ? window.localStorage.getItem(SESSION_STORAGE_KEY)
                : null;

        if (existing) {
            setSessionId(existing);
            return;
        }

        const created = createSessionId();
        setSessionId(created);
        if (typeof window !== "undefined") {
            window.localStorage.setItem(SESSION_STORAGE_KEY, created);
        }
    }, []);

    useEffect(() => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isOpen]);

    const canSend = useMemo(() => {
        return input.trim().length > 0 && !sending && sessionId.length > 0;
    }, [input, sending, sessionId]);

    const hasUserMessages = useMemo(
        () => messages.some((message) => message.role === "user"),
        [messages]
    );

    async function sendMessage(event?: FormEvent, presetMessage?: string) {
        event?.preventDefault();
        const message = (presetMessage ?? input).trim();
        if (!message || sending || sessionId.length === 0) return;

        if (!presetMessage) {
            setInput("");
        }

        const userMessage: ChatMessage = {
            id: `user_${Date.now()}`,
            role: "user",
            content: message,
        };

        setMessages((prev) => [...prev, userMessage]);
        const isFirstInteraction = !hasUserMessages;

        if (isFirstInteraction && GREETING_REGEX.test(message)) {
            setMessages((prev) => [
                ...prev,
                {
                    id: `assistant_quick_${Date.now()}`,
                    role: "assistant",
                    content:
                        "Perfeito. Me diga o produto ou projeto que voce precisa e eu te trago opcoes objetivas de compra.",
                },
            ]);
            return;
        }

        setSending(true);

        try {
            const response = await fetch("/api/ai/sales", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sessionId,
                    message,
                    page: typeof window !== "undefined" ? window.location.pathname : "/",
                }),
            });

            const data = (await response.json()) as AssistantReply;

            if (!response.ok) {
                throw new Error(data.error || "Falha no assistente");
            }

            setMessages((prev) => [
                ...prev,
                {
                    id: `assistant_${Date.now()}`,
                    role: "assistant",
                    content: data.reply || "Posso te ajudar com uma cotacao personalizada.",
                    suggestions: data.suggestions ?? [],
                    complementarySuggestions: data.complementarySuggestions ?? [],
                    categories: data.categories ?? [],
                    providerLimited: data.providerLimited,
                },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: `assistant_error_${Date.now()}`,
                    role: "assistant",
                    content: "Nao consegui responder agora. Tente novamente em instantes.",
                },
            ]);
        } finally {
            setSending(false);
        }
    }

    function handleInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            void sendMessage();
        }
    }

    function sendQuickPrompt(prompt: string) {
        void sendMessage(undefined, prompt);
    }

    return (
        <>
            {isOpen && (
                <div className="sales-chat-panel fixed z-[9998] bottom-24 left-3 right-3 md:left-auto md:right-6 md:w-[390px] rounded-3xl border border-white/40 bg-white/90 shadow-[0_24px_80px_rgba(11,39,81,0.28)] backdrop-blur-xl overflow-hidden">
                    <div className="sales-chat-header text-white px-4 py-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full shadow-[0_6px_16px_rgba(9,30,64,0.35)]">
                                <Image
                                    src="/images/chat2.png"
                                    alt="Rosto do assistente"
                                    fill
                                    sizes="36px"
                                    className="object-cover scale-125 rounded-full"
                                    priority
                                />
                            </span>
                            <div>
                                <p className="text-sm font-semibold leading-none tracking-tight">Assistente de Vendas</p>
                                <p className="text-[11px] text-white/85 mt-1">Resposta rapida para compra B2B</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 rounded-xl border border-white/20 inline-flex items-center justify-center hover:bg-white/15 transition-colors"
                            aria-label="Fechar assistente"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    <div
                        ref={scrollRef}
                        className="h-[58vh] max-h-[460px] min-h-[320px] overflow-y-auto px-3 py-3 space-y-3 bg-gradient-to-b from-[#eef4fb] via-[#f8fbff] to-white"
                    >
                        {!hasUserMessages && (
                            <div className="space-y-2">
                                <p className="text-[11px] uppercase tracking-wide text-[var(--color-text-dim)] px-1">
                                    Sugestoes rapidas
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {QUICK_PROMPTS.map((prompt) => (
                                        <button
                                            key={prompt}
                                            type="button"
                                            onClick={() => sendQuickPrompt(prompt)}
                                            className="text-xs bg-white/95 border border-[#d5e2f3] text-[var(--color-text)] rounded-full px-3 py-1.5 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-white transition-colors"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[88%] rounded-2xl px-3 py-2.5 text-sm shadow-sm ${
                                        message.role === "user"
                                            ? "bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white rounded-br-md border border-white/15"
                                            : "bg-white/96 border border-[#dce7f5] text-[var(--color-text)] rounded-bl-md"
                                    }`}
                                >
                                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>

                                    {message.providerLimited && (
                                        <p className="mt-2 text-[11px] text-amber-600">
                                            Atendimento com alto volume no momento.
                                        </p>
                                    )}

                                    {message.suggestions && message.suggestions.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            <p className="text-[11px] uppercase tracking-wide text-[var(--color-text-dim)] px-0.5">
                                                Produtos indicados
                                            </p>
                                            {message.suggestions.slice(0, 3).map((product) => (
                                                <Link
                                                    key={`${message.id}_${product.slug}`}
                                                    href={`/produtos/${product.slug}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className="block rounded-xl border border-[#dce7f5] bg-white p-2.5 hover:border-[var(--color-primary)] hover:shadow-md transition-all"
                                                >
                                                    <div className="flex gap-2.5">
                                                        <div className="w-14 h-14 rounded-lg border border-[var(--color-border)] bg-white overflow-hidden shrink-0">
                                                            {product.image ? (
                                                                // eslint-disable-next-line @next/next/no-img-element
                                                                <img
                                                                    src={product.image}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-contain p-1"
                                                                    loading="lazy"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-[var(--color-text-dim)]">
                                                                    Sem imagem
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs font-semibold text-[var(--color-text)] line-clamp-2">
                                                                {product.name}
                                                            </p>
                                                            <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                                                                SKU {product.sku}
                                                            </p>
                                                            <div className="mt-1.5 flex items-center justify-between text-[11px]">
                                                                <span className="font-semibold text-[var(--color-primary)]">
                                                                    {formatCurrency(product.price)}
                                                                </span>
                                                                <span className="text-[var(--color-text-dim)]">
                                                                    {stockLabel(product.stockStatus)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {message.complementarySuggestions &&
                                        message.complementarySuggestions.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                <p className="text-[11px] uppercase tracking-wide text-[var(--color-text-dim)] px-0.5">
                                                    Complementares
                                                </p>
                                                {message.complementarySuggestions.slice(0, 2).map((product) => (
                                                    <Link
                                                        key={`${message.id}_comp_${product.slug}`}
                                                        href={`/produtos/${product.slug}`}
                                                        onClick={() => setIsOpen(false)}
                                                        className="block rounded-xl border border-[#dce7f5] bg-white p-2 hover:border-[var(--color-primary)] hover:shadow-sm transition-all"
                                                    >
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className="text-xs font-semibold text-[var(--color-text)] line-clamp-1">
                                                                {product.name}
                                                            </p>
                                                            <span className="text-[11px] font-semibold text-[var(--color-primary)]">
                                                                {formatCurrency(product.price)}
                                                            </span>
                                                        </div>
                                                        <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                                                            SKU {product.sku} | {stockLabel(product.stockStatus)}
                                                        </p>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                    {message.categories && message.categories.length > 0 && (
                                        <div className="mt-3">
                                            <p className="text-[11px] uppercase tracking-wide text-[var(--color-text-dim)] mb-1 px-0.5">
                                                Categorias relacionadas
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {message.categories.slice(0, 4).map((category) => (
                                                    <Link
                                                        key={`${message.id}_cat_${category.slug}`}
                                                        href={`/produtos?category=${category.slug}`}
                                                        onClick={() => setIsOpen(false)}
                                                        className="text-[11px] rounded-full border border-[var(--color-border)] px-2 py-1 text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                                                    >
                                                        {category.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {sending && (
                            <div className="flex justify-start">
                                <div className="max-w-[85%] rounded-2xl rounded-bl-md px-3 py-2 bg-white border border-[#dce7f5] text-[var(--color-text)] text-sm inline-flex items-center gap-2">
                                    <Loader2 size={14} className="animate-spin text-[var(--color-primary)]" />
                                    Analisando sua necessidade...
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={sendMessage} className="p-3 border-t border-[#dce7f5] bg-white/95 backdrop-blur-sm">
                        <div className="flex items-end gap-2">
                            <textarea
                                rows={1}
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                                onKeyDown={handleInputKeyDown}
                                placeholder="Ex: preciso de switch 24 portas para empresa"
                                className="flex-1 resize-none rounded-xl border border-[#dce7f5] bg-[#f7faff] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
                                maxLength={1200}
                            />
                            <button
                                type="submit"
                                disabled={!canSend}
                                className="h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white inline-flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Enviar mensagem"
                            >
                                {sending ? (
                                    <Loader2 size={15} className="animate-spin" />
                                ) : (
                                    <SendHorizontal size={15} />
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={`sales-chat-fab fixed bottom-6 right-4 md:right-6 z-[9999] h-14 w-14 rounded-full bg-transparent text-white shadow-[0_18px_36px_rgba(13,43,82,0.35)] transition-all ${
                    isOpen ? "scale-[0.92] rotate-[-8deg]" : "hover:scale-105"
                }`}
                aria-label="Abrir assistente de vendas"
            >
                <span className="relative block h-full w-full overflow-hidden rounded-full">
                    <Image
                        src="/images/chat2.png"
                        alt="Abrir assistente"
                        fill
                        sizes="56px"
                        className="object-cover scale-125 rounded-full"
                    />
                </span>
                <span className="sales-chat-fab-dot" />
            </button>
        </>
    );
}
