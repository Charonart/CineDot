'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Sparkles } from 'lucide-react';
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
      className={`w-full bg-white rounded-3xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.04)] border transition-all flex flex-col sm:flex-row items-center gap-5 ${
        isSelected
          ? 'border-[#7C6FE8] shadow-[0_12px_40px_rgba(124,111,232,0.12)]'
          : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      {/* Thumbnail Image */}
      <div className="relative w-full sm:w-28 aspect-square rounded-2xl overflow-hidden bg-slate-100 shrink-0">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {item.badge && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#7C6FE8] text-white text-[9px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            <span>{item.badge}</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1.5 flex-1 w-full sm:w-auto">
        <h3 className="font-bold text-base text-[#131413] leading-snug">
          {item.name}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-base font-extrabold text-[#7C6FE8]">
            {item.price.toLocaleString()}đ
          </span>
          {item.originalPrice && (
            <span className="text-xs text-slate-400 line-through">
              {item.originalPrice.toLocaleString()}đ
            </span>
          )}
        </div>
      </div>

      {/* Quantity Increment/Decrement Controls */}
      <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-gray-100 shrink-0">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onUpdateQuantity(-1)}
          disabled={quantity <= 0}
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
            quantity > 0
              ? 'bg-white hover:bg-slate-200 text-slate-700 shadow-2xs'
              : 'bg-transparent text-gray-300 cursor-not-allowed'
          }`}
        >
          <Minus className="w-3.5 h-3.5" />
        </motion.button>

        <span className="w-6 text-center font-extrabold text-sm text-[#131413]">
          {quantity}
        </span>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onUpdateQuantity(1)}
          className="w-8 h-8 rounded-xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white flex items-center justify-center shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </div>
  );
};
