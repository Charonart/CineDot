'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { StarShopProduct } from '../types/star-shop.types';

interface StarShopProductCardProps {
  product: StarShopProduct;
  onAddToCart: (product: StarShopProduct) => void;
  onQuickBuy: (product: StarShopProduct) => void;
}

export const StarShopProductCard: React.FC<StarShopProductCardProps> = ({
  product,
  onAddToCart,
  onQuickBuy,
}) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/star-shop/${product.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      className="w-full bg-white rounded-3xl p-4 border border-gray-100 shadow-xs hover:shadow-xl transition-all flex flex-col gap-3 group cursor-pointer"
    >
      {/* Product Image Box */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-900 shadow-xs">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center z-10 pointer-events-none">
          {product.badge && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase shadow-sm ${
                product.badge === 'LIMITED'
                  ? 'bg-amber-500 text-white'
                  : product.badge === 'BESTSELLER'
                  ? 'bg-rose-500 text-white'
                  : 'bg-[#7C6FE8] text-white'
              }`}
            >
              {product.badge}
            </span>
          )}

          {product.discountPercent && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold shadow-sm">
              -{product.discountPercent}%
            </span>
          )}
        </div>

        {/* Direct Navigation Button */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-3 z-20">
          <span className="px-4 py-2 rounded-full bg-white/90 hover:bg-white text-slate-900 font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-transform transform hover:scale-105">
            <Eye className="w-3.5 h-3.5" />
            <span>Xem Chi Tiết</span>
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1 px-1 flex-1">
        <span className="text-[10px] font-extrabold text-[#7C6FE8] uppercase tracking-wider">
          {product.categoryName}
        </span>

        <h3 className="font-extrabold text-xs sm:text-sm text-slate-800 group-hover:text-[#7C6FE8] transition-colors line-clamp-2 leading-snug">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 text-amber-500 font-extrabold text-[11px] mt-0.5">
          <Star className="w-3 h-3 fill-amber-400" />
          <span>{product.rating}</span>
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-sm sm:text-base font-extrabold text-[#7C6FE8]">
            {product.price.toLocaleString('vi-VN')}đ
          </span>
          {product.originalPrice && (
            <span className="text-xs font-semibold text-slate-400 line-through">
              {product.originalPrice.toLocaleString('vi-VN')}đ
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onAddToCart(product)}
          className="py-2 px-2 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-[#7C6FE8] text-slate-700 font-extrabold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
          title="Thêm vào giỏ hàng"
        >
          <span className="text-sm font-black text-slate-700 group-hover:text-[#7C6FE8]">+</span>
          <ShoppingCart className="w-4 h-4" />
        </button>

        <button
          onClick={() => onQuickBuy(product)}
          className="py-2 px-2 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
        >
          <span>MUA NGAY</span>
        </button>
      </div>
    </motion.div>
  );
};
