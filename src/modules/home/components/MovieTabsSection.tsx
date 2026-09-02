'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Ticket, Clock, Film, ChevronRight } from 'lucide-react';
import { MovieCardItem } from '../types/home.types';
import { MOCK_MOVIES, MOCK_COMING_SOON_MOVIES } from '../mocks/mockHomeData';
import { useTrailerStore } from '@/shared/store/trailerStore';
import { Skeleton } from '@/shared/ui/Skeleton';
import { AgeRatingBadge } from '@/shared/components/ui/AgeRatingBadge';

interface MovieTabsSectionProps {
  movies: MovieCardItem[];
  isLoading?: boolean;
}

type TabType = 'now_showing' | 'upcoming';

export const MovieTabsSection: React.FC<MovieTabsSectionProps> = ({ movies, isLoading }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('now_showing');
  const openTrailer = useTrailerStore((state) => state.openTrailer);

  const activeMovies = React.useMemo(() => {
    return movies && movies.length > 0 ? movies : [...MOCK_MOVIES, ...MOCK_COMING_SOON_MOVIES];
  }, [movies]);

  const filteredMovies = activeMovies.filter((m) => {
    return m.status === activeTab;
  });

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
    if (movie.status === 'now_showing') {
      router.push(`/movies/${movie.slug}#showtime-schedule`);
    } else {
      router.push(`/movies/${movie.slug}`);
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'now_showing', label: 'Đang Chiếu', icon: <Film className="w-3.5 h-3.5" /> },
    { id: 'upcoming', label: 'Sắp Chiếu', icon: <Clock className="w-3.5 h-3.5" /> },
  ];

  const viewMoreLink = activeTab === 'upcoming' ? '/movies?tab=upcoming' : '/movies?tab=now_showing';

  return (
    <section className="relative z-10 w-full py-16 sm:py-20 bg-[#FAFAFB]">
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-5 bg-[#7C6FE8] rounded-full" />
              <span className="text-xs font-bold tracking-widest text-[#7C6FE8] uppercase">
                LỊCH CHIẾU & PHIM HOT
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-950">
              Khám Phá Phim Chiếu Rạp
            </h2>
          </div>

          {/* Capsule Switcher */}
          <div className="flex items-center gap-1 p-1.5 rounded-full bg-white border border-gray-200/80 shadow-sm overflow-x-auto scrollbar-none self-start md:self-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer z-10 ${
                    isActive ? 'text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeMovieTabPill"
                      className="absolute inset-0 bg-[#7C6FE8] rounded-full shadow-sm -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Movies Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[2/3] rounded-2xl bg-gray-200 animate-pulse border border-gray-100" />
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
                className="w-full py-16 px-6 rounded-3xl bg-white border border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 text-center shadow-sm"
              >
                <Film className="w-10 h-10 text-gray-400" />
                <span className="text-base font-bold text-gray-900">
                  Chưa có phim trong danh mục này
                </span>
                <span className="text-xs text-gray-500 max-w-sm">
                  CineDot đang cập nhật lịch chiếu mới nhất. Quý khách vui lòng chọn tab khác hoặc quay lại sau!
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
                      staggerChildren: 0.04,
                    },
                  },
                }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
              >
                {filteredMovies.map((movie) => (
                  <motion.div
                    key={movie.id}
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
                    }}
                    whileHover={{ y: -6 }}
                    className="group relative flex flex-col gap-3 rounded-2xl p-2.5 bg-white border border-gray-200/80 hover:border-[#7C6FE8]/50 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => router.push(`/movies/${movie.slug}`)}
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
                        <AgeRatingBadge ageRating={movie.ageRating} size="xs" variant="solid" />
                      </div>

                      {/* Hover Overlay with Rapid Action Buttons */}
                      <div className="absolute inset-0 bg-black/65 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-4 gap-2.5 z-20">
                        <button
                          type="button"
                          onClick={(e) => handleBookClick(e, movie)}
                          className="w-full max-w-[140px] py-2 px-4 bg-[#7C6FE8] hover:bg-[#685bc7] text-white rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                        >
                          <Ticket className="w-3.5 h-3.5 fill-white shrink-0" />
                          <span>{activeTab === 'upcoming' ? 'CHI TIẾT' : 'ĐẶT VÉ'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleWatchTrailer(e, movie)}
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
                      <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                        {movie.rating > 0 ? (
                          <span className="inline-flex items-center gap-1 font-bold text-gray-800">
                            <span className="px-1 py-0.2 rounded bg-[#F5C518] text-black font-black text-[9px] leading-tight">
                              IMDb
                            </span>
                            <span className="text-amber-600 font-extrabold">{movie.rating.toFixed(1)}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400 italic">Chưa có đánh giá</span>
                        )}
                        <span className="text-[11px] text-gray-500 truncate max-w-[120px]">{movie.genre}</span>
                      </div>
                      {movie.duration && (
                        <span className="text-[10px] text-gray-400">{movie.duration}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* View More Footer Action */}
        <div className="mt-12 text-center">
          <Link href={viewMoreLink}>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white hover:bg-[#7C6FE8] text-[#7C6FE8] hover:text-white border border-purple-200 hover:border-transparent font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Xem Toàn Bộ Lịch Chiếu</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};
