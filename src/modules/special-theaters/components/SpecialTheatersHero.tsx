'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Film, Volume2, Tv, ShieldCheck } from 'lucide-react';

export const SpecialTheatersHero: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-br from-[#F1EDFF] via-[#E8E3FF]/70 to-white border border-[#7C6FE8]/30 rounded-3xl p-8 sm:p-12 text-slate-900 shadow-[0_20px_60px_rgba(124,111,232,0.16)] mb-12 relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#7C6FE8]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl flex flex-col gap-4 relative z-10">
        <span className="px-3.5 py-1.5 rounded-full bg-white text-[#7C6FE8] font-extrabold text-xs uppercase tracking-wider w-fit flex items-center gap-1.5 border border-[#7C6FE8]/30 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#7C6FE8]" />
          <span>CÔNG NGHỆ PHÒNG CHIẾU CHUẨN HOLLYWOOD</span>
        </span>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Trải Nghiệm Công Nghệ Chiếu Đỉnh Cao Tại CineDot
        </h1>

        <p className="text-xs sm:text-base text-slate-700 font-medium leading-relaxed">
          Thưởng thức điện ảnh trọn vẹn với hệ thống phòng chiếu đỉnh cao: Màn chiếu khổng lồ <strong className="text-[#7C6FE8] font-extrabold">IMAX 12-Channel Laser</strong>, Ghế rung tương tác đa giác quan <strong className="text-[#7C6FE8] font-extrabold">4DX Motion</strong>, Giường nằm da thượng lưu <strong className="text-[#7C6FE8] font-extrabold">Gold Class VIP</strong> và Âm thanh vòm 3D <strong className="text-[#7C6FE8] font-extrabold">Dolby Atmos</strong>.
        </p>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#7C6FE8]/20 text-xs font-bold text-slate-800 mt-2">
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4 text-[#7C6FE8] shrink-0" />
            <span>Màn Cong 22m Dual 4K</span>
          </div>
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#7C6FE8] shrink-0" />
            <span>64 Loa Dolby Atmos</span>
          </div>
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-[#7C6FE8] shrink-0" />
            <span>21 Hiệu Ứng 4DX</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#7C6FE8] shrink-0" />
            <span>Chính Hãng 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
