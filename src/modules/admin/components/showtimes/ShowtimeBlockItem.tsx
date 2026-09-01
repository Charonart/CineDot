'use client';

import React, { useState } from 'react';
import { Lock, Edit3, Trash2, GripVertical, Users, Clock, Tag } from 'lucide-react';
import { AdminShowtimeGridItem } from '../../types/adminShowtime.types';

interface ShowtimeBlockItemProps {
  showtime: AdminShowtimeGridItem;
  dayStartMinutes: number;
  dayTotalMinutes: number;
  rowIndex?: number;
  onView: (st: AdminShowtimeGridItem) => void;
  onEdit: (st: AdminShowtimeGridItem) => void;
  onDelete: (st: AdminShowtimeGridItem) => void;
}

export function ShowtimeBlockItem({
  showtime,
  dayStartMinutes,
  dayTotalMinutes,
  rowIndex = 0,
  onView,
  onEdit,
  onDelete,
}: ShowtimeBlockItemProps) {
  const [isHovered, setIsHovered] = useState(false);

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`absolute top-1 bottom-1 flex rounded-md overflow-visible text-xs select-none transition-all ${
        isHovered ? 'z-40' : 'z-10'
      } ${showtime.isLocked ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'}`}
    >
      {/* Outer Card Container */}
      <div
        className={`w-full h-full flex rounded-md overflow-hidden transition-all ${
          showtime.isDraft
            ? 'border-2 border-dashed border-[#7C6FE8] ring-2 ring-[#7C6FE8]/20 shadow-md shadow-[#7C6FE8]/10'
            : 'border border-slate-700/80 shadow-2xs hover:shadow-md'
        }`}
      >
        {/* Main Movie Block */}
        <div
          style={{ width: `${(movieWidthPct / totalBlockWidthPct) * 100}%` }}
          className={`${
            showtime.isDraft
              ? 'bg-slate-900 border-l-4 border-l-[#7C6FE8]'
              : 'bg-slate-900 border-l-4 border-l-[#7C6FE8]'
          } text-white p-1.5 flex flex-col justify-between overflow-hidden relative`}
          onClick={() => onView(showtime)}
        >
          {/* Row 1: Title & Format Badge & Lock */}
          <div className="flex items-center justify-between gap-1 min-w-0">
            <div className="flex items-center gap-1 min-w-0 flex-1">
              {!showtime.isLocked && (
                <GripVertical className="w-3 h-3 text-slate-400 opacity-60 group-hover/card:opacity-100 shrink-0" />
              )}
              <span
                className="font-semibold text-[11px] text-white truncate leading-tight"
                title={showtime.movieTitle}
              >
                {showtime.movieTitle}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {showtime.isDraft ? (
                <span className="px-1.5 py-0.2 rounded bg-[#7C6FE8]/30 text-[#D8D4F7] font-bold text-[8.5px] border border-[#7C6FE8]/50 shadow-2xs">
                  AI Nháp
                </span>
              ) : (
                <span className="px-1 py-0.2 rounded bg-slate-800 text-[#7C6FE8] font-semibold text-[9px] border border-slate-700">
                  {showtime.roomType?.includes('IMAX') ? 'IMAX' : '2D'}
                </span>
              )}
              {showtime.isLocked && (
                <span title={`Đã có ${showtime.bookedSeats} vé đặt (Khóa không cho di chuyển)`} className="shrink-0">
                  <Lock className="w-3 h-3 text-amber-400" />
                </span>
              )}
            </div>
          </div>

          {/* Row 2: Time Range & Price */}
          <div className="flex items-center justify-between text-[10px] font-mono leading-none">
            <span className="font-semibold text-amber-300">
              {showtime.startTime} – {showtime.endTime}
            </span>
            <span className="font-semibold text-emerald-400">{formatVND(showtime.basePrice)}</span>
          </div>

          {/* Row 3: Occupancy Bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex items-center">
            <div
              className={`h-full transition-all ${
                showtime.occupancyRate > 60
                  ? 'bg-emerald-400'
                  : showtime.occupancyRate > 20
                  ? 'bg-[#7C6FE8]'
                  : 'bg-slate-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, showtime.occupancyRate))}%` }}
            />
          </div>
        </div>

        {/* Cleaning Buffer Stripe */}
        <div
          style={{ width: `${(bufferWidthPct / totalBlockWidthPct) * 100}%` }}
          className="bg-slate-200/90 text-slate-700 flex items-center justify-center text-[9px] font-semibold border-l border-slate-300/80 cursor-default select-none"
          title={`Dọn phòng: ${showtime.cleaningBufferMinutes} phút`}
        >
          <span className="opacity-75">15m</span>
        </div>
      </div>

      {/* Hover HUD Popover */}
      {isHovered && (
        <div
          className={`absolute left-0 z-50 w-64 p-3 bg-slate-900 text-white rounded-lg shadow-xl border border-slate-700/80 pointer-events-auto flex flex-col gap-2 ${
            rowIndex === 0 ? 'top-full mt-2' : 'bottom-full mb-2'
          }`}
        >
          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-xs text-white leading-snug truncate">
                {showtime.movieTitle}
              </span>
              <span className="text-[10px] text-slate-400">
                {showtime.roomName} • <span className="text-[#7C6FE8]">{showtime.roomType}</span>
              </span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-semibold text-[9px] border border-slate-700 shrink-0">
              {showtime.movieAgeRating}
            </span>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
            <div className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{showtime.startTime} – {showtime.endTime}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-300 justify-end">
              <Tag className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">{formatVND(showtime.basePrice)}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-300 col-span-2">
              <Users className="w-3 h-3 text-purple-400" />
              <span>
                Lấp đầy: <strong>{showtime.bookedSeats}/{showtime.totalSeats}</strong> ({showtime.occupancyRate}%)
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 text-[11px]">
            {showtime.isLocked ? (
              <span className="text-amber-400 text-[10px] font-medium flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Đã có vé đặt
              </span>
            ) : (
              <span className="text-slate-400 text-[10px]">Kéo thả để dời giờ</span>
            )}

            <div className="flex items-center gap-1">
              {!showtime.isLocked && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(showtime);
                    }}
                    className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-[#7C6FE8] transition-colors cursor-pointer"
                    title="Chỉnh sửa suất chiếu"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(showtime);
                    }}
                    className="p-1 rounded hover:bg-rose-900/60 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Xóa suất chiếu"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
