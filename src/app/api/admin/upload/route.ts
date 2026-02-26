import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const files = formData.getAll("files") as File[];

        if (!files.length) {
            return NextResponse.json(
                { error: "Nenhum arquivo enviado" },
                { status: 400 }
            );
        }

        const uploadedUrls: string[] = [];

        for (const file of files) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                return NextResponse.json(
                    { error: `Arquivo "${file.name}" não é uma imagem válida` },
                    { status: 400 }
                );
            }

            // Max 5MB per file
            if (file.size > 5 * 1024 * 1024) {
                return NextResponse.json(
                    { error: `Arquivo "${file.name}" excede o limite de 5MB` },
                    { status: 400 }
                );
            }

            const timestamp = Date.now();
            const safeName = file.name
                .replace(/[^a-zA-Z0-9.-]/g, "_")
                .toLowerCase();
            const pathname = `products/${timestamp}-${safeName}`;

            const blob = await put(pathname, file, {
                access: "public",
            });

            uploadedUrls.push(blob.url);
        }

        return NextResponse.json({ urls: uploadedUrls });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Erro ao fazer upload" },
            { status: 500 }
        );
    }
}
