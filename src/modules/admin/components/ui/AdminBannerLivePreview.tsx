'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Film,
  Tv,
  Image as ImageIcon,
  Sparkles,
  Calendar,
  Clock,
  ExternalLink,
  Layers,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { imageHelper } from '@/shared/utils/imageHelper';
import { AdminBackdropBanner } from './AdminBackdropBanner';
import { AdminPosterCard } from './AdminPosterCard';

interface AdminBannerLivePreviewProps {
  title: string;
  originalTitle?: string;
  posterPath?: string;
  backdropPath?: string;
  releaseDate?: string;
  durationMinutes?: number | string;
  adult?: boolean;
  status?: string;
  genres?: string[];
  rating?: number | string;
  className?: string;
}

export function AdminBannerLivePreview({
  title,
  originalTitle,
  posterPath,
  backdropPath,
  releaseDate,
  durationMinutes,
  adult = false,
  status = 'now_showing',
  genres = [],
  rating = 8.5,
  className = '',
}: AdminBannerLivePreviewProps) {
  const [activeTab, setActiveTab] = useState<'hero' | 'backdrop' | 'poster'>('hero');

  // Compute final image URLs
  const cleanedPoster = posterPath?.trim() || '';
  const cleanedBackdrop = backdropPath?.trim() || '';

  const finalPosterUrl = cleanedPoster ? imageHelper.getPosterUrl(cleanedPoster, 'lg') : '';
  const finalBackdropUrl = cleanedBackdrop ? imageHelper.getBackdropUrl(cleanedBackdrop, 'lg') : '';

  const statusLabel =
    status === 'now_showing' || status === 'NOW_SHOWING'
      ? 'Đang Chiếu'
      : status === 'upcoming' || status === 'COMING_SOON'
      ? 'Sắp Chiếu'
      : 'Ngừng Chiếu';

  const statusBg =
    status === 'now_showing' || status === 'NOW_SHOWING'
      ? 'bg-[#7C6FE8]'
      : status === 'upcoming' || status === 'COMING_SOON'
      ? 'bg-amber-500'
      : 'bg-slate-600';

  return (
    <div className={`flex flex-col gap-3 rounded-2xl bg-slate-900/90 border border-purple-500/20 p-4 shadow-xl ${className}`}>
      {/* Header with Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#7C6FE8]/20 border border-[#7C6FE8]/40 flex items-center justify-center text-[#7C6FE8]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-white tracking-wide flex items-center gap-1.5">
              Live Banner & Backdrop Studio
            </span>
            <span className="text-[10px] text-slate-400">Mô phỏng hiển thị trên Website & App</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('hero')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'hero'
                ? 'bg-[#7C6FE8] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Hero Showcase</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('backdrop')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'backdrop'
                ? 'bg-[#7C6FE8] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tv className="w-3 h-3" />
            <span>Backdrop (16:9)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('poster')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'poster'
                ? 'bg-[#7C6FE8] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            <span>Poster (2:3)</span>
          </button>
        </div>
      </div>

      {/* Preview Body */}
      <div className="relative min-h-[220px] rounded-xl overflow-hidden bg-slate-950 flex flex-col justify-center">
        {/* TAB 1: HERO SHOWCASE (Composite simulation) */}
        {activeTab === 'hero' && (
          <div className="relative w-full aspect-[21/9] min-h-[220px] max-h-[280px] overflow-hidden rounded-xl bg-slate-950 border border-white/10 group">
            {/* Background Backdrop Image */}
            <AdminBackdropBanner
              src={finalBackdropUrl || finalPosterUrl}
              alt={title || 'Hero Banner'}
              aspectRatio="custom"
              heightClass="h-full"
              className="absolute inset-0 rounded-none border-0"
              showOverlay={true}
              allowZoom={false}
            />

            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40 z-10 pointer-events-none" />

            {/* Composite Foreground Elements */}
            <div className="absolute inset-0 z-20 p-4 sm:p-5 flex items-center gap-4 sm:gap-6">
              {/* Poster Inset */}
              <div className="shrink-0 shadow-2xl rounded-xl overflow-hidden border border-white/20 transform group-hover:scale-105 transition-transform duration-300">
                <AdminPosterCard
                  src={finalPosterUrl}
                  alt={title}
                  size="sm"
                  adult={adult}
                  className="w-20 h-28 sm:w-24 sm:h-36 shadow-2xl"
                  fallbackText={title}
                />
              </div>

              {/* Movie Meta Information */}
              <div className="flex flex-col gap-1.5 sm:gap-2 max-w-md min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black text-white ${statusBg}`}>
                    {statusLabel}
                  </span>
                  {adult && (
                    <span className="px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[9px] font-black">
                      18+
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-amber-400 bg-black/40 px-2 py-0.5 rounded-md border border-amber-400/20">
                    ★ {rating} TMDB
                  </span>
                </div>

                <h3 className="text-sm sm:text-lg font-black text-white leading-tight line-clamp-1">
                  {title || 'Tên Phim Chưa Đặt'}
                </h3>
                {originalTitle && (
                  <span className="text-[11px] text-slate-400 italic line-clamp-1 -mt-1">
                    {originalTitle}
                  </span>
                )}

                <div className="flex items-center gap-3 text-[10px] text-slate-300 font-semibold mt-1">
                  {durationMinutes && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#7C6FE8]" />
                      <span>{durationMinutes} phút</span>
                    </span>
                  )}
                  {releaseDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#7C6FE8]" />
                      <span>{releaseDate}</span>
                    </span>
                  )}
                </div>

                {genres.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap mt-0.5">
                    {genres.slice(0, 3).map((g, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-white/10 text-white text-[9px] font-bold backdrop-blur-xs"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ONLY BACKDROP (16:9) */}
        {activeTab === 'backdrop' && (
          <div className="w-full flex flex-col items-center justify-center p-2">
            <AdminBackdropBanner
              src={finalBackdropUrl}
              alt={title || 'Backdrop Preview'}
              aspectRatio="16/9"
              className="max-w-xl max-h-[260px]"
              badgeText={cleanedBackdrop ? '16:9 HD BACKDROP' : 'CHƯA CÓ BACKDROP'}
              badgeColor={cleanedBackdrop ? 'bg-emerald-600' : 'bg-slate-700'}
              fallbackTitle="Chưa có đường dẫn Backdrop"
            />
          </div>
        )}

        {/* TAB 3: ONLY POSTER (2:3) */}
        {activeTab === 'poster' && (
          <div className="w-full flex flex-col items-center justify-center py-4">
            <AdminPosterCard
              src={finalPosterUrl}
              alt={title || 'Poster Preview'}
              size="lg"
              rounded="2xl"
              adult={adult}
              rating={rating}
              fallbackText={title || 'Poster'}
              className="shadow-2xl border border-white/20"
            />
          </div>
        )}
      </div>

      {/* Footer Info & Verification status */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
        <div className="flex items-center gap-2">
          {finalPosterUrl ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Poster OK</span>
            </span>
          ) : (
            <span className="text-amber-400 font-medium">Thiếu Poster</span>
          )}

          <span>•</span>

          {finalBackdropUrl ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Backdrop OK</span>
            </span>
          ) : (
            <span className="text-slate-500 font-medium">Chưa có Backdrop (Tùy chọn)</span>
          )}
        </div>

        <span className="font-mono text-[10px] text-slate-500">CineDot Cinema Standard</span>
      </div>
    </div>
  );
}
