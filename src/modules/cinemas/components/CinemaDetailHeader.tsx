'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, ExternalLink, Calendar } from 'lucide-react';
import Link from 'next/link';
import { CinemaItem } from '../types/cinemas.types';

interface CinemaDetailHeaderProps {
  cinema: CinemaItem;
}

export const CinemaDetailHeader: React.FC<CinemaDetailHeaderProps> = ({ cinema }) => {
  return (
    <motion.div
      key={cinema.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full flex flex-col gap-6"
    >
      {/* Lobby Banner Container */}
      <div className="relative w-full h-[280px] sm:h-[340px] rounded-3xl overflow-hidden shadow-xl border border-gray-100 group">
        <img
          src={cinema.bannerUrl}
          alt={cinema.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Floating Glass Info Badge */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="flex flex-col gap-2 max-w-xl">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md text-white">
              {cinema.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium line-clamp-2 leading-relaxed">
              {cinema.description}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href={`/movies?tab=now-showing`}>
              <button className="px-5 py-2.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#7C6FE8]/40 transition-all cursor-pointer">
                <Calendar className="w-4 h-4" />
                <span>Xem Lịch Chiếu</span>
              </button>
            </Link>

            <a
              href={cinema.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs flex items-center gap-1.5 transition-colors border border-white/30"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Xem Bản Đồ</span>
            </a>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="w-full p-5 rounded-2xl bg-slate-50 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7C6FE8]/10 text-[#7C6FE8] flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Địa chỉ rạp
            </span>
            <span className="text-xs font-extrabold text-slate-800 leading-snug">
              {cinema.address}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 sm:border-l sm:border-gray-200 sm:pl-6">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Hotline hỗ trợ
            </span>
            <span className="text-xs font-extrabold text-[#7C6FE8]">
              {cinema.phone}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
