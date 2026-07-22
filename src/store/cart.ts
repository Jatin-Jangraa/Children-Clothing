import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ICartItem, ICoupon } from "@/types";

interface CartState {
  items: ICartItem[];
  isOpen: boolean;
  coupon: ICoupon | null;
  addItem: (item: ICartItem) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyCoupon: (coupon: ICoupon) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getShipping: () => number;
  getGst: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      coupon: null,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.product._id === item.product._id && i.size === item.size && i.color === item.color
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product._id === item.product._id && i.size === item.size && i.color === item.color
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (productId, size, color) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.product._id === productId && i.size === size && i.color === color)
          ),
        })),

      updateQuantity: (productId, size, color, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (i) => !(i.product._id === productId && i.size === size && i.color === color)
                )
              : state.items.map((i) =>
                  i.product._id === productId && i.size === size && i.color === color
                    ? { ...i, quantity }
                    : i
                ),
        })),

      clearCart: () => set({ items: [], coupon: null }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      },

      getDiscount: () => {
        const { coupon } = get();
        const subtotal = get().getSubtotal();
        if (!coupon) return 0;
        if (coupon.discountType === "percentage") {
          const discount = (subtotal * coupon.discountValue) / 100;
          return coupon.maximumDiscount > 0 ? Math.min(discount, coupon.maximumDiscount) : discount;
        }
        return coupon.discountValue;
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        return subtotal >= 999 ? 0 : 99;
      },

      getGst: () => {
        const subtotal = get().getSubtotal() - get().getDiscount();
        return Math.round(subtotal * 0.12);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const shipping = get().getShipping();
        const gst = get().getGst();
        return Math.round(subtotal - discount + shipping + gst);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
