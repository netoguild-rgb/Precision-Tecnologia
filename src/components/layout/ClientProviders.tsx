"use client";

import { SessionProvider } from "next-auth/react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SalesAssistantWidget } from "@/components/chat/SalesAssistantWidget";

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
            <CartDrawer />
            <SalesAssistantWidget />
        </SessionProvider>
    );
}
