'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Ticket, Star, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col gap-3 group cursor-pointer"
      onClick={() => router.push(detailUrl)}
    >
      {/* Poster Image Container */}
      <div className="relative w-full aspect-[2/3] rounded-3xl overflow-hidden bg-slate-900 shadow-md group-hover:shadow-2xl transition-all">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <span className="px-2.5 py-0.5 rounded-full bg-[#7C6FE8] text-white text-[10px] font-bold uppercase shadow-sm">
            {movie.formatBadge}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold shadow-sm">
            {movie.ageRating}
          </span>
        </div>

        {/* Rating Score Badge */}
        {movie.rating > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 text-[11px] font-extrabold border border-white/10 z-10">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{movie.rating}</span>
          </div>
        )}

        {/* Hover Overlay Action Buttons (Sleek, Balanced Proportions) */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-5 z-20">
          <button
            onClick={handleBookClick}
            className="w-[82%] max-w-[170px] py-2.5 px-4 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#7C6FE8]/40 transition-all cursor-pointer transform hover:scale-105"
          >
            <Ticket className="w-4 h-4 fill-white shrink-0" />
            <span className="truncate">{isNowShowing ? 'MUA VÉ' : 'CHI TIẾT'}</span>
          </button>

          <button
            onClick={handleTrailerClick}
            className="w-[82%] max-w-[170px] py-2.5 px-4 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-white/30"
          >
            <Play className="w-3.5 h-3.5 fill-white shrink-0" />
            <span className="truncate">Xem Trailer</span>
          </button>
        </div>
      </div>

      {/* Info below poster */}
      <div className="flex flex-col gap-1 px-1">
        <Link href={detailUrl}>
          <h3 className="font-extrabold text-base text-[#131413] group-hover:text-[#7C6FE8] transition-colors leading-snug line-clamp-1">
            {movie.title}
          </h3>
        </Link>
        <span className="text-xs text-slate-500 font-semibold">
          {movie.genre.join(', ')} • {movie.duration}
        </span>
      </div>
    </motion.div>
  );
};
