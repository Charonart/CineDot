'use client';

import React from 'react';
import { EventCategory } from '../types/events.types';

interface EventsCategoryTabsProps {
  activeCategory: EventCategory;
  onSelectCategory: (cat: EventCategory) => void;
}

const CATEGORIES: { id: EventCategory; label: string }[] = [
  { id: 'ALL', label: 'Tất Cả Sự Kiện' },
  { id: 'FOOD_COMBO', label: 'Combo Bắp Nước' },
  { id: 'TICKET_PROMO', label: 'Ưu Đãi Giá Vé' },
  { id: 'MEMBER_ONLY', label: 'Sự Kiện Thành Viên' },
  { id: 'PARTNER_BANK', label: 'Đối Tác Ngân Hàng & Ví' },
];

export const EventsCategoryTabs: React.FC<EventsCategoryTabsProps> = ({
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
