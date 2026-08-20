'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Flame, Loader2, Clock } from 'lucide-react';
import { AdminRoomOption, AdminShowtimeGridItem, AdminMovieOption } from '../../types/adminShowtime.types';
import { ShowtimeBlockItem } from './ShowtimeBlockItem';
import { ShowtimesAlignmentGuide } from './ShowtimesAlignmentGuide';

const TIMELINE_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
const DAY_START_MINUTES = 8 * 60; // 480m (08:00)
const DAY_TOTAL_MINUTES = 16 * 60; // 960m (08:00 - 24:00)

function minutesToTime(minutes: number): string {
  const h = Math.floor((minutes / 60) % 24);
  const m = Math.floor(minutes % 60);
  return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
}

interface ShowtimesTimelineCanvasProps {
  rooms: AdminRoomOption[];
  showtimes: AdminShowtimeGridItem[];
  isLoadingRooms: boolean;
  zoomLevel: number;
  selectedDateKey: string;
  onOpenAddModal: (roomId?: number, defaultStartTime?: string, movie?: AdminMovieOption) => void;
  onViewShowtime: (st: AdminShowtimeGridItem) => void;
  onEditShowtime: (st: AdminShowtimeGridItem) => void;
  onDeleteShowtime: (st: AdminShowtimeGridItem) => void;
  onMoveShowtime: (showtimeId: number, targetRoomId: number, newStartTime: string, newEndTime: string) => void;
}

