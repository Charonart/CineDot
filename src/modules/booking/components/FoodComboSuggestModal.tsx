'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Popcorn, Sparkles, ArrowRight, ArrowLeft, ShoppingBag, CreditCard, X } from 'lucide-react';

interface FoodComboSuggestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFood: () => void;
  onSkipToPayment: () => void;
}

const FEATURED_COMBOS = [
  {
    id: 1,
    name: 'Combo Solo Cine',
    desc: '1 Bắp Ngọt Lớn (60oz) + 1 Nước Ngọt (32oz)',
    price: '89.000đ',
    originalPrice: '105.000đ',
    badge: 'BÁN CHẠY',
    bg: 'from-amber-500/10 to-orange-500/10 border-amber-200',
    badgeBg: 'bg-amber-500',
  },
  {
    id: 2,
    name: 'Combo Couple Cine',
    desc: '1 Bắp Ngọt Thượng Hạng + 2 Nước Ngọt Lớn',
    price: '119.000đ',
    originalPrice: '145.000đ',
    badge: 'TIẾT KIỆM 20%',
    bg: 'from-purple-500/10 to-indigo-500/10 border-purple-200',
    badgeBg: 'bg-[#7C6FE8]',
  },
];

export const FoodComboSuggestModal: React.FC<FoodComboSuggestModalProps> = ({
  isOpen,
  onClose,
  onSelectFood,
  onSkipToPayment,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(124,111,232,0.3)] border border-gray-100 z-10 flex flex-col gap-6"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="flex flex-col items-center text-center gap-2 pt-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#7C6FE8] to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-[#7C6FE8]/30 mb-1">
              <Popcorn className="w-8 h-8 animate-bounce" />
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-extrabold border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>ƯU ĐÃI ĐẶC BIỆT KHI ĐẶT VÉ</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[#131413] tracking-tight">
              Thêm Bắp Nước Cho Trọn Vẹn?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed font-medium">
              Thưởng thức bắp giòn rụm và nước mát lạnh với giá ưu đãi tốt nhất khi đặt trước cùng vé xem phim.
            </p>
          </div>

          {/* Featured Combos Showcase */}
          <div className="flex flex-col gap-3">
            {FEATURED_COMBOS.map((combo) => (
              <div
                key={combo.id}
                className={`p-4 rounded-2xl bg-gradient-to-r ${combo.bg} border flex items-center justify-between gap-3`}
              >
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#131413]">{combo.name}</span>
                    <span
                      className={`${combo.badgeBg} text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs`}
                    >
                      {combo.badge}
                    </span>
                  </div>
                  <span className="text-xs text-slate-600 font-medium">{combo.desc}</span>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="font-black text-base text-[#7C6FE8]">{combo.price}</span>
                  <span className="text-[11px] text-slate-400 line-through">{combo.originalPrice}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {/* Secondary CTA: Skip & Pay Directly */}
            <button
              onClick={onSkipToPayment}
              className="w-full sm:w-1/2 py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-slate-500" />
              <span>Bỏ Qua & Thanh Toán</span>
            </button>

            {/* Primary CTA: Select Food Combos */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSelectFood}
              className="w-full sm:w-1/2 py-3.5 px-4 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#7C6FE8]/30 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Xem & Chọn Bắp Nước</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
