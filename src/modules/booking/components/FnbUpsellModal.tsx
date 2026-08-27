/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · theme: White Minimal · component: FnbUpsellModal */
'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Popcorn, CupSoda, ArrowRight, X, Tag } from 'lucide-react';

interface FnbUpsellModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onSkip: () => void;
  onClose: () => void;
}

export const FnbUpsellModal: React.FC<FnbUpsellModalProps> = ({
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
          aria-labelledby="upsell-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onSkip}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            className="relative w-full max-w-[460px] bg-white rounded-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-200/90 overflow-hidden z-10 select-none flex flex-col items-center text-center gap-5 my-auto"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onSkip}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon Badge */}
            <div className="w-16 h-16 rounded-2xl bg-[#EEECFB] border border-[#7C6FE8]/20 flex items-center justify-center shadow-[0_2px_8px_rgba(124,111,232,0.15)]">
              <div className="flex items-center justify-center gap-1">
                <Popcorn className="w-7 h-7 text-amber-500" />
                <CupSoda className="w-6 h-6 text-[#7C6FE8] -ml-1 mt-1" />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="flex flex-col gap-1.5">
              <h3 id="upsell-modal-title" className="text-lg sm:text-xl font-extrabold text-gray-950 tracking-tight leading-snug">
                Thêm bắp nước cho buổi xem phim?
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium max-w-sm">
                Thưởng thức bắp giòn nóng hổi và nước ngọt mát lạnh — được chuẩn bị sẵn ngay khi bạn đến rạp.
              </p>
            </div>

            {/* Feature highlight badges */}
            <div className="w-full grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center gap-2.5 text-left">
                <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                  <Popcorn className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-gray-950 truncate">Bắp Rang Bơ</span>
                  <span className="text-[10px] text-gray-500 truncate">Phô mai, Caramel</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center gap-2.5 text-left">
                <div className="w-8 h-8 rounded-xl bg-[#EEECFB] text-[#7C6FE8] flex items-center justify-center shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-gray-950 truncate">Ưu Đãi Combo</span>
                  <span className="text-[10px] text-[#7C6FE8] font-bold truncate">Tiết kiệm tới 20%</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-2.5 pt-1">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onAccept}
                className="w-full py-3 px-6 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(124,111,232,0.35)] transition-all cursor-pointer"
              >
                <Popcorn className="w-4 h-4" />
                <span>CHỌN COMBO BẮP NƯỚC</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </motion.button>

              <button
                type="button"
                onClick={onSkip}
                className="w-full py-2.5 px-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
              >
                <span>Không, tiếp tục thanh toán vé</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

