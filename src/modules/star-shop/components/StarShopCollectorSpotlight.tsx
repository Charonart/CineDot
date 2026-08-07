'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles, ShoppingBag, CheckCircle2, Gift } from 'lucide-react';
import { StarShopProduct } from '../types/star-shop.types';

interface StarShopCollectorSpotlightProps {
  onQuickBuy: (product: StarShopProduct) => void;
}

export const StarShopCollectorSpotlight: React.FC<StarShopCollectorSpotlightProps> = ({
  onQuickBuy,
}) => {
  const spotlightProduct: StarShopProduct = {
    id: 'sp-1',
    slug: 'hot-toys-spiderman-1-6',
    name: 'Mô Hình Người Nhện Hot Toys 1:6 Limited Edition',
    category: 'FIGURINE',
    categoryName: 'Mô Hình / Figurine',
    price: 4500000,
    originalPrice: 5200000,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&auto=format&fit=crop&q=80',
    badge: 'LIMITED',
    discountPercent: 13,
    description:
      'Tuyệt tác mô hình tỉ lệ 1:6 với 30 điểm khớp động linh hoạt, trang phục vải thật thêu sợi ánh kim độc quyền từ Hot Toys Studios. Chân đế phát sáng LED đổi màu cảm ứng và giấy chứng nhận sở hữu số seri độc bản từ CineDot.',
    stock: 15,
  };

  return (
    <div className="w-full bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(124,111,232,0.12)] border border-purple-100 mb-12 relative overflow-hidden group">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column: 4K Product Photo (lg:col-span-6) */}
        <div className="lg:col-span-6 relative aspect-square w-full rounded-2xl overflow-hidden shadow-md bg-slate-900 border border-gray-100">
          <img
            src={spotlightProduct.imageUrl}
            alt={spotlightProduct.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-500 text-white font-extrabold text-xs uppercase flex items-center gap-1.5 shadow-md">
            <Crown className="w-3.5 h-3.5 fill-white" />
            <span>BẢO VẬT SƯU TẦM LIMITED</span>
          </div>
        </div>

        {/* Right Column: Light Mode High-Converting Copywriting (lg:col-span-6) */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          <div className="flex items-center gap-2 text-[#7C6FE8] font-extrabold text-xs">
            <Sparkles className="w-4 h-4 fill-[#7C6FE8]" />
            <span>BẢN QUYỀN CHÍNH HÃNG MARVEL STUDIOS</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-[#131413]">
            {spotlightProduct.name}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            {spotlightProduct.description}
          </p>

          {/* Pricing & Stock Callout */}
          <div className="flex flex-col gap-2 py-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Giá niêm yết độc quyền CineDot
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#7C6FE8]">
                {spotlightProduct.price.toLocaleString('vi-VN')}đ
              </span>
              <span className="text-sm font-semibold text-slate-400 line-through">
                {spotlightProduct.originalPrice?.toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>

          {/* Capitalist Buyer Incentives Badges */}
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Chỉ còn duy nhất {spotlightProduct.stock} bản tại Việt Nam</span>
            </span>

            <span className="text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-amber-600" />
              <span>Tặng Hộp quà Collector Box + 1.000 StarPoints</span>
            </span>
          </div>

          <button
            onClick={() => onQuickBuy(spotlightProduct)}
            className="w-full sm:w-fit px-8 py-4 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#7C6FE8]/35 transition-all cursor-pointer transform hover:scale-105 mt-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>SỞ HỮU BẢO VẬT NGAY</span>
          </button>
        </div>
      </div>
    </div>
  );
};
