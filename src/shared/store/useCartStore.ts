import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StarShopProduct } from '@/modules/star-shop/types/star-shop.types';

export interface StarShopCartItem {
  product: StarShopProduct;
  quantity: number;
}

interface CartStoreState {
  items: Record<string, StarShopCartItem>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  toggleCart: () => void;
  addToCart: (product: StarShopProduct, quantityDelta?: number) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getTotalCount: () => number;
  getTotalPrice: () => number;
  getCartItemList: () => StarShopCartItem[];
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: {},
      isCartOpen: false,
      setIsCartOpen: (open) => set({ isCartOpen: open }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      addToCart: (product, quantityDelta = 1) => {
        set((state) => {
          const current = state.items[product.id]?.quantity || 0;
          const next = Math.max(0, current + quantityDelta);
          const newItems = { ...state.items };
          if (next > 0) {
            newItems[product.id] = { product, quantity: next };
          } else {
            delete newItems[product.id];
          }
          return { items: newItems };
        });
      },
      updateQuantity: (productId, delta) => {
        set((state) => {
          const existing = state.items[productId];
          if (!existing) return state;
          const next = Math.max(0, existing.quantity + delta);
          const newItems = { ...state.items };
          if (next > 0) {
            newItems[productId] = { ...existing, quantity: next };
          } else {
            delete newItems[productId];
          }
          return { items: newItems };
        });
      },
      removeFromCart: (productId) => {
        set((state) => {
          const newItems = { ...state.items };
          delete newItems[productId];
          return { items: newItems };
        });
      },
      clearCart: () => set({ items: {}, isCartOpen: false }),
      getTotalCount: () => {
        return Object.values(get().items).reduce((sum, item) => sum + item.quantity, 0);
      },
      getTotalPrice: () => {
        return Object.values(get().items).reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },
      getCartItemList: () => {
        return Object.values(get().items);
      },
    }),
    {
      name: 'cinedot_star_shop_cart',
    }
  )
);
