export type CheckoutProfile = "B2C" | "B2B";

export type CheckoutPaymentMethod =
    | "PIX"
    | "CREDIT_CARD"
    | "BOLETO"
    | "BANK_TRANSFER"
    | "B2B_INVOICE";

export interface PaymentContext {
    profile: CheckoutProfile;
    amount: number;
    hasApprovedCredit?: boolean;
    creditLimitRemaining?: number | null;
    isFirstPurchase?: boolean;
    isRecurringCharge?: boolean;
}

export interface PaymentPolicyConfig {
    enabledMethods: CheckoutPaymentMethod[];
    maxInstallments: number;
    noInterestInstallments: number;
    noInterestMaxAmount: number;
    card3DSRequiredAbove: number;
    pixDiscountTier1Max: number;
    pixDiscountTier1Percent: number;
    pixDiscountTier2Max: number;
    pixDiscountTier2Percent: number;
    pixDiscountTier3Percent: number;
    b2bInvoiceEnabled: boolean;
    b2bInvoiceTermsDays: number[];
    b2bInvoiceMaxAmountWithoutReview: number;
    bankTransferFromAmount: number;
}

export interface MethodDecision {
    method: CheckoutPaymentMethod;
    enabled: boolean;
    reason?: string;
}

export interface PaymentPolicyResult {
    methods: MethodDecision[];
    prioritizedMethods: CheckoutPaymentMethod[];
    pixDiscountPercent: number;
    noInterestInstallments: number;
    maxInstallments: number;
    require3DS: boolean;
    requiresManualReview: boolean;
    b2bInvoiceTermsDays: number[];
    notes: string[];
}

