'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Ticket } from 'lucide-react';
import { MovieCardItem } from '../types/home.types';
import { useTrailerStore } from '@/shared/store/trailerStore';
import { Skeleton } from '@/shared/ui/Skeleton';

interface MovieTabsSectionProps {
  movies: MovieCardItem[];
  isLoading?: boolean;
}

export const MovieTabsSection: React.FC<MovieTabsSectionProps> = ({ movies, isLoading }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'now-showing' | 'coming-soon'>('now-showing');
  const openTrailer = useTrailerStore((state) => state.openTrailer);

  const filteredMovies = movies.filter((m) => m.status === activeTab);

  const handleWatchTrailer = (e: React.MouseEvent, movie: MovieCardItem) => {
    e.preventDefault();
    e.stopPropagation();
    openTrailer(
      movie.trailerUrl || 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
      movie.posterUrl,
      movie.title
    );
  };

  const handleBookClick = (e: React.MouseEvent, movie: MovieCardItem) => {
    e.preventDefault();
    e.stopPropagation();
    const scheduleUrl = `/movies/${movie.slug}#showtime-schedule`;
    const detailUrl = `/movies/${movie.slug}`;

    if (movie.status === 'now-showing') {
      router.push(scheduleUrl);
    } else {
      router.push(detailUrl);
    }
  };

  const tabs = [
    { id: 'now-showing', label: 'Đang Chiếu' },
    { id: 'coming-soon', label: 'Sắp Chiếu' },
  ] as const;

  const viewMoreLink = activeTab === 'coming-soon' ? '/movies?tab=coming-soon' : '/movies?tab=now-showing';

  return (
    <section className="w-full py-20 bg-[var(--bg)]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
        {/* Header with Title & Sub-tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 bg-[#7C6FE8] rounded-full shadow-[0_0_12px_rgba(124,111,232,0.6)]" />
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text)] uppercase">
              PHIM
            </h2>
          </div>

          {/* Animated Neo-Glass Capsule Switcher */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-xl ring-1 ring-[#7C6FE8]/25 shadow-[0_8px_30px_rgba(124,111,232,0.15)] self-start sm:self-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-5 py-2 text-sm font-semibold rounded-full transition-colors z-10 cursor-pointer ${
                    isActive ? 'text-white' : 'text-[var(--text2)] hover:text-[#7C6FE8]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-[#7C6FE8] rounded-full shadow-[0_4px_20px_rgba(124,111,232,0.5)] -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Staggered Movies Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} variant="card" className="h-[340px] rounded-2xl" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filteredMovies.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full py-16 px-6 rounded-3xl bg-white/60 border border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-center"
              >
                <span className="text-sm font-extrabold text-slate-700">
                  {activeTab === 'coming-soon' ? 'Chưa có phim sắp chiếu trong danh mục này' : 'Chưa có phim đang chiếu trong danh mục này'}
                </span>
                <span className="text-xs text-slate-400">
                  Vui lòng quay lại sau để cập nhật những bom tấn mới nhất nhé!
                </span>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.06,
                    },
                  },
                }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
              >
                {filteredMovies.map((movie) => (
                  <motion.div
                    key={movie.id}
                    variants={{
                      hidden: { opacity: 0, y: 25 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
                    }}
                    whileHover={{ y: -6 }}
                    className="group flex flex-col gap-2 cursor-pointer"
                    onClick={() => router.push(`/movies/${movie.slug}`)}
                  >
                    {/* Poster Box */}
                    <div className="relative aspect-[2/3] w-full rounded-3xl overflow-hidden bg-slate-900 shadow-md group-hover:shadow-2xl transition-all">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10 pointer-events-none">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#7C6FE8] text-white text-[10px] font-bold uppercase shadow-sm">
                          {movie.formatBadge || '2D'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold shadow-sm">
                          {movie.ageRating}
                        </span>
                      </div>

                      {/* Hover Overlay with Proportional Pill Buttons */}
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-4 gap-3 z-20">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={(e) => handleBookClick(e, movie)}
                          className="w-[82%] max-w-[170px] py-2.5 px-4 bg-[#7C6FE8] hover:bg-[#685bc7] text-white rounded-full font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#7C6FE8]/40 transition-all cursor-pointer"
                        >
                          <Ticket className="w-4 h-4 fill-white shrink-0" />
                          <span className="truncate">{activeTab === 'now-showing' ? 'MUA VÉ' : 'CHI TIẾT'}</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={(e) => handleWatchTrailer(e, movie)}
                          className="w-[82%] max-w-[170px] py-2.5 px-4 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-full font-bold text-xs backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-white shrink-0" />
                          <span className="truncate">Xem Trailer</span>
                        </motion.button>
                      </div>
                    </div>

                    {/* Info Below */}
                    <div className="flex flex-col gap-1 px-1">
                      <h3 className="font-extrabold text-base text-[#131413] group-hover:text-[#7C6FE8] transition-colors line-clamp-1">
                        {movie.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                        <span className="flex items-center text-amber-500 font-bold">
                          ★ {movie.rating > 0 ? movie.rating : 'N/A'}
                        </span>
                        <span className="truncate">{movie.genre}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* View More Button */}
        <div className="mt-12 text-center">
          <Link href={viewMoreLink}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2 px-8 py-3 bg-[#7C6FE8]/10 border border-[#7C6FE8]/40 text-[#7C6FE8] hover:bg-[#7C6FE8] hover:text-white rounded-full text-xs font-extrabold transition-all duration-300 shadow-sm hover:shadow-[0_8px_24px_rgba(124,111,232,0.3)] cursor-pointer"
            >
              <span>Xem thêm phim</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">&gt;</span>
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
};
