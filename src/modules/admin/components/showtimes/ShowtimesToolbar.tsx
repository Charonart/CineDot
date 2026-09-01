'use client';

import React from 'react';
import {
  Plus,
  RefreshCw,
  Building2,
  Copy,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Magnet,
  Calendar,
  Sparkles,
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

  snapMinutes: number;
  onSnapChange: (snap: number) => void;

  isFetchingShowtimes: boolean;
  onRefresh: () => void;
  onOpenAddModal: () => void;
  onOpenCloneModal: () => void;
  onOpenAiModal?: () => void;
}

const SNAP_OPTIONS = [
  { value: 5, label: '5p' },
  { value: 10, label: '10p' },
  { value: 15, label: '15p' },
  { value: 30, label: '30p' },
  { value: 1, label: 'Tự do' },
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
  snapMinutes,
  onSnapChange,
  isFetchingShowtimes,
  onRefresh,
  onOpenAddModal,
  onOpenCloneModal,
  onOpenAiModal,
}: ShowtimesToolbarProps) {
  const handleStepDay = (step: number) => {
    const d = new Date(selectedDateKey);
    d.setDate(d.getDate() + step);
    onSelectDate(d.toISOString().split('T')[0]);
  };

  const handleZoomIn = () => {
    onZoomChange(Math.min(2.0, Math.round((zoomLevel + 0.25) * 100) / 100));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(0.65, Math.round((zoomLevel - 0.25) * 100) / 100));
  };

  return (
    <div className="bg-slate-50/70 border-b border-gray-200 px-3.5 py-2.5 flex flex-col gap-2 select-none shrink-0 font-sans">
      {/* Top Command Row */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none flex-wrap">
        {/* Left: Branch & Date Navigation Controls */}
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
          {/* Cinema Branch Dropdown */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-gray-200 text-xs font-medium shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0" />
            <select
              value={selectedCinemaId || ''}
              onChange={(e) => onSelectCinema(Number(e.target.value))}
              disabled={isLoadingCinemas}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer pr-1 max-w-[180px] truncate"
            >
              {cinemas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.provinceName ? `(${c.provinceName})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Date Stepper (< Today >) */}
          <div className="flex items-center rounded-md border border-gray-200 bg-white p-0.5 shadow-2xs">
            <button
              onClick={() => handleStepDay(-1)}
              className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Ngày trước"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSelectDate(new Date().toISOString().split('T')[0])}
              className="px-2 py-0.5 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded transition-colors cursor-pointer"
            >
              Hôm nay
            </button>
            <button
              onClick={() => handleStepDay(1)}
              className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Ngày tiếp theo"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Native Date Picker */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-md px-2 py-1 bg-white shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="date"
              value={selectedDateKey}
              onChange={(e) => onSelectDate(e.target.value)}
              className="text-xs font-medium text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isFetchingShowtimes}
            className="p-1.5 rounded-md border border-gray-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-[#7C6FE8] text-xs transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
            title="Làm mới lịch chiếu"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetchingShowtimes ? 'animate-spin text-[#7C6FE8]' : ''}`} />
          </button>
        </div>

        {/* Right: Snap Option + Zoom Level + Actions */}
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
          {/* Snap Selector */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-gray-200 text-xs font-medium shadow-2xs">
            <Magnet className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0" />
            <span className="text-slate-400 text-[11px]">Hít lưới:</span>
            <select
              value={snapMinutes}
              onChange={(e) => onSnapChange(Number(e.target.value))}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer text-xs"
            >
              {SNAP_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center bg-white p-0.5 rounded-md border border-gray-200 text-xs shadow-2xs">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.65}
              className="p-1 rounded text-slate-500 hover:text-slate-900 disabled:opacity-30 transition-colors cursor-pointer"
              title="Thu nhỏ timeline"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-xs font-medium font-mono text-slate-700 tabular-nums">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 2.0}
              className="p-1 rounded text-slate-500 hover:text-slate-900 disabled:opacity-30 transition-colors cursor-pointer"
              title="Phóng to timeline"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* CineAI Studio Trigger Action */}
          {onOpenAiModal && (
            <button
              onClick={onOpenAiModal}
              className="px-3 py-1 rounded-md bg-[#EEECFB] hover:bg-[#D8D4F7] text-[#7C6FE8] hover:text-[#685bc7] border border-[#D8D4F7] font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer group"
              title="Mở CineAI Showtime Studio để tạo ma trận suất chiếu tự động"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#7C6FE8] group-hover:rotate-12 transition-transform" />
              <span>Studio AI Tạo Lịch</span>
            </button>
          )}

          {/* Clone Date Action */}
          <button
            onClick={onOpenCloneModal}
            className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-50 border border-gray-200 text-slate-700 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Sao chép ngày</span>
          </button>

          {/* Primary Add Showtime Action */}
          <button
            onClick={onOpenAddModal}
            className="px-3 py-1 rounded-md bg-[#7C6FE8] hover:bg-[#6b5edb] text-white font-medium text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tạo suất</span>
          </button>
        </div>
      </div>

      {/* Date Rail (7-Day Strip) */}
      <div className="flex items-center gap-1 overflow-x-auto pt-1 border-t border-gray-200/60 scrollbar-none">
        {datePills.map((p) => (
          <button
            key={p.key}
            onClick={() => onSelectDate(p.key)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              selectedDateKey === p.key
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
