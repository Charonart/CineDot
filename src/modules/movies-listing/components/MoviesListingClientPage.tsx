'use client';

import React from 'react';
import { useMoviesListing } from '../hooks/useMoviesListing';
import { MoviesToolbar } from './MoviesToolbar';
import { MovieGridCard } from './MovieGridCard';
import { MovieListingTab } from '../types/movies-listing.types';
import { Skeleton } from '@/shared/ui/Skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MoviesListingClientPageProps {
  initialTab?: MovieListingTab;
}

export function MoviesListingClientPage({ initialTab = 'now-showing' }: MoviesListingClientPageProps) {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    movies,
    loading,
  } = useMoviesListing(initialTab);

  return (
    <div className="w-full flex flex-col font-sans bg-[#FEFEFE] text-[#131413] min-h-screen pt-28 pb-20 selection:bg-[#7C6FE8] selection:text-white">
      <main className="w-full">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
          {/* 1. Streamlined Toolbar (Tab Switcher & Search Bar) */}
          <MoviesToolbar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* 2. Movies Grid (4 Columns) */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 pt-8">
              {Array.from({ length: 8 }).map((_, idx) => (
                <Skeleton key={idx} variant="card" className="w-full aspect-[2/3] rounded-3xl" />
              ))}
            </div>
          ) : movies.length === 0 ? (
            <div className="w-full bg-slate-50 rounded-3xl p-12 text-center border border-gray-100 flex flex-col items-center gap-2 my-8">
              <span className="text-4xl">🎬</span>
              <h3 className="font-bold text-base text-[#131413]">Không tìm thấy bộ phim phù hợp</h3>
              <p className="text-xs text-slate-400">Thử tìm kiếm với từ khóa khác.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 pt-8">
              {movies.map((m) => (
                <MovieGridCard key={m.id} movie={m} />
              ))}
            </div>
          )}

          {/* 3. Pagination Bar */}
          <div className="flex items-center justify-center gap-2 pt-12">
            <button className="w-9 h-9 rounded-xl border border-gray-200 text-slate-500 hover:text-[#7C6FE8] hover:border-[#7C6FE8] flex items-center justify-center transition-colors cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-xl bg-[#7C6FE8] text-white font-bold text-xs shadow-sm cursor-pointer">
              1
            </button>
            <button className="w-9 h-9 rounded-xl border border-gray-200 text-slate-600 hover:text-[#7C6FE8] hover:border-[#7C6FE8] font-bold text-xs transition-colors cursor-pointer">
              2
            </button>
            <button className="w-9 h-9 rounded-xl border border-gray-200 text-slate-500 hover:text-[#7C6FE8] hover:border-[#7C6FE8] flex items-center justify-center transition-colors cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
