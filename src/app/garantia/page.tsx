import type { Metadata } from "next";
import Link from "next/link";
import { InstitutionalShell } from "@/components/institutional/InstitutionalShell";

export const metadata: Metadata = {
    title: "Garantia | Precision Tecnologia",
    description:
        "Politica de garantia da Precision Tecnologia com cobertura, exclusoes, prazos de acionamento e fluxo tecnico de atendimento.",
};

const coverage = [
    "Garantia legal conforme legislacao aplicavel.",
    "Garantia contratual do fabricante conforme especificacao de cada item.",
    "Suporte de triagem para acelerar diagnostico tecnico e encaminhamento.",
];

const exclusions = [
    "Dano fisico por impacto, queda, liquido, sobrecarga eletrica ou mau uso.",
    "Violacao de lacre, modificacao nao autorizada ou reparo por terceiros nao homologados.",
    "Desgaste natural de componentes consumiveis.",
];

const rmaFlow = [
    {
        step: "Abertura",
        detail: "Envio de numero do pedido, serial (quando houver) e descricao objetiva da falha.",
    },
    {
        step: "Triagem",
        detail: "Analise inicial para separar problema de configuracao, instalacao ou defeito de hardware.",
    },
    {
        step: "Encaminhamento",
        detail: "Direcionamento para troca, reparo ou processo junto ao fabricante conforme cobertura.",
    },
    {
        step: "Conclusao",
        detail: "Retorno ao cliente com status, prazo e orientacoes finais de uso.",
    },
];

export default function GarantiaPage() {
    return (
        <InstitutionalShell
            eyebrow="Confianca e Pos-venda"
            title="Garantia pensada para proteger a operacao do cliente e reduzir tempo de indisponibilidade"
            description="Trabalhamos com regras de cobertura transparentes, triagem tecnica rapida e alinhamento com processos de fabricante para dar previsibilidade no pos-venda."
            highlights={[
                "Cobertura alinhada a legislacao e fabricante",
                "Processo de RMA com triagem tecnica",
                "Comunicacao de status ao longo do atendimento",
            ]}
            actions={[
                { label: "Abrir solicitacao", href: "mailto:contato@precisiontecnologia.com.br" },
                { label: "Ver Trocas e Devolucoes", href: "/trocas", variant: "secondary" },
            ]}
            updatedAt="27/02/2026"
        >
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <article className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
                    <h2 className="text-lg font-semibold text-[var(--color-text)]">O que a garantia cobre</h2>
                    <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-muted)]">
                        {coverage.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </article>

                <article className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
                    <h2 className="text-lg font-semibold text-[var(--color-text)]">Situacoes nao cobertas</h2>
                    <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-muted)]">
                        {exclusions.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-warning)]" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </article>
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
                <h2 className="text-2xl font-bold text-[var(--color-text)]">Fluxo de acionamento (RMA)</h2>
                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                    {rmaFlow.map((item) => (
                        <article
                            key={item.step}
                            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4"
                        >
                            <h3 className="text-sm font-semibold text-[var(--color-text)]">{item.step}</h3>
                            <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
                                {item.detail}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary)]/5 p-6 md:p-8">
                <h3 className="text-xl font-bold text-[var(--color-text)]">Boas praticas para agilizar atendimento</h3>
                <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-muted)]">
                    <li className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                        <span>Descreva o cenario tecnico com objetividade (sintoma, ambiente e quando ocorreu).</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                        <span>Informe numero do pedido, SKU e serie quando aplicavel.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                        <span>Envie evidencias de falha (fotos, logs ou video curto).</span>
                    </li>
                </ul>
                <div className="mt-4 flex flex-wrap gap-3">
                    <a
                        href="mailto:contato@precisiontecnologia.com.br"
                        className="inline-flex rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
                    >
                        Enviar solicitacao
                    </a>
                    <Link
                        href="/rastreamento"
                        className="inline-flex rounded-xl border border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    >
                        Acompanhar pedido
                    </Link>
                </div>
            </section>
        </InstitutionalShell>
    );
}

