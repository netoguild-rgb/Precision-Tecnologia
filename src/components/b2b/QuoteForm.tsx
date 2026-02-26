"use client";

import { useState } from "react";
import {
    Building2,
    Mail,
    Phone,
    FileText,
    Send,
    CheckCircle2,
    Clock,
    CreditCard,
} from "lucide-react";
import { QuoteProductSelector, QuoteItem } from "./QuoteProductSelector";

interface FormData {
    companyName: string;
    cnpj: string;
    contactName: string;
    email: string;
    phone: string;
    sector: string;
    paymentPreference: string;
    deadline: string;
    notes: string;
}

function formatCNPJ(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 14);
    return digits
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
}

function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 10) {
        return digits
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return digits
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
}

export function QuoteForm() {
    const [formData, setFormData] = useState<FormData>({
        companyName: "",
        cnpj: "",
        contactName: "",
        email: "",
        phone: "",
        sector: "",
        paymentPreference: "",
        deadline: "",
        notes: "",
    });
    const [items, setItems] = useState<QuoteItem[]>([]);
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [protocolNumber, setProtocolNumber] = useState("");

    function handleChange(field: keyof FormData, value: string) {
        let formatted = value;
        if (field === "cnpj") formatted = formatCNPJ(value);
        if (field === "phone") formatted = formatPhone(value);

        setFormData((prev) => ({ ...prev, [field]: formatted }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    }

    function validate(): boolean {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        if (!formData.companyName.trim()) newErrors.companyName = "Informe o nome da empresa";
        if (!formData.cnpj.trim() || formData.cnpj.replace(/\D/g, "").length < 14)
            newErrors.cnpj = "Informe um CNPJ válido";
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = "Informe um e-mail válido";
        if (!formData.phone.trim() || formData.phone.replace(/\D/g, "").length < 10)
            newErrors.phone = "Informe um telefone válido";
        if (items.length === 0) newErrors.companyName = "Adicione pelo menos um produto";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);

        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const protocol = `COT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        setProtocolNumber(protocol);
        setIsSubmitted(true);
        setIsSubmitting(false);
    }

    if (isSubmitted) {
        return (
            <div className="quote-success-card text-center py-12 px-6">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={32} className="text-[var(--color-success)]" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                    Cotação enviada com sucesso!
                </h3>
                <p className="text-[var(--color-text-muted)] mb-6 max-w-md mx-auto">
                    Nossa equipe comercial analisará sua solicitação e entrará em contato em até <strong>24 horas úteis</strong>.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl mb-6">
                    <FileText size={16} className="text-[var(--color-primary)]" />
                    <span className="text-sm text-[var(--color-text-muted)]">Protocolo:</span>
                    <span className="text-sm font-bold font-mono-sku text-[var(--color-primary)]">
                        {protocolNumber}
                    </span>
                </div>

                <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl p-5 max-w-lg mx-auto text-left">
                    <h4 className="text-sm font-semibold text-[var(--color-text)] mb-3">Resumo da cotação</h4>
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--color-text-muted)]">Empresa</span>
                            <span className="font-medium text-[var(--color-text)]">{formData.companyName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--color-text-muted)]">CNPJ</span>
                            <span className="font-mono-sku text-[var(--color-text)]">{formData.cnpj}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--color-text-muted)]">E-mail</span>
                            <span className="text-[var(--color-text)]">{formData.email}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--color-text-muted)]">Itens</span>
                            <span className="font-medium text-[var(--color-text)]">{items.length} produtos</span>
                        </div>
                    </div>
                    <div className="border-t border-[var(--color-border)] pt-3">
                        {items.map((item) => (
                            <div key={item.product.id} className="flex justify-between text-xs py-1">
                                <span className="text-[var(--color-text-muted)] truncate mr-3">
                                    {item.quantity}x {item.product.name}
                                </span>
                                <span className="text-[var(--color-text)] font-medium shrink-0">
                                    {(item.product.price * item.quantity).toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                            companyName: "",
                            cnpj: "",
                            contactName: "",
                            email: "",
                            phone: "",
                            sector: "",
                            paymentPreference: "",
                            deadline: "",
                            notes: "",
                        });
                        setItems([]);
                    }}
                    className="mt-8 btn-outline text-sm"
                >
                    Nova cotação
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1 — Company Data */}
            <div className="quote-form-section">
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                        <Building2 size={16} className="text-[var(--color-primary)]" />
                    </div>
                    <h3 className="text-base font-semibold text-[var(--color-text)]">
                        Dados da Empresa
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Company name */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                            Nome Fantasia / Razão Social *
                        </label>
                        <input
                            type="text"
                            value={formData.companyName}
                            onChange={(e) => handleChange("companyName", e.target.value)}
                            placeholder="Ex: TechNet Soluções LTDA"
                            className={`quote-input ${errors.companyName ? "quote-input-error" : ""}`}
                        />
                        {errors.companyName && (
                            <p className="text-xs text-[var(--color-danger)] mt-1">{errors.companyName}</p>
                        )}
                    </div>

                    {/* CNPJ */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                            CNPJ *
                        </label>
                        <input
                            type="text"
                            value={formData.cnpj}
                            onChange={(e) => handleChange("cnpj", e.target.value)}
                            placeholder="00.000.000/0001-00"
                            className={`quote-input font-mono-sku ${errors.cnpj ? "quote-input-error" : ""}`}
                        />
                        {errors.cnpj && (
                            <p className="text-xs text-[var(--color-danger)] mt-1">{errors.cnpj}</p>
                        )}
                    </div>

                    {/* Contact name */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                            Nome do Contato
                        </label>
                        <input
                            type="text"
                            value={formData.contactName}
                            onChange={(e) => handleChange("contactName", e.target.value)}
                            placeholder="Responsável pela cotação"
                            className="quote-input"
                        />
                    </div>

                    {/* Sector */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                            Setor de Atuação
                        </label>
                        <select
                            value={formData.sector}
                            onChange={(e) => handleChange("sector", e.target.value)}
                            className="quote-input"
                        >
                            <option value="">Selecione...</option>
                            <option value="telecom">Telecomunicações</option>
                            <option value="ti">Tecnologia da Informação</option>
                            <option value="integrador">Integrador de Redes</option>
                            <option value="isp">Provedor de Internet (ISP)</option>
                            <option value="datacenter">Data Center</option>
                            <option value="governo">Governo / Setor Público</option>
                            <option value="educacao">Educação</option>
                            <option value="saude">Saúde</option>
                            <option value="industria">Indústria</option>
                            <option value="varejo">Varejo</option>
                            <option value="outro">Outro</option>
                        </select>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                            <span className="flex items-center gap-1.5">
                                <Mail size={14} className="text-[var(--color-text-dim)]" />
                                E-mail *
                            </span>
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="comercial@empresa.com.br"
                            className={`quote-input ${errors.email ? "quote-input-error" : ""}`}
                        />
                        {errors.email && (
                            <p className="text-xs text-[var(--color-danger)] mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                            <span className="flex items-center gap-1.5">
                                <Phone size={14} className="text-[var(--color-text-dim)]" />
                                Telefone *
                            </span>
                        </label>
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            placeholder="(11) 99999-9999"
                            className={`quote-input ${errors.phone ? "quote-input-error" : ""}`}
                        />
                        {errors.phone && (
                            <p className="text-xs text-[var(--color-danger)] mt-1">{errors.phone}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Section 2 — Products */}
            <div className="quote-form-section">
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center">
                        <FileText size={16} className="text-[var(--color-accent)]" />
                    </div>
                    <h3 className="text-base font-semibold text-[var(--color-text)]">
                        Produtos para Cotação
                    </h3>
                </div>

                <QuoteProductSelector items={items} onItemsChange={setItems} />

                {items.length === 0 && errors.companyName && (
                    <p className="text-xs text-[var(--color-danger)] mt-2">
                        Adicione pelo menos um produto à cotação
                    </p>
                )}
            </div>

            {/* Section 3 — Additional Info */}
            <div className="quote-form-section">
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-success)]/10 flex items-center justify-center">
                        <CreditCard size={16} className="text-[var(--color-success)]" />
                    </div>
                    <h3 className="text-base font-semibold text-[var(--color-text)]">
                        Informações Adicionais
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Payment preference */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                            Forma de Pagamento Preferencial
                        </label>
                        <select
                            value={formData.paymentPreference}
                            onChange={(e) => handleChange("paymentPreference", e.target.value)}
                            className="quote-input"
                        >
                            <option value="">Selecione...</option>
                            <option value="pix">PIX (desconto adicional)</option>
                            <option value="boleto-vista">Boleto à Vista</option>
                            <option value="boleto-30">Boleto Faturado 30 dias</option>
                            <option value="boleto-30-60">Boleto Faturado 30/60 dias</option>
                            <option value="boleto-30-60-90">Boleto Faturado 30/60/90 dias</option>
                            <option value="cartao">Cartão de Crédito</option>
                            <option value="outro">Outro — especificar nas observações</option>
                        </select>
                    </div>

                    {/* Deadline */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                            <span className="flex items-center gap-1.5">
                                <Clock size={14} className="text-[var(--color-text-dim)]" />
                                Prazo Desejado de Entrega
                            </span>
                        </label>
                        <select
                            value={formData.deadline}
                            onChange={(e) => handleChange("deadline", e.target.value)}
                            className="quote-input"
                        >
                            <option value="">Selecione...</option>
                            <option value="urgente">Urgente (até 5 dias úteis)</option>
                            <option value="normal">Normal (até 15 dias úteis)</option>
                            <option value="programada">Entrega Programada (30+ dias)</option>
                            <option value="sem-pressa">Sem urgência</option>
                        </select>
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                        Observações
                    </label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => handleChange("notes", e.target.value)}
                        placeholder="Informações adicionais, requisitos específicos, quantidades adicionais de itens não listados, etc."
                        rows={4}
                        className="quote-input resize-y"
                    />
                </div>
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 text-base px-8 py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Enviando...
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            Enviar Cotação
                        </>
                    )}
                </button>
                <p className="text-xs text-[var(--color-text-dim)] text-center sm:text-left">
                    Ao enviar, você concorda com nossa{" "}
                    <a href="/privacidade" className="text-[var(--color-primary)] hover:underline">
                        Política de Privacidade
                    </a>
                </p>
            </div>
        </form>
    );
}
