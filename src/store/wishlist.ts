import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  items: string[];
  toggleItem: (productId: string) => void;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (productId) => {
        const { items } = get();
        if (items.includes(productId)) {
          set({ items: items.filter((id) => id !== productId) });
        } else {
          set({ items: [...items, productId] });
        }
      },
      addItem: (productId) => {
        const { items } = get();
        if (!items.includes(productId)) {
          set({ items: [...items, productId] });
        }
      },
      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter((id) => id !== productId) }));
      },
      isInWishlist: (productId) => get().items.includes(productId),
    }),
    { name: "wishlist-storage" }
  )
);
