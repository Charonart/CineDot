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
}

export const BookingSummaryBar: React.FC<BookingSummaryBarProps> = ({
  selectedSeatLabels,
  selectedCount,
  totalPrice,
  showtimeId,
}) => {
  const isSelected = selectedCount > 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-gray-200 shadow-[0_-12px_40px_rgba(0,0,0,0.08)] py-3.5 sm:py-4">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Selected Seats Summary */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-[#7C6FE8]/15 flex items-center justify-center text-[#7C6FE8] shrink-0">
            <Ticket className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Ghế Đã Chọn ({selectedCount})
            </span>
            <span className="text-sm sm:text-base font-bold text-[#131413] line-clamp-1">
              {isSelected ? selectedSeatLabels : 'Vui lòng chọn ghế ngồi'}
            </span>
          </div>
        </div>

        {/* Right: Total Price & Continue Button */}
        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex flex-col text-right">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Tạm Tính
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#7C6FE8]">
              {totalPrice.toLocaleString()}đ
            </span>
          </div>

          <Link href={isSelected ? `/booking/food?showtime_id=${showtimeId}` : '#'}>
            <motion.button
              whileHover={isSelected ? { scale: 1.04 } : {}}
              whileTap={isSelected ? { scale: 0.96 } : {}}
              disabled={!isSelected}
              className={`px-7 py-3.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#7C6FE8] hover:bg-[#685bc7] text-white shadow-lg shadow-[#7C6FE8]/35'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>TIẾP TỤC CHỌN BẮP NƯỚC</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
};
