/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · theme: White Minimal · component: SeatBookingHeader */
'use client';

import React from 'react';
import { Clock, Film } from 'lucide-react';

export interface SiblingShowtimeItem {
  id: string;
  time: string;
  format?: string;
}

interface SeatBookingHeaderProps {
  currentShowTime: string;
  currentShowtimeId?: string;
  showtimes?: SiblingShowtimeItem[];
  onSelectShowTime: (item: SiblingShowtimeItem) => void;
}

export const SeatBookingHeader: React.FC<SeatBookingHeaderProps> = ({
  currentShowTime,
  currentShowtimeId,
  showtimes = [],
  onSelectShowTime,
}) => {
  const displaySlots: SiblingShowtimeItem[] =
    showtimes.length > 0
      ? showtimes
      : [{ id: currentShowtimeId || '1', time: currentShowTime || '19:30', format: 'IMAX 2D' }];

  return (
    <section
      aria-label="Đổi suất chiếu nhanh"
      className="w-full bg-white rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-200/90 flex flex-wrap items-center justify-between gap-3 transition-colors"
    >
      <div className="flex items-center gap-2 text-xs font-bold text-gray-950">
        <div className="w-6 h-6 rounded-lg bg-[#EEECFB] flex items-center justify-center text-[#7C6FE8] shrink-0">
          <Clock className="w-3.5 h-3.5" />
        </div>
        <span>Đổi suất chiếu khác:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {displaySlots.map((item) => {
          const isActive =
            (currentShowtimeId && item.id === currentShowtimeId) ||
            item.time === currentShowTime;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectShowTime(item)}
              aria-pressed={isActive}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#7C6FE8] text-white shadow-[0_2px_8px_rgba(124,111,232,0.35)] ring-2 ring-[#7C6FE8]/25 scale-[1.02]'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200/80 hover:border-gray-300'
              }`}
            >
              <span>{item.time}</span>
              {item.format && (
                <span
                  className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-md uppercase tracking-wider ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200/70 text-gray-600'
                  }`}
                >
                  {item.format}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};

