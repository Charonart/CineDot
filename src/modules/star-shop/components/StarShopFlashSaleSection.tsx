'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, ArrowRight } from 'lucide-react';

interface StarShopFlashSaleSectionProps {
  onExploreClick: () => void;
}

export const StarShopFlashSaleSection: React.FC<StarShopFlashSaleSectionProps> = ({
  onExploreClick,
}) => {
  const [timeLeft, setTimeLeft] = useState(13490); // 03h 44m 50s

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="w-full p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-300/40 shadow-xs mb-10 flex flex-col md:flex-row items-center justify-between gap-5">
      {/* Left: Program Name & Badge */}
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/30 shrink-0">
          <Zap className="w-6 h-6 fill-white" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#131413] tracking-tight uppercase">
              FLASH SALE GIỜ VÀNG
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold uppercase">
              GIẢM TỚI 50%
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500">
            Ưu đãi siêu sốc dành riêng cho thành viên CineDot Star Club
          </p>
        </div>
      </div>

      {/* Center: Prominent Large Live Timer Countdown Pills */}
      <div className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-sm border border-amber-200 text-slate-800">
        <Clock className="w-5 h-5 text-amber-500 animate-pulse shrink-0" />
        <span className="text-xs sm:text-sm font-extrabold text-slate-700">Kết thúc trong:</span>
        <div className="flex items-center gap-1.5 font-extrabold text-[#7C6FE8]">
          <span className="bg-gradient-to-b from-[#7C6FE8] to-[#685bc7] text-white px-3 py-1 rounded-xl text-base sm:text-lg font-mono shadow-xs">
            {hours.toString().padStart(2, '0')}
          </span>
          <span className="text-base sm:text-lg font-extrabold text-[#7C6FE8]">:</span>
          <span className="bg-gradient-to-b from-[#7C6FE8] to-[#685bc7] text-white px-3 py-1 rounded-xl text-base sm:text-lg font-mono shadow-xs">
            {minutes.toString().padStart(2, '0')}
          </span>
          <span className="text-base sm:text-lg font-extrabold text-[#7C6FE8]">:</span>
          <span className="bg-gradient-to-b from-[#7C6FE8] to-[#685bc7] text-white px-3 py-1 rounded-xl text-base sm:text-lg font-mono shadow-xs">
            {seconds.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Right: Explore Action Button */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onExploreClick}
        className="w-full md:w-auto px-6 py-3.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#7C6FE8]/30 transition-all cursor-pointer shrink-0"
      >
        <span>SẢN PHẨM KHUYẾN MÃI</span>
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
};
