'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface FoodUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  showtimeId: string;
  movieParam?: string;
  seatsParam?: string;
  dateParam?: string;
  timeParam?: string;
  cinemaParam?: string;
}

export const FoodUpsellModal: React.FC<FoodUpsellModalProps> = ({
  isOpen,
  onClose,
  showtimeId,
  movieParam,
  seatsParam,
  dateParam,
  timeParam,
  cinemaParam,
}) => {
  if (!isOpen) return null;

  const buildFoodUrl = (combo?: string) => {
    const params = new URLSearchParams();
    if (showtimeId) params.set('showtime_id', showtimeId);
    if (combo) params.set('combo', combo);
    if (movieParam) params.set('movie', movieParam);
    if (seatsParam) params.set('seats', seatsParam);
    if (dateParam) params.set('date', dateParam);
    if (timeParam) params.set('time', timeParam);
    if (cinemaParam) params.set('cinema', cinemaParam);

    return `/booking/food?${params.toString()}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(124,111,232,0.25)] border border-gray-100 flex flex-col gap-6 z-10"
        >
          {/* Close Button X */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center text-center gap-2 pt-2">
            <div className="w-14 h-14 rounded-2xl bg-[#7C6FE8]/15 flex items-center justify-center text-[#7C6FE8] mb-1">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Ưu Đãi Đặc Biệt Mua Cùng Vé</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#131413]">
              🍿 Thưởng Thức Phim Trọn Vẹn Cùng Bắp Nước!
            </h2>
            <p className="text-xs text-slate-500 max-w-xs">
              Tiết kiệm đến 20% khi chọn các bộ Combo hot ngay lúc này.
            </p>
          </div>

          {/* Top 2 Best-seller Combos */}
          <div className="flex flex-col gap-3">
            {/* Combo 1 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center text-2xl shrink-0">
                  🍿🥤
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-[#131413]">Combo Cine Single</span>
                  <span className="text-[11px] text-slate-500">1 Bắp Phô Mai + 1 Pepsi Lớn</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-extrabold text-[#7C6FE8]">95.000đ</span>
                    <span className="text-[11px] text-slate-400 line-through">120.000đ</span>
                  </div>
                </div>
              </div>

              <Link href={buildFoodUrl('single')}>
                <button className="px-3.5 py-2 rounded-xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white text-xs font-bold flex items-center gap-1 transition-all shadow-sm cursor-pointer">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Mua ngay</span>
                </button>
              </Link>
            </div>

            {/* Combo 2 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center text-2xl shrink-0">
                  🍿🥤🥤
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-[#131413]">Combo Cine Double</span>
                  <span className="text-[11px] text-slate-500">1 Bắp Lớn + 2 Pepsi Lớn</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-extrabold text-[#7C6FE8]">139.000đ</span>
                    <span className="text-[11px] text-slate-400 line-through">175.000đ</span>
                  </div>
                </div>
              </div>

              <Link href={buildFoodUrl('double')}>
                <button className="px-3.5 py-2 rounded-xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white text-xs font-bold flex items-center gap-1 transition-all shadow-sm cursor-pointer">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Mua ngay</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Action Buttons (2 Flows) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Flow 1: Dismiss / Skip */}
            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Bỏ qua (Không mua)
            </button>

            {/* Flow 2: Go to Food Booking Page */}
            <Link href={buildFoodUrl()}>
              <button className="w-full py-3 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#7C6FE8]/30 cursor-pointer">
                <span>Xem tất cả Combo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
