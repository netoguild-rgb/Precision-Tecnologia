import type { Metadata } from "next";
import Link from "next/link";
import { InstitutionalShell } from "@/components/institutional/InstitutionalShell";

export const metadata: Metadata = {
    title: "Termos de Uso | Precision Tecnologia",
    description:
        "Regras de uso da plataforma Precision Tecnologia, condicoes comerciais, responsabilidades e diretrizes para compras no ecommerce.",
};

const sections = [
    {
        title: "1. Escopo da plataforma",
        content:
            "A Precision Tecnologia disponibiliza um ecommerce para consulta tecnica, cotacao e compra de produtos de infraestrutura de rede. O uso da plataforma pressupoe leitura e concordancia com estes termos.",
    },
    {
        title: "2. Cadastro e veracidade das informacoes",
        content:
            "O usuario se compromete a fornecer dados corretos e atualizados. O uso indevido de identidade de terceiros, dados falsos ou tentativa de fraude pode resultar em bloqueio da conta e cancelamento da compra.",
    },
    {
        title: "3. Precos, disponibilidade e propostas",
        content:
            "Precos e estoque podem ser atualizados sem aviso previo. Condicoes exibidas no site valem ate o momento da confirmacao do pedido. Propostas B2B e negociacoes especiais possuem validade definida em documento comercial.",
    },
    {
        title: "4. Pagamentos e aprovacao",
        content:
            "A liberacao de pedido depende da confirmacao de pagamento pela instituicao financeira ou gateway utilizado. Pedidos com indicio de risco podem passar por validacao adicional para seguranca operacional.",
    },
    {
        title: "5. Entrega, rastreio e recebimento",
        content:
            "Prazos de entrega sao informados no fluxo de compra e podem variar por regiao, disponibilidade e modalidade de frete. O cliente deve conferir o pedido no ato do recebimento e reportar divergencias imediatamente.",
    },
    {
        title: "6. Propriedade intelectual",
        content:
            "Textos, imagens, marcas, layout e conteudos tecnicos do site sao protegidos por direitos de propriedade intelectual. E vedada reproducao sem autorizacao previa e expressa.",
    },
    {
        title: "7. Limitacoes de responsabilidade",
        content:
            "A Precision atua para manter o ambiente estavel e seguro, mas nao garante indisponibilidade zero de servicos de terceiros. Em qualquer hipotese, a responsabilidade respeita os limites legais e contratuais aplicaveis.",
    },
    {
        title: "8. Alteracoes dos termos",
        content:
            "Estes termos podem ser atualizados para refletir melhorias operacionais, exigencias legais e evolucoes de servico. A versao vigente ficara sempre disponivel nesta pagina.",
    },
];

export default function TermosPage() {
    return (
        <InstitutionalShell
            eyebrow="Termos e Condicoes"
            title="Termos de Uso com regras claras para proteger operacao, cliente e relacao comercial"
            description="Nossa abordagem e objetiva: transparencia nas condicoes comerciais, seguranca no uso da plataforma e previsibilidade no ciclo de compra."
            highlights={[
                "Regras claras para compras B2B e B2C",
                "Condicoes comerciais com transparencia",
                "Atualizacoes periodicas de governanca",
            ]}
            actions={[
                { label: "Ver Politica de Privacidade", href: "/privacidade", variant: "secondary" },
                { label: "Solicitar Cotacao", href: "/cotacao" },
            ]}
            updatedAt="27/02/2026"
        >
            <section className="space-y-4">
                {sections.map((section) => (
                    <article
                        key={section.title}
                        className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm"
                    >
                        <h2 className="text-lg font-semibold text-[var(--color-text)]">{section.title}</h2>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                            {section.content}
                        </p>
                    </article>
                ))}
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary)]/5 p-6 md:p-8">
                <h3 className="text-xl font-bold text-[var(--color-text)]">Suporte e esclarecimentos</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                    Em caso de duvidas sobre interpretacao destes termos, entre em contato com nosso time comercial ou de atendimento antes de concluir seu pedido.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                        href="/rastreamento"
                        className="inline-flex rounded-xl border border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    >
                        Rastrear Pedido
                    </Link>
                    <a
                        href="mailto:contato@precisiontecnologia.com.br"
                        className="inline-flex rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
                    >
                        contato@precisiontecnologia.com.br
                    </a>
                </div>
            </section>
        </InstitutionalShell>
    );
}
