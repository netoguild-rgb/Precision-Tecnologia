import prisma from "@/lib/prisma";
import { buildPaymentPolicyConfig } from "./config";
import type { PaymentPolicyConfig } from "./types";

export async function loadPaymentSettingsMap(): Promise<Record<string, string>> {
    const keys = [
        "payment_provider",
        "payment_methods_enabled",
        "max_installments",
        "card_installments_no_interest_max",
        "no_interest_max_amount",
        "card_3ds_required_above",
        "pix_discount_tier_1_max",
        "pix_discount_tier_1_percent",
        "pix_discount_tier_2_max",
        "pix_discount_tier_2_percent",
        "pix_discount_tier_3_percent",
        "b2b_invoice_enabled",
        "b2b_invoice_terms_days",
        "b2b_invoice_max_amount_without_review",
        "bank_transfer_from_amount",
        "pix_expiration_minutes",
        "boleto_due_days",
    ] as const;

    const settings = await prisma.setting.findMany({
        where: { key: { in: [...keys] } },
        select: { key: true, value: true },
    });

    return settings.reduce<Record<string, string>>((acc, item) => {
        acc[item.key] = item.value;
        return acc;
    }, {});
}

export async function loadPaymentPolicyConfigFromDb(): Promise<PaymentPolicyConfig> {
    const settingsMap = await loadPaymentSettingsMap();
    return buildPaymentPolicyConfig(settingsMap);
}

