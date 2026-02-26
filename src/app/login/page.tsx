"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    Eye,
    EyeOff,
    LogIn,
    Loader2,
    Shield,
    Zap,
    CheckCircle2,
    Headphones,
    Star,
} from "lucide-react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Email ou senha incorretos");
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch {
            setError("Erro ao fazer login");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-split">
            {/* Left — Brand Panel */}
            <div className="auth-split-brand">
                <div className="relative z-10 max-w-md text-center">
                    {/* Glow orbs */}
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

                    <div className="relative">
                        <Image
                            src="/images/precision-logo-cropped.png"
                            alt="Precision Tecnologia"
                            width={802}
                            height={230}
                            className="h-12 w-auto mx-auto mb-8 brightness-0 invert"
                        />

                        <h2 className="text-2xl font-bold text-white mb-3">
                            Infraestrutura de rede de alta performance
                        </h2>
                        <p className="text-white/60 text-sm leading-relaxed mb-10">
                            Acesse sua conta para gerenciar pedidos, acompanhar entregas e solicitar cotações B2B.
                        </p>

                        {/* Benefits */}
                        <div className="space-y-4 text-left">
                            {[
                                { icon: Zap, text: "Pronta entrega com envio em 24h" },
                                { icon: Shield, text: "Garantia oficial Huawei" },
                                { icon: CheckCircle2, text: "Pagamento seguro em até 12x" },
                                { icon: Headphones, text: "Suporte técnico especializado" },
                            ].map((item) => (
                                <div key={item.text} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                        <item.icon size={16} className="text-white/80" />
                                    </div>
                                    <span className="text-sm text-white/70">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Mini testimonial */}
                        <div className="mt-10 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <div className="flex -space-x-0.5 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                                ))}
                            </div>
                            <p className="text-xs text-white/60 italic leading-relaxed">
                                &ldquo;Precisão no nome e na entrega. Melhor fornecedor de switches Huawei do Brasil.&rdquo;
                            </p>
                            <p className="text-[10px] text-white/40 mt-2">— Ricardo M., NetLink Solutions</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right — Form */}
            <div className="auth-split-form">
                <div className="w-full max-w-[420px]">
                    <div className="auth-card">
                        {/* Logo */}
                        <div className="text-center mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Shield size={24} className="text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-[var(--color-text)]">Entrar</h1>
                            <p className="text-sm text-[var(--color-text-muted)] mt-1">
                                Acesse sua conta Precision Tecnologia
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 text-sm mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="auth-label">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="auth-input"
                                    placeholder="seu@email.com"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="auth-label">Senha</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="auth-input !pr-10"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)] hover:text-[var(--color-text)]"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="auth-btn-primary"
                            >
                                {loading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <LogIn size={18} />
                                )}
                                {loading ? "Entrando..." : "Entrar"}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-[var(--color-text-muted)]">
                                Não tem conta?{" "}
                                <Link href="/cadastro" className="text-[var(--color-primary)] font-medium hover:underline">
                                    Criar conta
                                </Link>
                            </p>
                        </div>

                        <div className="mt-4 text-center">
                            <Link href="/" className="text-xs text-[var(--color-text-dim)] hover:text-[var(--color-primary)]">
                                ← Voltar à loja
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[var(--color-primary)]" /></div>}>
            <LoginForm />
        </Suspense>
    );
}
