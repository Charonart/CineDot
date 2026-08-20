'use client';

import React from 'react';
import { Lock, Edit3, Trash2, Move } from 'lucide-react';
import { AdminShowtimeGridItem } from '../../types/adminShowtime.types';

interface ShowtimeBlockItemProps {
  showtime: AdminShowtimeGridItem;
  dayStartMinutes: number;
  dayTotalMinutes: number;
  onView: (st: AdminShowtimeGridItem) => void;
  onEdit: (st: AdminShowtimeGridItem) => void;
  onDelete: (st: AdminShowtimeGridItem) => void;
}

export function ShowtimeBlockItem({
  showtime,
  dayStartMinutes,
  dayTotalMinutes,
  onView,
  onEdit,
  onDelete,
}: ShowtimeBlockItemProps) {
  const startRelMinutes = Math.max(0, showtime.startMinutes - dayStartMinutes);
  const leftPct = (startRelMinutes / dayTotalMinutes) * 100;
  const movieWidthPct = (showtime.durationMinutes / dayTotalMinutes) * 100;
  const bufferWidthPct = (showtime.cleaningBufferMinutes / dayTotalMinutes) * 100;
  const totalBlockWidthPct = movieWidthPct + bufferWidthPct;

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (showtime.isLocked) {
      e.preventDefault();
      return;
    }
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData(
      'application/showtime-move',
      JSON.stringify({
        showtimeId: showtime.id,
        duration: showtime.durationMinutes,
        oldRoomId: showtime.roomId,
      })
    );
  };

  return (
    <div
      style={{
        left: `${leftPct}%`,
        width: `${totalBlockWidthPct}%`,
      }}
      draggable={!showtime.isLocked}
      onDragStart={handleDragStart}
      className={`absolute top-2 bottom-2 flex rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all z-10 text-xs border border-purple-200 group/card ${
        showtime.isLocked ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
      }`}
    >
      {/* Main Movie Card */}
      <div
        style={{ width: `${(movieWidthPct / totalBlockWidthPct) * 100}%` }}
        className="bg-[#1E1B4B] text-white p-2 flex flex-col justify-between overflow-hidden relative select-none"
        onClick={() => onView(showtime)}
      >
        {/* Header: Title & Lock/Action buttons */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 truncate">
            {!showtime.isLocked && (
              <span title="Kéo để dời giờ / phòng" className="text-purple-300 opacity-60 group-hover/card:opacity-100 shrink-0">
                <Move className="w-3 h-3" />
              </span>
            )}
            <span
              className="font-extrabold text-[11px] text-white truncate"
              title={`${showtime.movieTitle} (${showtime.startTime} - ${showtime.endTime})`}
            >
              {showtime.movieTitle}
            </span>
          </div>

          {showtime.isLocked ? (
            <span title={`Đã có ${showtime.bookedSeats} vé đặt (Khóa không cho di chuyển)`} className="shrink-0">
              <Lock className="w-3 h-3 text-amber-400" />
            </span>
          ) : (
            <div className="opacity-0 group-hover/card:opacity-100 flex items-center gap-1 transition-opacity shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(showtime);
                }}
                className="p-0.5 rounded hover:bg-white/20 text-purple-200 transition-colors"
                title="Chỉnh sửa giờ / giá"
              >
                <Edit3 className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(showtime);
                }}
                className="p-0.5 rounded hover:bg-rose-500/40 text-rose-300 transition-colors"
                title="Xóa suất chiếu"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Showtime Info */}
        <div className="flex items-center justify-between text-[10px] text-purple-200 font-mono">
          <span>
            {showtime.startTime} - {showtime.endTime}
          </span>
          <span className="font-bold text-emerald-300">{formatVND(showtime.basePrice)}</span>
        </div>

        {/* Live Occupancy Bar */}
        <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden mt-0.5">
          <div
            className={`h-full transition-all ${
              showtime.occupancyRate > 75
                ? 'bg-emerald-400'
                : showtime.occupancyRate > 30
                ? 'bg-purple-400'
                : 'bg-slate-400'
            }`}
            style={{ width: `${Math.min(100, showtime.occupancyRate)}%` }}
            title={`Tỷ lệ lấp đầy: ${showtime.bookedSeats}/${showtime.totalSeats} (${showtime.occupancyRate}%)`}
          />
        </div>
      </div>

      {/* Cleaning Buffer Stripe */}
      <div
        style={{ width: `${(bufferWidthPct / totalBlockWidthPct) * 100}%` }}
        className="bg-slate-200/90 text-slate-600 flex items-center justify-center text-[9px] font-bold border-l border-slate-300 select-none cursor-default"
        title={`Dọn phòng: ${showtime.cleaningBufferMinutes} phút`}
      >
        🧹
      </div>
    </div>
  );
}
