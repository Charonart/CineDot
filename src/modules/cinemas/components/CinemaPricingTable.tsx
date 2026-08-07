'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Info, Ticket } from 'lucide-react';
import { PricingFormatTab, CinemaPricingFormat } from '../types/cinemas.types';

interface CinemaPricingTableProps {
  activeTab: PricingFormatTab;
  onSelectTab: (tab: PricingFormatTab) => void;
  pricingFormat: CinemaPricingFormat | null;
}

export const CinemaPricingTable: React.FC<CinemaPricingTableProps> = ({
  activeTab,
  onSelectTab,
  pricingFormat,
}) => {
  const formatTabs: { id: PricingFormatTab; label: string }[] = [
    { id: '2d', label: '2D Digital' },
    { id: '3d', label: '3D Experience' },
    { id: 'imax', label: 'IMAX Laser' },
  ];

  return (
    <div className="w-full flex flex-col gap-6 pt-4">
      {/* Title & Format Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-[#131413] flex items-center gap-2">
          <span className="w-1.5 h-6 bg-[#7C6FE8] rounded-full inline-block" />
          <span>Bảng Giá Vé Quy Định</span>
        </h2>

        {/* Format Pill Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
          {formatTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/30'
                  : 'text-slate-600 hover:text-[#7C6FE8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Grid */}
      {pricingFormat && (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col gap-4"
        >
          {/* Format Subheader */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-[#7C6FE8]" />
              <span>{pricingFormat.formatName}</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              Đơn vị: VNĐ / vé (Đã bao gồm VAT)
            </span>
          </div>

          {/* Pricing Table Grid */}
          <div className="w-full rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-xs">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-slate-100 p-4 text-xs font-extrabold text-slate-700 uppercase tracking-wider border-b border-gray-200">
              <div className="col-span-5 sm:col-span-4">Đối Tượng / Thời Gian</div>
              <div className="col-span-7 sm:col-span-8 grid grid-cols-3 text-center">
                <span>Ghế Thường</span>
                <span className="text-[#7C6FE8]">Ghế VIP</span>
                <span className="text-amber-600">Sweetbox (Đôi)</span>
              </div>
            </div>

            {/* Table Body Rows */}
            <div className="divide-y divide-gray-100">
              {pricingFormat.categories.map((cat, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 p-4 items-center hover:bg-slate-50/80 transition-colors"
                >
                  <div className="col-span-5 sm:col-span-4 flex flex-col gap-0.5">
                    <span className="text-xs font-extrabold text-slate-800">
                      {cat.dayType}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {cat.timeSlot}
                    </span>
                  </div>

                  <div className="col-span-7 sm:col-span-8 grid grid-cols-3 text-center items-center">
                    <span className="text-xs font-extrabold text-slate-700">
                      {cat.standardPrice.toLocaleString('vi-VN')}đ
                    </span>
                    <span className="text-xs font-extrabold text-[#7C6FE8] bg-purple-50 py-1.5 rounded-xl border border-purple-100">
                      {cat.vipPrice.toLocaleString('vi-VN')}đ
                    </span>
                    <span className="text-xs font-extrabold text-amber-700 bg-amber-50 py-1.5 rounded-xl border border-amber-100">
                      {cat.sweetboxPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Surcharges & Notes */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-gray-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <Info className="w-4 h-4 text-[#7C6FE8] shrink-0" />
              <span>Giá vé áp dụng cho tất cả cụm rạp CineDot thuộc khu vực được chọn.</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2.5 py-1 rounded-full bg-purple-100 text-[#7C6FE8] text-[10px] font-extrabold">
                Ghế VIP +10.000đ
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-extrabold">
                Sweetbox Dành Cho 2 Người
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
