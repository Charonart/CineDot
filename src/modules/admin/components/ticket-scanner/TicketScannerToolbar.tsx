'use client';

import React from 'react';
import {
  Building2,
  RefreshCw,
  Camera,
  CameraOff,
  Volume2,
  VolumeX,
  Zap,
  CheckCircle2,
  Ticket,
  Coffee,
  Calendar,
} from 'lucide-react';
import { AdminCinemaOption } from '../../types/adminShowtime.types';

interface TicketScannerToolbarProps {
  cinemas: AdminCinemaOption[];
  isLoadingCinemas?: boolean;
  selectedCinemaId?: number;
  onSelectCinema: (id: number) => void;

  isAutoCheckIn: boolean;
  onToggleAutoCheckIn: () => void;

  isAudioEnabled: boolean;
  onToggleAudio: () => void;

  isCameraActive: boolean;
  onToggleCamera: () => void;

  totalScannedCount: number;
  pendingCombosCount: number;

  isLoadingRecent: boolean;
  onRefresh: () => void;
}

export function TicketScannerToolbar({
  cinemas,
  isLoadingCinemas = false,
  selectedCinemaId,
  onSelectCinema,
  isAutoCheckIn,
  onToggleAutoCheckIn,
  isAudioEnabled,
  onToggleAudio,
  isCameraActive,
  onToggleCamera,
  totalScannedCount,
  pendingCombosCount,
  isLoadingRecent,
  onRefresh,
}: TicketScannerToolbarProps) {
  const todayFormatted = new Date().toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="bg-slate-50/70 border-b border-gray-200 px-3.5 py-2.5 flex flex-col gap-2 select-none shrink-0 font-sans">
      <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none flex-wrap">
        {/* Left: Cinema Branch Selector & Date Capsule */}
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
          {/* Cinema Branch Dropdown */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-gray-200 text-xs font-medium shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0" />
            <select
              value={selectedCinemaId || ''}
              onChange={(e) => onSelectCinema(Number(e.target.value))}
              disabled={isLoadingCinemas}
              aria-label="Chọn cụm rạp soát vé"
              className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer pr-1 max-w-[200px] truncate text-xs"
            >
              <option value="">Tất cả cụm rạp</option>
              {cinemas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.provinceName ? `(${c.provinceName})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Today Date Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-gray-200 text-xs font-medium text-slate-700 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="capitalize">{todayFormatted}</span>
          </div>

          {/* Live Online Beacon */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50/80 border border-emerald-200 text-emerald-800 text-[11px] font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Cổng Trực Tuyến</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoadingRecent}
            className="p-1.5 rounded-md border border-gray-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-[#7C6FE8] text-xs transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
            title="Làm mới dữ liệu quét"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRecent ? 'animate-spin text-[#7C6FE8]' : ''}`} />
          </button>
        </div>

        {/* Right: Operational Controls (Auto-Checkin, Sound, Camera, Shift KPIs) */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Shift Stats KPI Capsule */}
          <div className="hidden md:flex items-center gap-2 bg-white px-2.5 py-1 rounded-md border border-gray-200 text-xs font-medium shadow-2xs">
            <div className="flex items-center gap-1 text-slate-700">
              <Ticket className="w-3.5 h-3.5 text-[#7C6FE8]" />
              <span className="font-mono font-bold text-slate-900">{totalScannedCount}</span>
              <span className="text-slate-400 text-[11px]">vé ca này</span>
            </div>
            {pendingCombosCount > 0 && (
              <>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-1 text-amber-700">
                  <Coffee className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-mono font-bold">{pendingCombosCount}</span>
                  <span className="text-amber-500 text-[11px]">combo chờ trả</span>
                </div>
              </>
            )}
          </div>

          {/* Audio Beep Toggle */}
          <button
            type="button"
            onClick={onToggleAudio}
            className={`p-1.5 rounded-md border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs ${
              isAudioEnabled
                ? 'bg-purple-50/80 border-purple-200 text-[#7C6FE8]'
                : 'bg-white border-gray-200 text-slate-400 hover:text-slate-600'
            }`}
            title={isAudioEnabled ? 'Âm thanh phản hồi: Đang BẬT' : 'Âm thanh phản hồi: Đang TẮT'}
          >
            {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden lg:inline text-[11px]">{isAudioEnabled ? 'Âm thanh' : 'Tắt âm'}</span>
          </button>

          {/* Camera Viewfinder Toggle */}
          <button
            type="button"
            onClick={onToggleCamera}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs ${
              isCameraActive
                ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                : 'bg-white border-gray-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Bật/Tắt Camera quét mã trực tiếp"
          >
            {isCameraActive ? <CameraOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5 text-[#7C6FE8]" />}
            <span className="font-semibold">{isCameraActive ? 'Đóng Camera' : 'Camera QR'}</span>
          </button>

          {/* Auto Check-in Mode Switch */}
          <button
            type="button"
            onClick={onToggleAutoCheckIn}
            className={`px-3 py-1 rounded-md border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
              isAutoCheckIn
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-600/20'
                : 'bg-white border-gray-200 text-slate-700 hover:bg-slate-50'
            }`}
            title={
              isAutoCheckIn
                ? 'Chế độ: Soát Nhanh (Tự động xác nhận khách vào ngay khi quét)'
                : 'Chế độ: Tra Cứu (Kiểm tra thông tin vé trước khi xác nhận)'
            }
          >
            <Zap className={`w-3.5 h-3.5 ${isAutoCheckIn ? 'fill-white text-white' : 'text-amber-500'}`} />
            <span>{isAutoCheckIn ? 'Soát Nhanh: BẬT' : 'Tra Cứu Chi Tiết'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
