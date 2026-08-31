'use client';

import React, { useMemo } from 'react';
import {
  PanelLeftOpen,
  Save,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import { AdminRoomItem, AdminSeatItem } from '../../types/adminCinema.types';
import { AdminSeatCanvasEditor } from '../ui';

interface CinemaRoomStudioProps {
  activeRoom: AdminRoomItem | null;
  seats: AdminSeatItem[];
  isLoadingDetail?: boolean;
  isSavingSeatLayout?: boolean;
  isLeftPanelCollapsed: boolean;
  onExpandLeftPanel: () => void;
  onChangeSeats: (seats: AdminSeatItem[]) => void;
  onResetToDefaultLayout: () => void;
  onSaveSeatLayout: () => void;
}

export const CinemaRoomStudio: React.FC<CinemaRoomStudioProps> = ({
  activeRoom,
  seats,
  isLoadingDetail = false,
  isSavingSeatLayout = false,
  isLeftPanelCollapsed,
  onExpandLeftPanel,
  onChangeSeats,
  onResetToDefaultLayout,
  onSaveSeatLayout,
}) => {
  // Compute Seat Breakdown
  const seatStats = useMemo(() => {
    let regularCount = 0;
    let vipCount = 0;
    let coupleCount = 0;
    let sweetboxCount = 0;
    let maintenanceCount = 0;

    seats.forEach((s) => {
      const t = (s.type || '').toUpperCase();
      if (t === 'VIP') vipCount++;
      else if (t === 'COUPLE') coupleCount++;
      else if (t === 'SWEETBOX') sweetboxCount++;
      else if (t === 'MAINTENANCE') maintenanceCount++;
      else regularCount++;
    });

    return {
      total: seats.length,
      regular: regularCount,
      vip: vipCount,
      couple: coupleCount + sweetboxCount,
      maintenance: maintenanceCount,
    };
  }, [seats]);

  if (isLoadingDetail || !activeRoom) {
    return (
      <div className="p-8 rounded-xl bg-white border border-gray-200/90 shadow-2xs flex flex-col gap-3 items-center justify-center min-h-[460px]">
        <Loader2 className="w-6 h-6 text-[#7C6FE8] animate-spin" />
        <span className="text-xs text-slate-500 font-medium">
          Đang nạp dữ liệu phòng chiếu & sơ đồ ghế…
        </span>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-xl bg-white border border-gray-200/90 shadow-2xs flex flex-col gap-4">
      {/* 1. Clean Room Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3.5">
        {/* Left: Active Room Info */}
        <div className="flex items-center gap-3 flex-wrap min-w-0">
          {isLeftPanelCollapsed && (
            <button
              type="button"
              onClick={onExpandLeftPanel}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-gray-200"
              title="Mở rộng danh sách phòng"
            >
              <PanelLeftOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>Mở bảng rạp</span>
            </button>
          )}

          <div className="flex items-baseline gap-2">
            <h2 className="text-base font-bold text-slate-900 truncate">
              {activeRoom.name}
            </h2>
            <span className="text-xs font-normal text-slate-500">
              ({activeRoom.format})
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-normal">
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span>Tổng: <strong className="font-semibold text-slate-800 tabular-nums">{seatStats.total}</strong> ghế</span>
            <span>(Thường: <strong className="font-medium text-slate-700 tabular-nums">{seatStats.regular}</strong></span>
            <span>VIP: <strong className="font-medium text-[#7C6FE8] tabular-nums">{seatStats.vip}</strong></span>
            {seatStats.couple > 0 && <span>Đôi: <strong className="font-medium text-pink-600 tabular-nums">{seatStats.couple}</strong></span>}
            {seatStats.maintenance > 0 && <span>Bảo trì: <strong className="font-medium text-rose-600 tabular-nums">{seatStats.maintenance}</strong></span>}
            <span>)</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={onResetToDefaultLayout}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Đặt lại sơ đồ ghế về ma trận chuẩn"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Đặt lại mặc định</span>
          </button>

          <button
            type="button"
            onClick={onSaveSeatLayout}
            disabled={isSavingSeatLayout}
            className="px-4 py-1.5 rounded-lg bg-[#7C6FE8] hover:bg-[#6b5ed6] text-white font-medium text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSavingSeatLayout ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{isSavingSeatLayout ? 'Đang lưu…' : 'Lưu sơ đồ ghế'}</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Seat Canvas Editor Studio */}
      <AdminSeatCanvasEditor
        seats={seats}
        roomFormat={activeRoom.format}
        roomName={activeRoom.name}
        onChangeSeats={onChangeSeats}
        onResetToDefaultLayout={onResetToDefaultLayout}
      />
    </div>
  );
};
