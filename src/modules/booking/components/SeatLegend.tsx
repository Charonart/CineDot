'use client';

import React from 'react';
import { SeatTypeInfo, SeatItem } from '../types/seat-booking.types';

export interface SeatLegendProps {
  seatTypes?: SeatTypeInfo[];
  seats?: SeatItem[];
  basePrice?: number;
  // Fallback props for backwards compatibility
  standardPrice?: number;
  vipPrice?: number;
  sweetboxPrice?: number;
  hasStandard?: boolean;
  hasVip?: boolean;
  hasSweetbox?: boolean;
}

export const SeatLegend: React.FC<SeatLegendProps> = ({
  seatTypes = [],
  seats = [],
  basePrice = 110000,
  standardPrice,
  vipPrice,
  sweetboxPrice,
}) => {
  // Collect unique seat types present in the current showtime
  const presentTypeKeys = new Set(seats.map((s) => (s.type || 'STANDARD').toLowerCase()));

  // Filter seatTypes to those present in the showtime, or if empty use all available seatTypes
  let displayTypes = seatTypes.filter((st) => presentTypeKeys.size === 0 || presentTypeKeys.has(st.key.toLowerCase()));

  // Fallback if seatTypes is not yet populated
  if (displayTypes.length === 0) {
    displayTypes = [
      { key: 'standard', name: 'Ghế Thường', surcharge: 0, color: '#64748B', price: standardPrice || basePrice },
      { key: 'vip', name: 'Ghế VIP', surcharge: 20000, color: '#7C6FE8', price: vipPrice || (basePrice + 20000) },
      { key: 'sweetbox', name: 'Ghế Đôi Sweetbox', surcharge: 40000, color: '#EC4899', price: sweetboxPrice || ((basePrice + 40000) * 2) },
    ];
  }

  const formatPrice = (p?: number) => {
    if (!p) return '0đ';
    return `${p.toLocaleString('vi-VN')}đ`;
  };

  return (
    <div className="w-full flex flex-col gap-4 py-4 border-t border-gray-200 text-xs font-semibold text-slate-700">
      {/* 1. Dynamic Color Blocks Seat Legend */}
      <div className="w-full flex flex-wrap items-center justify-center gap-6">
        {displayTypes.map((st) => {
          const isCouple = st.key.toLowerCase() === 'sweetbox' || st.key.toLowerCase() === 'couple' || st.key.toLowerCase() === 'bed';
          return (
            <div key={st.key} className="flex items-center gap-2">
              <div
                style={{
                  backgroundColor: `${st.color}25`, // 15% tint
                  borderColor: st.color,
                }}
                className={`${isCouple ? 'w-8' : 'w-5'} h-5 rounded-md border shadow-2xs`}
              />
              <span>{st.name}</span>
            </div>
          );
        })}

        {/* Selected Seat Indicator */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#7C6FE8] shadow-[0_2px_8px_rgba(124,111,232,0.6)]" />
          <span>Ghế Đang Chọn</span>
        </div>

        {/* Booked Seat Indicator */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gray-200 border border-gray-300 shadow-2xs" />
          <span>Đã Được Đặt</span>
        </div>
      </div>

      {/* 2. Dynamic Price Tariff Bar */}
      <div className="w-full flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-3 border-t border-gray-100 text-[11px] text-slate-500 font-medium">
        <span>Bảng giá niêm yết:</span>
        {displayTypes.map((st, idx) => {
          const isCouple = st.key.toLowerCase() === 'sweetbox' || st.key.toLowerCase() === 'couple';
          const calculatedPrice = st.price || (basePrice + (st.surcharge || 0)) * (isCouple ? 2 : 1);

          return (
            <React.Fragment key={st.key}>
              {idx > 0 && <span className="text-slate-300">•</span>}
              <span className="flex items-center gap-1">
                <strong style={{ color: st.color }}>{st.name}:</strong>{' '}
                {formatPrice(calculatedPrice)}
                {isCouple ? ' / cặp' : ''}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
