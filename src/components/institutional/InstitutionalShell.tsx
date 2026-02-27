import Link from "next/link";
import { ReactNode } from "react";

type InstitutionalAction = {
    label: string;
    href: string;
    variant?: "primary" | "secondary";
};

type InstitutionalShellProps = {
    eyebrow: string;
    title: string;
    description: string;
    highlights: string[];
    actions?: InstitutionalAction[];
    updatedAt?: string;
    children: ReactNode;
};

export function InstitutionalShell({
    eyebrow,
    title,
    description,
    highlights,
    actions = [],
    updatedAt,
    children,
}: InstitutionalShellProps) {
    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-gradient-to-br from-[#f3f8ff] via-white to-[#edf6ff]">
                <div className="absolute inset-0 grid-pattern opacity-[0.06]" />
                <div className="absolute -top-16 right-[-120px] h-72 w-72 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
                <div className="absolute -bottom-20 left-[-120px] h-72 w-72 rounded-full bg-[var(--color-accent)]/10 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-4 py-14 md:py-20">
                    <span className="inline-flex rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                        {eyebrow}
                    </span>

                    <h1 className="mt-4 max-w-4xl text-3xl font-extrabold leading-tight text-[var(--color-text)] md:text-5xl">
                        {title}
                    </h1>

                    <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--color-text-muted)] md:text-lg">
                        {description}
                    </p>

                    {actions.length > 0 && (
                        <div className="mt-8 flex flex-wrap gap-3">
                            {actions.map((action) => (
                                <Link
                                    key={`${action.label}_${action.href}`}
                                    href={action.href}
                                    className={
                                        action.variant === "secondary"
                                            ? "inline-flex items-center rounded-xl border border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                                            : "inline-flex items-center rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
                                    }
                                >
                                    {action.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {highlights.map((item) => (
                            <div
                                key={item}
                                className="rounded-xl border border-[var(--color-border)] bg-white/90 px-4 py-3 text-sm font-medium text-[var(--color-text)] shadow-sm"
                            >
                                {item}
                            </div>
                        ))}
                    </div>

                    {updatedAt && (
                        <p className="mt-4 text-xs text-[var(--color-text-dim)]">
                            Ultima atualizacao: {updatedAt}
                        </p>
                    )}
                </div>
            </section>

            <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 md:py-14">
                {children}
            </main>
        </div>
    );
}

