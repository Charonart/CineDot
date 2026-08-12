'use client';

import React from 'react';
import { Clock } from 'lucide-react';

interface SeatBookingHeaderProps {
  currentShowTime: string;
  onSelectShowTime: (time: string) => void;
}

export const SeatBookingHeader: React.FC<SeatBookingHeaderProps> = ({
  currentShowTime = '19:30',
  onSelectShowTime,
}) => {
  const showtimeSlots = ['09:15', '11:30', '14:15', '17:00', '19:30', '22:15'];

  return (
    <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-xs font-bold text-[#131413]">
        <Clock className="w-4 h-4 text-[#7C6FE8]" />
        <span>Đổi suất chiếu:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {showtimeSlots.map((time) => {
          const isActive = time === currentShowTime;
          return (
            <button
              key={time}
              onClick={() => onSelectShowTime(time)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#7C6FE8] text-white shadow-sm scale-105'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
};
