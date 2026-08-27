/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · theme: White Minimal · component: FoodItemCard */
'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { FoodItem } from '../types/food-booking.types';

interface FoodItemCardProps {
  item: FoodItem;
  quantity: number;
  onUpdateQuantity: (delta: number) => void;
}

export const FoodItemCard: React.FC<FoodItemCardProps> = ({
  item,
  quantity,
  onUpdateQuantity,
}) => {
  const isSelected = quantity > 0;

  return (
    <div
      className={`w-full bg-white rounded-3xl p-4 sm:p-5 transition-all duration-200 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 select-none ${
        isSelected
          ? 'border-2 border-[#7C6FE8] shadow-[0_4px_20px_rgba(124,111,232,0.12)] ring-2 ring-[#7C6FE8]/20'
          : 'border border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-gray-300'
      }`}
    >
      {/* Thumbnail Image */}
      <div className="relative w-full sm:w-28 aspect-square rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200/80">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {item.badge && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#7C6FE8] text-white text-[9px] font-extrabold uppercase tracking-wider shadow-xs">
            <span>{item.badge}</span>
          </div>
        )}
      </div>


      {/* Details */}
      <div className="flex flex-col gap-1 flex-1 w-full sm:w-auto">
        <h3 className="font-extrabold text-sm sm:text-base text-gray-950 leading-snug">
          {item.name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-medium">
          {item.description}
        </p>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-base font-black text-[#7C6FE8]">
            {item.price.toLocaleString('vi-VN')}đ
          </span>
          {item.originalPrice && (
            <span className="text-xs text-gray-400 line-through font-semibold">
              {item.originalPrice.toLocaleString('vi-VN')}đ
            </span>
          )}
        </div>
      </div>

      {/* Quantity Increment/Decrement Stepper */}
      <div className="flex items-center gap-2.5 bg-gray-50 p-1.5 rounded-2xl border border-gray-200/90 shrink-0">
        <button
          type="button"
          onClick={() => onUpdateQuantity(-1)}
          disabled={quantity <= 0}
          aria-label={`Giảm số lượng ${item.name}`}
          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
            quantity > 0
              ? 'bg-white hover:bg-gray-200 text-gray-900 shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
              : 'bg-transparent text-gray-300 cursor-not-allowed'
          }`}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <span className="w-6 text-center font-black text-sm text-gray-950">
          {quantity}
        </span>

        <button
          type="button"
          onClick={() => onUpdateQuantity(1)}
          aria-label={`Tăng số lượng ${item.name}`}
          className="w-7 h-7 rounded-xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white flex items-center justify-center shadow-[0_2px_8px_rgba(124,111,232,0.35)] transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

