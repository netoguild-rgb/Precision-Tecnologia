"use client";

import { useState, useMemo } from "react";
import {
    CheckCircle,
    AlertTriangle,
    Search,
    ChevronDown,
    X,
    Shield,
    Cpu,
    Info,
} from "lucide-react";

// Static compatibility data (until backend is ready)
const compatibilityData: Record<
    string,
    { models: string[]; compatible: Record<string, { supported: boolean; note?: string }[]> }
> = {
    Huawei: {
        models: [
            "S5735-L Series",
            "S5735-S Series",
            "S6730-H Series",
            "S12700E Series",
            "CloudEngine 16800",
            "NetEngine AR6000",
            "NetEngine AR650",
        ],
        compatible: {
            "SFP-1G-LX": [
                { supported: true, note: undefined },
            ],
            "SFP-10G-LR": [
                { supported: true, note: undefined },
            ],
            "QSFP-100G-LR4": [
                { supported: true, note: "Requer firmware V200R019 ou superior" },
            ],
        },
    },
    Cisco: {
        models: [
            "Catalyst 9300",
            "Catalyst 9200",
            "Catalyst 3850",
            "Nexus 9000",
            "ISR 4000",
            "ASR 1000",
        ],
        compatible: {
            "SFP-1G-LX": [{ supported: true, note: undefined }],
            "SFP-10G-LR": [
                { supported: true, note: "Pode exigir service unsupported-transceiver" },
            ],
            "QSFP-100G-LR4": [{ supported: true, note: undefined }],
        },
    },
    "HP / Aruba": {
        models: [
            "Aruba 6300",
            "Aruba 6200",
            "Aruba 2930F",
            "Aruba 2530",
            "FlexNetwork 5130",
        ],
        compatible: {
            "SFP-1G-LX": [{ supported: true, note: undefined }],
            "SFP-10G-LR": [{ supported: true, note: undefined }],
            "QSFP-100G-LR4": [
                { supported: false, note: "Modelos Aruba 6200 e inferiores não suportam QSFP28" },
            ],
        },
    },
    Dell: {
        models: [
            "PowerSwitch S5248F",
            "PowerSwitch N3248",
            "PowerSwitch N2248PX",
        ],
        compatible: {
            "SFP-1G-LX": [{ supported: true, note: undefined }],
            "SFP-10G-LR": [{ supported: true, note: undefined }],
            "QSFP-100G-LR4": [{ supported: true, note: "Apenas série S5248F e superior" }],
        },
    },
    Juniper: {
        models: ["EX4300", "EX3400", "QFX5110", "SRX 300"],
        compatible: {
            "SFP-1G-LX": [{ supported: true, note: undefined }],
            "SFP-10G-LR": [{ supported: true, note: undefined }],
            "QSFP-100G-LR4": [{ supported: true, note: undefined }],
        },
    },
    Mikrotik: {
        models: [
            "CRS326-24G-2S+",
            "CRS328-24P-4S+",
            "CRS354-48G-4S+2Q+",
            "CCR2004-1G-12S+2XS",
        ],
        compatible: {
            "SFP-1G-LX": [{ supported: true, note: undefined }],
            "SFP-10G-LR": [{ supported: true, note: undefined }],
            "QSFP-100G-LR4": [
                { supported: false, note: "Mikrotik não suporta QSFP28 100G neste módulo" },
            ],
        },
    },
};

interface CompatibilityCheckerProps {
    productPartNumber?: string;
    className?: string;
}

