'use client';

import { useState, useEffect, useMemo } from 'react';
import { StarShopProduct, StarShopCategory, CartItem } from '../types/star-shop.types';
import { fetchStarShopProducts } from '../services/star-shop.service';
import { useAuthStore } from '@/shared/store/useAuthStore';

export function useStarShop() {
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const [products, setProducts] = useState<StarShopProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState<StarShopCategory>('ALL');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<StarShopProduct | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch products by category
  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      setLoading(true);
      try {
        const data = await fetchStarShopProducts(activeCategory);
        if (isMounted) setProducts(data);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, [activeCategory]);

  // Cart operations
  const addToCart = (product: StarShopProduct, quantityDelta: number = 1) => {
    setCart((prev) => {
      const current = prev[product.id] || 0;
      return { ...prev, [product.id]: Math.max(0, current + quantityDelta) };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const cartItems = useMemo<CartItem[]>(() => {
    return products
      .filter((p) => (cart[p.id] || 0) > 0)
      .map((p) => ({ product: p, quantity: cart[p.id] || 0 }));
  }, [products, cart]);

  const totalCartCount = useMemo(() => {
    return Object.values(cart).reduce((sum, q) => sum + q, 0);
  }, [cart]);

  const totalCartPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      openAuthModal('login', 'Vui lòng đăng nhập để tiến hành thanh toán đơn hàng Star Shop');
      return;
    }
    alert(`Xác nhận thanh toán đơn hàng Star Shop thành công! Tổng tiền: ${totalCartPrice.toLocaleString('vi-VN')}đ`);
    setCart({});
    setIsCartOpen(false);
  };

  return {
    products,
    activeCategory,
    setActiveCategory,
    cart,
    addToCart,
    removeFromCart,
    cartItems,
    totalCartCount,
    totalCartPrice,
    isCartOpen,
    setIsCartOpen,
    selectedProduct,
    setSelectedProduct,
    handleCheckout,
    loading,
  };
}
