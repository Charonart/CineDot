/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · theme: White Minimal · component: FoodCategoryFilter */
'use client';

import React from 'react';
import { FoodCategory } from '../types/food-booking.types';

interface FoodCategoryFilterProps {
  activeCategory: FoodCategory;
  onSelectCategory: (cat: FoodCategory) => void;
}

const categories: { id: FoodCategory; label: string }[] = [
  { id: 'ALL', label: 'Tất cả Bắp Nước' },
  { id: 'COMBO', label: 'Combo Tiết Kiệm' },
  { id: 'POPCORN', label: 'Bắp Rang Giòn' },
  { id: 'DRINK', label: 'Nước Ngọt' },
  { id: 'SNACK', label: 'Snack Khoai Tây' },
];

export const FoodCategoryFilter: React.FC<FoodCategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div
      role="tablist"
      aria-label="Danh mục bắp nước"
      className="w-full bg-white rounded-2xl p-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-200/90 flex items-center gap-1.5 overflow-x-auto scrollbar-none select-none transition-colors"
    >
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-150 cursor-pointer ${
              isActive
                ? 'bg-[#7C6FE8] text-white shadow-[0_2px_8px_rgba(124,111,232,0.35)]'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-950 border border-transparent'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};

