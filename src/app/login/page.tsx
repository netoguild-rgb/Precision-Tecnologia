"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LogIn, Loader2, Shield } from "lucide-react";

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
        <div className="auth-page">
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
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[var(--color-primary)]" /></div>}>
            <LoginForm />
        </Suspense>
    );
}
