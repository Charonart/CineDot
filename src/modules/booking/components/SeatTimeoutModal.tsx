'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimerReset, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface SeatTimeoutModalProps {
  isOpen: boolean;
  movieSlug?: string;
}

export const SeatTimeoutModal: React.FC<SeatTimeoutModalProps> = ({
  isOpen,
  movieSlug = 'spiderman-new-beginning',
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop (Modal cannot be dismissed by clicking backdrop to enforce release of seats) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(225,29,72,0.25)] border border-rose-100 flex flex-col items-center text-center gap-5 z-10"
        >
          {/* Glowing Alarm Timer Icon */}
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/20 ring-8 ring-rose-50">
            <TimerReset className="w-8 h-8 animate-bounce" />
          </div>

          {/* Title & Message Content */}
          <div className="flex flex-col gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#131413]">
              Hết Thời Gian Giữ Ghế!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xs font-medium">
              Rất tiếc, thời gian giữ ghế của bạn đã hết hạn. Các vị trí ghế bạn chọn đã được tự động giải phóng để đảm bảo công bằng cho các khách hàng khác.
            </p>
          </div>

          {/* Action Button: Return to Movie Detail to re-select */}
          <div className="w-full pt-2">
            <Link href={`/movies/${movieSlug}`}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#7C6FE8]/35 transition-all cursor-pointer"
              >
                <span>Quay Về Chọn Lại Suất Chiếu</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
