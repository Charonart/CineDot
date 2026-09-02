/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · theme: White Minimal · component: BookingSummaryBar */
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Ticket, ArrowRight } from 'lucide-react';

interface BookingSummaryBarProps {
  selectedSeatLabels: string;
  selectedCount: number;
  totalPrice: number;
  showtimeId: string;
  isHolding?: boolean;
  onContinue?: () => Promise<void> | void;
}

export const BookingSummaryBar: React.FC<BookingSummaryBarProps> = ({
  selectedSeatLabels,
  selectedCount,
  totalPrice,
  showtimeId,
  isHolding = false,
  onContinue,
}) => {
  const isSelected = selectedCount > 0;

  return (
    <div
      role="region"
      aria-label="Thanh tóm tắt đặt vé nhanh"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-gray-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] py-3.5 sm:py-4 transition-colors"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Left: Selected Seats Summary */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-[#EEECFB] border border-[#7C6FE8]/20 flex items-center justify-center text-[#7C6FE8] shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <Ticket className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
              Ghế Đã Chọn ({selectedCount})
            </span>
            <span className="text-sm font-extrabold text-gray-950 truncate">
              {isSelected ? selectedSeatLabels : 'Vui lòng chọn ghế ngồi'}
            </span>
          </div>
        </div>

        {/* Right: Total Price & Continue Button */}
        <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex flex-col text-left sm:text-right">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Tạm Tính
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#7C6FE8]">
              {totalPrice.toLocaleString('vi-VN')}đ
            </span>
          </div>

          <motion.button
            type="button"
            whileHover={isSelected && !isHolding ? { scale: 1.02 } : {}}
            whileTap={isSelected && !isHolding ? { scale: 0.98 } : {}}
            disabled={!isSelected || isHolding}
            onClick={onContinue}
            className={`px-6 sm:px-7 py-3 rounded-full font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer select-none ${
              isSelected
                ? 'bg-[#7C6FE8] hover:bg-[#685bc7] text-white shadow-[0_4px_14px_rgba(124,111,232,0.35)]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
            } ${isHolding ? 'opacity-70 cursor-wait' : ''}`}
          >
            <span>{isHolding ? 'Đang xử lý...' : 'Tiếp tục'}</span>
            {!isHolding && <ArrowRight className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

