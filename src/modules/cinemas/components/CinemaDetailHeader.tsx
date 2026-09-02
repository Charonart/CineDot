'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Calendar,
  Clock,
  Copy,
  Check,
  Navigation,
  Car,
  Tv,
} from 'lucide-react';
import { CinemaItem } from '../types/cinemas.types';

interface CinemaDetailHeaderProps {
  cinema: CinemaItem;
  onSelectTab?: (tab: string) => void;
}

export const CinemaDetailHeader: React.FC<CinemaDetailHeaderProps> = ({
  cinema,
  onSelectTab,
}) => {
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(cinema.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <motion.section
      key={cinema.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col gap-4"
    >
      {/* 1. Full-Width Architectural Showcase Banner */}
      <div className="relative w-full h-[280px] sm:h-[340px] rounded-3xl overflow-hidden border border-slate-200/90 shadow-md group bg-slate-950">
        <img
          src={cinema.bannerUrl}
          alt={cinema.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        <div className="absolute inset-0 bg-radial-at-t from-transparent via-transparent to-slate-950/40" />

        {/* Top Meta Badges */}
        <div className="absolute top-5 left-5 right-5 flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-extrabold tracking-wider uppercase shadow-xs">
              {cinema.city}
            </span>
            <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-[11px] font-bold items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Đang mở cửa</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/15 text-slate-300 text-xs font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>08:00 – 24:00</span>
            </span>
          </div>
        </div>

        {/* Bottom Banner Content Dock */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight drop-shadow-xs">
              {cinema.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium line-clamp-2 leading-relaxed max-w-xl">
              {cinema.description}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => onSelectTab && onSelectTab('showtimes')}
              className="px-5 py-2.5 rounded-xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#7C6FE8]/30 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Calendar className="w-4 h-4" />
              <span>Xem Lịch Chiếu</span>
            </button>

            <a
              href={cinema.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-xs flex items-center gap-2 transition-all border border-white/25 hover:border-white/40 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Chỉ Đường</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Facility Specification Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Address Card */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3 group hover:border-[#7C6FE8]/40 transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#EEECFB] text-[#7C6FE8] flex items-center justify-center shrink-0">
              <MapPin className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Địa chỉ
              </span>
              <span className="text-xs font-bold text-slate-800 truncate leading-snug">
                {cinema.address}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyAddress}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#7C6FE8] hover:bg-[#EEECFB] transition-colors shrink-0 cursor-pointer"
            title="Sao chép địa chỉ"
          >
            {copiedAddress ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Hotline Contact Card */}
        <a
          href={`tel:${cinema.phone.replace(/\s+/g, '')}`}
          className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5 group hover:border-[#7C6FE8]/40 transition-colors cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#EEECFB] text-[#7C6FE8] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Phone className="w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Hotline
            </span>
            <span className="text-xs font-extrabold text-slate-900 group-hover:text-[#7C6FE8] transition-colors">
              {cinema.phone}
            </span>
          </div>
        </a>

        {/* Screening Tech */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Tv className="w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Công nghệ chiếu
            </span>
            <span className="text-xs font-bold text-slate-800 truncate leading-snug">
              Laser 4K • Dolby Atmos
            </span>
          </div>
        </div>

        {/* Parking */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Car className="w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Bãi đỗ xe
            </span>
            <span className="text-xs font-bold text-slate-800 leading-snug truncate">
              Hầm gửi xe ô tô & xe máy
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
