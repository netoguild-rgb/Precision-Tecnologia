import { loadPaymentPolicyConfigFromDb, loadPaymentSettingsMap } from "@/lib/payments";

function toNumber(value: string | undefined): number | null {
    if (!value) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function formatCurrency(value: number): string {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function paymentMethodLabel(method: string): string {
    switch (method) {
        case "PIX":
            return "PIX";
        case "CREDIT_CARD":
            return "Cartao de credito";
        case "BOLETO":
            return "Boleto";
        case "BANK_TRANSFER":
            return "Transferencia bancaria";
        case "B2B_INVOICE":
            return "Faturamento B2B";
        default:
            return method;
    }
}

function safeSetting(value: string | undefined): string {
    const sanitized = value?.trim();
    return sanitized ? sanitized : "nao configurado no sistema";
}

export async function buildStorePolicyContextText(): Promise<string> {
    const [settingsMap, paymentPolicy] = await Promise.all([
        loadPaymentSettingsMap(),
        loadPaymentPolicyConfigFromDb(),
    ]);

    const enabledPaymentMethods = paymentPolicy.enabledMethods
        .map((method) => paymentMethodLabel(method))
        .join(", ");

    const maxInstallments = paymentPolicy.maxInstallments;
    const noInterestInstallments = paymentPolicy.noInterestInstallments;
    const freeShippingAbove = toNumber(settingsMap.free_shipping_above);
    const pixExpirationMinutes = toNumber(settingsMap.pix_expiration_minutes);
    const boletoDueDays = toNumber(settingsMap.boleto_due_days);
    const b2bTerms = paymentPolicy.b2bInvoiceTermsDays;

    const warrantyPolicy = safeSetting(settingsMap.warranty_policy);
    const deliveryPolicy = safeSetting(settingsMap.delivery_policy);
    const returnPolicy = safeSetting(settingsMap.return_policy);
    const supportEmail = safeSetting(settingsMap.store_email);
    const supportPhone = safeSetting(settingsMap.store_phone);

    const freeShippingText =
        freeShippingAbove != null
            ? `frete gratis acima de ${formatCurrency(freeShippingAbove)}`
            : "politica de frete gratis nao configurada";

    const pixExpirationText =
        pixExpirationMinutes != null
            ? `PIX expira em ${pixExpirationMinutes} minutos`
            : "expiracao de PIX nao configurada";

    const boletoText =
        boletoDueDays != null
            ? `boleto com vencimento em ${boletoDueDays} dia(s)`
            : "prazo de boleto nao configurado";

    const b2bTermsText =
        b2bTerms.length > 0
            ? `faturamento B2B com prazos ${b2bTerms.join("/")} dias (quando aprovado)`
            : "faturamento B2B sem prazos configurados";

    return [
        "Politicas reais do ecommerce (dados do sistema):",
        `- metodos de pagamento habilitados: ${enabledPaymentMethods}`,
        `- parcelamento maximo: ${maxInstallments}x (sem juros ate ${noInterestInstallments}x, conforme politica ativa)`,
        `- ${pixExpirationText}`,
        `- ${boletoText}`,
        `- ${b2bTermsText}`,
        `- entrega: ${freeShippingText}`,
        "- rastreio: pagina /rastreamento por numero do pedido + email da compra",
        "- rastreio exibe: status, transportadora, codigo de rastreio e descricao de entrega",
        `- politica de entrega cadastrada: ${deliveryPolicy}`,
        `- politica de garantia cadastrada: ${warrantyPolicy}`,
        `- politica de devolucao cadastrada: ${returnPolicy}`,
        `- contato comercial cadastrado: email ${supportEmail}, telefone ${supportPhone}`,
    ].join("\n");
}
