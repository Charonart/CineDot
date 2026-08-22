'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Popcorn, CupSoda, Sparkles, ArrowRight, X, Tag } from 'lucide-react';

interface FnbUpsellModalProps {
  isOpen: boolean;
  onAccept: () => void; // Chuyển sang trang chọn bắp nước (/booking/food)
  onSkip: () => void;   // Bỏ qua, sang thẳng thanh toán (/booking/payment)
  onClose: () => void;
}

export const FnbUpsellModal: React.FC<FnbUpsellModalProps> = ({
  isOpen,
  onAccept,
  onSkip,
  onClose,
}) => {
  // Lock body scroll when modal is open & listen for ESC key
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop with Apple-grade frosted glass */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={onSkip}
            className="fixed inset-0 bg-black/45 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{
              type: 'spring',
              damping: 28,
              stiffness: 350,
            }}
            className="relative w-full max-w-[480px] bg-white/95 backdrop-blur-2xl rounded-[32px] p-6 sm:p-8 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.8)_inset] border border-gray-100/80 overflow-hidden z-10 select-none"
          >
            {/* Ambient subtle glow decoration */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-gradient-to-br from-[#7C6FE8]/25 to-amber-200/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-gradient-to-tr from-rose-200/20 to-[#7C6FE8]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onSkip}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer z-20"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content Stack */}
            <div className="flex flex-col items-center text-center gap-5 relative z-10">
              {/* Apple-style Animated Icon Badge */}
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 shadow-lg shadow-amber-500/10 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/10 to-transparent" />
                  <div className="flex items-center justify-center gap-1">
                    <Popcorn className="w-8 h-8 text-amber-500 animate-bounce [animation-duration:2.5s]" />
                    <CupSoda className="w-7 h-7 text-[#7C6FE8] -ml-1 mt-1" />
                  </div>
                </div>

                {/* Floating sparkle badge */}
                <div className="absolute -top-1.5 -right-2 px-2 py-0.5 rounded-full bg-[#7C6FE8] text-white text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-md shadow-[#7C6FE8]/30">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Ưu đãi</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  Thêm chút hương vị cho buổi xem phim?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium max-w-sm">
                  Thưởng thức bắp giòn nóng hổi và nước mát lạnh chuẩn vị rạp chiếu — được chuẩn bị sẵn ngay khi bạn check-in.
                </p>
              </div>

              {/* Feature highlight badges */}
              <div className="w-full grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-100 flex items-center gap-2.5 text-left">
                  <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0">
                    <Popcorn className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-800 truncate">Bắp Rang Phô Mai</span>
                    <span className="text-[10px] text-slate-400 font-medium truncate">Caramel & Truyền thống</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-100 flex items-center gap-2.5 text-left">
                  <div className="w-8 h-8 rounded-xl bg-purple-100/80 text-[#7C6FE8] flex items-center justify-center shrink-0">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-800 truncate">Tiết kiệm 20%</span>
                    <span className="text-[10px] text-slate-400 font-medium truncate">Khi mua kèm cùng vé</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Apple UI style) */}
              <div className="w-full flex flex-col gap-2.5 pt-2">
                {/* Primary Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onAccept}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#7C6FE8]/30 transition-all cursor-pointer"
                >
                  <Popcorn className="w-4 h-4" />
                  <span>Chọn combo bắp nước</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </motion.button>

                {/* Secondary Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={onSkip}
                  className="w-full py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-800 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                >
                  <span>Không, tiếp tục thanh toán vé</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
