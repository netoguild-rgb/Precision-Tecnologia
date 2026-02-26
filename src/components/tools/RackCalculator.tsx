"use client";

import { useState } from "react";
import { Plus, Trash2, Server, ChevronDown, Calculator } from "lucide-react";

interface RackItem {
    id: string;
    name: string;
    units: number;
    color: string;
}

const presetEquipments = [
    { name: "Switch 1U (ex: S5735-L)", units: 1, color: "#2563EB" },
    { name: "Switch 2U (ex: S12700E Módulo)", units: 2, color: "#1D4ED8" },
    { name: "Patch Panel 1U", units: 1, color: "#059669" },
    { name: "Guia de Cabos 1U", units: 1, color: "#64748B" },
    { name: "Roteador 1U (ex: AR650)", units: 1, color: "#7C3AED" },
    { name: "Firewall 1U (ex: USG6500E)", units: 1, color: "#DC2626" },
    { name: "Servidor 2U", units: 2, color: "#0891B2" },
    { name: "UPS / Nobreak 3U", units: 3, color: "#D97706" },
    { name: "Bandeja de Ventilação 1U", units: 1, color: "#475569" },
    { name: "Organizador Vertical 2U", units: 2, color: "#78716C" },
];

export function RackCalculator() {
    const [rackSize, setRackSize] = useState(42);
    const [items, setItems] = useState<RackItem[]>([]);
    const [showPresets, setShowPresets] = useState(false);

    const usedUnits = items.reduce((acc, item) => acc + item.units, 0);
    const freeUnits = rackSize - usedUnits;
    const usagePercent = Math.round((usedUnits / rackSize) * 100);

    const addPreset = (preset: (typeof presetEquipments)[0]) => {
        if (usedUnits + preset.units > rackSize) return;
        setItems((prev) => [
            ...prev,
            {
                id: `${Date.now()}-${Math.random()}`,
                name: preset.name,
                units: preset.units,
                color: preset.color,
            },
        ]);
        setShowPresets(false);
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <div className="bg-white border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                        <Calculator size={20} className="text-[var(--color-primary)]" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-[var(--color-text)]">
                            Calculadora de Rack
                        </h3>
                        <p className="text-xs text-[var(--color-text-muted)]">
                            Visualize a ocupação do seu rack
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-5">
                {/* Rack size selector */}
                <div className="flex items-center gap-3 mb-5">
                    <label className="text-xs font-medium text-[var(--color-text-muted)]">
                        Tamanho do rack:
                    </label>
                    <div className="flex gap-1.5">
                        {[12, 22, 32, 42, 48].map((size) => (
                            <button
                                key={size}
                                onClick={() => setRackSize(size)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${rackSize === size
                                        ? "bg-[var(--color-primary)] text-white"
                                        : "bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-[var(--color-primary)]"
                                    }`}
                            >
                                {size}U
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Visual rack */}
                    <div>
                        <div className="bg-[#1E293B] rounded-xl p-3 relative">
                            {/* Rack shell */}
                            <div className="space-y-[2px]">
                                {Array.from({ length: rackSize }, (_, i) => {
                                    // Check if this slot is occupied by an item
                                    let currentU = 0;
                                    let occupyingItem: RackItem | null = null;
                                    let isFirstUnit = false;

                                    for (const item of items) {
                                        if (i >= currentU && i < currentU + item.units) {
                                            occupyingItem = item;
                                            isFirstUnit = i === currentU;
                                            break;
                                        }
                                        currentU += item.units;
                                    }

                                    if (occupyingItem && !isFirstUnit) return null;

                                    if (occupyingItem && isFirstUnit) {
                                        return (
                                            <div
                                                key={i}
                                                className="flex items-center rounded-md px-2 transition-all group relative"
                                                style={{
                                                    backgroundColor: occupyingItem.color,
                                                    height: `${occupyingItem.units * 20 + (occupyingItem.units - 1) * 2}px`,
                                                }}
                                            >
                                                <span className="text-[9px] text-white font-medium truncate flex-1">
                                                    {occupyingItem.name}
                                                </span>
                                                <span className="text-[8px] text-white/70 mr-1">
                                                    {occupyingItem.units}U
                                                </span>
                                                <button
                                                    onClick={() => removeItem(occupyingItem!.id)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 bg-black/30 rounded flex items-center justify-center"
                                                >
                                                    <Trash2 size={8} className="text-white" />
                                                </button>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div
                                            key={i}
                                            className="h-5 bg-[#334155] rounded-sm flex items-center px-2"
                                        >
                                            <span className="text-[7px] text-slate-500 font-mono">
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div>
                        {/* Usage bar */}
                        <div className="mb-5">
                            <div className="flex justify-between text-xs mb-1.5">
                                <span className="font-medium text-[var(--color-text)]">
                                    Ocupação: {usedUnits}U de {rackSize}U
                                </span>
                                <span
                                    className={`font-bold ${usagePercent > 80
                                            ? "text-[var(--color-danger)]"
                                            : usagePercent > 50
                                                ? "text-[var(--color-warning)]"
                                                : "text-[var(--color-accent)]"
                                        }`}
                                >
                                    {usagePercent}%
                                </span>
                            </div>
                            <div className="h-2.5 bg-[var(--color-bg-elevated)] rounded-full overflow-hidden border border-[var(--color-border)]">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${usagePercent > 80
                                            ? "bg-[var(--color-danger)]"
                                            : usagePercent > 50
                                                ? "bg-[var(--color-warning)]"
                                                : "bg-[var(--color-accent)]"
                                        }`}
                                    style={{ width: `${usagePercent}%` }}
                                />
                            </div>
                            <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                {freeUnits}U disponíveis
                            </p>
                        </div>

                        {/* Items list */}
                        {items.length > 0 && (
                            <div className="mb-5">
                                <p className="text-xs font-semibold text-[var(--color-text)] uppercase tracking-wider mb-2">
                                    Equipamentos ({items.length})
                                </p>
                                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-[var(--color-bg-elevated)] text-xs group"
                                        >
                                            <span
                                                className="w-3 h-3 rounded-sm shrink-0"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <span className="flex-1 text-[var(--color-text)] truncate">
                                                {item.name}
                                            </span>
                                            <span className="text-[var(--color-text-dim)] font-mono-sku">
                                                {item.units}U
                                            </span>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={12} className="text-[var(--color-danger)]" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add equipment */}
                        <div className="relative">
                            <button
                                onClick={() => setShowPresets(!showPresets)}
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all"
                            >
                                <Plus size={16} />
                                Adicionar Equipamento
                                <ChevronDown
                                    size={14}
                                    className={`transition-transform ${showPresets ? "rotate-180" : ""}`}
                                />
                            </button>

                            {showPresets && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[var(--color-border)] rounded-xl shadow-xl z-10 max-h-52 overflow-y-auto">
                                    {presetEquipments.map((eq) => (
                                        <button
                                            key={eq.name}
                                            onClick={() => addPreset(eq)}
                                            disabled={usedUnits + eq.units > rackSize}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-[var(--color-bg-elevated)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <span
                                                className="w-3 h-3 rounded-sm shrink-0"
                                                style={{ backgroundColor: eq.color }}
                                            />
                                            <span className="flex-1 text-[var(--color-text)]">{eq.name}</span>
                                            <span className="text-xs text-[var(--color-text-dim)] font-mono-sku">
                                                {eq.units}U
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
