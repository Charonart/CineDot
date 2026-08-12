'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Building2, Users, Tv } from 'lucide-react';
import { MOCK_ABOUT_STATS } from '../mocks/mockAboutData';

export const AboutHero: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-br from-[#F1EDFF] via-[#E8E3FF]/70 to-white border border-[#7C6FE8]/30 rounded-3xl p-8 sm:p-14 text-slate-900 shadow-[0_20px_60px_rgba(124,111,232,0.16)] mb-16 relative overflow-hidden">
      {/* Decorative Glow Background */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#7C6FE8]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl flex flex-col gap-5 relative z-10">
        <span className="px-3.5 py-1.5 rounded-full bg-white text-[#7C6FE8] font-extrabold text-xs uppercase tracking-wider w-fit flex items-center gap-1.5 border border-[#7C6FE8]/30 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#7C6FE8]" />
          <span>VỀ CHÚNG TÔI • THƯƠNG HIỆU RẠP PHIM IMAX</span>
        </span>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          CineDot — Khởi Nguồn Đam Mê Điện Ảnh
        </h1>

        <p className="text-sm sm:text-lg text-slate-700 font-medium leading-relaxed max-w-3xl">
          Hệ thống rạp chiếu phim cao cấp hàng đầu Việt Nam, mang đến trải nghiệm thị giác và thính giác vượt đỉnh với công nghệ trình chiếu chuẩn Hollywood và dịch vụ khách hàng 5 sao.
        </p>

        {/* 3 Stat Counters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#7C6FE8]/20 mt-4">
          {MOCK_ABOUT_STATS.map((stat, idx) => (
            <div key={idx} className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-[#7C6FE8]/25 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#7C6FE8]/15 text-[#7C6FE8] flex items-center justify-center shrink-0 font-black">
                {stat.icon === 'Building2' && <Building2 className="w-5 h-5" />}
                {stat.icon === 'Users' && <Users className="w-5 h-5" />}
                {stat.icon === 'Tv' && <Tv className="w-5 h-5" />}
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-slate-900 leading-none">{stat.value}</span>
                <span className="text-xs font-bold text-slate-600 mt-1">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
