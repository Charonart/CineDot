'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { MovieListingTab } from '../types/movies-listing.types';

interface MoviesToolbarProps {
  activeTab: MovieListingTab;
  onSelectTab: (tab: MovieListingTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const MoviesToolbar: React.FC<MoviesToolbarProps> = ({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
      {/* Tab Switcher: Phim Đang Chiếu vs Phim Sắp Chiếu */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl shrink-0 w-fit">
        <button
          onClick={() => onSelectTab('now-showing')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'now-showing'
              ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/30'
              : 'text-slate-600 hover:text-[#7C6FE8]'
          }`}
        >
          Phim Đang Chiếu
        </button>

        <button
          onClick={() => onSelectTab('coming-soon')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'coming-soon'
              ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/30'
              : 'text-slate-600 hover:text-[#7C6FE8]'
          }`}
        >
          Phim Sắp Chiếu
        </button>
      </div>

      {/* Streamlined Search Bar */}
      <div className="relative w-full sm:w-72">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm tên phim..."
          className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-semibold focus:border-[#7C6FE8] focus:bg-white outline-none transition-all"
        />
      </div>
    </div>
  );
};
