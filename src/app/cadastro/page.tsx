"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    Eye,
    EyeOff,
    UserPlus,
    Loader2,
    ShieldCheck,
    Zap,
    Shield,
    CheckCircle2,
    Headphones,
    Star,
} from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("As senhas não coincidem");
            return;
        }

        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Erro ao criar conta");
                return;
            }

            // Auto login after registration
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                router.push("/login");
            } else {
                router.push("/");
                router.refresh();
            }
        } catch {
            setError("Erro ao criar conta");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-split">
            {/* Left — Brand Panel */}
            <div className="auth-split-brand">
                <div className="relative z-10 max-w-md text-center">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

                    <div className="relative">
                        <Link href="/" className="inline-block" aria-label="Ir para a Home">
                            <span className="h-12 px-6 inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white font-bold text-lg tracking-wide mb-8 mx-auto backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                                Protótipo
                            </span>
                        </Link>

                        <h2 className="text-2xl font-bold text-white mb-3">
                            Crie sua conta e comece a comprar
                        </h2>
                        <p className="text-white/60 text-sm leading-relaxed mb-10">
                            Acesse preços especiais, acompanhe seus pedidos e solicite cotações personalizadas.
                        </p>

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

                        <div className="mt-10 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <div className="flex -space-x-0.5 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                                ))}
                            </div>
                            <p className="text-xs text-white/60 italic leading-relaxed">
                                &ldquo;Compramos em volume há mais de 2 anos. Os preços B2B e o suporte são incomparáveis.&rdquo;
                            </p>
                            <p className="text-[10px] text-white/40 mt-2">— Ana O., ISP Fibra Connect</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right — Form */}
            <div className="auth-split-form">
                <div className="w-full max-w-[420px]">
                    <div className="auth-card">
                        <div className="text-center mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <ShieldCheck size={24} className="text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-[var(--color-text)]">Criar Conta</h1>
                            <p className="text-sm text-[var(--color-text-muted)] mt-1">
                                Crie sua conta para comprar na Precision
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 text-sm mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="auth-label">Nome Completo</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="auth-input"
                                    placeholder="Seu nome"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="auth-label">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="auth-input"
                                    placeholder="seu@email.com"
                                    required
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
                                        placeholder="Mínimo 6 caracteres"
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

                            <div>
                                <label className="auth-label">Confirmar Senha</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="auth-input"
                                    placeholder="Repita a senha"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="auth-btn-primary"
                            >
                                {loading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <UserPlus size={18} />
                                )}
                                {loading ? "Criando..." : "Criar Conta"}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-[var(--color-text-muted)]">
                                Já tem conta?{" "}
                                <Link href="/login" className="text-[var(--color-primary)] font-medium hover:underline">
                                    Entrar
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
