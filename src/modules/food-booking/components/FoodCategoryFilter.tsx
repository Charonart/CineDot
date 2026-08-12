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
    <div className="w-full bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? 'bg-[#7C6FE8] text-white shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};
