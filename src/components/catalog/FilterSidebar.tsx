"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { FilterGroup } from "@/lib/mock-products";

interface FilterSidebarProps {
    filterGroups: FilterGroup[];
    activeFilters: Record<string, string[]>;
    onFilterChange: (key: string, value: string, checked: boolean) => void;
    onClearAll: () => void;
    totalResults: number;
}

export function FilterSidebar({
    filterGroups,
    activeFilters,
    onFilterChange,
    onClearAll,
    totalResults,
}: FilterSidebarProps) {
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

    const toggleCollapse = (key: string) => {
        setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const activeCount = Object.values(activeFilters).reduce(
        (acc, arr) => acc + arr.length,
        0
    );

    return (
        <aside className="w-full lg:w-72 shrink-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[var(--color-text)] uppercase tracking-wider">
                    Filtros
                </h3>
                {activeCount > 0 && (
                    <button
                        onClick={onClearAll}
                        className="text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium transition-colors"
                    >
                        Limpar todos ({activeCount})
                    </button>
                )}
            </div>

            {/* Results count */}
            <p className="text-xs text-[var(--color-text-muted)] mb-4 pb-4 border-b border-[var(--color-border)]">
                {totalResults} produto{totalResults !== 1 ? "s" : ""} encontrado{totalResults !== 1 ? "s" : ""}
            </p>

            {/* Filter groups */}
            <div className="space-y-1">
                {filterGroups.map((group) => {
                    const isCollapsed = collapsed[group.key];
                    const selectedValues = activeFilters[group.key] || [];

                    return (
                        <div key={group.key} className="border-b border-[var(--color-border)] pb-4 mb-4">
                            <button
                                onClick={() => toggleCollapse(group.key)}
                                className="flex items-center justify-between w-full py-1 text-sm font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    {group.label}
                                    {selectedValues.length > 0 && (
                                        <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold flex items-center justify-center">
                                            {selectedValues.length}
                                        </span>
                                    )}
                                </span>
                                {isCollapsed ? (
                                    <ChevronDown size={16} className="text-[var(--color-text-dim)]" />
                                ) : (
                                    <ChevronUp size={16} className="text-[var(--color-text-dim)]" />
                                )}
                            </button>

                            {!isCollapsed && (
                                <div className="mt-2 space-y-1.5">
                                    {group.options.map((option) => {
                                        const isChecked = selectedValues.includes(option.value);
                                        return (
                                            <label
                                                key={option.value}
                                                className={`flex items-center gap-2.5 py-1.5 px-2 rounded-lg cursor-pointer transition-colors text-sm ${isChecked
                                                        ? "bg-[var(--color-primary)]/5 text-[var(--color-primary)]"
                                                        : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-card-hover)] hover:text-[var(--color-text)]"
                                                    }`}
                                            >
                                                <input
                                                    type={group.type === "radio" ? "radio" : "checkbox"}
                                                    name={group.type === "radio" ? group.key : undefined}
                                                    checked={isChecked}
                                                    onChange={(e) =>
                                                        onFilterChange(group.key, option.value, e.target.checked)
                                                    }
                                                    className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] accent-[var(--color-primary)]"
                                                />
                                                <span className="flex-1">{option.label}</span>
                                                <span className="text-xs text-[var(--color-text-dim)]">
                                                    ({option.count})
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}

/* ═══════════════════════════════
   FILTER CHIPS (active filters)
   ═══════════════════════════════ */
interface FilterChipsProps {
    activeFilters: Record<string, string[]>;
    filterGroups: FilterGroup[];
    onRemove: (key: string, value: string) => void;
    onClearAll: () => void;
}

export function FilterChips({
    activeFilters,
    filterGroups,
    onRemove,
    onClearAll,
}: FilterChipsProps) {
    const chips: { key: string; value: string; label: string; groupLabel: string }[] = [];

    Object.entries(activeFilters).forEach(([key, values]) => {
        const group = filterGroups.find((g) => g.key === key);
        if (!group) return;
        values.forEach((value) => {
            const option = group.options.find((o) => o.value === value);
            if (option) {
                chips.push({
                    key,
                    value,
                    label: option.label,
                    groupLabel: group.label,
                });
            }
        });
    });

    if (chips.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-[var(--color-text-dim)] mr-1">Filtros ativos:</span>
            {chips.map((chip) => (
                <button
                    key={`${chip.key}-${chip.value}`}
                    onClick={() => onRemove(chip.key, chip.value)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-primary)]/5 text-[var(--color-primary)] text-xs font-medium border border-[var(--color-primary)]/15 hover:bg-[var(--color-primary)]/10 transition-colors group"
                >
                    {chip.label}
                    <X size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                </button>
            ))}
            {chips.length > 1 && (
                <button
                    onClick={onClearAll}
                    className="text-xs text-[var(--color-text-dim)] hover:text-[var(--color-danger)] transition-colors ml-1"
                >
                    Limpar todos
                </button>
            )}
        </div>
    );
}
