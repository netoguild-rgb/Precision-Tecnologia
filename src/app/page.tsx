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
  Cable,
  Server,
  HardDrive,
  ChevronRight,
  Star,
  Play,
  Package,
} from "lucide-react";

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
    icon: Cable,
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
    icon: Server,
    gradient: "from-sky-500 to-blue-500",
    products: "UTP, Fibra, Modular",
  },
  {
    name: "Conectores",
    slug: "conectores",
    desc: "RJ-45, LC, SC, Keystone",
    icon: HardDrive,
    gradient: "from-lime-500 to-green-500",
    products: "Fast Connect, Splice, Keystone",
  },
  {
    name: "Firewalls",
    slug: "firewalls",
    desc: "Next-Gen com IA",
    icon: Shield,
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

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => { });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* ═══════════════════════════════════════════════════
          HERO SECTION — Video Background (keeps dark overlay)
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
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/datacenter-hero.mp4" type="video/mp4" />
        </video>

        {/* Multi-layer Gradient Overlay for depth */}
        <div className="hero-video-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-black/40" style={{ zIndex: 1 }} />
        <div className="absolute inset-0 grid-pattern opacity-10" style={{ zIndex: 2 }} />

        {/* Animated glow orbs */}
        <div className="absolute top-10 left-[15%] w-[600px] h-[600px] bg-[#1B4B8A] rounded-full opacity-[0.06] blur-[180px] animate-pulse-slow" style={{ zIndex: 2 }} />
        <div className="absolute bottom-10 right-[10%] w-[500px] h-[500px] bg-[#0EA5E9] rounded-full opacity-[0.06] blur-[180px] animate-pulse-slow" style={{ animationDelay: "3s", zIndex: 2 }} />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 lg:py-28 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left — Text Content */}
            <div className={`flex-1 max-w-2xl transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
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

              {/* Stats */}
              <div className="flex flex-wrap gap-8 mt-14 pt-8 border-t border-white/10">
                {[
                  { value: "500+", label: "Produtos" },
                  { value: "24h", label: "Envio rápido" },
                  { value: "12x", label: "Sem juros" },
                  { value: "100%", label: "Garantia" },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    style={{ transitionDelay: `${600 + i * 150}ms` }}
                  >
                    <p className="text-3xl font-extrabold bg-gradient-to-r from-[#5B9EC9] to-[#A3D4F7] bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                    <p className="text-sm text-white/50 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Huawei Partner Card */}
            <div className={`shrink-0 transition-all duration-1000 delay-300 ${isLoaded ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}>
              <div className="relative" style={{ animation: "float 8s ease-in-out infinite" }}>
                {/* Glow behind card */}
                <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-[#1B4B8A]/15 to-[#5B9EC9]/15 blur-3xl" />

                <div className="relative glass-hero rounded-2xl p-8 md:p-10 border border-white/10 overflow-hidden">
                  {/* Subtle top line glow */}
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

        {/* Multi-layer transition from dark hero to white page */}
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
          CATEGORIES GRID
         ═══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex justify-between items-end mb-10">
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
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/produtos?category=${cat.slug}`}
              className="category-card group relative bg-[var(--color-bg-card)] rounded-2xl p-6 border border-[var(--color-border)] overflow-hidden"
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
          <div className="flex justify-between items-end mb-10">
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
                price: "R$ 2.890,00",
                installment: "12x R$ 240,83",
                stock: "Em Estoque",
                stockType: "available" as const,
              },
              {
                name: "AirEngine 5773-22P",
                cat: "Access Point Wi-Fi 6",
                sku: "50084766",
                price: "R$ 1.450,00",
                installment: "12x R$ 120,83",
                stock: "Em Estoque",
                stockType: "available" as const,
              },
              {
                name: "SFP+ 10G LR 10km",
                cat: "GBIC / Módulo Óptico",
                sku: "34060599",
                price: "R$ 320,00",
                installment: "3x R$ 106,67",
                stock: "Em Estoque",
                stockType: "available" as const,
              },
              {
                name: "NetEngine AR650",
                cat: "Roteador Enterprise",
                sku: "02311TSJ",
                price: "R$ 3.200,00",
                installment: "12x R$ 266,67",
                stock: "Sob Encomenda",
                stockType: "order" as const,
              },
            ].map((product) => (
              <div
                key={product.name}
                className="product-card rounded-2xl overflow-hidden group"
              >
                {/* Image placeholder */}
                <div className="aspect-square bg-[var(--color-bg-elevated)] flex items-center justify-center p-8 relative overflow-hidden border-b border-[var(--color-border)]">
                  <div className="w-full h-full rounded-xl bg-white flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <Network size={48} className="text-[var(--color-border)]" />
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
          B2B CTA
         ═══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-16">
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
          BRANDS / TRUST
         ═══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-14 border-t border-[var(--color-border)]">
        <p className="text-center text-xs text-[var(--color-text-dim)] uppercase tracking-widest mb-10">
          Trabalhamos com as melhores marcas
        </p>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
          <Image
            src="/images/huawei-logo.png"
            alt="Huawei"
            width={120}
            height={40}
            className="h-8 w-auto opacity-40 hover:opacity-80 transition-opacity duration-300 grayscale hover:grayscale-0"
          />
          {["Furukawa", "Commscope", "Ubiquiti", "Mikrotik"].map((brand) => (
            <span
              key={brand}
              className="text-lg md:text-xl font-bold tracking-wider text-[var(--color-text-dim)] opacity-40 hover:opacity-80 hover:text-[var(--color-text)] transition-all duration-300"
            >
              {brand}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
