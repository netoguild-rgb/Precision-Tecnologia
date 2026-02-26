import type { PaymentPolicyConfig } from "./types";

const DEFAULT_ENABLED_METHODS: PaymentPolicyConfig["enabledMethods"] = [
    "PIX",
    "CREDIT_CARD",
    "BOLETO",
    "B2B_INVOICE",
];

function parseNumber(value: string | undefined, fallback: number): number {
    if (!value) return fallback;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
    if (!value) return fallback;
    if (value === "true") return true;
    if (value === "false") return false;
    return fallback;
}

function parseMethods(value: string | undefined): PaymentPolicyConfig["enabledMethods"] {
    if (!value) return DEFAULT_ENABLED_METHODS;

    try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) return DEFAULT_ENABLED_METHODS;

        const valid = parsed.filter((item): item is PaymentPolicyConfig["enabledMethods"][number] =>
            ["PIX", "CREDIT_CARD", "BOLETO", "BANK_TRANSFER", "B2B_INVOICE"].includes(item)
        );

        return valid.length > 0 ? valid : DEFAULT_ENABLED_METHODS;
    } catch {
        return DEFAULT_ENABLED_METHODS;
    }
}

function parseNumberArray(value: string | undefined, fallback: number[]): number[] {
    if (!value) return fallback;
    try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) return fallback;
        const numeric = parsed
            .map((item) => Number(item))
            .filter((item) => Number.isFinite(item) && item > 0);
        return numeric.length > 0 ? numeric : fallback;
    } catch {
        return fallback;
    }
}

export function buildPaymentPolicyConfig(settings: Record<string, string> = {}): PaymentPolicyConfig {
    return {
        enabledMethods: parseMethods(settings.payment_methods_enabled),
        maxInstallments: parseNumber(settings.max_installments, 12),
        noInterestInstallments: parseNumber(settings.card_installments_no_interest_max, 6),
        noInterestMaxAmount: parseNumber(settings.no_interest_max_amount, 5000),
        card3DSRequiredAbove: parseNumber(settings.card_3ds_required_above, 2000),
        pixDiscountTier1Max: parseNumber(settings.pix_discount_tier_1_max, 3000),
        pixDiscountTier1Percent: parseNumber(settings.pix_discount_tier_1_percent, 5),
        pixDiscountTier2Max: parseNumber(settings.pix_discount_tier_2_max, 15000),
        pixDiscountTier2Percent: parseNumber(settings.pix_discount_tier_2_percent, 3),
        pixDiscountTier3Percent: parseNumber(settings.pix_discount_tier_3_percent, 2),
        b2bInvoiceEnabled: parseBoolean(settings.b2b_invoice_enabled, true),
        b2bInvoiceTermsDays: parseNumberArray(settings.b2b_invoice_terms_days, [30, 60, 90]),
        b2bInvoiceMaxAmountWithoutReview: parseNumber(
            settings.b2b_invoice_max_amount_without_review,
            15000
        ),
        bankTransferFromAmount: parseNumber(settings.bank_transfer_from_amount, 15000),
    };
}

export const defaultPaymentPolicyConfig: PaymentPolicyConfig = buildPaymentPolicyConfig();

