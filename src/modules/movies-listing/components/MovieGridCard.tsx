'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Ticket, Star, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MovieListingItem } from '../types/movies-listing.types';
import { useTrailerStore } from '@/shared/store/trailerStore';

interface MovieGridCardProps {
  movie: MovieListingItem;
}

export const MovieGridCard: React.FC<MovieGridCardProps> = ({ movie }) => {
  const router = useRouter();
  const openTrailer = useTrailerStore((state) => state.openTrailer);

  const isNowShowing = movie.status === 'NOW_SHOWING';
  const detailUrl = `/movies/${movie.slug}`;
  const scheduleUrl = `/movies/${movie.slug}#showtime-schedule`;

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isNowShowing) {
      router.push(scheduleUrl);
    } else {
      router.push(detailUrl);
    }
  };

  const handleTrailerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openTrailer(movie.trailerUrl, movie.posterUrl, movie.title);
  };

  const genreText = Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
      }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col gap-3 rounded-2xl p-2.5 bg-white border border-gray-200/80 hover:border-[#7C6FE8]/50 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={() => router.push(detailUrl)}
    >
      {/* Poster Frame */}
      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-gray-100">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center z-10 pointer-events-none">
          <span className="px-2.5 py-0.5 rounded-full bg-[#7C6FE8] text-white text-[10px] font-extrabold uppercase shadow-sm">
            {movie.formatBadge || '2D'}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-black shadow-sm">
            {movie.ageRating || 'P'}
          </span>
        </div>

        {/* Rating Score Badge */}
        {movie.rating > 0 && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[11px] font-bold border border-white/10 z-10">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Hover Overlay with Rapid Action Buttons */}
        <div className="absolute inset-0 bg-black/65 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-4 gap-2.5 z-20">
          <button
            type="button"
            onClick={handleBookClick}
            className="w-full max-w-[140px] py-2 px-4 bg-[#7C6FE8] hover:bg-[#685bc7] text-white rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Ticket className="w-3.5 h-3.5 fill-white shrink-0" />
            <span>{isNowShowing ? 'ĐẶT VÉ' : 'CHI TIẾT'}</span>
          </button>

          <button
            type="button"
            onClick={handleTrailerClick}
            className="w-full max-w-[140px] py-2 px-4 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-full font-semibold text-xs backdrop-blur-md transition-all flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white shrink-0" />
            <span>Xem Trailer</span>
          </button>
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex flex-col gap-1 px-1 pb-1">
        <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-[#7C6FE8] transition-colors line-clamp-1 leading-snug">
          {movie.title}
        </h3>
        <p className="text-xs text-gray-500 font-medium truncate">
          {genreText}
        </p>
        <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium pt-0.5">
          <span>{movie.duration}</span>
          {movie.releaseDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{movie.releaseDate}</span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
