"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, GripVertical, ImageIcon } from "lucide-react";

interface ImageItem {
    url: string;
    alt?: string;
}

interface ImageUploaderProps {
    images: ImageItem[];
    onChange: (images: ImageItem[]) => void;
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleFiles(files: FileList | null) {
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append("files", files[i]);
            }

            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.error || "Erro ao fazer upload");
                return;
            }

            const data = await res.json();
            const newImages: ImageItem[] = data.urls.map((url: string) => ({
                url,
                alt: "",
            }));
            onChange([...images, ...newImages]);
        } catch {
            alert("Erro ao fazer upload das imagens");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
    }

    function removeImage(index: number) {
        const updated = images.filter((_, i) => i !== index);
        onChange(updated);
    }

    function moveImage(from: number, to: number) {
        if (to < 0 || to >= images.length) return;
        const updated = [...images];
        const [moved] = updated.splice(from, 1);
        updated.splice(to, 0, moved);
        onChange(updated);
    }

    return (
        <div className="space-y-3">
            {/* Drop zone */}
            <div
                className={`admin-dropzone ${dragOver ? "admin-dropzone-active" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                />
                {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                        <div className="admin-spinner" />
                        <p className="text-sm text-[var(--color-text-muted)]">Enviando...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-elevated)] flex items-center justify-center">
                            <Upload size={20} className="text-[var(--color-primary)]" />
                        </div>
                        <p className="text-sm font-medium text-[var(--color-text)]">
                            Arraste imagens aqui ou clique para selecionar
                        </p>
                        <p className="text-xs text-[var(--color-text-dim)]">
                            PNG, JPG, WebP • Máx. 5MB por arquivo
                        </p>
                    </div>
                )}
            </div>

            {/* Preview grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {images.map((img, i) => (
                        <div
                            key={img.url}
                            className="relative group rounded-xl border border-[var(--color-border)] overflow-hidden bg-white"
                        >
                            <div className="aspect-square relative">
                                <Image
                                    src={img.url}
                                    alt={img.alt || "Produto"}
                                    fill
                                    className="object-contain p-2"
                                    sizes="150px"
                                />
                            </div>

                            {/* Controls overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-start justify-between p-1.5 opacity-0 group-hover:opacity-100">
                                <div className="flex flex-col gap-1">
                                    {i > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => moveImage(i, i - 1)}
                                            className="w-6 h-6 rounded bg-white/90 flex items-center justify-center text-xs hover:bg-white"
                                        >
                                            ↑
                                        </button>
                                    )}
                                    {i < images.length - 1 && (
                                        <button
                                            type="button"
                                            onClick={() => moveImage(i, i + 1)}
                                            className="w-6 h-6 rounded bg-white/90 flex items-center justify-center text-xs hover:bg-white"
                                        >
                                            ↓
                                        </button>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="w-6 h-6 rounded bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            {/* Primary badge */}
                            {i === 0 && (
                                <div className="absolute bottom-0 left-0 right-0 bg-[var(--color-primary)] text-white text-[10px] text-center py-0.5 font-medium">
                                    Principal
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {images.length === 0 && (
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-dim)]">
                    <ImageIcon size={14} />
                    Nenhuma imagem adicionada
                </div>
            )}
        </div>
    );
}
