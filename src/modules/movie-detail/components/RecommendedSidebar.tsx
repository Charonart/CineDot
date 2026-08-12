'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { MovieCardItem } from '@/modules/home/types/home.types';

interface RecommendedSidebarProps {
  movies: MovieCardItem[];
}

export const RecommendedSidebar: React.FC<RecommendedSidebarProps> = ({ movies }) => {
  return (
    <div className="flex flex-col gap-6 p-6 rounded-3xl bg-white shadow-[0_16px_50px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.02)] border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
        <div className="w-1.5 h-6 bg-[#7C6FE8] rounded-full shadow-[0_0_10px_rgba(124,111,232,0.6)]" />
        <h3 className="text-base font-bold text-[#131413] uppercase tracking-wider">
          Phim Đang Chiếu Hot
        </h3>
      </div>

      {/* Recommended Movies List */}
      <div className="flex flex-col gap-4">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movies/${movie.slug}`}>
            <motion.div
              whileHover={{ y: -4, x: 2 }}
              className="group flex items-center gap-3.5 p-2 rounded-2xl transition-all duration-300 hover:bg-slate-50 hover:shadow-[0_8px_24px_rgba(124,111,232,0.12)] cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative w-16 aspect-[2/3] rounded-xl overflow-hidden bg-slate-900 shrink-0 shadow-md">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1 flex-1">
                <h4 className="font-bold text-xs sm:text-sm text-[#131413] group-hover:text-[#7C6FE8] transition-colors line-clamp-1">
                  {movie.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">{movie.genre}</p>
                <div className="flex items-center justify-between text-[11px] pt-0.5">
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{movie.rating}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#7C6FE8]/15 text-[#7C6FE8] text-[9px] font-bold uppercase">
                    {movie.formatBadge || '2D'}
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};
