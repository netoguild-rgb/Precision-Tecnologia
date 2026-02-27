import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Clock3, ShieldCheck, Truck, Wrench } from "lucide-react";
import { InstitutionalShell } from "@/components/institutional/InstitutionalShell";

export const metadata: Metadata = {
    title: "Sobre Nos | Precision Tecnologia",
    description:
        "Conheca a Precision Tecnologia: especialista em infraestrutura de rede B2B, pronta entrega, atendimento consultivo e garantia oficial.",
};

const pillars = [
    {
        icon: BriefcaseBusiness,
        title: "Foco B2B de ponta a ponta",
        description:
            "Atendemos integradores, empresas e projetos com processos comerciais orientados a prazo, disponibilidade e previsibilidade.",
    },
    {
        icon: Wrench,
        title: "Consultoria tecnica aplicada",
        description:
            "Nao vendemos apenas SKU. Validamos cenario, compatibilidade e crescimento para reduzir erro de compra e retrabalho.",
    },
    {
        icon: Truck,
        title: "Operacao logistica nacional",
        description:
            "Envio para todo o Brasil com rastreamento. Prioridade em itens de alta demanda para acelerar a implantacao do cliente.",
    },
    {
        icon: ShieldCheck,
        title: "Garantia e procedencia",
        description:
            "Portifolio com marcas reconhecidas e regras claras de garantia, troca e pos-venda para proteger seu investimento.",
    },
];

const operatingModel = [
    {
        step: "1. Diagnostico tecnico-comercial",
        description:
            "Mapeamos necessidade, ambiente, prazo de projeto e nivel de criticidade para orientar a compra correta.",
    },
    {
        step: "2. Curadoria de solucao",
        description:
            "Montamos proposta objetiva com itens principais e complementares, evitando gargalos de implantacao.",
    },
    {
        step: "3. Proposta e negociacao",
        description:
            "Consolidamos condicao comercial, prazo logistico e forma de pagamento adequada ao perfil da operacao.",
    },
    {
        step: "4. Entrega e suporte",
        description:
            "Acompanhamos o pedido ate a entrega, com rastreamento e apoio em pos-venda quando necessario.",
    },
];

export default function SobrePage() {
    return (
        <InstitutionalShell
            eyebrow="Institucional"
            title="Infraestrutura de rede com visao de negocio, execucao tecnica e compromisso com resultado"
            description="A Precision Tecnologia foi estruturada para resolver o maior desafio da compra B2B: unir especificacao tecnica correta, disponibilidade real e velocidade de entrega sem abrir mao de governanca comercial."
            highlights={[
                "Resposta comercial em ate 24h uteis",
                "Atendimento consultivo para ambiente corporativo",
                "Entrega nacional com rastreio de pedido",
            ]}
            actions={[
                { label: "Solicitar Cotacao B2B", href: "/cotacao" },
                { label: "Ver Catalogo", href: "/produtos", variant: "secondary" },
            ]}
        >
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {pillars.map((pillar) => (
                    <article
                        key={pillar.title}
                        className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm"
                    >
                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                            <pillar.icon size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-[var(--color-text)]">{pillar.title}</h2>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                            {pillar.description}
                        </p>
                    </article>
                ))}
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
                <h2 className="text-2xl font-bold text-[var(--color-text)]">Como operamos na pratica</h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--color-text-muted)]">
                    Nosso metodo combina inteligencia comercial com criterio tecnico. O objetivo e simples: entregar o produto certo, no tempo certo, com risco minimo para o seu projeto.
                </p>
                <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                    {operatingModel.map((item) => (
                        <div
                            key={item.step}
                            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4"
                        >
                            <h3 className="text-sm font-semibold text-[var(--color-text)]">{item.step}</h3>
                            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{item.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary)]/5 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-[var(--color-text)]">Pronto para acelerar seu projeto?</h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--color-text-muted)]">
                    Conte com um time comercial-tecnico para definir especificacao, disponibilidade e condicao de pagamento com transparencia.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                        href="/cotacao"
                        className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
                    >
                        Iniciar cotacao
                        <ArrowRight size={16} />
                    </Link>
                    <Link
                        href="/rastreamento"
                        className="inline-flex items-center rounded-xl border border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    >
                        Rastrear pedido
                    </Link>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-xs text-[var(--color-text-dim)]">
                    <Clock3 size={14} />
                    Atendimento comercial de segunda a sexta, 8h as 18h.
                </div>
            </section>
        </InstitutionalShell>
    );
}

