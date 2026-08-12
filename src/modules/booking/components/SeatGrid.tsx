'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SeatItem } from '../types/seat-booking.types';

interface SeatGridProps {
  seats: SeatItem[];
  selectedSeatIds: string[];
  onToggleSeat: (seatId: string) => void;
}

export const SeatGrid: React.FC<SeatGridProps> = ({
  seats,
  selectedSeatIds,
  onToggleSeat,
}) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  return (
    <div className="w-full flex flex-col items-center gap-3 overflow-x-auto py-4 scrollbar-none">
      {rows.map((rowLabel) => {
        const rowSeats = seats.filter((s) => s.row === rowLabel);
        const isSweetboxRow = ['I', 'J'].includes(rowLabel);

        return (
          <div key={rowLabel} className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Left Row Label */}
            <span className="w-6 text-center text-xs font-bold text-slate-400">
              {rowLabel}
            </span>

            {/* Seat Buttons Grid */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {isSweetboxRow ? (
                // Render Sweetbox Couple Seats (6 Pairs = 12 seats)
                Array.from({ length: 6 }).map((_, pairIdx) => {
                  const s1 = rowSeats[pairIdx * 2];
                  const s2 = rowSeats[pairIdx * 2 + 1];
                  if (!s1 || !s2) return null;

                  const isSelected = selectedSeatIds.includes(s1.id);
                  const isBooked = s1.status === 'BOOKED';

                  return (
                    <motion.button
                      key={s1.pairId || s1.id}
                      whileHover={!isBooked ? { scale: 1.08, y: -2 } : {}}
                      whileTap={!isBooked ? { scale: 0.94 } : {}}
                      onClick={() => onToggleSeat(s1.id)}
                      disabled={isBooked}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isBooked
                          ? 'bg-gray-200 border border-gray-300 text-gray-400 cursor-not-allowed shadow-none'
                          : isSelected
                          ? 'bg-[#7C6FE8] text-white border border-[#7C6FE8] shadow-[0_6px_20px_rgba(124,111,232,0.6)]'
                          : 'bg-pink-50 border border-pink-300 text-pink-700 hover:border-pink-500 hover:bg-pink-100 shadow-sm'
                      }`}
                    >
                      <span>{s1.id}</span>
                      <span>-</span>
                      <span>{s2.id}</span>
                    </motion.button>
                  );
                })
              ) : (
                // Render Standard & VIP Single Seats (12 seats)
                rowSeats.map((seat, idx) => {
                  const isSelected = selectedSeatIds.includes(seat.id);
                  const isBooked = seat.status === 'BOOKED';
                  const isVip = seat.type === 'VIP';

                  // Add Aisle gap between seats 3 & 4, and 9 & 10
                  const isAisleGap = idx === 3 || idx === 9;

                  return (
                    <React.Fragment key={seat.id}>
                      {isAisleGap && <div className="w-3 sm:w-5" />}

                      <motion.button
                        whileHover={!isBooked ? { scale: 1.15, y: -2 } : {}}
                        whileTap={!isBooked ? { scale: 0.9 } : {}}
                        onClick={() => onToggleSeat(seat.id)}
                        disabled={isBooked}
                        className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                          isBooked
                            ? 'bg-gray-200 border border-gray-300 text-gray-400 cursor-not-allowed shadow-none'
                            : isSelected
                            ? 'bg-[#7C6FE8] text-white border border-[#7C6FE8] shadow-[0_6px_20px_rgba(124,111,232,0.6)]'
                            : isVip
                            ? 'bg-[#7C6FE8]/15 border border-[#7C6FE8]/50 text-[#7C6FE8] hover:bg-[#7C6FE8]/30 shadow-sm'
                            : 'bg-[#F2F2F7] border border-gray-300 text-slate-700 hover:bg-gray-200 shadow-sm'
                        }`}
                      >
                        {seat.number}
                      </motion.button>
                    </React.Fragment>
                  );
                })
              )}
            </div>

            {/* Right Row Label */}
            <span className="w-6 text-center text-xs font-bold text-slate-400">
              {rowLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
};
