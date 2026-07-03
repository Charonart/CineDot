import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItemDTO, CartStateDTO } from '../dto/cart.dto';

interface CartActions {
  addItem: (item: Omit<CartItemDTO, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setPaymentMethod: (method: string) => void;
  setDeliveryInfo: (info: CartStateDTO['deliveryInfo']) => void;
}

type CartStore = CartStateDTO & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      paymentMethod: null,
      deliveryInfo: null,

      addItem: (item) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.productId === item.productId
          );
          
          let newItems = [...state.items];
          const addedQuantity = item.quantity || 1;

          if (existingItemIndex >= 0) {
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              quantity: newItems[existingItemIndex].quantity + addedQuantity,
            };
          } else {
            newItems.push({
              ...item,
              quantity: addedQuantity,
            });
          }

          const totalItems = newItems.reduce((acc, curr) => acc + curr.quantity, 0);
          const totalPrice = newItems.reduce(
            (acc, curr) => acc + curr.price * curr.quantity,
            0
          );

          return { items: newItems, totalItems, totalPrice };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const newItems = state.items.filter((i) => i.productId !== productId);
          
          const totalItems = newItems.reduce((acc, curr) => acc + curr.quantity, 0);
          const totalPrice = newItems.reduce(
            (acc, curr) => acc + curr.price * curr.quantity,
            0
          );

          return { items: newItems, totalItems, totalPrice };
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return state;
          }

          const newItems = state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          );

          const totalItems = newItems.reduce((acc, curr) => acc + curr.quantity, 0);
          const totalPrice = newItems.reduce(
            (acc, curr) => acc + curr.price * curr.quantity,
            0
          );

          return { items: newItems, totalItems, totalPrice };
        });
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 });
      },
      setPaymentMethod: (method) => {
        set({ paymentMethod: method });
      },
      setDeliveryInfo: (info) => {
        set({ deliveryInfo: info });
      },
    }),
    {
      name: 'cinedot-cart-storage',
      // Provide a safe storage wrapper for SSR
      storage: createJSONStorage(() => typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      } as any),
    }
  )
);
