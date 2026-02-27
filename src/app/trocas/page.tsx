import type { Metadata } from "next";
import Link from "next/link";
import { InstitutionalShell } from "@/components/institutional/InstitutionalShell";

export const metadata: Metadata = {
    title: "Trocas e Devolucoes | Precision Tecnologia",
    description:
        "Politica de trocas e devolucoes da Precision Tecnologia com prazos, condicoes de elegibilidade e fluxo de atendimento.",
};

const timeline = [
    {
        step: "1. Solicitar atendimento",
        description:
            "Envie numero do pedido, motivo da solicitacao e evidencias (foto/video quando aplicavel) para acelerar a analise.",
    },
    {
        step: "2. Triagem tecnica e comercial",
        description:
            "Nosso time valida elegibilidade conforme tipo de solicitacao: avaria, divergencia, defeito, arrependimento ou garantia.",
    },
    {
        step: "3. Logistica reversa",
        description:
            "Quando aprovado, informamos instrucoes de coleta/postagem e checklist de embalagem para preservar o item.",
    },
    {
        step: "4. Conclusao",
        description:
            "Apos recebimento e inspecao, concluimos com troca, credito, reenvio ou estorno conforme o caso.",
    },
];

const conditions = [
    "Produto sem sinais de mau uso, dano acidental ou violacao de lacre tecnico.",
    "Item devolvido com embalagem, acessorios e documentos fiscais.",
    "Solicitacao dentro dos prazos aplicaveis ao tipo de ocorrencia.",
    "Itens sob encomenda, personalizados ou de projeto podem ter regras especificas.",
];

const freightRules = [
    {
        scenario: "Erro operacional ou item divergente",
        cost: "Precision assume custo de retorno e reenvio",
    },
    {
        scenario: "Defeito coberto por garantia",
        cost: "Fluxo conforme politica do fabricante e analise tecnica",
    },
    {
        scenario: "Arrependimento em compra elegivel",
        cost: "Aplicavel conforme legislacao e condicoes do pedido",
    },
    {
        scenario: "Troca por conveniencia comercial",
        cost: "Definido caso a caso no atendimento",
    },
];

export default function TrocasPage() {
    return (
        <InstitutionalShell
            eyebrow="Pos-venda"
            title="Trocas e devolucoes com processo claro, rastreavel e orientado a resolver rapido"
            description="Nosso objetivo no pos-venda e reduzir impacto operacional do cliente. Por isso, seguimos um fluxo padronizado, com comunicacao objetiva e criterio tecnico."
            highlights={[
                "Fluxo em 4 etapas com triagem tecnica",
                "Atendimento com base em numero de pedido",
                "Tratamento transparente por tipo de ocorrencia",
            ]}
            actions={[
                { label: "Rastrear Pedido", href: "/rastreamento" },
                { label: "Ver Garantia", href: "/garantia", variant: "secondary" },
            ]}
            updatedAt="27/02/2026"
        >
            <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
                <h2 className="text-2xl font-bold text-[var(--color-text)]">Fluxo de atendimento</h2>
                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                    {timeline.map((item) => (
                        <article
                            key={item.step}
                            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4"
                        >
                            <h3 className="text-sm font-semibold text-[var(--color-text)]">{item.step}</h3>
                            <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
                                {item.description}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <article className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
                    <h3 className="text-lg font-semibold text-[var(--color-text)]">Condicoes gerais</h3>
                    <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-muted)]">
                        {conditions.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </article>

                <article className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
                    <h3 className="text-lg font-semibold text-[var(--color-text)]">Custos de frete de retorno</h3>
                    <div className="mt-3 space-y-2">
                        {freightRules.map((item) => (
                            <div
                                key={item.scenario}
                                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3"
                            >
                                <p className="text-sm font-medium text-[var(--color-text)]">{item.scenario}</p>
                                <p className="mt-1 text-sm text-[var(--color-text-muted)]">{item.cost}</p>
                            </div>
                        ))}
                    </div>
                </article>
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary)]/5 p-6 md:p-8">
                <h3 className="text-xl font-bold text-[var(--color-text)]">Canal oficial para abertura</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                    Para iniciar qualquer solicitacao de troca ou devolucao, envie o numero do pedido e o email da compra para nosso atendimento.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                    <a
                        href="mailto:contato@precisiontecnologia.com.br"
                        className="inline-flex rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
                    >
                        contato@precisiontecnologia.com.br
                    </a>
                    <Link
                        href="/rastreamento"
                        className="inline-flex rounded-xl border border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    >
                        Consultar status do pedido
                    </Link>
                </div>
            </section>
        </InstitutionalShell>
    );
}
