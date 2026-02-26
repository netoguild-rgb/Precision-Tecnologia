import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "./catalog";

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isDrawerOpen: boolean;
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    openDrawer: () => void;
    closeDrawer: () => void;
    toggleDrawer: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isDrawerOpen: false,

            addItem: (product: Product, quantity: number = 1) => {
                const { items } = get();
                const existing = items.find((item) => item.product.id === product.id);

                if (existing) {
                    set({
                        items: items.map((item) =>
                            item.product.id === product.id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        ),
                        isDrawerOpen: true,
                    });
                } else {
                    set({
                        items: [...items, { product, quantity }],
                        isDrawerOpen: true,
                    });
                }
            },

            removeItem: (productId: string) => {
                set({ items: get().items.filter((item) => item.product.id !== productId) });
            },

            updateQuantity: (productId: string, quantity: number) => {
                if (quantity < 1) return;
                set({
                    items: get().items.map((item) =>
                        item.product.id === productId ? { ...item, quantity } : item
                    ),
                });
            },

            clearCart: () => set({ items: [] }),

            openDrawer: () => set({ isDrawerOpen: true }),
            closeDrawer: () => set({ isDrawerOpen: false }),
            toggleDrawer: () => set({ isDrawerOpen: !get().isDrawerOpen }),
        }),
        {
            name: "precision-cart",
            partialize: (state) => ({ items: state.items }),
        }
    )
);

// Helper selectors
export const cartTotalItems = (state: CartState) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0);

export const cartTotalPrice = (state: CartState) =>
    state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
