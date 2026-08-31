'use client';

import React from 'react';
import { Search, X, Film, Clock } from 'lucide-react';
import { MovieListingTab } from '../types/movies-listing.types';
import { GenreItem } from '@/shared/services/masterData.service';

interface MoviesToolbarProps {
  activeTab: MovieListingTab;
  onSelectTab: (tab: MovieListingTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  genres?: GenreItem[];
  selectedGenreId?: string | number;
  onSelectGenre?: (genreId: string | number) => void;
  totalCount?: number;
}

export const MoviesToolbar: React.FC<MoviesToolbarProps> = ({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  genres = [],
  selectedGenreId = 'all',
  onSelectGenre,
  totalCount,
}) => {
  return (
    <div className="w-full flex flex-col gap-4 pb-6 border-b border-gray-200/80">
      {/* Tier 1: Main Tabs & Search Bar */}
      <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white border border-gray-200/80 shadow-sm w-fit">
          <button
            type="button"
            onClick={() => onSelectTab('now-showing')}
            className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'now-showing'
                ? 'bg-[#7C6FE8] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Phim Đang Chiếu</span>
            {activeTab === 'now-showing' && typeof totalCount === 'number' && (
              <span className="ml-1 px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
                {totalCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('coming-soon')}
            className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'coming-soon'
                ? 'bg-[#7C6FE8] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Phim Sắp Chiếu</span>
            {activeTab === 'coming-soon' && typeof totalCount === 'number' && (
              <span className="ml-1 px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
                {totalCount}
              </span>
            )}
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm phim theo tên..."
            className="w-full pl-10 pr-9 py-2.5 rounded-full bg-white border border-gray-200 text-xs sm:text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-[#7C6FE8] focus:ring-2 focus:ring-[#7C6FE8]/15 outline-none transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tier 2: Genre Filter Chips */}
      {genres.length > 0 && onSelectGenre && (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <button
            type="button"
            onClick={() => onSelectGenre('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedGenreId === 'all'
                ? 'bg-[#7C6FE8] text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200/80 hover:border-[#7C6FE8]/40 hover:text-[#7C6FE8]'
            }`}
          >
            Tất cả thể loại
          </button>

          {genres.map((g, idx) => {
            const genreId = g.genre_id ?? g.id ?? idx;
            const genreName = g.name || g.genre_name || 'Thể loại';
            const isSelected = String(selectedGenreId) === String(genreId);
            return (
              <button
                key={genreId}
                type="button"
                onClick={() => onSelectGenre(genreId)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#7C6FE8] text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200/80 hover:border-[#7C6FE8]/40 hover:text-[#7C6FE8]'
                }`}
              >
                {genreName}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
