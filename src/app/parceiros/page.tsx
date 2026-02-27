import type { Metadata } from "next";
import Link from "next/link";
import { InstitutionalShell } from "@/components/institutional/InstitutionalShell";

export const metadata: Metadata = {
    title: "Programa de Parceiros | Precision Tecnologia",
    description:
        "Programa de parceiros Precision Tecnologia para integradores, revendas e consultorias com beneficios comerciais e suporte tecnico.",
};

const tiers = [
    {
        name: "Partner Start",
        profile: "Integradores e revendas em fase de escala",
        benefits: [
            "Condicao comercial dedicada por projeto",
            "Apoio tecnico-comercial na especificacao",
            "Canal prioritario para cotacao",
        ],
    },
    {
        name: "Partner Pro",
        profile: "Operacoes com recorrencia mensal de compra",
        benefits: [
            "Tabela diferenciada por categoria",
            "Acompanhamento de pipeline e forecast",
            "Suporte de pos-venda prioritario",
        ],
    },
    {
        name: "Partner Elite",
        profile: "Parceiros com alto volume e projetos estrategicos",
        benefits: [
            "Planejamento conjunto de demanda",
            "Condicoes comerciais expandidas",
            "Atendimento executivo dedicado",
        ],
    },
];

const requirements = [
    "Atuar com projetos de infraestrutura, rede, datacenter ou servicos relacionados.",
    "Possuir CNPJ ativo e regularidade cadastral.",
    "Compromisso com boas praticas comerciais e tecnicas no atendimento ao cliente final.",
];

const process = [
    "Cadastro inicial com dados da empresa e perfil de atuacao.",
    "Analise comercial do potencial e alinhamento de categoria.",
    "Reuniao de onboarding com definicao de estrategia de compra.",
    "Ativacao no programa e inicio do atendimento dedicado.",
];

export default function ParceirosPage() {
    return (
        <InstitutionalShell
            eyebrow="Growth B2B"
            title="Programa de Parceiros para acelerar vendas com margem, previsibilidade e suporte tecnico"
            description="Desenhado para integradores, revendas e consultorias de tecnologia que precisam de parceiro comercial confiavel para escala em infraestrutura de rede."
            highlights={[
                "Modelo por nivel de maturidade do parceiro",
                "Suporte tecnico-comercial em pre-venda",
                "Condicoes negociadas por volume e recorrencia",
            ]}
            actions={[
                { label: "Quero ser parceiro", href: "/cotacao" },
                { label: "Ver Catalogo", href: "/produtos", variant: "secondary" },
            ]}
        >
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {tiers.map((tier) => (
                    <article
                        key={tier.name}
                        className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm"
                    >
                        <h2 className="text-lg font-semibold text-[var(--color-text)]">{tier.name}</h2>
                        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{tier.profile}</p>
                        <ul className="mt-4 space-y-2 text-sm text-[var(--color-text-muted)]">
                            {tier.benefits.map((item) => (
                                <li key={item} className="flex items-start gap-2">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </article>
                ))}
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <article className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
                    <h3 className="text-lg font-semibold text-[var(--color-text)]">Requisitos de entrada</h3>
                    <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-muted)]">
                        {requirements.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </article>

                <article className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
                    <h3 className="text-lg font-semibold text-[var(--color-text)]">Como funciona a adesao</h3>
                    <ol className="mt-3 space-y-2 text-sm text-[var(--color-text-muted)]">
                        {process.map((item, index) => (
                            <li key={item} className="flex items-start gap-2">
                                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-xs font-semibold text-[var(--color-primary)]">
                                    {index + 1}
                                </span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ol>
                </article>
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary)]/5 p-6 md:p-8">
                <h3 className="text-xl font-bold text-[var(--color-text)]">Vamos estruturar seu plano comercial?</h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--color-text-muted)]">
                    Envie seu contexto de atuacao, mix de produtos e estimativa de volume. O time Precision retorna com proposta de parceria aderente ao seu momento de crescimento.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                        href="/cotacao"
                        className="inline-flex rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
                    >
                        Iniciar aplicacao
                    </Link>
                    <a
                        href="mailto:contato@precisiontecnologia.com.br"
                        className="inline-flex rounded-xl border border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    >
                        contato@precisiontecnologia.com.br
                    </a>
                </div>
            </section>
        </InstitutionalShell>
    );
}
