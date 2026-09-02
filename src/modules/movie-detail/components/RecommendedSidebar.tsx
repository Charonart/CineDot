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
    <div className="flex flex-col gap-5 p-5 sm:p-6 rounded-3xl bg-white shadow-sm border border-gray-200/80 sticky top-28">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
        <div className="w-1.5 h-5 bg-[#7C6FE8] rounded-full" />
        <h3 className="text-sm sm:text-base font-extrabold text-gray-950 uppercase tracking-wide">
          Phim Đang Hot
        </h3>
      </div>

      {/* Recommended Movies List */}
      <div className="flex flex-col gap-3">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movies/${movie.slug}`}>
            <motion.div
              whileHover={{ y: -3 }}
              className="group flex items-center gap-3 p-2 rounded-2xl transition-all duration-200 hover:bg-purple-50/50 border border-transparent hover:border-purple-100 cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative w-14 aspect-[2/3] rounded-xl overflow-hidden bg-gray-100 shrink-0 shadow-xs">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-[#7C6FE8] transition-colors truncate">
                  {movie.title}
                </h4>
                <p className="text-[11px] text-gray-500 truncate">{movie.genre}</p>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  {movie.rating > 0 ? (
                    <span className="flex items-center gap-1 font-bold text-gray-800">
                      <span className="px-1 py-0.2 rounded bg-[#F5C518] text-black font-black text-[9px] leading-tight">
                        IMDb
                      </span>
                      <span className="text-amber-600 font-extrabold">{movie.rating.toFixed(1)}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-400 italic">Chưa có đánh giá</span>
                  )}
                  <span className="px-2 py-0.2 rounded-full bg-[#7C6FE8]/15 text-[#7C6FE8] text-[9px] font-extrabold uppercase">
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
