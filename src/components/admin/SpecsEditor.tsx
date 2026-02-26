"use client";

import { Plus, Trash2 } from "lucide-react";

interface SpecItem {
    label: string;
    value: string;
    group?: string;
}

interface SpecsEditorProps {
    specs: SpecItem[];
    onChange: (specs: SpecItem[]) => void;
}

export function SpecsEditor({ specs, onChange }: SpecsEditorProps) {
    function addSpec() {
        onChange([...specs, { label: "", value: "", group: "" }]);
    }

    function updateSpec(index: number, field: keyof SpecItem, val: string) {
        const updated = specs.map((spec, i) =>
            i === index ? { ...spec, [field]: val } : spec
        );
        onChange(updated);
    }

    function removeSpec(index: number) {
        onChange(specs.filter((_, i) => i !== index));
    }

    return (
        <div className="space-y-3">
            {specs.map((spec, i) => (
                <div key={i} className="flex items-start gap-2">
                    <input
                        type="text"
                        placeholder="Grupo (ex: Rede)"
                        value={spec.group || ""}
                        onChange={(e) => updateSpec(i, "group", e.target.value)}
                        className="admin-input w-28 text-xs"
                    />
                    <input
                        type="text"
                        placeholder="Nome (ex: Portas)"
                        value={spec.label}
                        onChange={(e) => updateSpec(i, "label", e.target.value)}
                        className="admin-input flex-1"
                    />
                    <input
                        type="text"
                        placeholder="Valor (ex: 48x GE)"
                        value={spec.value}
                        onChange={(e) => updateSpec(i, "value", e.target.value)}
                        className="admin-input flex-1"
                    />
                    <button
                        type="button"
                        onClick={() => removeSpec(i)}
                        className="p-2 text-[var(--color-danger)] hover:bg-red-50 rounded-lg shrink-0"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={addSpec}
                className="flex items-center gap-2 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
                <Plus size={16} />
                Adicionar Especificação
            </button>
        </div>
    );
}