export function CompatibilityChecker({
    productPartNumber,
    className = "",
}: CompatibilityCheckerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedModel, setSelectedModel] = useState("");

    const brands = Object.keys(compatibilityData);

    const models = useMemo(() => {
        if (!selectedBrand) return [];
        return compatibilityData[selectedBrand]?.models || [];
    }, [selectedBrand]);

    const result = useMemo(() => {
        if (!selectedBrand || !productPartNumber) return null;
        const brandData = compatibilityData[selectedBrand];
        if (!brandData) return null;
        const compat = brandData.compatible[productPartNumber];
        if (!compat || compat.length === 0) return null;
        return compat[0];
    }, [selectedBrand, productPartNumber]);

    if (!productPartNumber) return null;

    return (
        <div className={className}>
            {/* Trigger button */}
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-accent)]/5 border-2 border-dashed border-[var(--color-primary)]/20 rounded-2xl hover:border-[var(--color-primary)]/40 hover:from-[var(--color-primary)]/8 hover:to-[var(--color-accent)]/8 transition-all group"
                >
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center group-hover:bg-[var(--color-primary)]/15 transition-colors">
                        <Cpu size={20} className="text-[var(--color-primary)]" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-semibold text-[var(--color-primary)]">
                            Verificar Compatibilidade
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                            Cisco, Huawei, HP/Aruba, Dell, Juniper, Mikrotik
                        </p>
                    </div>
                    <Search size={18} className="text-[var(--color-primary)] ml-auto opacity-60 group-hover:opacity-100 transition-opacity" />
                </button>
            ) : (
                <div className="bg-white border border-[var(--color-border)] rounded-2xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                                <Search size={18} className="text-[var(--color-primary)]" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-[var(--color-text)]">
                                    Verificar Compatibilidade
                                </h3>
                                <p className="text-xs text-[var(--color-text-muted)] font-mono-sku">
                                    {productPartNumber}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                setSelectedBrand("");
                                setSelectedModel("");
                            }}
                            className="p-1.5 hover:bg-[var(--color-bg-elevated)] rounded-lg transition-colors"
                        >
                            <X size={16} className="text-[var(--color-text-dim)]" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-4">
                        {/* Brand select */}
                        <div>
                            <label className="text-xs font-medium text-[var(--color-text-muted)] mb-1.5 block">
                                Fabricante do seu equipamento
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedBrand}
                                    onChange={(e) => {
                                        setSelectedBrand(e.target.value);
                                        setSelectedModel("");
                                    }}
                                    className="w-full appearance-none bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl py-3 pl-4 pr-10 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 cursor-pointer transition-all"
                                >
                                    <option value="">Selecione o fabricante...</option>
                                    {brands.map((b) => (
                                        <option key={b} value={b}>
                                            {b}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={16}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)] pointer-events-none"
                                />
                            </div>
                        </div>

                        {/* Model select */}
                        {selectedBrand && (
                            <div>
                                <label className="text-xs font-medium text-[var(--color-text-muted)] mb-1.5 block">
                                    Modelo do equipamento
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedModel}
                                        onChange={(e) => setSelectedModel(e.target.value)}
                                        className="w-full appearance-none bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl py-3 pl-4 pr-10 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 cursor-pointer transition-all"
                                    >
                                        <option value="">Selecione o modelo...</option>
                                        {models.map((m) => (
                                            <option key={m} value={m}>
                                                {m}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        size={16}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)] pointer-events-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Result */}
                        {selectedBrand && result && (
                            <div
                                className={`rounded-xl p-4 border ${result.supported
                                        ? "bg-[#ECFDF5] border-[#A7F3D0]"
                                        : "bg-[#FEF2F2] border-[#FECACA]"
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    {result.supported ? (
                                        <CheckCircle size={20} className="text-[var(--color-accent)] mt-0.5 shrink-0" />
                                    ) : (
                                        <AlertTriangle size={20} className="text-[var(--color-danger)] mt-0.5 shrink-0" />
                                    )}
                                    <div>
                                        <p
                                            className={`text-sm font-semibold ${result.supported
                                                    ? "text-[var(--color-accent-dark)]"
                                                    : "text-[var(--color-danger)]"
                                                }`}
                                        >
                                            {result.supported
                                                ? `✅ Compatível com ${selectedBrand}`
                                                : `❌ Incompatível com este modelo`}
                                        </p>
                                        {selectedModel && (
                                            <p
                                                className={`text-xs mt-1 ${result.supported ? "text-emerald-700" : "text-red-700"
                                                    }`}
                                            >
                                                Modelo: {selectedModel}
                                            </p>
                                        )}
                                        {result.note && (
                                            <div className="mt-2 flex items-start gap-1.5">
                                                <Info size={12} className="mt-0.5 shrink-0 opacity-60" />
                                                <p
                                                    className={`text-xs ${result.supported ? "text-emerald-700" : "text-red-700"
                                                        }`}
                                                >
                                                    {result.note}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Supported brands strip */}
                        <div className="pt-3 border-t border-[var(--color-border)]">
                            <p className="text-[10px] text-[var(--color-text-dim)] uppercase tracking-wider mb-2">
                                Marcas suportadas
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {brands.map((b) => (
                                    <button
                                        key={b}
                                        onClick={() => {
                                            setSelectedBrand(b);
                                            setSelectedModel("");
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selectedBrand === b
                                                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                                : "bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                                            }`}
                                    >
                                        {b}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Trust note */}
                        <div className="flex items-center gap-2 text-xs text-[var(--color-text-dim)]">
                            <Shield size={12} />
                            <span>
                                Dados de compatibilidade verificados em laboratório. Em caso de dúvida,
                                consulte nosso suporte técnico.
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
