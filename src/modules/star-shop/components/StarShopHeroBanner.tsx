'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShoppingBag, Gift } from 'lucide-react';

export const StarShopHeroBanner: React.FC = () => {
  return (
    <div className="relative w-full h-[360px] sm:h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex items-center p-6 sm:p-12 mb-10 group">
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1600&auto=format&fit=crop&q=80"
        alt="Star Shop Merchandise Banner"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col gap-4 max-w-xl text-white"
      >
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#7C6FE8] text-white text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>CỬA HÀNG VẬT PHẨM ĐIỆN ẢNH STAR SHOP</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
          Bảo Vật Điện Ảnh Limited Edition
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
          Sở hữu ngay mô hình Hot Toys 1:6, cốc đổi màu Venom heat-changing và dải quà tặng độc quyền chính hãng dành riêng cho tín đồ CineDot.
        </p>

        {/* Promo Badge Callout */}
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs font-bold w-fit">
          <Gift className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Ưu đãi đặc biệt: GIẢM NGAY 20% khi mua kèm Vé Xem Phim CineDot!</span>
        </div>
      </motion.div>
    </div>
  );
};
