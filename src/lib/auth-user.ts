import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { authSecret } from "@/lib/auth-secret";
import prisma from "@/lib/prisma";

type AuthToken = {
    id?: string;
    role?: string;
};

export async function getAuthenticatedUser(request: NextRequest) {
    const token = (await getToken({
        req: request,
        secret: authSecret,
    })) as AuthToken | null;

    if (!token?.id) return null;

    const user = await prisma.user.findUnique({
        where: { id: token.id },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            cnpj: true,
            addresses: {
                orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
            },
            orders: {
                select: { id: true },
                take: 1,
            },
        },
    });

    return user;
}

