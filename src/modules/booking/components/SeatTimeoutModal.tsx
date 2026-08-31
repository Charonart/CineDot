/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · theme: White Minimal · component: SeatTimeoutModal */
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';

export interface SeatTimeoutModalProps {
  isOpen: boolean;
  movieSlug?: string;
  onReset?: () => void;
}

export const SeatTimeoutModal: React.FC<SeatTimeoutModalProps> = ({
  isOpen,
  movieSlug = 'spiderman-new-beginning',
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="timeout-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 bg-gray-950/50 backdrop-blur-xs"
        />

        {/* Modal Surface */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-[0_16px_40px_rgba(0,0,0,0.1)] border border-gray-200/90 flex flex-col gap-4 z-10 select-none text-left"
        >
          {/* Header indicator */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              Phiên giữ vé hết hạn
            </span>
          </div>

          {/* Title & Copy */}
          <div className="flex flex-col gap-1.5">
            <h2 id="timeout-modal-title" className="text-base font-bold text-gray-950">
              Phiên giữ chỗ đã kết thúc
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed font-normal">
              Thời gian 10 phút giữ ghế đã hết hạn. Các vị trí ghế đã được mở lại cho người xem khác. Vui lòng chọn lại suất chiếu để tiếp tục.
            </p>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
            <Link href="/">
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Về trang chủ
              </button>
            </Link>

            <Link href={`/movies/${movieSlug}`}>
              <button
                type="button"
                onClick={onReset}
                className="px-4 py-2 rounded-xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>Chọn lại suất chiếu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


