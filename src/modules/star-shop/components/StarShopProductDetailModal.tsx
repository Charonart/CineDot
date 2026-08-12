'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Star, CheckCircle2, ShieldCheck } from 'lucide-react';
import { StarShopProduct } from '../types/star-shop.types';

interface StarShopProductDetailModalProps {
  product: StarShopProduct | null;
  onClose: () => void;
  onAddToCart: (product: StarShopProduct, quantity: number) => void;
}

export const StarShopProductDetailModal: React.FC<StarShopProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Box Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 border border-gray-100 flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto selection:bg-[#7C6FE8] selection:text-white"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Product Image Showcase */}
          <div className="w-full md:w-1/2 aspect-square rounded-2xl overflow-hidden bg-slate-900 shrink-0 shadow-md">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details Info */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold text-[#7C6FE8] uppercase tracking-wider">
                {product.categoryName}
              </span>
              <h2 className="text-xl font-extrabold text-slate-800 leading-tight">
                {product.name}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-500 font-extrabold text-xs bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{product.rating} / 5.0</span>
              </div>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Còn hàng ({product.stock})</span>
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl font-extrabold text-[#7C6FE8]">
                {product.price.toLocaleString('vi-VN')}đ
              </span>
              {product.originalPrice && (
                <span className="text-sm font-semibold text-slate-400 line-through">
                  {product.originalPrice.toLocaleString('vi-VN')}đ
                </span>
              )}
            </div>

            {/* Quantity Control & Submit */}
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 mt-auto">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-700">Số lượng:</span>
                <div className="flex items-center border border-gray-200 rounded-xl bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 hover:bg-slate-200 text-slate-700 font-bold text-sm cursor-pointer rounded-l-xl"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-extrabold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 hover:bg-slate-200 text-slate-700 font-bold text-sm cursor-pointer rounded-r-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className="w-full py-3.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#7C6FE8]/30 transition-all cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>THÊM VÀO GIỎ HÀNG</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
