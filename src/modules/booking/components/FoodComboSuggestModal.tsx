/* Hallmark · component: FoodComboSuggestModal · genre: modern-minimal · theme: White Minimal / Iris Cinema
 * UX: Booking flow optimization popup after seat selection (Buy Combo vs Skip directly to Payment)
 */
'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Popcorn, CupSoda, ArrowRight, X, Sparkles, Check } from 'lucide-react';

interface FoodComboSuggestModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onSkip: () => void;
  onClose: () => void;
}

export const FoodComboSuggestModal: React.FC<FoodComboSuggestModalProps> = ({
  isOpen,
  onAccept,
  onSkip,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onSkip();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onSkip]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="combo-suggest-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onSkip}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            className="relative w-full max-w-[480px] bg-white rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-purple-100 overflow-hidden z-10 select-none flex flex-col items-center text-center gap-6 my-auto text-slate-900"
          >
            {/* Close / Skip Button */}
            <button
              type="button"
              onClick={onSkip}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Bỏ qua"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Icon Badge */}
            <div className="relative">
              <div className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-[#7C6FE8]/15 via-amber-400/20 to-pink-500/15 border border-[#7C6FE8]/25 flex items-center justify-center shadow-lg shadow-[#7C6FE8]/10">
                <div className="flex items-center justify-center gap-1.5">
                  <Popcorn className="w-8 h-8 text-amber-500 animate-bounce" />
                  <CupSoda className="w-7 h-7 text-[#7C6FE8] -ml-2 mt-2" />
                </div>
              </div>
              <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-sm">
                Ưu Đãi
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="flex flex-col gap-1.5">
              <h3
                id="combo-suggest-title"
                className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug"
              >
                Thêm Bắp Nước Cho Suất Chiếu?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium max-w-sm">
                Thưởng thức bắp giòn nóng hổi và nước ngọt mát lạnh — đặt trước online giúp tiết kiệm tới <strong className="text-amber-600 font-black">20%</strong> so với mua tại quầy.
              </p>
            </div>

            {/* Feature Highlight Pills */}
            <div className="w-full grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-2.5 text-left">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold">
                  <Popcorn className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-extrabold text-xs text-amber-950">Combo Đôi</span>
                  <span className="text-[10px] text-amber-700 font-medium">Bắp lớn + 2 Nước</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200/80 flex items-center gap-2.5 text-left">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C6FE8] flex items-center justify-center shrink-0 font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-extrabold text-xs text-purple-950">Nhận Tại Quầy</span>
                  <span className="text-[10px] text-purple-700 font-medium">Quét QR lấy ngay</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-2.5 pt-1">
              <button
                type="button"
                onClick={onAccept}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-md shadow-[#7C6FE8]/30 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Xem & Chọn Bắp Nước</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onSkip}
                className="w-full py-2.5 px-4 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
              >
                Bỏ qua, tiếp tục tới thanh toán vé →
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
