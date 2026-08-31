'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMoviesListing } from '../hooks/useMoviesListing';
import { MoviesToolbar } from './MoviesToolbar';
import { MovieGridCard } from './MovieGridCard';
import { MovieListingTab } from '../types/movies-listing.types';
import { ChevronLeft, ChevronRight, Film, RefreshCw } from 'lucide-react';

interface MoviesListingClientPageProps {
  initialTab?: MovieListingTab;
}

export function MoviesListingClientPage({ initialTab = 'now-showing' }: MoviesListingClientPageProps) {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedGenreId,
    setSelectedGenreId,
    genres,
    page,
    setPage,
    totalPages,
    totalResults,
    movies,
    loading,
  } = useMoviesListing(initialTab);

  const isFiltered = searchQuery.trim() !== '' || selectedGenreId !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGenreId('all');
  };

  return (
    <div className="w-full flex flex-col font-sans bg-[#FAFAFB] text-gray-900 min-h-screen pt-24 pb-20 sm:pt-28 selection:bg-[#7C6FE8] selection:text-white">
      <main className="w-full">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-col gap-6 sm:gap-8">
          {/* 1. Page Header */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-5 bg-[#7C6FE8] rounded-full" />
              <span className="text-xs font-bold tracking-widest text-[#7C6FE8] uppercase">
                DANH MỤC PHIM CHIẾU RẠP
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-950">
              {activeTab === 'now-showing' ? 'Phim Đang Chiếu' : 'Phim Sắp Chiếu'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-2xl leading-relaxed">
              Khám phá danh sách phim bom tấn mới nhất với định dạng IMAX 3D Laser, 4DX sống động và hệ thống âm thanh vòm Dolby Atmos tại CineDot.
            </p>
          </div>

          {/* 2. Streamlined Toolbar (Tabs, Genres Filter & Search Bar) */}
          <MoviesToolbar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            genres={genres}
            selectedGenreId={selectedGenreId}
            onSelectGenre={setSelectedGenreId}
            totalCount={totalResults}
          />

          {/* 3. Movies Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="aspect-[2/3] rounded-2xl bg-gray-200 animate-pulse border border-gray-100"
                />
              ))}
            </div>
          ) : movies.length === 0 ? (
            <div className="w-full bg-white rounded-3xl p-12 sm:p-16 text-center border border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 my-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center">
                <Film className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900">
                Không tìm thấy phim phù hợp
              </h3>
              <p className="text-xs text-gray-500 max-w-sm">
                Vui lòng thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc thể loại hiện tại.
              </p>
              {isFiltered && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 mt-2 rounded-full bg-[#7C6FE8] text-white text-xs font-bold shadow-sm hover:bg-[#685bc7] transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Xóa tất cả bộ lọc</span>
                </button>
              )}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${selectedGenreId}-${searchQuery}-${page}`}
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
                {movies.map((m) => (
                  <MovieGridCard key={m.id} movie={m} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* 4. Pagination Bar (If multi-page) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className={`w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center transition-colors cursor-pointer ${
                  page <= 1
                    ? 'text-gray-300 border-gray-100 cursor-not-allowed'
                    : 'text-gray-600 hover:text-[#7C6FE8] hover:border-[#7C6FE8]'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const p = idx + 1;
                const isActive = page === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#7C6FE8] text-white shadow-sm'
                        : 'border border-gray-200 text-gray-700 hover:text-[#7C6FE8] hover:border-[#7C6FE8]'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className={`w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center transition-colors cursor-pointer ${
                  page >= totalPages
                    ? 'text-gray-300 border-gray-100 cursor-not-allowed'
                    : 'text-gray-600 hover:text-[#7C6FE8] hover:border-[#7C6FE8]'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
