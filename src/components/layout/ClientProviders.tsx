"use client";

import { SessionProvider } from "next-auth/react";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
            <CartDrawer />
        </SessionProvider>
    );
}
