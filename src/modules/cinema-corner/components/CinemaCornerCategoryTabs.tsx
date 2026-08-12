'use client';

import React from 'react';
import { ArticleCategory } from '../types/cinema-corner.types';

interface CinemaCornerCategoryTabsProps {
  activeCategory: ArticleCategory;
  onSelectCategory: (cat: ArticleCategory) => void;
}

const CATEGORIES: { id: ArticleCategory; label: string }[] = [
  { id: 'ALL', label: 'Tất Cả' },
  { id: 'REVIEWS', label: 'Review Phim Chuyên Sâu' },
  { id: 'CINEMA_NEWS', label: 'Tin Bên Lề Rạp Phim' },
  { id: 'DIRECTOR_ACTOR', label: 'Góc Đạo Diễn & Diễn Viên' },
  { id: 'BEHIND_SCENES', label: 'Hậu Trường & Kỹ Thuật Số' },
];

export const CinemaCornerCategoryTabs: React.FC<CinemaCornerCategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/30 scale-105'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-gray-200'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};
