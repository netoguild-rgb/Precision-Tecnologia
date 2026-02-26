import type { Metadata } from "next";
import {
    FileText,
    BadgePercent,
    Receipt,
    Headphones,
    Truck,
    ChevronDown,
    MessageSquareQuote,
} from "lucide-react";
import { QuoteForm } from "@/components/b2b/QuoteForm";

export const metadata: Metadata = {
    title: "Cotação B2B | Precision Tecnologia",
    description:
        "Solicite uma cotação personalizada para compras em volume. Descontos exclusivos, boleto faturado 30/60/90 dias, suporte técnico dedicado.",
    openGraph: {
        title: "Cotação B2B | Precision Tecnologia",
        description:
            "Orçamento em lote para empresas. Switches, roteadores, APs, GBICs e mais com preços especiais para projetos.",
        type: "website",
        locale: "pt_BR",
    },
};

const advantages = [
    {
        icon: BadgePercent,
        title: "Descontos por Volume",
        description: "Preços exclusivos para compras acima de 10 unidades. Quanto maior o volume, maior o desconto.",
        color: "var(--color-primary)",
        bg: "rgba(27, 75, 138, 0.08)",
    },
    {
        icon: Receipt,
        title: "Boleto Faturado",
        description: "Condições especiais 30/60/90 dias para empresas com CNPJ ativo.",
        color: "var(--color-success)",
        bg: "rgba(5, 150, 105, 0.08)",
    },
    {
        icon: Headphones,
        title: "Suporte Dedicado",
        description: "Gerente de conta exclusivo para acompanhar seus pedidos e projetos.",
        color: "var(--color-accent)",
        bg: "rgba(14, 165, 233, 0.08)",
    },
    {
        icon: Truck,
        title: "Logística Nacional",
        description: "Entrega em todo o Brasil com rastreamento. Opção de retirada em São Paulo.",
        color: "var(--color-warning)",
        bg: "rgba(217, 119, 6, 0.08)",
    },
];

const faqs = [
    {
        question: "Qual o prazo de resposta da cotação?",
        answer: "Nossa equipe comercial retorna em até 24 horas úteis com preços personalizados e condições de pagamento.",
    },
    {
        question: "Qual a quantidade mínima para cotação B2B?",
        answer: "Não há quantidade mínima obrigatória, mas descontos progressivos aplicam a partir de 10 unidades do mesmo produto.",
    },
    {
        question: "Aceitam boleto faturado?",
        answer: "Sim! Oferecemos boleto faturado em 30, 60 e 90 dias para empresas com CNPJ ativo e análise de crédito aprovada.",
    },
    {
        question: "Posso solicitar produtos que não estão no catálogo?",
        answer: "Sim, descreva os produtos desejados no campo de observações e nossa equipe verificará disponibilidade e prazos.",
    },
    {
        question: "Como funciona a garantia em pedidos B2B?",
        answer: "Todos os produtos possuem garantia padrão do fabricante (12 meses). Para projetos maiores, oferecemos contratos de suporte estendido.",
    },
];

export default function CotacaoPage() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-accent)] text-white overflow-hidden">
                <div className="absolute inset-0">
                    <video
                        className="quote-hero-video"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        aria-hidden="true"
                    >
                        <source src="/videos/geracao-video-concluida.mp4" type="video/mp4" />
                    </video>
                </div>
                <div className="absolute inset-0 quote-hero-overlay" />
                <div className="absolute inset-0 quote-hero-lights" />
                <div className="absolute inset-0 grid-pattern opacity-[0.07]" />

                <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-3xl quote-hero-content">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
                            <MessageSquareQuote size={14} />
                            Cotação para Empresas
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
                            Solicitar Cotação
                            <span className="block text-white/80">B2B</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl">
                            Preços exclusivos para projetos de infraestrutura de rede. Preencha o formulário e receba uma proposta personalizada em até <strong className="text-white">24 horas úteis</strong>.
                        </p>
                    </div>
                </div>
            </section>

            {/* B2B Advantages */}
            <section className="relative -mt-8 z-10 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {advantages.map((adv) => (
                        <div
                            key={adv.title}
                            className="bg-white border border-[var(--color-border)] rounded-xl p-5 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                        >
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                                style={{ background: adv.bg }}
                            >
                                <adv.icon size={20} style={{ color: adv.color }} />
                            </div>
                            <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">
                                {adv.title}
                            </h3>
                            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                                {adv.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Form Section */}
            <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">
                <div className="bg-white border border-[var(--color-border)] rounded-2xl shadow-lg p-6 md:p-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                            <FileText size={20} className="text-[var(--color-primary)]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[var(--color-text)]">
                                Formulário de Cotação
                            </h2>
                            <p className="text-sm text-[var(--color-text-muted)]">
                                Campos com * são obrigatórios
                            </p>
                        </div>
                    </div>

                    <QuoteForm />
                </div>
            </section>

            {/* FAQ */}
            <section className="max-w-4xl mx-auto px-4 pb-16">
                <h2 className="text-2xl font-bold text-[var(--color-text)] mb-8 text-center">
                    Perguntas Frequentes
                </h2>
                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <details
                            key={i}
                            className="group bg-white border border-[var(--color-border)] rounded-xl overflow-hidden"
                        >
                            <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-elevated)] transition-colors">
                                {faq.question}
                                <ChevronDown
                                    size={16}
                                    className="text-[var(--color-text-dim)] transition-transform group-open:rotate-180 shrink-0"
                                />
                            </summary>
                            <div className="px-5 pb-4 text-sm text-[var(--color-text-muted)] leading-relaxed">
                                {faq.answer}
                            </div>
                        </details>
                    ))}
                </div>
            </section>
        </div>
    );
}
