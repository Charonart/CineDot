/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · theme: White Minimal · component: SeatLegend */
'use client';

import React from 'react';
import { SeatTypeInfo, SeatItem } from '../types/seat-booking.types';

export interface SeatLegendProps {
  seatTypes?: SeatTypeInfo[];
  seats?: SeatItem[];
  basePrice?: number;
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
  const presentTypeKeys = new Set(seats.map((s) => (s.type || 'STANDARD').toLowerCase()));

  let displayTypes = seatTypes.filter((st) => presentTypeKeys.size === 0 || presentTypeKeys.has(st.key.toLowerCase()));

  if (displayTypes.length === 0) {
    const baseList: SeatTypeInfo[] = [
      { key: 'standard', name: 'Ghế Thường', surcharge: 0, color: '#64748B', price: standardPrice || basePrice },
      { key: 'vip', name: 'Ghế VIP', surcharge: 20000, color: '#7C6FE8', price: vipPrice || (basePrice + 20000) },
      { key: 'sweetbox', name: 'Ghế Đôi Sweetbox', surcharge: 40000, color: '#EC4899', price: sweetboxPrice || ((basePrice + 40000) * 2) },
    ];

    if (presentTypeKeys.has('deluxe')) {
      baseList.push({ key: 'deluxe', name: 'Ghế Deluxe Ngả Lưng', surcharge: 35000, color: '#D97706', price: basePrice + 35000 });
    }
    if (presentTypeKeys.has('bed')) {
      baseList.push({ key: 'bed', name: 'Giường Nằm VIP Bed', surcharge: 70000, color: '#059669', price: (basePrice + 70000) * 2 });
    }

    displayTypes = baseList;
  }

  const formatPrice = (p?: number) => {
    if (!p) return '0đ';
    return `${p.toLocaleString('vi-VN')}đ`;
  };

  return (
    <footer
      aria-label="Chú thích loại ghế và bảng giá"
      className="w-full flex flex-col gap-3 py-3 border-t border-gray-200/90 text-xs font-semibold text-gray-700 select-none"
    >
      {/* 1. Dynamic Color Blocks Seat Legend */}
      <div className="w-full flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5">
        {displayTypes.map((st) => {
          const isCouple = st.key.toLowerCase() === 'sweetbox' || st.key.toLowerCase() === 'couple' || st.key.toLowerCase() === 'bed';
          const isVip = st.key.toLowerCase() === 'vip';

          return (
            <div key={st.key} className="flex items-center gap-1.5">
              <div
                style={{
                  backgroundColor: isVip ? '#F3F0FF' : isCouple ? '#FDF2F8' : '#F8FAFC',
                  borderColor: st.color,
                }}
                className={`${isCouple ? 'w-8' : 'w-5'} h-5 rounded-lg border-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)]`}
              />
              <span className="text-gray-800 font-bold">{st.name}</span>
            </div>
          );
        })}

        {/* Selected Seat Indicator */}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-lg bg-[#7C6FE8] border border-[#685BC7] shadow-[0_2px_8px_rgba(124,111,232,0.4)]" />
          <span className="text-gray-950 font-bold">Ghế Đang Chọn</span>
        </div>

        {/* Other User Selecting Indicator */}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-lg bg-[#FFFBEB] border-2 border-amber-400 animate-pulse" />
          <span className="text-amber-800 font-bold">Có Người Đang Nhắm</span>
        </div>

        {/* Holding Seat Indicator */}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-lg bg-[#FEF3C7] border border-amber-400" />
          <span className="text-amber-900 font-medium">Đang Giữ Chỗ</span>
        </div>

        {/* Booked Seat Indicator */}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-lg bg-[#F1F5F9] border border-gray-300" />
          <span className="text-gray-400 font-normal">Đã Được Đặt</span>
        </div>
      </div>

      {/* 2. Dynamic Price Tariff Bar */}
      <div className="w-full flex flex-wrap items-center justify-center gap-x-5 gap-y-1 pt-2.5 border-t border-gray-100 text-[11px] text-gray-600 font-medium">
        <span className="text-gray-400 font-semibold">Bảng giá niêm yết:</span>
        {displayTypes.map((st, idx) => {
          const isCouple = st.key.toLowerCase() === 'sweetbox' || st.key.toLowerCase() === 'couple';
          const calculatedPrice = st.price || (basePrice + (st.surcharge || 0)) * (isCouple ? 2 : 1);

          return (
            <React.Fragment key={st.key}>
              {idx > 0 && <span className="text-gray-300">•</span>}
              <span className="flex items-center gap-1">
                <strong style={{ color: st.color }} className="font-bold">{st.name}:</strong>{' '}
                <span className="font-extrabold text-gray-900">{formatPrice(calculatedPrice)}</span>
                {isCouple ? <span className="text-gray-400">/ cặp</span> : ''}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </footer>
  );
};

