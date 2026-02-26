import type { CheckoutPaymentMethod } from "./types";

export interface CreateProviderPaymentInput {
    orderId: string;
    amount: number;
    currency: string;
    method: CheckoutPaymentMethod;
    customer: {
        email: string;
        name: string;
        document?: string;
    };
    metadata?: Record<string, string>;
}

export interface ProviderPaymentResult {
    providerPaymentId: string;
    status: "PENDING" | "PROCESSING" | "PAID" | "FAILED" | "EXPIRED";
    paymentUrl?: string;
    qrCodeText?: string;
    barcode?: string;
    expiresAt?: Date;
    raw?: unknown;
}

export interface ProviderWebhookEvent {
    eventId: string;
    eventType: string;
    providerPaymentId: string;
    status: "PENDING" | "PROCESSING" | "PAID" | "FAILED" | "REFUNDED" | "EXPIRED";
    amount?: number;
    raw: unknown;
}

export interface PaymentProviderAdapter {
    readonly providerCode: string;
    createPayment(input: CreateProviderPaymentInput): Promise<ProviderPaymentResult>;
    parseWebhook(rawBody: string, signature?: string): Promise<ProviderWebhookEvent>;
}

