import type { Metadata } from "next";
import Link from "next/link";
import { InstitutionalShell } from "@/components/institutional/InstitutionalShell";

export const metadata: Metadata = {
    title: "Politica de Privacidade | Precision Tecnologia",
    description:
        "Entenda como a Precision Tecnologia coleta, usa, compartilha e protege seus dados pessoais em conformidade com a LGPD.",
};

const summary = [
    {
        title: "Quais dados coletamos",
        points: [
            "Dados cadastrais: nome, email, telefone, empresa e CNPJ quando informado.",
            "Dados de navegacao: paginas visitadas, interacoes e preferencias.",
            "Dados de pedido: itens, endereco, historico de compra e rastreamento.",
        ],
    },
    {
        title: "Como usamos os dados",
        points: [
            "Processar pedidos, pagamentos, suporte e comunicacoes transacionais.",
            "Responder cotacoes e montar propostas comerciais para seu perfil.",
            "Melhorar experiencia, desempenho e seguranca da plataforma.",
        ],
    },
    {
        title: "Seus direitos",
        points: [
            "Confirmar tratamento, acessar, corrigir e atualizar seus dados.",
            "Solicitar anonimizacao, bloqueio ou exclusao quando aplicavel.",
            "Revogar consentimento e pedir portabilidade nos termos da LGPD.",
        ],
    },
];

const legalBases = [
    "Execucao de contrato e diligencias pre-contratuais para venda e entrega.",
    "Cumprimento de obrigacao legal e regulatoria.",
    "Legitimo interesse para seguranca, prevencao a fraude e melhoria de servico.",
    "Consentimento quando necessario para comunicacoes especificas.",
];

const retentionRules = [
    "Dados de pedidos e faturamento sao mantidos pelo prazo exigido por lei fiscal e contabil.",
    "Dados de navegacao podem ser armazenados por periodo limitado para analise de performance e seguranca.",
    "Dados usados em marketing podem ser removidos a pedido do titular ou apos inatividade prolongada.",
];

export default function PrivacidadePage() {
    return (
        <InstitutionalShell
            eyebrow="Privacidade e Dados"
            title="Politica de Privacidade orientada por transparencia, seguranca e controle do titular"
            description="Tratamos dados pessoais com responsabilidade operacional e juridica. Esta politica explica, de forma objetiva, como coletamos, usamos e protegemos suas informacoes."
            highlights={[
                "Conformidade com principios da LGPD",
                "Canal direto para solicitacoes de titulares",
                "Controles de seguranca para operacao de ecommerce",
            ]}
            actions={[
                { label: "Falar com o time", href: "/cotacao", variant: "secondary" },
                { label: "Ver Termos de Uso", href: "/termos" },
            ]}
            updatedAt="27/02/2026"
        >
            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {summary.map((item) => (
                    <article
                        key={item.title}
                        className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm"
                    >
                        <h2 className="text-lg font-semibold text-[var(--color-text)]">{item.title}</h2>
                        <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-muted)]">
                            {item.points.map((point) => (
                                <li key={point} className="flex items-start gap-2">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </article>
                ))}
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8">
                <h2 className="text-2xl font-bold text-[var(--color-text)]">Bases legais e finalidade do tratamento</h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                    O tratamento de dados e realizado com base nas hipoteses legais previstas pela LGPD, sempre limitado ao necessario para operacao, seguranca e atendimento comercial.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-[var(--color-text-muted)]">
                    {legalBases.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <article className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
                    <h3 className="text-lg font-semibold text-[var(--color-text)]">Retencao e descarte</h3>
                    <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-muted)]">
                        {retentionRules.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </article>

                <article className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
                    <h3 className="text-lg font-semibold text-[var(--color-text)]">Cookies e tecnologias similares</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                        Utilizamos cookies para autenticar sessao, lembrar preferencias, medir desempenho e proteger a plataforma contra abusos. Voce pode ajustar preferencias de navegador e, quando aplicavel, recusar cookies nao essenciais.
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                        O bloqueio de cookies pode impactar funcionalidades como login, carrinho e recomendacoes personalizadas.
                    </p>
                </article>
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary)]/5 p-6 md:p-8">
                <h3 className="text-xl font-bold text-[var(--color-text)]">Solicitacoes do titular</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                    Para exercer seus direitos de titular, envie solicitacao para{" "}
                    <a className="font-semibold text-[var(--color-primary)]" href="mailto:contato@precisiontecnologia.com.br">
                        contato@precisiontecnologia.com.br
                    </a>{" "}
                    com o assunto Privacidade de Dados. Podemos solicitar confirmacao de identidade para proteger suas informacoes.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                        href="/termos"
                        className="inline-flex rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
                    >
                        Ler Termos de Uso
                    </Link>
                    <Link
                        href="/trocas"
                        className="inline-flex rounded-xl border border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    >
                        Ver Trocas e Devolucoes
                    </Link>
                </div>
            </section>
        </InstitutionalShell>
    );
}
