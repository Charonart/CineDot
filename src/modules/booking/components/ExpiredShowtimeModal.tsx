/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · theme: White Minimal · component: ExpiredShowtimeModal */
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowRight, Clock, Film } from 'lucide-react';
import Link from 'next/link';
import { SiblingShowtimeItem } from './SeatBookingHeader';

export interface ExpiredShowtimeModalProps {
  isOpen: boolean;
  movieSlug?: string;
  showTime?: string;
  showDate?: string;
  siblingShowtimes?: SiblingShowtimeItem[];
  onSelectSiblingShowtime?: (item: SiblingShowtimeItem) => void;
}

export const ExpiredShowtimeModal: React.FC<ExpiredShowtimeModalProps> = ({
  isOpen,
  movieSlug = 'movie-detail',
  showTime = '19:30',
  showDate = 'Hôm nay',
  siblingShowtimes = [],
  onSelectSiblingShowtime,
}) => {
  if (!isOpen) return null;

  const nextAvailableSlot = siblingShowtimes.length > 0 ? siblingShowtimes[0] : null;

  return (
    <AnimatePresence>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="expired-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 bg-gray-950/60 backdrop-blur-xs"
        />

        {/* Modal Surface */}
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-[0_16px_40px_rgba(0,0,0,0.15)] border border-gray-200/90 flex flex-col gap-4 z-10 select-none text-left"
        >
          {/* Header indicator */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 animate-pulse" />
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
              Suất chiếu đã quá giờ
            </span>
          </div>

          {/* Title & Copy */}
          <div className="flex flex-col gap-1.5">
            <h2 id="expired-modal-title" className="text-base font-bold text-gray-950 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <span>Suất chiếu đã bắt đầu hoặc đã kết thúc</span>
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed font-normal">
              Suất chiếu <strong className="text-gray-900 font-semibold">{showTime}</strong> ({showDate}) hiện đã qua thời gian mở bán vé trực tuyến. Quý khách vui lòng chọn một suất chiếu sắp tới của phim để tiếp tục đặt vé.
            </p>
          </div>

          {/* Sibling Upcoming Showtimes Quick Recommendation */}
          {siblingShowtimes.length > 0 && (
            <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 flex flex-col gap-2">
              <span className="text-[11px] font-bold text-[#7C6FE8] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Các suất chiếu sắp tới cùng ngày:</span>
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {siblingShowtimes.slice(0, 4).map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => onSelectSiblingShowtime?.(slot)}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#7C6FE8] hover:text-white text-[#7C6FE8] border border-purple-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    <span>{slot.time}</span>
                    {slot.format && <span className="ml-1 text-[10px] opacity-75">({slot.format})</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-gray-100">
            <Link href="/">
              <button
                type="button"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Về trang chủ
              </button>
            </Link>

            <Link href={`/movies/${movieSlug}`}>
              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Xem tất cả lịch chiếu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
