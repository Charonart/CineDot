'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Building2, Users, Tv, ShieldCheck } from 'lucide-react';

export const HomeAboutShowcase: React.FC = () => {
  return (
    <section className="w-full py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-full bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl grid grid-cols-1 lg:grid-cols-12 items-center gap-8 relative overflow-hidden"
      >
        {/* Glowing Ambient Bulbs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#7C6FE8]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Left Column: Text Details (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-4 relative z-10">
          <span className="px-3.5 py-1.5 rounded-full bg-white/15 text-amber-300 font-extrabold text-xs uppercase tracking-wider w-fit flex items-center gap-1.5 backdrop-blur-md border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>VỀ THƯƠNG HIỆU CINEDOT</span>
          </span>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            CineDot — Khởi Nguồn Đam Mê Điện Ảnh
          </h2>

          <p className="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed max-w-2xl">
            CineDot tự hào là hệ thống rạp chiếu phim chuẩn quốc tế hàng đầu Việt Nam. Nơi tiên phong công nghệ <strong className="text-amber-300">IMAX 12-Channel Laser</strong>, không gian sảnh <strong className="text-amber-300">Lounge 5 sao</strong> và hệ thống cửa hàng <strong className="text-amber-300">Star Shop Gourmet</strong>.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/15 my-1">
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black text-amber-400">50+</span>
              <span className="text-[11px] font-semibold text-purple-200">Cụm rạp toàn quốc</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black text-amber-400">10M+</span>
              <span className="text-[11px] font-semibold text-purple-200">Lượt khách hàng</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black text-amber-400">IMAX 4K</span>
              <span className="text-[11px] font-semibold text-purple-200">Chuẩn Hollywood</span>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/about">
              <button className="px-6 py-3.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#7C6FE8]/30 transition-all cursor-pointer">
                <span>TÌM HIỂU THÊM VỀ CINEDOT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>

        {/* Right Column: Image Preview Card (lg:col-span-5) */}
        <div className="lg:col-span-5 relative aspect-video lg:aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-800 border border-white/20 shadow-md group">
          <img
            src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80"
            alt="CineDot Cinema Lobby"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-4 flex flex-col justify-end text-white">
            <span className="text-[10px] font-extrabold text-amber-300 uppercase">
              KHÔNG GIAN KIẾN TRÚC ĐỘC BẢN
            </span>
            <span className="text-xs font-bold text-slate-100">
              Phòng Chiếu Màn Cong Khổng Lồ 22m IMAX Laser 3D
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
