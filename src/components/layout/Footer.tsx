import Link from "next/link";
import Image from "next/image";
import {
    Mail,
    Phone,
    MapPin,
    Instagram,
    Linkedin,
    Youtube,
} from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-[var(--color-bg-elevated)] border-t border-[var(--color-border)]">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Image
                                src="/images/precision-logo-cropped.png"
                                alt="Precision Tecnologia"
                                width={802}
                                height={230}
                                className="h-10 sm:h-11 w-auto"
                            />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <Image
                                src="/images/huawei-logo.png"
                                alt="Huawei"
                                width={70}
                                height={22}
                                className="h-6 w-auto opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition-all"
                            />
                            <div className="h-4 w-px bg-[var(--color-border)]" />
                            <Image
                                src="/images/furukawa-logo-slogan.svg"
                                alt="Furukawa"
                                width={80}
                                height={24}
                                className="h-6 w-auto opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition-all"
                            />
                        </div>
                        <p className="text-sm text-[var(--color-text-muted)] mb-4 leading-relaxed">
                            Soluções completas em infraestrutura de rede. Switches, roteadores,
                            access points, GBICs e conectividade Huawei com pronta entrega e
                            os melhores preços.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="w-9 h-9 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all"
                            >
                                <Instagram size={16} />
                            </a>
                            <a
                                href="#"
                                className="w-9 h-9 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all"
                            >
                                <Linkedin size={16} />
                            </a>
                            <a
                                href="#"
                                className="w-9 h-9 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all"
                            >
                                <Youtube size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider text-[var(--color-text)]">
                            Produtos
                        </h4>
                        <ul className="space-y-2.5">
                            {[
                                "Switches",
                                "Roteadores",
                                "Access Points",
                                "GBICs / SFP",
                                "Patch Cords",
                                "Patch Panels",
                                "Conectores",
                                "Firewalls",
                            ].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={`/produtos?category=${item.toLowerCase().replace(/\s+\/?\s*/g, "-")}`}
                                        className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Institutional */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider text-[var(--color-text)]">
                            Institucional
                        </h4>
                        <ul className="space-y-2.5">
                            {[
                                { name: "Sobre Nós", href: "/sobre" },
                                { name: "Política de Privacidade", href: "/privacidade" },
                                { name: "Termos de Uso", href: "/termos" },
                                { name: "Trocas e Devoluções", href: "/trocas" },
                                { name: "Garantia", href: "/garantia" },
                                { name: "Programa de Parceiros", href: "/parceiros" },
                                { name: "Solicitar Cotação B2B", href: "/cotacao" },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider text-[var(--color-text)]">
                            Contato
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2.5">
                                <Phone
                                    size={16}
                                    className="text-[var(--color-primary)] mt-0.5 shrink-0"
                                />
                                <div>
                                    <p className="text-sm text-[var(--color-text)]">
                                        (11) 4002-8922
                                    </p>
                                    <p className="text-xs text-[var(--color-text-dim)]">
                                        Seg-Sex 8h às 18h
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <Mail
                                    size={16}
                                    className="text-[var(--color-primary)] mt-0.5 shrink-0"
                                />
                                <p className="text-sm text-[var(--color-text)]">
                                    contato@precisiontecnologia.com.br
                                </p>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <MapPin
                                    size={16}
                                    className="text-[var(--color-primary)] mt-0.5 shrink-0"
                                />
                                <p className="text-sm text-[var(--color-text-muted)]">
                                    São Paulo, SP — Brasil
                                </p>
                            </li>
                        </ul>

                        {/* Payment methods */}
                        <div className="mt-6">
                            <h5 className="text-xs font-semibold mb-2 uppercase tracking-wider text-[var(--color-text-dim)]">
                                Formas de Pagamento
                            </h5>
                            <div className="flex flex-wrap gap-2">
                                {["PIX", "Visa", "Master", "Elo", "Boleto"].map((m) => (
                                    <span
                                        key={m}
                                        className="px-2.5 py-1 text-[10px] font-medium bg-[var(--color-bg-card)] rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)]"
                                    >
                                        {m}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* B2B badge */}
                        <div className="mt-4 p-3 rounded-lg bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10">
                            <p className="text-xs font-medium text-[var(--color-primary)]">
                                💼 Boleto faturado para CNPJ (30/60/90 dias)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-6 border-t border-[var(--color-border)] flex flex-col md:flex-row justify-between items-center gap-3">
                    <p className="text-xs text-[var(--color-text-dim)]">
                        © 2026 Precision Tecnologia. Todos os direitos reservados. CNPJ:
                        XX.XXX.XXX/0001-XX
                    </p>
                    <div className="flex items-center gap-4 text-xs text-[var(--color-text-dim)]">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                            Parceiro Autorizado Huawei
                        </span>
                        <span>•</span>
                        <span>🔒 Pagamento Seguro SSL</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
