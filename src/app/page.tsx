"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import {
  ArrowRight,
  Zap,
  Shield,
  Truck,
  Headphones,
  Network,
  Router,
  Wifi,
  Cpu,
  Cable,
  LayoutGrid,
  Plug,
  ShieldCheck,
  ChevronRight,
  Star,
  Play,
  Package,
  Award,
  CheckCircle2,
  Warehouse,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";

const categories = [
  {
    name: "Switches",
    slug: "switches",
    desc: "Campus & Data Center",
    icon: Network,
    gradient: "from-blue-600 to-cyan-500",
    products: "CloudEngine S5735, S12700E",
  },
  {
    name: "Roteadores",
    slug: "roteadores",
    desc: "Enterprise & SD-WAN",
    icon: Router,
    gradient: "from-violet-600 to-purple-500",
    products: "NetEngine AR6700, AR650",
  },
  {
    name: "Access Points",
    slug: "access-points",
    desc: "Wi-Fi 6 & Wi-Fi 7",
    icon: Wifi,
    gradient: "from-emerald-600 to-teal-500",
    products: "AirEngine 5700, 6700, 8700",
  },
  {
    name: "GBICs / SFP",
    slug: "gbics-sfp",
    desc: "1G a 400G",
    icon: Cpu,
    gradient: "from-orange-500 to-amber-500",
    products: "SFP, SFP+, SFP28, QSFP28",
  },
  {
    name: "Patch Cords",
    slug: "patch-cords",
    desc: "UTP & Fibra Óptica",
    icon: Cable,
    gradient: "from-pink-500 to-rose-500",
    products: "Cat5e, Cat6, Cat6a, SM/MM",
  },
  {
    name: "Patch Panels",
    slug: "patch-panels",
    desc: 'Rack 19" • 24/48 portas',
    icon: LayoutGrid,
    gradient: "from-sky-500 to-blue-500",
    products: "UTP, Fibra, Modular",
  },
  {
    name: "Conectores",
    slug: "conectores",
    desc: "RJ-45, LC, SC, Keystone",
    icon: Plug,
    gradient: "from-lime-500 to-green-500",
    products: "Fast Connect, Splice, Keystone",
  },
  {
    name: "Firewalls",
    slug: "firewalls",
    desc: "Next-Gen com IA",
    icon: ShieldCheck,
    gradient: "from-red-500 to-orange-500",
    products: "HiSecEngine USG6500E, USG6700E",
  },
];

const features = [
  {
    icon: Zap,
    title: "Pronta Entrega",
    desc: "Milhares de produtos em estoque para envio imediato",
  },
  {
    icon: Shield,
    title: "Garantia Oficial",
    desc: "Todos os produtos com garantia Huawei e nota fiscal",
  },
  {
    icon: Truck,
    title: "Envio Nacional e Internacional",
    desc: "Correios, Jadlog, DHL e FedEx para todo o mundo",
  },
  {
    icon: Headphones,
    title: "Suporte Técnico",
    desc: "Equipe especializada em infraestrutura de rede",
  },
];

const testimonials = [
  {
    name: "Ricardo Mendes",
    role: "CTO",
    company: "NetLink Solutions",
    text: "A Precision é nosso fornecedor principal de switches Huawei. Pronta entrega real, não é marketing — recebemos em 24h em SP. Suporte técnico excelente.",
    rating: 5,
  },
  {
    name: "Ana Oliveira",
    role: "Gerente de Compras",
    company: "ISP Fibra Connect",
    text: "Compramos GBICs e patch cords em volume. Os preços B2B são os melhores que encontramos, e o boleto faturado facilita muito o fluxo de caixa.",
    rating: 5,
  },
  {
    name: "Carlos Eduardo",
    role: "Engenheiro de Redes",
    company: "DataCenter Plus",
    text: "Excelente catálogo técnico. As especificações são detalhadas e os datasheets estão sempre disponíveis. Isso economiza muito tempo no dia a dia.",
    rating: 5,
  },
];

const whyChooseUs = [
  {
    icon: Award,
    title: "Parceiro Oficial Huawei",
    desc: "Gold Partner com acesso direto ao suporte e estoque do fabricante. Garantia e procedência asseguradas.",
    color: "var(--color-primary)",
    bg: "rgba(27, 75, 138, 0.08)",
  },
  {
    icon: Warehouse,
    title: "Estoque Próprio no Brasil",
    desc: "Mais de 500 produtos em estoque em São Paulo. Envio em até 24 horas para todo o Brasil.",
    color: "var(--color-success)",
    bg: "rgba(5, 150, 105, 0.08)",
  },
  {
    icon: Headphones,
    title: "Suporte Pós-Venda",
    desc: "Equipe técnica especializada em infraestrutura de rede. Assistência na configuração e integração.",
    color: "var(--color-accent)",
    bg: "rgba(14, 165, 233, 0.08)",
  },
];

