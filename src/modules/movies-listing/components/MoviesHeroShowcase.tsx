'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Ticket, Star, Sparkles } from 'lucide-react';
import { useTrailerStore } from '@/shared/store/trailerStore';
import { useRouter } from 'next/navigation';

export const MoviesHeroShowcase: React.FC = () => {
  const router = useRouter();
  const openTrailer = useTrailerStore((state) => state.openTrailer);

  const featuredMovie = {
    slug: 'spiderman-new-beginning',
    title: 'Người Nhện: Khởi Đầu Mới',
    originalTitle: 'Spider-Man: A New Beginning',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
    rating: 9.2,
    genre: 'Hành động • Phiêu lưu • Giả tưởng',
    duration: '148 phút',
  };

  const handleBookNow = () => {
    router.push(`/movies/${featuredMovie.slug}#showtime-schedule`);
  };

  return (
    <div className="relative w-full h-[420px] sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex items-end p-6 sm:p-12 mb-8 group">
      {/* Backdrop Image */}
      <img
        src={featuredMovie.backdropUrl}
        alt={featuredMovie.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />

      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col gap-3 max-w-2xl text-white"
      >
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#7C6FE8] text-white text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>BOM TẤN HOT NHẤT HỆ THỐNG</span>
          </span>
          <span className="flex items-center gap-1 text-amber-400 font-extrabold text-xs bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/30">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{featuredMovie.rating} / 10</span>
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
          {featuredMovie.title}
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 font-medium">
          {featuredMovie.genre} • {featuredMovie.duration}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleBookNow}
            className="px-6 py-3 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#7C6FE8]/40 transition-all transform hover:scale-105 cursor-pointer"
          >
            <Ticket className="w-4 h-4 fill-white" />
            <span>MUA VÉ</span>
          </button>

          <button
            onClick={() => openTrailer(featuredMovie.trailerUrl, featuredMovie.posterUrl, featuredMovie.title)}
            className="px-5 py-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer border border-white/30"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Xem Trailer</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
