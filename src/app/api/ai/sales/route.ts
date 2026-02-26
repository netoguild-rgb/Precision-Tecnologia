import { NextRequest, NextResponse } from "next/server";
import type { AiMessageRole } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth-user";
import { applyRateLimit } from "@/lib/ai/rate-limit";
import {
    buildCatalogContextText,
    findCatalogKnowledge,
    type CatalogKnowledge,
} from "@/lib/ai/catalog-context";
import {
    SALES_ASSISTANT_SYSTEM_PROMPT,
    buildSalesSystemContext,
    type SalesCartItem,
} from "@/lib/ai/sales-prompt";
import { buildStorePolicyContextText } from "@/lib/ai/store-context";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GroqCompletionResponse = {
    choices?: Array<{
        message?: {
            content?: string | null;
        };
    }>;
    usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
    };
    error?: {
        message?: string;
        type?: string;
        code?: string;
    };
};

type SalesRequestBody = {
    sessionId?: unknown;
    message?: unknown;
    page?: unknown;
    cart?: unknown;
};

function getRequestIp(request: NextRequest): string {
    const xForwardedFor = request.headers.get("x-forwarded-for");
    if (xForwardedFor) {
        const firstIp = xForwardedFor.split(",")[0]?.trim();
        if (firstIp) return firstIp;
    }

    const xRealIp = request.headers.get("x-real-ip");
    if (xRealIp) return xRealIp;

    return "unknown-ip";
}

function sanitizeSessionId(input: unknown): string {
    if (typeof input !== "string") return "";
    return input.trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);
}

function sanitizeMessage(input: unknown): string {
    if (typeof input !== "string") return "";
    return input.replace(/\s+/g, " ").trim().slice(0, 1200);
}

function sanitizePage(input: unknown): string {
    if (typeof input !== "string") return "/";
    const value = input.trim();
    if (!value) return "/";
    return value.slice(0, 160);
}

function sanitizeCart(input: unknown): SalesCartItem[] {
    if (!Array.isArray(input)) return [];

    return input
        .map((item) => {
            if (!item || typeof item !== "object") return null;
            const raw = item as Record<string, unknown>;

            const sku = String(raw.sku ?? "").trim().toUpperCase().slice(0, 60);
            const qtyRaw = Number(raw.qty);
            const qty = Number.isFinite(qtyRaw) ? Math.max(1, Math.floor(qtyRaw)) : 1;

            if (!sku) return null;
            return { sku, qty };
        })
        .filter((item): item is SalesCartItem => item !== null)
        .slice(0, 15);
}

function mapRoleToGroq(role: AiMessageRole): "user" | "assistant" | "system" {
    if (role === "ASSISTANT") return "assistant";
    if (role === "SYSTEM") return "system";
    return "user";
}

function buildFallbackReply(message: string, knowledge: CatalogKnowledge): string {
    if (knowledge.primaryProducts.length > 0) {
        const top = knowledge.primaryProducts.slice(0, 3).map((item) => item.name).join(", ");
        const complementary = knowledge.complementaryProducts
            .slice(0, 2)
            .map((item) => item.name)
            .join(", ");

        if (complementary) {
            return `Encontrei no catalogo: ${top}. Complementares reais: ${complementary}.`;
        }

        return `Encontrei no catalogo: ${top}.`;
    }

    if (knowledge.categories.length > 0) {
        const categories = knowledge.categories
            .slice(0, 4)
            .map((item) => item.name)
            .join(", ");
        return `Nao encontrei produto especifico, mas estas categorias estao relacionadas: ${categories}.`;
    }

    if (/cotac|orcament|proposta|pagamento|frete|entrega|garantia|rastreio/i.test(message)) {
        return "Nao encontrei essa informacao no sistema.";
    }

    return "Nao encontrei essa informacao no sistema.";
}

