'use client';

import React from 'react';
import {
  Calendar,
  Plus,
  RefreshCw,
  Building2,
  Copy,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
import { AdminCinemaOption } from '../../types/adminShowtime.types';

interface ShowtimesToolbarProps {
  cinemas: AdminCinemaOption[];
  isLoadingCinemas: boolean;
  selectedCinemaId?: number;
  onSelectCinema: (id: number) => void;

  datePills: Array<{ key: string; label: string }>;
  selectedDateKey: string;
  onSelectDate: (dateKey: string) => void;

  zoomLevel: number;
  onZoomChange: (level: number) => void;

  isFetchingShowtimes: boolean;
  onRefresh: () => void;
  onOpenAddModal: () => void;
  onOpenCloneModal: () => void;
}

const ZOOM_PRESETS = [
  { level: 0.75, label: '75% (Gọn)' },
  { level: 1.0, label: '100%' },
  { level: 1.35, label: '135%' },
  { level: 1.75, label: '175% (Rộng)' },
];

export function ShowtimesToolbar({
  cinemas,
  isLoadingCinemas,
  selectedCinemaId,
  onSelectCinema,
  datePills,
  selectedDateKey,
  onSelectDate,
  zoomLevel,
  onZoomChange,
  isFetchingShowtimes,
  onRefresh,
  onOpenAddModal,
  onOpenCloneModal,
}: ShowtimesToolbarProps) {
  const handleZoomIn = () => {
    onZoomChange(Math.min(2.0, Math.round((zoomLevel + 0.25) * 100) / 100));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(0.65, Math.round((zoomLevel - 0.25) * 100) / 100));
  };

  return (
    <div className="flex flex-col gap-4 text-slate-900">
      {/* Top Bar: Title & Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>HỆ THỐNG PHÂN BỔ & QUẢN TRỊ LỊCH CHIẾU PHIM</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Lập Lịch Chiếu & Quản Lý Phòng
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Giao diện Gantt Timeline trực quan: Thu phóng linh hoạt, đường gióng căn giờ chuẩn xác, tự động tính buffer dọn phòng.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onRefresh}
            disabled={isFetchingShowtimes}
            className="px-3.5 py-2.5 rounded-2xl bg-white border border-gray-200 text-slate-700 hover:text-[#7C6FE8] hover:border-[#7C6FE8] font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetchingShowtimes ? 'animate-spin' : ''}`} />
            <span>Làm Mới</span>
          </button>

          <button
            onClick={onOpenCloneModal}
            className="px-4 py-2.5 rounded-2xl bg-purple-50 text-[#7C6FE8] hover:bg-purple-100 border border-purple-200 font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Sao Chép Lịch Ngày</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-4 py-2.5 rounded-2xl bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Suất Chiếu Mới</span>
          </button>
        </div>
      </div>

      {/* Filter Row: Cinema, Date Pills & Zoom Controls */}
      <div className="p-4 rounded-3xl bg-white border border-gray-200 shadow-sm flex flex-col xl:flex-row items-center justify-between gap-4">
        {/* Cinema Selector */}
        <div className="flex items-center gap-2.5 w-full xl:w-auto">
          <div className="w-9 h-9 rounded-2xl bg-purple-50 text-[#7C6FE8] flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase">CỤM RẠP ĐANG CHỌN</span>
            <select
              value={selectedCinemaId || ''}
              onChange={(e) => onSelectCinema(Number(e.target.value))}
              disabled={isLoadingCinemas}
              className="font-extrabold text-sm text-slate-900 bg-transparent focus:outline-none cursor-pointer pr-4"
            >
              {cinemas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.provinceName ? `(${c.provinceName})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full xl:w-auto pb-1 xl:pb-0">
          {datePills.map((p) => (
            <button
              key={p.key}
              onClick={() => onSelectDate(p.key)}
              className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedDateKey === p.key
                  ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/25'
                  : 'bg-slate-50 text-slate-600 border border-gray-200 hover:bg-slate-100'
              }`}
            >
              {p.label}
            </button>
          ))}

          {/* Custom Date Input */}
          <div className="flex items-center border border-gray-200 rounded-2xl px-2.5 py-1.5 bg-slate-50 shrink-0">
            <input
              type="date"
              value={selectedDateKey}
              onChange={(e) => onSelectDate(e.target.value)}
              className="text-xs font-bold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Zoom Controls Bar */}
        <div className="flex items-center gap-2 w-full xl:w-auto justify-end border-t xl:border-t-0 pt-2 xl:pt-0 border-gray-100">
          <div className="flex items-center bg-slate-50 p-1 rounded-2xl border border-gray-200 shadow-2xs">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.65}
              className="p-1.5 rounded-xl hover:bg-white text-slate-600 hover:text-[#7C6FE8] disabled:opacity-40 transition-all cursor-pointer"
              title="Thu nhỏ timeline"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1 px-1">
              {ZOOM_PRESETS.map((preset) => (
                <button
                  key={preset.level}
                  onClick={() => onZoomChange(preset.level)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                    Math.abs(zoomLevel - preset.level) < 0.05
                      ? 'bg-[#7C6FE8] text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 2.0}
              className="p-1.5 rounded-xl hover:bg-white text-slate-600 hover:text-[#7C6FE8] disabled:opacity-40 transition-all cursor-pointer"
              title="Phóng to timeline"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
