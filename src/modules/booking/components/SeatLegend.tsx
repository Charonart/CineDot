'use client';

import React from 'react';

export const SeatLegend: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-4 py-4 border-t border-gray-200 text-xs font-semibold text-slate-700">
      {/* 1. Pure Color Blocks Seat Legend (No text numbers inside blocks) */}
      <div className="w-full flex flex-wrap items-center justify-center gap-6">
        {/* Standard Seat */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#F2F2F7] border border-gray-300 shadow-2xs" />
          <span>Ghế Thường</span>
        </div>

        {/* VIP Seat */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#7C6FE8]/20 border border-[#7C6FE8] shadow-2xs" />
          <span>Ghế VIP</span>
        </div>

        {/* Sweetbox Couple Seat */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-5 rounded-md bg-pink-100 border border-pink-400 shadow-2xs" />
          <span>Ghế Đôi Sweetbox</span>
        </div>

        {/* Selected Seat */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#7C6FE8] shadow-[0_2px_8px_rgba(124,111,232,0.6)]" />
          <span>Ghế Đang Chọn</span>
        </div>

        {/* Booked Seat */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gray-200 border border-gray-300 shadow-2xs" />
          <span>Đã Được Đặt</span>
        </div>
      </div>

      {/* 2. Price Tariff Bar */}
      <div className="w-full flex flex-wrap items-center justify-center gap-6 pt-3 border-t border-gray-100 text-[11px] text-slate-500 font-medium">
        <span>Bảng giá niêm yết:</span>
        <span className="flex items-center gap-1">
          <strong className="text-slate-800">Ghế Thường:</strong> 110.000đ
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-1">
          <strong className="text-[#7C6FE8]">Ghế VIP:</strong> 140.000đ
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-1">
          <strong className="text-pink-600">Ghế Đôi Sweetbox:</strong> 250.000đ / cặp
        </span>
      </div>
    </div>
  );
};
