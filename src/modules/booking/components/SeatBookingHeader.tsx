'use client';

import React from 'react';
import { Clock } from 'lucide-react';

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
  // If showtimes is empty, at least show the current showtime
  const displaySlots: SiblingShowtimeItem[] =
    showtimes.length > 0
      ? showtimes
      : [{ id: currentShowtimeId || '1', time: currentShowTime || '19:30' }];

  return (
    <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-xs font-bold text-[#131413]">
        <Clock className="w-4 h-4 text-[#7C6FE8]" />
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
              onClick={() => onSelectShowTime(item)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#7C6FE8] text-white shadow-sm scale-105'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {item.time}
              {item.format ? ` (${item.format})` : ''}
            </button>
          );
        })}
      </div>
    </div>
  );
};
