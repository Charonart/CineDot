'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StarShopCategory } from '../types/star-shop.types';

interface StarShopCategoryFilterProps {
  activeCategory: StarShopCategory;
  onSelectCategory: (category: StarShopCategory) => void;
}

export const StarShopCategoryFilter: React.FC<StarShopCategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const categories: { id: StarShopCategory; label: string }[] = [
    { id: 'ALL', label: 'Tất Cả Sản Phẩm' },
    { id: 'FIGURINE', label: 'Mô Hình / Figurine' },
    { id: 'TUMBLER', label: 'Cốc Limited / Tumbler' },
    { id: 'APPAREL', label: 'Thời Trang & Phụ Kiện' },
    { id: 'COMBO', label: 'Combo Quà Tặng' },
  ];

  return (
    <div className="w-full flex items-center gap-2 overflow-x-auto scrollbar-none py-2 mb-6">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`relative px-5 py-2.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/30'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};