async function requestGroqReply(params: {
    apiKey: string;
    model: string;
    maxTokens: number;
    temperature: number;
    history: Array<{ role: "user" | "assistant"; content: string }>;
    context: string;
    catalogText: string;
}) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${params.apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: params.model,
            temperature: params.temperature,
            max_tokens: params.maxTokens,
            messages: [
                { role: "system", content: SALES_ASSISTANT_SYSTEM_PROMPT },
                { role: "system", content: params.context },
                { role: "system", content: params.catalogText },
                ...params.history,
            ],
        }),
    });

    const json = (await response.json()) as GroqCompletionResponse;

    return {
        ok: response.ok,
        status: response.status,
        payload: json,
    };
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as SalesRequestBody;
        const sessionId = sanitizeSessionId(body.sessionId);
        const message = sanitizeMessage(body.message);
        const page = sanitizePage(body.page);
        const cart = sanitizeCart(body.cart);

        if (!sessionId) {
            return NextResponse.json(
                { error: "sessionId invalido" },
                { status: 400 }
            );
        }

        if (!message) {
            return NextResponse.json(
                { error: "Mensagem vazia" },
                { status: 400 }
            );
        }

        const ip = getRequestIp(request);
        const rate = applyRateLimit(`ai-sales:${ip}:${sessionId.slice(0, 12)}`, {
            limit: 18,
            windowMs: 60_000,
        });

        if (!rate.allowed) {
            return NextResponse.json(
                {
                    error: "Limite de uso temporario atingido. Tente novamente em instantes.",
                },
                {
                    status: 429,
                    headers: {
                        "Retry-After": String(rate.retryAfterSeconds),
                    },
                }
            );
        }

        const user = await getAuthenticatedUser(request);
        const [knowledge, storePolicyText] = await Promise.all([
            findCatalogKnowledge(message),
            buildStorePolicyContextText(),
        ]);

        const conversation = await prisma.aiConversation.upsert({
            where: { sessionId },
            update: user?.id ? { userId: user.id } : {},
            create: {
                sessionId,
                userId: user?.id ?? null,
                status: "OPEN",
            },
            select: {
                id: true,
            },
        });

        await prisma.aiMessage.create({
            data: {
                conversationId: conversation.id,
                role: "USER",
                content: message,
            },
        });

        const recentMessages = await prisma.aiMessage.findMany({
            where: { conversationId: conversation.id },
            orderBy: { createdAt: "desc" },
            take: 12,
            select: {
                role: true,
                content: true,
            },
        });

        const history = recentMessages
            .reverse()
            .filter((item) => item.role !== "SYSTEM")
            .map((item) => ({
                role: mapRoleToGroq(item.role),
                content: item.content,
            }))
            .filter((item): item is { role: "user" | "assistant"; content: string } => item.role !== "system");

        const systemContext = buildSalesSystemContext({
            page,
            cart,
            categories: knowledge.categories,
            primaryProducts: knowledge.primaryProducts,
            complementaryProducts: knowledge.complementaryProducts,
            storePolicyText,
        });

        const catalogText = buildCatalogContextText(knowledge);

        const apiKey = process.env.GROQ_API_KEY;
        const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
        const maxTokensRaw = Number(process.env.GROQ_MAX_TOKENS ?? "500");
        const temperatureRaw = Number(process.env.GROQ_TEMPERATURE ?? "0.1");
        const maxTokens = Number.isFinite(maxTokensRaw)
            ? Math.min(Math.max(Math.floor(maxTokensRaw), 120), 1200)
            : 500;
        const temperature = Number.isFinite(temperatureRaw)
            ? Math.min(Math.max(temperatureRaw, 0), 0.5)
            : 0.1;

        let reply = "";
        let tokensIn: number | null = null;
        let tokensOut: number | null = null;
        let providerLimited = false;

        if (apiKey) {
            const completion = await requestGroqReply({
                apiKey,
                model,
                maxTokens,
                temperature,
                history,
                context: systemContext,
                catalogText,
            });

            if (completion.ok) {
                reply = completion.payload.choices?.[0]?.message?.content?.trim() || "";
                tokensIn = completion.payload.usage?.prompt_tokens ?? null;
                tokensOut = completion.payload.usage?.completion_tokens ?? null;
            } else if (completion.status === 429) {
                providerLimited = true;
                reply = "Estou com alto volume de atendimento agora. Tente novamente em 1 minuto ou solicite cotacao B2B para retorno comercial.";
            } else {
                reply = buildFallbackReply(message, knowledge);
            }
        } else {
            reply = buildFallbackReply(message, knowledge);
        }

        if (!reply) {
            reply = buildFallbackReply(message, knowledge);
        }

        await prisma.aiMessage.create({
            data: {
                conversationId: conversation.id,
                role: "ASSISTANT",
                content: reply,
                tokensIn,
                tokensOut,
            },
        });

        return NextResponse.json(
            {
                reply,
                suggestions: knowledge.primaryProducts.map((item) => ({
                    slug: item.slug,
                    name: item.name,
                    sku: item.sku,
                    price: item.price,
                    stockStatus: item.stockStatus,
                    image: item.image,
                })),
                complementarySuggestions: knowledge.complementaryProducts.map((item) => ({
                    slug: item.slug,
                    name: item.name,
                    sku: item.sku,
                    price: item.price,
                    stockStatus: item.stockStatus,
                    image: item.image,
                })),
                categories: knowledge.categories.map((category) => ({
                    name: category.name,
                    slug: category.slug,
                })),
                leadCaptured: false,
                providerLimited,
            },
            {
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    } catch (error) {
        console.error("Error in /api/ai/sales:", error);
        return NextResponse.json(
            { error: "Erro ao processar assistente de vendas" },
            { status: 500 }
        );
    }
}
