'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Ticket, Star } from 'lucide-react';
import { useTrailerStore } from '@/shared/store/trailerStore';
import { useRouter } from 'next/navigation';
import { MovieListingItem } from '../types/movies-listing.types';

interface MoviesHeroShowcaseProps {
  movie?: MovieListingItem;
}

export const MoviesHeroShowcase: React.FC<MoviesHeroShowcaseProps> = ({ movie }) => {
  const router = useRouter();
  const openTrailer = useTrailerStore((state) => state.openTrailer);

  const featured = movie || {
    slug: 'spiderman-new-beginning',
    title: 'Người Nhện: Khởi Đầu Mới',
    originalTitle: 'Spider-Man: A New Beginning',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
    rating: 9.2,
    genre: ['Hành động', 'Phiêu lưu', 'Giả tưởng'],
    duration: '148 phút',
    formatBadge: 'IMAX 3D Laser',
  };

  const backdropUrl = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80';

  const handleBookNow = () => {
    router.push(`/movies/${featured.slug}#showtime-schedule`);
  };

  const genreText = Array.isArray(featured.genre) ? featured.genre.join(' • ') : featured.genre;

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[460px] rounded-3xl overflow-hidden shadow-[0_16px_45px_rgba(0,0,0,0.14)] border border-gray-200/70 flex items-end p-6 sm:p-10 lg:p-12 mb-10 group bg-slate-950">
      {/* Backdrop Image */}
      <img
        src={backdropUrl}
        alt={featured.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
      />

      {/* Atmospheric Vignette Overlay */}
      <div className="absolute inset-0 hero-overlay" />
      <div className="absolute inset-0 hero-side-fade hidden md:block" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 flex flex-col gap-3 max-w-2xl text-white"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-[#7C6FE8] text-white text-[11px] font-bold tracking-wide uppercase shadow-sm">
            BOM TẤN NỔI BẬT
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-semibold text-white border border-white/20">
            {featured.formatBadge || 'IMAX 3D Laser'}
          </span>
          {featured.rating > 0 && (
            <span className="flex items-center gap-1 text-amber-300 font-bold text-xs bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{featured.rating.toFixed(1)} / 10</span>
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white drop-shadow-md">
          {featured.title}
        </h1>

        <p className="text-xs sm:text-sm text-gray-200 font-medium line-clamp-2">
          {genreText} {featured.duration ? `• ${featured.duration}` : ''}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleBookNow}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#7C6FE8]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Ticket className="w-4 h-4 fill-white" />
            <span>ĐẶT VÉ NGAY</span>
          </button>

          <button
            type="button"
            onClick={() => openTrailer(featured.trailerUrl, featured.posterUrl, featured.title)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs sm:text-sm transition-all border border-white/30 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-white text-white" />
            <span>Xem Trailer</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
