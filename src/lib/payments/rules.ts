import { defaultPaymentPolicyConfig } from "./config";
import type {
    CheckoutPaymentMethod,
    MethodDecision,
    PaymentContext,
    PaymentPolicyConfig,
    PaymentPolicyResult,
} from "./types";

function getPixDiscountPercent(amount: number, config: PaymentPolicyConfig): number {
    if (amount <= config.pixDiscountTier1Max) return config.pixDiscountTier1Percent;
    if (amount <= config.pixDiscountTier2Max) return config.pixDiscountTier2Percent;
    return config.pixDiscountTier3Percent;
}

function isEnabled(method: CheckoutPaymentMethod, config: PaymentPolicyConfig): boolean {
    return config.enabledMethods.includes(method);
}

function prioritizeMethods(ctx: PaymentContext, available: CheckoutPaymentMethod[]): CheckoutPaymentMethod[] {
    const has = (method: CheckoutPaymentMethod) => available.includes(method);
    const prioritized: CheckoutPaymentMethod[] = [];

    if (ctx.profile === "B2C") {
        if (ctx.amount <= 500) {
            if (has("PIX")) prioritized.push("PIX");
            if (has("CREDIT_CARD")) prioritized.push("CREDIT_CARD");
            if (has("BOLETO")) prioritized.push("BOLETO");
        } else {
            if (has("CREDIT_CARD")) prioritized.push("CREDIT_CARD");
            if (has("PIX")) prioritized.push("PIX");
            if (has("BOLETO")) prioritized.push("BOLETO");
        }
    } else {
        if (ctx.amount <= 2000) {
            if (has("PIX")) prioritized.push("PIX");
            if (has("CREDIT_CARD")) prioritized.push("CREDIT_CARD");
            if (has("BOLETO")) prioritized.push("BOLETO");
        } else if (ctx.amount <= 15000) {
            if (has("PIX")) prioritized.push("PIX");
            if (has("BOLETO")) prioritized.push("BOLETO");
            if (has("CREDIT_CARD")) prioritized.push("CREDIT_CARD");
        } else {
            if (has("B2B_INVOICE")) prioritized.push("B2B_INVOICE");
            if (has("BANK_TRANSFER")) prioritized.push("BANK_TRANSFER");
            if (has("PIX")) prioritized.push("PIX");
            if (has("CREDIT_CARD")) prioritized.push("CREDIT_CARD");
            if (has("BOLETO")) prioritized.push("BOLETO");
        }
    }

    for (const method of available) {
        if (!prioritized.includes(method)) prioritized.push(method);
    }

    return prioritized;
}

export function resolvePaymentPolicy(
    context: PaymentContext,
    config: PaymentPolicyConfig = defaultPaymentPolicyConfig
): PaymentPolicyResult {
    const notes: string[] = [];
    const methods: MethodDecision[] = [];
    const available: CheckoutPaymentMethod[] = [];

    const baseMethods: CheckoutPaymentMethod[] = ["PIX", "CREDIT_CARD", "BOLETO", "BANK_TRANSFER"];
    for (const method of baseMethods) {
        const enabled = isEnabled(method, config) && (method !== "BANK_TRANSFER" || context.amount >= config.bankTransferFromAmount);
        methods.push({ method, enabled, reason: enabled ? undefined : "Metodo indisponivel para este pedido" });
        if (enabled) available.push(method);
    }

    const b2bInvoiceEligibleByCredit =
        context.profile === "B2B" &&
        Boolean(context.hasApprovedCredit) &&
        (context.creditLimitRemaining == null || context.creditLimitRemaining >= context.amount);

    const b2bInvoiceEnabled = isEnabled("B2B_INVOICE", config) && config.b2bInvoiceEnabled;
    const b2bInvoiceAllowed = b2bInvoiceEnabled && b2bInvoiceEligibleByCredit;

    methods.push({
        method: "B2B_INVOICE",
        enabled: b2bInvoiceAllowed,
        reason: b2bInvoiceAllowed
            ? undefined
            : "Disponivel apenas para CNPJ aprovado e com limite de credito",
    });
    if (b2bInvoiceAllowed) available.push("B2B_INVOICE");

    const pixDiscountPercent = getPixDiscountPercent(context.amount, config);

    const noInterestInstallments =
        context.amount <= config.noInterestMaxAmount
            ? Math.min(config.noInterestInstallments, config.maxInstallments)
            : 1;

    const require3DS = Boolean(context.isFirstPurchase) || context.amount >= config.card3DSRequiredAbove;
    if (require3DS) notes.push("Cartao deve usar 3DS para reforco antifraude");

    if (context.isRecurringCharge) {
        notes.push("Cartoes virtuais temporarios podem falhar em cobrancas recorrentes");
    }

    const requiresManualReview =
        context.amount > config.b2bInvoiceMaxAmountWithoutReview ||
        (context.profile === "B2C" && context.amount > 3000);

    if (requiresManualReview) {
        notes.push("Pedido recomendado para revisao manual antes da captura final");
    }

    return {
        methods,
        prioritizedMethods: prioritizeMethods(context, available),
        pixDiscountPercent,
        noInterestInstallments,
        maxInstallments: config.maxInstallments,
        require3DS,
        requiresManualReview,
        b2bInvoiceTermsDays: config.b2bInvoiceTermsDays,
        notes,
    };
}

