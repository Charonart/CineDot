'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Star, Sparkles, Clock, ArrowRight, Play, Film, Flame } from 'lucide-react';
import { fetchNavbarMovies } from '@/modules/home/services/home.service';
import { MovieCardItem } from '@/modules/home/types/home.types';
import { Skeleton } from '@/shared/ui/Skeleton';

interface MoviesMegaDropdownProps {
  onClose?: () => void;
}

export const MoviesMegaDropdown: React.FC<MoviesMegaDropdownProps> = ({ onClose }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'now-showing' | 'coming-soon'>('now-showing');
  const [nowShowingMovies, setNowShowingMovies] = useState<MovieCardItem[]>([]);
  const [comingSoonMovies, setComingSoonMovies] = useState<MovieCardItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await fetchNavbarMovies();
        if (isMounted) {
          setNowShowingMovies(data.nowShowing.slice(0, 5));
          setComingSoonMovies(data.comingSoon.slice(0, 5));
        }
      } catch (e) {
        console.error('Failed to load navbar movies', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleBookNow = (e: React.MouseEvent, movieSlug: string) => {
    e.stopPropagation();
    if (onClose) onClose();
    router.push(`/movies/${movieSlug}#showtime-schedule`);
  };

  const handleMovieClick = (movieSlug: string) => {
    if (onClose) onClose();
    router.push(`/movies/${movieSlug}`);
  };

  const displayedMovies = activeTab === 'now-showing' ? nowShowingMovies : comingSoonMovies;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[min(980px,calc(100vw-48px))] bg-white/95 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_24px_60px_-12px_rgba(15,23,42,0.18),0_0_0_1px_rgba(229,231,235,0.8)] border border-white/60 z-[110] text-slate-900 selection:bg-[#7C6FE8] selection:text-white"
    >
      {/* Header bar with tactile tab switcher & all movies link */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 bg-gray-100/80 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('now-showing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'now-showing'
                ? 'bg-white text-slate-900 shadow-xs shadow-black/5 font-extrabold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>Phim Đang Chiếu</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-gray-100 text-slate-700 font-bold">
              {nowShowingMovies.length > 0 ? nowShowingMovies.length : '•'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('coming-soon')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'coming-soon'
                ? 'bg-white text-slate-900 shadow-xs shadow-black/5 font-extrabold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>Phim Sắp Chiếu</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-gray-100 text-slate-700 font-bold">
              {comingSoonMovies.length > 0 ? comingSoonMovies.length : '•'}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={`/movies?category=${activeTab}`}
            onClick={onClose}
            className="group inline-flex items-center gap-1.5 text-xs font-bold text-[#7C6FE8] hover:text-[#685bc7] transition-colors"
          >
            <span>Xem toàn bộ lịch chiếu</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Movie Cards Carousel Grid (5 columns for rich visual rhythm) */}
      {isLoading ? (
        <div className="grid grid-cols-5 gap-3.5 py-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton variant="card" className="w-full aspect-[2/3] rounded-2xl" />
              <Skeleton variant="text" className="w-4/5 h-3.5" />
              <Skeleton variant="text" className="w-1/2 h-3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 py-1">
          {displayedMovies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleMovieClick(movie.slug)}
              className="group/card relative flex flex-col gap-2 cursor-pointer transition-transform duration-200 hover:-translate-y-1"
            >
              {/* Poster Container */}
              <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-slate-950 shadow-xs group-hover/card:shadow-lg group-hover/card:shadow-purple-500/10 transition-all border border-gray-100">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-105"
                />

                {/* Top format and age rating badges */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
                  <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[9px] font-black tracking-wider uppercase border border-white/10">
                    {movie.formatBadge || '2D Digital'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-lg bg-amber-500/90 backdrop-blur-md text-white text-[9px] font-black shadow-xs">
                    {movie.ageRating || 'P'}
                  </span>
                </div>

                {/* Star rating pill */}
                {movie.rating > 0 && (
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md text-amber-300 text-[10px] font-extrabold z-10 border border-white/10">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{movie.rating.toFixed(1)}</span>
                  </div>
                )}

                {/* Film roll subtle accent watermark */}
                <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none z-10">
                  <span className="p-1 rounded-full bg-[#7C6FE8] text-white flex items-center justify-center shadow-sm">
                    <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
                  </span>
                </div>

                {/* Hover overlay with tactile action button */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-2.5 z-20">
                  {activeTab === 'now-showing' ? (
                    <button
                      onClick={(e) => handleBookNow(e, movie.slug)}
                      className="w-full py-2 px-2.5 rounded-xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-[#7C6FE8]/40 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
                    >
                      <Ticket className="w-3.5 h-3.5 fill-white shrink-0" />
                      <span className="truncate">ĐẶT VÉ</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMovieClick(movie.slug)}
                      className="w-full py-2 px-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
                    >
                      <Film className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0" />
                      <span className="truncate">CHI TIẾT</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="flex flex-col px-0.5">
                <h4 className="font-extrabold text-xs text-slate-800 group-hover/card:text-[#7C6FE8] transition-colors line-clamp-1">
                  {movie.title}
                </h4>
                <p className="text-[11px] text-gray-500 line-clamp-1 font-medium">
                  {movie.genre || 'Hành động, Phiêu lưu'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Bar: Cinema Special Experiences */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#7C6FE8]" /> Trải nghiệm đỉnh cao:
          </span>
          <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#7C6FE8] font-bold">IMAX with Laser</span>
          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold">Gold Class VIP Lounge</span>
          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold">Dolby Atmos Sound</span>
        </div>

        <Link
          href="/special-theaters"
          onClick={onClose}
          className="font-bold text-gray-600 hover:text-[#7C6FE8] transition-colors"
        >
          Khám phá phòng chiếu đặc biệt →
        </Link>
      </div>
    </motion.div>
  );
};