export function ShowtimesTimelineCanvas({
  rooms,
  showtimes,
  isLoadingRooms,
  zoomLevel,
  selectedDateKey,
  onOpenAddModal,
  onViewShowtime,
  onEditShowtime,
  onDeleteShowtime,
  onMoveShowtime,
}: ShowtimesTimelineCanvasProps) {
  const timelineTracksRef = useRef<HTMLDivElement>(null);
  const [guideX, setGuideX] = useState<number | null>(null);
  const [guideTime, setGuideTime] = useState<string | null>(null);
  const [canvasHeight, setCanvasHeight] = useState<number>(300);

  // Dynamic Base Width for the Timeline Track Area based on Zoom Level
  const minTrackWidth = useMemo(() => {
    return Math.round(1100 * zoomLevel);
  }, [zoomLevel]);

  // Current Time Marker (if viewing today)
  const isViewingToday = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return selectedDateKey === todayStr;
  }, [selectedDateKey]);

  const currentTimeMinutes = useMemo(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }, []);

  const currentTimePercent = useMemo(() => {
    if (currentTimeMinutes < DAY_START_MINUTES || currentTimeMinutes > DAY_START_MINUTES + DAY_TOTAL_MINUTES) {
      return null;
    }
    return ((currentTimeMinutes - DAY_START_MINUTES) / DAY_TOTAL_MINUTES) * 100;
  }, [currentTimeMinutes]);

  // Measure Canvas Height for the Alignment Guide Line
  useEffect(() => {
    if (timelineTracksRef.current) {
      setCanvasHeight(timelineTracksRef.current.offsetHeight);
    }
  }, [rooms, showtimes, zoomLevel]);

  // Mouse Move over Timeline Track -> Calculate Guide Line Position & Snapped Time
  const handleMouseMoveOnTimeline = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineTracksRef.current) return;
    const rect = timelineTracksRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (x < 0 || x > rect.width) {
      setGuideX(null);
      setGuideTime(null);
      return;
    }

    // Ratio in minutes (0.0 to 1.0)
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    const totalM = DAY_START_MINUTES + ratio * DAY_TOTAL_MINUTES;

    // Snap to nearest 5 minutes
    const snappedM = Math.round(totalM / 5) * 5;
    const snappedX = ((snappedM - DAY_START_MINUTES) / DAY_TOTAL_MINUTES) * rect.width;

    setGuideX(snappedX);
    setGuideTime(minutesToTime(snappedM));
  };

  const handleMouseLeaveTimeline = () => {
    setGuideX(null);
    setGuideTime(null);
  };

  // Handle Drag Over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle Drop on Room Track (Supports both Rescheduling existing Showtime & Dropping new Movie)
  const handleDropOnRoom = (e: React.DragEvent, roomId: number) => {
    e.preventDefault();
    if (!timelineTracksRef.current) return;
    const rect = timelineTracksRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    const totalM = DAY_START_MINUTES + ratio * DAY_TOTAL_MINUTES;

    // 1. Check if dragging an existing Showtime block to move/reschedule
    const showtimeMoveData = e.dataTransfer.getData('application/showtime-move');
    if (showtimeMoveData) {
      try {
        const { showtimeId, duration } = JSON.parse(showtimeMoveData);
        const snappedStartM = Math.round(totalM / 5) * 5; // Snap to 5 min
        const startStr = minutesToTime(snappedStartM);
        const endStr = minutesToTime(snappedStartM + (duration || 120));
        onMoveShowtime(Number(showtimeId), roomId, startStr, endStr);
        return;
      } catch {
        // ignore
      }
    }

    // 2. Check if dropping a Movie card from the left sidebar
    const movieData = e.dataTransfer.getData('application/json');
    if (movieData) {
      try {
        const movie: AdminMovieOption = JSON.parse(movieData);
        const snappedStartM = Math.round(totalM / 15) * 15; // Snap to 15 min
        const startStr = minutesToTime(snappedStartM);
        onOpenAddModal(roomId, startStr, movie);
      } catch {
        // ignore
      }
    }
  };

  // Click on empty space in a room track to quickly create a showtime
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>, roomId: number) => {
    if ((e.target as HTMLElement).closest('.group\\/card')) {
      return;
    }

    if (!timelineTracksRef.current) return;
    const rect = timelineTracksRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    const totalM = DAY_START_MINUTES + ratio * DAY_TOTAL_MINUTES;
    const snappedM = Math.round(totalM / 15) * 15;
    const startTimeStr = minutesToTime(snappedM);

    onOpenAddModal(roomId, startTimeStr);
  };

  return (
    <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm flex flex-col gap-4 overflow-x-auto text-slate-900 select-none">
      {/* Header Bar & Prime-Time Zone */}
      <div
        className="flex items-center justify-between text-xs border-b border-gray-100 pb-3"
        style={{ minWidth: `${minTrackWidth + 190}px` }}
      >
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-slate-900 uppercase">
            TRỤC THỜI GIAN HOẠT ĐỘNG (08:00 – 24:00)
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px] flex items-center gap-1 border border-amber-200">
            <Flame className="w-3 h-3 text-amber-600" />
            <span>GIỜ VÀNG (18:00 - 21:30)</span>
          </span>
          {isViewingToday && currentTimePercent !== null && (
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] flex items-center gap-1 border border-rose-200 animate-pulse">
              <Clock className="w-3 h-3 text-rose-600" />
              <span>Đang chiếu ({minutesToTime(currentTimeMinutes)})</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
          <span>🧹 Dọn phòng: 15p</span>
          <span>•</span>
          <span>✋ Kéo block để dời giờ</span>
          <span>•</span>
          <span>🖱️ Nhấp ô trống để tạo</span>
        </div>
      </div>

      {/* Main Gantt Canvas Layout: Left Rooms Column + Right Timeline Track Area */}
      <div
        className="flex gap-3 relative items-start"
        style={{ minWidth: `${minTrackWidth + 190}px` }}
      >
        {/* ── Left Column: Room Badges ── */}
        <div className="w-44 flex flex-col gap-3 shrink-0">
          <div className="h-6 text-[10px] font-extrabold text-slate-400 uppercase flex items-center border-b border-gray-200 pb-1">
            PHÒNG CHIẾU ({rooms.length})
          </div>

          {isLoadingRooms ? (
            <div className="py-14 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#7C6FE8]" />
              <span>Đang tải phòng...</span>
            </div>
          ) : rooms.length === 0 ? (
            <div className="py-14 text-center text-slate-400 text-xs">Chưa có phòng</div>
          ) : (
            rooms.map((room) => (
              <div
                key={room.id}
                className="h-24 p-3 rounded-2xl bg-slate-50 border border-gray-200 flex flex-col justify-between shrink-0 shadow-2xs"
              >
                <div className="flex flex-col">
                  <span className="font-extrabold text-xs text-slate-900 truncate" title={room.name}>
                    {room.name}
                  </span>
                  <span className="text-[10px] text-[#7C6FE8] font-bold mt-0.5">{room.type}</span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span>{room.capacity} Ghế</span>
                  <button
                    onClick={() => onOpenAddModal(room.id)}
                    className="text-[#7C6FE8] font-bold hover:underline cursor-pointer"
                  >
                    + Thêm
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Right Column: Timeline Area (Hour Ruler + Room Tracks) ── */}
        <div
          ref={timelineTracksRef}
          onMouseMove={handleMouseMoveOnTimeline}
          onMouseLeave={handleMouseLeaveTimeline}
          className="flex-1 flex flex-col gap-3 relative min-w-0"
        >
          {/* Hour Ruler Header */}
          <div className="h-6 grid grid-cols-16 text-[10px] font-extrabold text-slate-400 border-b border-gray-200 pb-1 relative">
            {TIMELINE_HOURS.slice(0, 16).map((hour) => (
              <div key={hour} className="text-left relative select-none">
                <span>{hour < 10 ? `0${hour}:00` : `${hour}:00`}</span>
                <div className="absolute bottom-0 left-1/4 w-[1px] h-1 bg-gray-200" />
                <div className="absolute bottom-0 left-2/4 w-[1px] h-1.5 bg-gray-300" />
                <div className="absolute bottom-0 left-3/4 w-[1px] h-1 bg-gray-200" />
              </div>
            ))}
          </div>

          {/* Alignment Guide Line & Current Time Line Container */}
          <div className="absolute top-6 bottom-0 left-0 right-0 pointer-events-none z-30">
            <ShowtimesAlignmentGuide
              guideX={guideX}
              guideTime={guideTime}
              height={canvasHeight - 24}
            />

            {isViewingToday && currentTimePercent !== null && (
              <div
                className="absolute top-0 bottom-0 pointer-events-none z-25"
                style={{ left: `${currentTimePercent}%` }}
              >
                <div className="absolute -top-2.5 -translate-x-1/2 w-2 h-2 rounded-full bg-rose-600 shadow-sm shadow-rose-600" />
                <div className="w-[1.5px] h-full bg-rose-500 shadow-sm" />
              </div>
            )}
          </div>

          {/* Room Tracks Rows */}
          {isLoadingRooms ? (
            <div className="py-14 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#7C6FE8]" />
              <span>Đang tải danh sách suất chiếu...</span>
            </div>
          ) : rooms.length === 0 ? (
            <div className="py-14 text-center text-slate-400 text-xs">
              Cụm rạp này chưa có phòng chiếu nào được cấu hình trong hệ thống.
            </div>
          ) : (
            rooms.map((room) => {
              const roomShowtimes = showtimes.filter((st) => st.roomId === room.id);

              return (
                <div
                  key={room.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnRoom(e, room.id)}
                  onClick={(e) => handleTrackClick(e, room.id)}
                  className="h-24 relative bg-slate-50/60 rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:border-[#7C6FE8]/40 transition-colors cursor-crosshair"
                >
                  {/* Hour Grid Lines */}
                  <div className="absolute inset-0 grid grid-cols-16 divide-x divide-gray-200/60 pointer-events-none" />

                  {/* Prime-Time Shaded Golden Zone (18:00 - 21:30) */}
                  <div
                    className="absolute top-0 bottom-0 bg-amber-500/10 border-x border-amber-300/40 pointer-events-none"
                    style={{
                      left: `${((10 * 60) / DAY_TOTAL_MINUTES) * 100}%`,
                      width: `${((3.5 * 60) / DAY_TOTAL_MINUTES) * 100}%`,
                    }}
                  />

                  {/* Render Showtime Blocks */}
                  {roomShowtimes.map((st) => (
                    <ShowtimeBlockItem
                      key={st.id}
                      showtime={st}
                      dayStartMinutes={DAY_START_MINUTES}
                      dayTotalMinutes={DAY_TOTAL_MINUTES}
                      onView={onViewShowtime}
                      onEdit={onEditShowtime}
                      onDelete={onDeleteShowtime}
                    />
                  ))}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
