"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useSession } from "next-auth/react";
import { ICartItem, IProduct } from "@/types";

interface CartStore {
  items: ICartItem[];
  addItem: (product: IProduct, size: string, color?: string, quantity?: number) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
}

function buildStore(key: string) {
  return create<CartStore>()(
    persist(
      (set, get) => ({
        items: [],

        addItem: (product, size, color, quantity = 1) => {
          set((state) => {
            const existing = state.items.find(
              (i) => i.product._id === product._id && i.size === size
            );
            if (existing) {
              return {
                items: state.items.map((i) =>
                  i.product._id === product._id && i.size === size
                    ? { ...i, quantity: i.quantity + quantity }
                    : i
                ),
              };
            }
            return { items: [...state.items, { product, size, color, quantity }] };
          });
        },

        removeItem: (productId, size) => {
          set((state) => ({
            items: state.items.filter(
              (i) => !(i.product._id === productId && i.size === size)
            ),
          }));
        },

        updateQuantity: (productId, size, quantity) => {
          if (quantity < 1) {
            get().removeItem(productId, size);
            return;
          }
          set((state) => ({
            items: state.items.map((i) =>
              i.product._id === productId && i.size === size ? { ...i, quantity } : i
            ),
          }));
        },

        clearCart: () => set({ items: [] }),

        getSubtotal: () =>
          get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

        getTotalItems: () =>
          get().items.reduce((sum, i) => sum + i.quantity, 0),
      }),
      {
        name: key,
        storage: createJSONStorage(() => localStorage),
      }
    )
  );
}

const storeCache = new Map<string, ReturnType<typeof buildStore>>();

function getStore(userId: string | null | undefined) {
  const key = userId ? `5thjohnson-cart-${userId}` : "5thjohnson-cart-guest";
  if (!storeCache.has(key)) {
    storeCache.set(key, buildStore(key));
  }
  return storeCache.get(key)!;
}

export function useCartStore(): CartStore;
export function useCartStore<T>(selector: (s: CartStore) => T): T;
export function useCartStore<T>(selector?: (s: CartStore) => T): T | CartStore {
  const { data: session } = useSession();
  const store = getStore(session?.user?.id);
  return selector ? store(selector) : store((s) => s as unknown as T) as unknown as CartStore;
}
