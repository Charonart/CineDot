'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, ArrowRight, Plus, Minus, ExternalLink } from 'lucide-react';
import { CartItem, StarShopProduct } from '../types/star-shop.types';

interface StarShopCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalPrice: number;
  onUpdateQuantity: (product: StarShopProduct, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export const StarShopCartDrawer: React.FC<StarShopCartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  totalPrice,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex justify-end pointer-events-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Slide-over Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 p-6 overflow-hidden selection:bg-[#7C6FE8] selection:text-white"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 font-extrabold text-lg text-slate-800">
                <ShoppingBag className="w-5 h-5 text-[#7C6FE8]" />
                <span>Giỏ Hàng Star Shop ({cartItems.length})</span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Items List */}
            <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-400 py-12">
                  <ShoppingBag className="w-12 h-12 stroke-[1.5] text-slate-300" />
                  <p className="text-sm font-semibold">Giỏ hàng của bạn đang trống</p>
                </div>
              ) : (
                cartItems.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-gray-100 flex items-center gap-3"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex flex-col flex-1 gap-1">
                      <h4 className="font-extrabold text-xs text-slate-800 line-clamp-1">
                        {product.name}
                      </h4>
                      <span className="font-extrabold text-xs text-[#7C6FE8]">
                        {(product.price * quantity).toLocaleString('vi-VN')}đ
                      </span>

                      {/* Quantity Selector Bar */}
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                          <button
                            onClick={() => onUpdateQuantity(product, -1)}
                            className="p-1 hover:bg-slate-100 text-slate-600 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-800">
                            {quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(product, 1)}
                            className="p-1 hover:bg-slate-100 text-slate-600 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      title="Xóa sản phẩm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer & Checkout */}
            {cartItems.length > 0 && (
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                    Tổng Tiền Star Shop
                  </span>
                  <span className="text-xl font-extrabold text-[#7C6FE8]">
                    {totalPrice.toLocaleString('vi-VN')}đ
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={onCheckout}
                    className="w-full py-3.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#7C6FE8]/30 transition-all cursor-pointer"
                  >
                    <span>THANH TOÁN NHANH</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <Link href="/star-shop/cart" onClick={onClose}>
                    <button className="w-full py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Xem Giỏ Hàng Đầy Đủ</span>
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
