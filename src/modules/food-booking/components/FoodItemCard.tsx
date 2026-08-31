/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · genre: modern-minimal · theme: White Minimal · component: FoodItemCard */
'use client';

import React from 'react';
import { Minus, Plus, Sparkles, Check } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <motion.div
      layout
      whileTap={{ scale: 0.99 }}
      onClick={() => {
        if (quantity === 0) onUpdateQuantity(1);
      }}
      className={`group relative rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 sm:gap-3.5 transition-all duration-150 select-none cursor-pointer ${
        isSelected
          ? 'bg-[#FAF9FE] border-2 border-[#7C6FE8] shadow-[0_4px_16px_rgba(124,111,232,0.12)] ring-1 ring-[#7C6FE8]/20'
          : 'bg-white border border-gray-200/90 shadow-xs hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      {/* Thumbnail Image (Compact Square) */}
      <div className="relative w-20 sm:w-22 h-20 sm:h-22 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200/70">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {item.badge && (
          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-[#7C6FE8]/95 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider shadow-xs flex items-center gap-0.5">
            <Sparkles className="w-2 h-2" />
            <span>{item.badge}</span>
          </div>
        )}
      </div>

      {/* Details (Middle Section) */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h3 className="font-extrabold text-sm text-gray-950 leading-tight truncate group-hover:text-[#7C6FE8] transition-colors">
            {item.name}
          </h3>
        </div>

        <p className="text-[11px] text-gray-500 line-clamp-1 font-medium leading-normal">
          {item.description}
        </p>

        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-sm sm:text-base font-black text-[#7C6FE8]">
            {item.price.toLocaleString('vi-VN')}đ
          </span>
          {item.originalPrice && item.originalPrice > item.price && (
            <span className="text-[11px] text-gray-400 line-through font-semibold">
              {item.originalPrice.toLocaleString('vi-VN')}đ
            </span>
          )}
        </div>
      </div>

      {/* Stepper / Add Action (Right Section) */}
      <div
        className="shrink-0"
        onClick={(e) => e.stopPropagation()} // prevent double-triggering card click
      >
        {quantity === 0 ? (
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onUpdateQuantity(1)}
            aria-label={`Thêm ${item.name}`}
            className="px-3.5 py-2 rounded-xl bg-[#EEECFB] hover:bg-[#7C6FE8] text-[#7C6FE8] hover:text-white font-extrabold text-xs flex items-center gap-1 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm</span>
          </motion.button>
        ) : (
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-gray-200/90 shadow-xs">
            <motion.button
              type="button"
              whileTap={{ scale: 0.88 }}
              onClick={() => onUpdateQuantity(-1)}
              aria-label={`Giảm số lượng ${item.name}`}
              className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </motion.button>

            <span className="w-5 text-center font-black text-xs text-gray-950 font-mono">
              {quantity}
            </span>

            <motion.button
              type="button"
              whileTap={{ scale: 0.88 }}
              onClick={() => onUpdateQuantity(1)}
              aria-label={`Tăng số lượng ${item.name}`}
              className="w-7 h-7 rounded-lg bg-[#7C6FE8] hover:bg-[#685bc7] text-white flex items-center justify-center shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};




