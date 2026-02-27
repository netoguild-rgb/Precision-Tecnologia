"use client";

import Link from "next/link";
import {
    ArrowRight,
    Server,
    Database,
    Shield,
    Cpu,
    Network,
    CloudCog,
    Settings,
    Headphones,
    BarChart3,
    CheckCircle2,
    Zap,
    Clock,
    Users,
    Award,
    ChevronRight,
    MonitorCog,
    HardDrive,
    Lock,
    Workflow,
    Star,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/* ═══════════════════════════════════════
   DATA — Services, Process, Stats, FAQ
   ═══════════════════════════════════════ */

const services = [
    {
        icon: Server,
        title: "Data Center",
        subtitle: "Implementação & Gestão",
        description:
            "Projeto, implementação e gerenciamento de data centers de alta disponibilidade. Infraestrutura robusta com redundância N+1, monitoramento 24/7 e SLA garantido.",
        features: [
            "Desenho de infraestrutura física e lógica",
            "Instalação de racks, cabeamento e energia",
            "Refrigeração e controle ambiental",
            "Monitoramento e operação 24/7",
            "Plano de disaster recovery",
        ],
        gradient: "from-blue-600 to-cyan-500",
        color: "var(--color-primary)",
        bg: "rgba(27, 75, 138, 0.08)",
    },
    {
        icon: HardDrive,
        title: "Servidores",
        subtitle: "Configuração & Otimização",
        description:
            "Configuração, virtualização e manutenção de servidores físicos e em nuvem. Máximo desempenho com segurança e escalabilidade para sua operação.",
        features: [
            "Servidores físicos e virtualizados (VMware, Hyper-V)",
            "Migração e consolidação de ambientes",
            "Backup e recuperação de dados",
            "Monitoramento proativo de performance",
            "Atualizações e patching de segurança",
        ],
        gradient: "from-violet-600 to-purple-500",
        color: "var(--color-accent)",
        bg: "rgba(14, 165, 233, 0.08)",
    },
    {
        icon: BarChart3,
        title: "Consultoria",
        subtitle: "Estratégia & Planejamento",
        description:
            "Consultoria especializada em infraestrutura de TI. Análise, planejamento e definição de arquitetura para projetos de qualquer escala.",
        features: [
            "Assessment de infraestrutura existente",
            "Planejamento de capacidade e crescimento",
            "Desenho de arquitetura de rede",
            "Análise de TCO e ROI",
            "Recomendação de tecnologias e fornecedores",
        ],
        gradient: "from-emerald-600 to-teal-500",
        color: "var(--color-success)",
        bg: "rgba(5, 150, 105, 0.08)",
    },
];

const additionalServices = [
    {
        icon: Network,
        title: "Redes Corporativas",
        desc: "Projeto e implantação de redes LAN, WAN e SD-WAN com alta performance e segurança.",
    },
    {
        icon: Lock,
        title: "Segurança de Rede",
        desc: "Firewalls next-gen, VPN, segmentação de rede e políticas de acesso Zero Trust.",
    },
    {
        icon: CloudCog,
        title: "Cloud & Hybrid",
        desc: "Migração para nuvem, ambientes híbridos e multi-cloud com integração on-premise.",
    },
    {
        icon: Workflow,
        title: "Automação de TI",
        desc: "Scripts, orquestração e automação de processos para reduzir custos operacionais.",
    },
    {
        icon: MonitorCog,
        title: "NOC & Monitoramento",
        desc: "Centro de operações de rede com monitoramento proativo e resposta a incidentes.",
    },
    {
        icon: Shield,
        title: "Compliance & Auditoria",
        desc: "Adequação a normas LGPD, ISO 27001, PCI-DSS e auditorias de segurança.",
    },
];

const processSteps = [
    {
        step: "01",
        title: "Diagnóstico",
        desc: "Análise detalhada do ambiente atual, necessidades e objetivos do negócio.",
        icon: BarChart3,
    },
    {
        step: "02",
        title: "Planejamento",
        desc: "Elaboração do projeto técnico com cronograma, custos e especificações.",
        icon: Settings,
    },
    {
        step: "03",
        title: "Implementação",
        desc: "Execução do projeto com equipe certificada e acompanhamento em tempo real.",
        icon: Cpu,
    },
    {
        step: "04",
        title: "Suporte Contínuo",
        desc: "Monitoramento, manutenção preventiva e suporte técnico especializado.",
        icon: Headphones,
    },
];

const stats = [
    { value: "150+", label: "Projetos Entregues" },
    { value: "99.9%", label: "Uptime Garantido" },
    { value: "24/7", label: "Suporte Disponível" },
    { value: "50+", label: "Clientes Ativos" },
];

const testimonials = [
    {
        name: "Fernando Silva",
        role: "Diretor de TI",
        company: "TechCorp Brasil",
        text: "A equipe da Precision entregou nosso data center em tempo recorde. A qualidade da implementação e o suporte pós-projeto são excepcionais.",
        rating: 5,
    },
    {
        name: "Mariana Costa",
        role: "CTO",
        company: "ISP NetBrasil",
        text: "A consultoria nos ajudou a reduzir custos em 40% com a consolidação de servidores. Profissionais extremamente competentes.",
        rating: 5,
    },
    {
        name: "Paulo Henrique",
        role: "Gerente de Infra",
        company: "Banco Digital Plus",
        text: "Monitoramento 24/7 e resposta rápida a incidentes. Desde que contratamos, tivemos zero downtime não planejado.",
        rating: 5,
    },
];

/* ═══════════════════════════════
   COMPONENT
   ═══════════════════════════════ */

export default function ServicosPage() {
    const scrollRef = useScrollReveal();

    return (
        <div ref={scrollRef} className="min-h-screen bg-[var(--color-bg)]">
            {/* ════════════════════════════
          HERO
          ════════════════════════════ */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#112240] to-[#0a1628] text-white">
                {/* Animated grid */}
                <div className="absolute inset-0 grid-pattern opacity-[0.06]" />
                <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#1B4B8A]/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#0EA5E9]/10 rounded-full blur-[100px]" />

                <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
                            <Database size={14} />
                            Serviços Profissionais
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.08] mb-6 tracking-tight">
                            Serviços de{" "}
                            <span className="bg-gradient-to-r from-[#5B9EC9] to-[#0EA5E9] bg-clip-text text-transparent">
                                infraestrutura de TI
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/65 leading-relaxed max-w-2xl mb-10">
                            Data centers, servidores e consultoria especializada. Soluções
                            completas para empresas que exigem{" "}
                            <strong className="text-white/90">
                                alta disponibilidade e performance
                            </strong>
                            .
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/cotacao"
                                className="hero-btn-primary flex items-center gap-2.5 text-base group"
                            >
                                Solicitar Proposta
                                <ArrowRight
                                    size={18}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Link>
                            <a
                                href="#servicos"
                                className="hero-btn-outline flex items-center gap-2.5 text-base"
                            >
                                Conheça Nossos Serviços
                            </a>
                        </div>

                        {/* Stats bar */}
                        <div className="flex flex-wrap gap-8 mt-14 pt-8 border-t border-white/10">
                            {stats.map((s) => (
                                <div key={s.label}>
                                    <p className="text-3xl font-extrabold bg-gradient-to-r from-[#5B9EC9] to-[#A3D4F7] bg-clip-text text-transparent">
                                        {s.value}
                                    </p>
                                    <p className="text-sm text-white/50 mt-1">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
            </section>

            {/* ════════════════════════════
          MAIN SERVICES — 3 cards
          ════════════════════════════ */}
            <section id="servicos" className="max-w-7xl mx-auto px-4 py-20">
                <div className="text-center mb-14 scroll-reveal">
                    <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-widest mb-2">
                        Soluções
                    </p>
                    <h2 className="text-3xl font-bold mb-3 text-[var(--color-text)]">
                        Nossos Serviços Principais
                    </h2>
                    <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
                        Equipe certificada e infraestrutura de ponta para atender projetos
                        de qualquer escala
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {services.map((svc, i) => (
                        <div
                            key={svc.title}
                            className={`scroll-reveal scroll-reveal-delay-${i + 1} group relative bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300`}
                        >
                            {/* Gradient top bar */}
                            <div
                                className={`h-1.5 bg-gradient-to-r ${svc.gradient}`}
                            />

                            <div className="p-7">
                                {/* Icon */}
                                <div
                                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${svc.gradient} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}
                                >
                                    <svc.icon size={26} className="text-white" />
                                </div>

                                {/* Text */}
                                <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-widest mb-1">
                                    {svc.subtitle}
                                </p>
                                <h3 className="text-xl font-bold text-[var(--color-text)] mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                                    {svc.title}
                                </h3>
                                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-5">
                                    {svc.description}
                                </p>

                                {/* Feature list */}
                                <ul className="space-y-2.5 mb-6">
                                    {svc.features.map((feat) => (
                                        <li
                                            key={feat}
                                            className="flex items-start gap-2.5 text-sm text-[var(--color-text)]"
                                        >
                                            <CheckCircle2
                                                size={16}
                                                className="text-[var(--color-success)] mt-0.5 shrink-0"
                                            />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                <Link
                                    href="/cotacao"
                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors group/link"
                                >
                                    Solicitar proposta
                                    <ChevronRight
                                        size={14}
                                        className="transition-transform group-hover/link:translate-x-1"
                                    />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ════════════════════════════
          ADDITIONAL SERVICES — 6 grid
          ════════════════════════════ */}
            <section className="bg-[var(--color-bg-elevated)] py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-14 scroll-reveal">
                        <p className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-widest mb-2">
                            Mais Soluções
                        </p>
                        <h2 className="text-3xl font-bold mb-3 text-[var(--color-text)]">
                            Serviços Complementares
                        </h2>
                        <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
                            Cobertura completa para todas as necessidades da sua
                            infraestrutura
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {additionalServices.map((svc, i) => (
                            <div
                                key={svc.title}
                                className={`scroll-reveal scroll-reveal-delay-${(i % 3) + 1} bg-white border border-[var(--color-border)] rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group`}
                            >
                                <div className="w-11 h-11 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)]/15 transition-colors">
                                    <svc.icon
                                        size={20}
                                        className="text-[var(--color-primary)]"
                                    />
                                </div>
                                <h3 className="text-base font-semibold text-[var(--color-text)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                                    {svc.title}
                                </h3>
                                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                                    {svc.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════
          PROCESS — How We Work
          ════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-4 py-20">
                <div className="text-center mb-14 scroll-reveal">
                    <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-widest mb-2">
                        Metodologia
                    </p>
                    <h2 className="text-3xl font-bold mb-3 text-[var(--color-text)]">
                        Como Trabalhamos
                    </h2>
                    <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
                        Um processo estruturado para garantir qualidade e previsibilidade em
                        cada projeto
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {processSteps.map((step, i) => (
                        <div
                            key={step.step}
                            className={`scroll-reveal scroll-reveal-delay-${i + 1} relative bg-white border border-[var(--color-border)] rounded-2xl p-6 hover:shadow-lg transition-all duration-300`}
                        >
                            {/* Step number */}
                            <div className="text-4xl font-black text-[var(--color-primary)]/10 absolute top-4 right-5 select-none">
                                {step.step}
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center mb-4">
                                <step.icon
                                    size={22}
                                    className="text-[var(--color-primary)]"
                                />
                            </div>

                            <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">
                                {step.title}
                            </h3>
                            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                                {step.desc}
                            </p>

                            {/* Connector line */}
                            {i < processSteps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 border-t-2 border-dashed border-[var(--color-border)]" />
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* ════════════════════════════
          WHY US — Differentials
          ════════════════════════════ */}
            <section className="relative overflow-hidden py-20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] to-[#112240]" />
                <div className="absolute inset-0 grid-pattern opacity-[0.05]" />
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#1B4B8A]/20 rounded-full blur-[100px]" />

                <div className="relative max-w-7xl mx-auto px-4">
                    <div className="text-center mb-14 scroll-reveal">
                        <p className="text-xs font-semibold text-[#0EA5E9] uppercase tracking-widest mb-2">
                            Diferenciais
                        </p>
                        <h2 className="text-3xl font-bold mb-3 text-white">
                            Por Que a Precision?
                        </h2>
                        <p className="text-white/60 max-w-2xl mx-auto">
                            Combinamos expertise técnica com equipamentos de ponta Huawei
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            {
                                icon: Award,
                                title: "Certificados",
                                desc: "Equipe com certificações Huawei, Cisco, VMware e Microsoft.",
                            },
                            {
                                icon: Clock,
                                title: "SLA Garantido",
                                desc: "Tempo de resposta contratual com penalidades em caso de descumprimento.",
                            },
                            {
                                icon: Users,
                                title: "Equipe Dedicada",
                                desc: "Gerente de projeto e engenheiros exclusivos para cada contrato.",
                            },
                            {
                                icon: Zap,
                                title: "Agilidade",
                                desc: "Metodologia ágil com entregas incrementais e visibilidade total.",
                            },
                        ].map((item, i) => (
                            <div
                                key={item.title}
                                className={`scroll-reveal scroll-reveal-delay-${i + 1} p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300`}
                            >
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                                    <item.icon size={22} className="text-[#0EA5E9]" />
                                </div>
                                <h3 className="text-base font-bold text-white mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-white/60 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════
          TESTIMONIALS
          ════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-4 py-20">
                <div className="text-center mb-14 scroll-reveal">
                    <p className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-widest mb-2">
                        Depoimentos
                    </p>
                    <h2 className="text-3xl font-bold mb-3 text-[var(--color-text)]">
                        O Que Nossos Clientes Dizem
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <div
                            key={t.name}
                            className={`scroll-reveal scroll-reveal-delay-${i + 1} testimonial-card`}
                        >
                            <div className="flex -space-x-0.5 mb-3">
                                {[...Array(t.rating)].map((_, j) => (
                                    <Star
                                        key={j}
                                        size={14}
                                        className="text-amber-400 fill-amber-400"
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4 italic">
                                &ldquo;{t.text}&rdquo;
                            </p>
                            <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border)]">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white text-sm font-bold">
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-[var(--color-text)]">
                                        {t.name}
                                    </p>
                                    <p className="text-xs text-[var(--color-text-dim)]">
                                        {t.role} — {t.company}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ════════════════════════════
          CTA FINAL
          ════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-4 pb-20 scroll-reveal">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary)] p-10 md:p-14">
                    <div className="absolute inset-0 grid-pattern opacity-10" />
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-3">
                                Pronto para transformar sua infraestrutura?
                            </h3>
                            <p className="text-white/80 max-w-lg text-lg leading-relaxed">
                                Entre em contato e receba uma proposta personalizada. Nossa
                                equipe de engenheiros está pronta para atender seu projeto.
                            </p>
                        </div>
                        <Link
                            href="/cotacao"
                            className="shrink-0 bg-white text-[var(--color-primary-dark)] font-bold px-8 py-4 rounded-xl hover:bg-white/90 hover:shadow-2xl hover:scale-105 transition-all text-base group"
                        >
                            <span className="flex items-center gap-2">
                                Solicitar Proposta
                                <ArrowRight
                                    size={18}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