const brandLogos = [
  { src: "/images/huawei-logo.png", alt: "Huawei", w: 120, h: 40 },
  { src: "/images/furukawa-logo-slogan.svg", alt: "Furukawa Electric", w: 180, h: 40 },
  { src: "/images/commscope-logo.svg", alt: "Commscope", w: 180, h: 40 },
  { src: "/images/cisco-logo.png", alt: "Cisco", w: 180, h: 40 },
  { src: "/images/mikrotik-logo.png", alt: "MikroTik", w: 180, h: 40 },
];

/* ── Animated counter subcomponent ── */
function AnimatedStat({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const { ref, value } = useAnimatedCounter(end, 2000, suffix);
  return (
    <div>
      <p
        ref={ref as React.Ref<HTMLParagraphElement>}
        className="text-3xl font-extrabold bg-gradient-to-r from-[#5B9EC9] to-[#A3D4F7] bg-clip-text text-transparent"
      >
        {value}
      </p>
      <p className="text-sm text-white/50 mt-1">{label}</p>
    </div>
  );
}

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded] = useState(true);
  const scrollRef = useScrollReveal();

  const setHeroVideoSpeed = () => {
    if (!videoRef.current) return;
    videoRef.current.defaultPlaybackRate = 1;
    videoRef.current.playbackRate = 1;
  };

  useEffect(() => {
    setHeroVideoSpeed();
    videoRef.current?.play().catch(() => { });
  }, []);

  return (
    <div ref={scrollRef} className="min-h-screen bg-[var(--color-bg)]">
      {/* ═══════════════════════════════════════════════════
          HERO SECTION — Video Background
         ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Video Background */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedMetadata={setHeroVideoSpeed}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/datacenter-hero.mp4" type="video/mp4" />
        </video>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 lg:py-28 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left — Text Content */}
            <div className={`flex-1 max-w-2xl hero-focus-panel transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="hero-badge inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-8">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0EA5E9] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0EA5E9]" />
                </span>
                <span className="text-sm font-semibold tracking-wide">
                  Parceiro Autorizado Huawei Enterprise
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.05] mb-6 tracking-tight text-white">
                Infraestrutura de rede{" "}
                <span className="hero-gradient-text">
                  de alta performance
                </span>
              </h2>

              <p className="text-lg md:text-xl text-white/70 mb-10 max-w-xl leading-relaxed">
                Switches, roteadores, access points, GBICs, patch cords e
                conectores. <strong className="text-white/90">Pronta entrega</strong> com os melhores preços do Brasil.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/produtos"
                  className="hero-btn-primary flex items-center gap-2.5 text-base group"
                >
                  <Play size={18} className="fill-current" />
                  Ver Catálogo
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/cotacao"
                  className="hero-btn-outline flex items-center gap-2.5 text-base"
                >
                  Solicitar Cotação B2B
                </Link>
              </div>

              {/* Animated Stats */}
              <div className="flex flex-wrap gap-8 mt-14 pt-8 border-t border-white/10">
                <AnimatedStat end={500} suffix="+" label="Produtos" />
                <AnimatedStat end={24} suffix="h" label="Envio rápido" />
                <AnimatedStat end={12} suffix="x" label="Sem juros" />
                <AnimatedStat end={100} suffix="%" label="Garantia" />
              </div>
            </div>

            {/* Right — Huawei Partner Card */}
            <div className={`shrink-0 transition-all duration-1000 delay-300 ${isLoaded ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}>
              <div className="relative" style={{ animation: "float 8s ease-in-out infinite" }}>
                {/* Glow behind card */}
                <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-[#1B4B8A]/15 to-[#5B9EC9]/15 blur-3xl" />

                <div className="relative glass-hero hero-brand-panel rounded-2xl p-8 md:p-10 border border-white/10 overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

                  <Image
                    src="/images/huawei-logo.png"
                    alt="Huawei Enterprise Partner"
                    width={280}
                    height={90}
                    className="w-56 md:w-72 h-auto drop-shadow-2xl brightness-0 invert relative z-10"
                    priority
                  />
                  <div className="mt-6 flex items-center gap-2 justify-center relative z-10">
                    <div className="flex -space-x-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] text-white/60 ml-1.5 font-medium">Partner Tier Gold</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/[0.06] relative z-10">
                    <p className="text-center text-[10px] text-white/35 tracking-[0.2em] uppercase">
                      Enterprise Network Solutions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transition to white */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent z-10" />
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURES BAR — Floating Card
         ═══════════════════════════════════════════════════ */}
      <section className="relative z-20 -mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="glass-features rounded-2xl p-2">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
              {features.map((feat, i) => (
                <div
                  key={feat.title}
                  className={`feature-card flex items-center gap-3.5 p-4 rounded-xl transition-all duration-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ transitionDelay: `${800 + i * 100}ms` }}
                >
                  <div className="w-11 h-11 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                    <feat.icon size={20} className="text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">{feat.title}</p>
                    <p className="text-xs text-[var(--color-text-dim)] leading-snug">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CATEGORIES GRID — with scroll reveal
         ═══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex justify-between items-end mb-10 scroll-reveal">
          <div>
            <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-widest mb-2">
              Explore
            </p>
            <h3 className="text-3xl font-bold mb-2 text-[var(--color-text)]">Categorias</h3>
            <p className="text-[var(--color-text-muted)]">
              Encontre a solução ideal para sua infraestrutura
            </p>
          </div>
          <Link
            href="/produtos"
            className="hidden md:flex items-center gap-1.5 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium transition-colors group"
          >
            Ver todos
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/produtos?category=${cat.slug}`}
              className={`scroll-reveal scroll-reveal-delay-${(i % 4) + 1} category-card group relative bg-[var(--color-bg-card)] rounded-2xl p-6 border border-[var(--color-border)] overflow-hidden`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`}
              />

              <div className="relative">
                <div
                  className={`w-13 h-13 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}
                >
                  <cat.icon size={22} className="text-white" />
                </div>

                <h4 className="text-lg font-semibold mb-1 text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                  {cat.name}
                </h4>
                <p className="text-sm text-[var(--color-text-muted)] mb-2">{cat.desc}</p>
                <p className="text-xs text-[var(--color-text-dim)] font-mono-sku">{cat.products}</p>

                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[var(--color-primary)] opacity-0 group-hover:opacity-100 translate-x-[-8px] group-hover:translate-x-0 transition-all duration-300">
                  Ver produtos
                  <ChevronRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURED PRODUCTS
         ═══════════════════════════════════════════════════ */}
      <section className="bg-[var(--color-bg-elevated)] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10 scroll-reveal">
            <div>
              <p className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-widest mb-2">
                Destaques
              </p>
              <h3 className="text-3xl font-bold mb-2 text-[var(--color-text)]">
                Produtos em{" "}
                <span className="gradient-text">Destaque</span>
              </h3>
              <p className="text-[var(--color-text-muted)]">
                Os mais vendidos com pronta entrega
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                name: "CloudEngine S5735-L-V2",
                cat: "Switch Campus",
                sku: "98012021",
                image: "/images/products/cloudengine-s5735-l-v2.png",
                price: "R$ 2.890,00",
                installment: "12x R$ 240,83",
                stock: "Em Estoque",
                stockType: "available" as const,
              },
              {
                name: "AirEngine 5773-22P",
                cat: "Access Point Wi-Fi 6",
                sku: "50084766",
                image: "/images/products/airengine-5773-22p.png",
                price: "R$ 1.450,00",
                installment: "12x R$ 120,83",
                stock: "Em Estoque",
                stockType: "available" as const,
              },
              {
                name: "SFP+ 10G LR 10km",
                cat: "GBIC / Módulo Óptico",
                sku: "34060599",
                image: "/images/products/sfp-plus-10g-lr-10km.png",
                price: "R$ 320,00",
                installment: "3x R$ 106,67",
                stock: "Em Estoque",
                stockType: "available" as const,
              },
              {
                name: "NetEngine AR650",
                cat: "Roteador Enterprise",
                sku: "02311TSJ",
                image: "/images/products/netengine-ar650.png",
                price: "R$ 3.200,00",
                installment: "12x R$ 266,67",
                stock: "Sob Encomenda",
                stockType: "order" as const,
              },
            ].map((product, i) => (
              <div
                key={product.name}
                className={`scroll-reveal scroll-reveal-delay-${i + 1} product-card rounded-2xl overflow-hidden group`}
              >
                {/* Image */}
                <div className="aspect-square bg-[var(--color-bg-elevated)] flex items-center justify-center p-8 relative overflow-hidden border-b border-[var(--color-border)]">
                  <div className="relative w-full h-full rounded-xl bg-white overflow-hidden flex items-center justify-center">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <Network size={48} className="text-[var(--color-border)]" />
                    )}
                  </div>
                  {/* Stock badge */}
                  <span
                    className={`absolute top-3 left-3 badge-stock ${product.stockType === "available"
                      ? "badge-stock-available"
                      : "badge-stock-order"
                      }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full pulse-dot ${product.stockType === "available"
                        ? "bg-[var(--color-accent)]"
                        : "bg-[var(--color-warning)]"
                        }`}
                    />
                    {product.stock}
                  </span>
                </div>

                {/* Info */}
                <div className="p-5 bg-white">
                  <p className="text-xs text-[var(--color-primary)] font-medium mb-1">
                    {product.cat}
                  </p>
                  <h4 className="font-semibold text-sm mb-1 text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                    {product.name}
                  </h4>
                  <p className="font-mono-sku mb-3">SKU: {product.sku}</p>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-lg font-bold text-[var(--color-text)]">
                        {product.price}
                      </p>
                      <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                        {product.installment} sem juros
                      </p>
                    </div>
                    <button className="btn-primary !py-2.5 !px-4 text-xs flex items-center gap-1.5 group/btn">
                      <Package size={14} />
                      Comprar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHY CHOOSE US — Trust Section
         ═══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12 scroll-reveal">
          <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-widest mb-2">
            Diferenciais
          </p>
          <h3 className="text-3xl font-bold mb-3 text-[var(--color-text)]">
            Por Que Escolher a{" "}
            <span className="gradient-text">Precision</span>
          </h3>
          <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Mais do que um e-commerce, somos especialistas em infraestrutura de rede com estoque próprio no Brasil
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {whyChooseUs.map((item, i) => (
            <div
              key={item.title}
              className={`scroll-reveal scroll-reveal-delay-${i + 1} p-8 rounded-2xl border border-[var(--color-border)] bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300`}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-sm"
                style={{ background: item.bg }}
              >
                <item.icon size={24} style={{ color: item.color }} />
              </div>
              <h4 className="text-lg font-bold text-[var(--color-text)] mb-2">{item.title}</h4>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TESTIMONIALS — Social Proof
         ═══════════════════════════════════════════════════ */}
      <section className="bg-[var(--color-bg-elevated)] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 scroll-reveal">
            <p className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-widest mb-2">
              Depoimentos
            </p>
            <h3 className="text-3xl font-bold mb-3 text-[var(--color-text)]">
              O Que Nossos Clientes Dizem
            </h3>
            <p className="text-[var(--color-text-muted)]">
              Empresas que confiam na Precision para sua infraestrutura
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className={`scroll-reveal scroll-reveal-delay-${i + 1} testimonial-card`}
              >
                <div className="flex -space-x-0.5 mb-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
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
                    <p className="text-sm font-semibold text-[var(--color-text)]">{t.name}</p>
                    <p className="text-xs text-[var(--color-text-dim)]">
                      {t.role} — {t.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          B2B CTA
         ═══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-16 scroll-reveal">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary)] p-10 md:p-14">
          <div className="absolute inset-0 grid-pattern opacity-10" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-3">
                Você é integrador de TI ou ISP?
              </h3>
              <p className="text-white/80 max-w-lg text-lg leading-relaxed">
                Condições especiais para compras em volume. Tabela de preços
                diferenciada, faturamento com prazo e suporte técnico dedicado.
              </p>
            </div>
            <Link
              href="/cotacao"
              className="shrink-0 bg-white text-[var(--color-primary-dark)] font-bold px-8 py-4 rounded-xl hover:bg-white/90 hover:shadow-2xl hover:scale-105 transition-all text-base group"
            >
              <span className="flex items-center gap-2">
                Solicitar Cotação B2B
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          BRANDS — Infinite Marquee
         ═══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-14 border-t border-[var(--color-border)] scroll-reveal">
        <p className="text-center text-xs text-[var(--color-text-dim)] uppercase tracking-widest mb-10">
          Trabalhamos com as melhores marcas
        </p>
        <div className="marquee-container">
          <div className="marquee-track">
            {[0, 1].map((groupIndex) => (
              <div
                key={`brand-group-${groupIndex}`}
                className="marquee-group"
                aria-hidden={groupIndex === 1}
              >
                {brandLogos.map((logo, i) => (
                  <Image
                    key={`${groupIndex}-${logo.alt}-${i}`}
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.w}
                    height={logo.h}
                    loading="eager"
                    className="h-8 w-auto opacity-40 hover:opacity-80 transition-opacity duration-300 grayscale hover:grayscale-0 shrink-0"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TRUST BADGES BAR
         ═══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 pb-16 scroll-reveal">
        <div className="flex flex-wrap justify-center gap-4">
          <div className="trust-badge">
            <div className="trust-badge-icon bg-green-50">
              <CheckCircle2 size={14} className="text-green-600" />
            </div>
            Pagamento Seguro SSL
          </div>
          <div className="trust-badge">
            <div className="trust-badge-icon bg-blue-50">
              <Shield size={14} className="text-blue-600" />
            </div>
            Garantia Oficial Huawei
          </div>
          <div className="trust-badge">
            <div className="trust-badge-icon bg-amber-50">
              <Award size={14} className="text-amber-600" />
            </div>
            Parceiro Autorizado
          </div>
          <div className="trust-badge">
            <div className="trust-badge-icon bg-purple-50">
              <Truck size={14} className="text-purple-600" />
            </div>
            Envio para Todo Brasil
          </div>
        </div>
      </section>
    </div>
  );
}
