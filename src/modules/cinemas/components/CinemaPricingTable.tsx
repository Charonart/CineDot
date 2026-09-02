'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Info,
  Ticket,
  GraduationCap,
  Crown,
  Tag,
} from 'lucide-react';
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
  const formatTabs: { id: PricingFormatTab; label: string; badge?: string }[] = [
    { id: '2d', label: '2D Digital Tiêu Chuẩn' },
    { id: '3d', label: '3D Experience' },
    { id: 'imax', label: 'IMAX Laser 4K', badge: 'Flagship' },
  ];

  return (
    <section className="w-full flex flex-col gap-5">
      {/* 1. Header & Format Segmented Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#7C6FE8]" />
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Bảng Giá Vé Quy Định
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Giá vé niêm yết chính thức theo khung giờ và loại ghế tại cụm rạp
          </p>
        </div>

        {/* Segmented Control */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 w-full sm:w-fit overflow-x-auto scrollbar-none">
          {formatTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                      isActive
                        ? 'bg-[#EEECFB] text-[#7C6FE8]'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Pricing Matrix Table */}
      {pricingFormat && (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full flex flex-col gap-4"
        >
          <div className="w-full rounded-3xl overflow-hidden border border-slate-200/90 bg-white shadow-2xs">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-slate-50/90 px-5 py-3.5 text-xs font-bold text-slate-600 border-b border-slate-200/80">
              <div className="col-span-5 sm:col-span-4 uppercase tracking-wider text-[11px] text-slate-500">
                Thời Gian & Đối Tượng
              </div>
              <div className="col-span-7 sm:col-span-8 grid grid-cols-3 text-center text-[11px] uppercase tracking-wider">
                <span className="text-slate-700">Ghế Thường</span>
                <span className="text-[#7C6FE8] font-extrabold">Ghế VIP</span>
                <span className="text-amber-700 font-extrabold">Sweetbox (Đôi)</span>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-slate-100">
              {pricingFormat.categories.map((cat, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 px-5 py-4 items-center hover:bg-slate-50/60 transition-colors"
                >
                  <div className="col-span-5 sm:col-span-4 flex flex-col gap-0.5">
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      {cat.dayType}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {cat.timeSlot}
                    </span>
                  </div>

                  <div className="col-span-7 sm:col-span-8 grid grid-cols-3 text-center items-center font-mono">
                    <span className="text-xs sm:text-sm font-bold text-slate-800 tabular-nums">
                      {cat.standardPrice.toLocaleString('vi-VN')}đ
                    </span>
                    <div>
                      <span className="inline-block text-xs sm:text-sm font-extrabold text-[#7C6FE8] bg-[#EEECFB] px-2.5 py-1 rounded-xl tabular-nums">
                        {cat.vipPrice.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    <div>
                      <span className="inline-block text-xs sm:text-sm font-extrabold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/60 tabular-nums">
                        {cat.sweetboxPrice.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table Footer Note */}
            <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0" />
                <span>Đơn giá trên đã bao gồm thuế VAT (8%). Áp dụng cho 01 vé / 01 suất chiếu.</span>
              </div>
              <span className="text-slate-400">
                Sweetbox tính cho 02 người (bao gồm 02 phần vé)
              </span>
            </div>
          </div>

          {/* 3. Concession & Special Rates Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center shrink-0 mt-0.5">
                <GraduationCap className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-xs font-bold text-slate-900">
                  Ưu đãi Học sinh - Sinh viên (U22)
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  Đồng giá vé <strong>65.000đ</strong> cho tất cả các suất chiếu trước 17:00 từ Thứ 2 đến Thứ 6 khi xuất trình thẻ HSSV.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <Crown className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-xs font-bold text-slate-900">
                  Đặc quyền Hội viên StarClub
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  Tích lũy từ <strong>5% - 10% điểm thưởng</strong> trên mỗi giao dịch vé và bắp nước, nhận voucher vé miễn phí dịp sinh nhật.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
};
