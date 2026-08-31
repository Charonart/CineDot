'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Loader2, Clock, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
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

interface DragGhostState {
  roomId: number;
  startMinutes: number;
  durationMinutes: number;
  bufferMinutes: number;
  title: string;
  isConflict: boolean;
  conflictWithTitle?: string;
}

interface ShowtimesTimelineCanvasProps {
  rooms: AdminRoomOption[];
  showtimes: AdminShowtimeGridItem[];
  isLoadingRooms: boolean;
  zoomLevel: number;
  snapMinutes?: number;
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
  snapMinutes = 15,
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

  // Live Drag Ghost Preview State
  const [dragGhost, setDragGhost] = useState<DragGhostState | null>(null);

  // Dynamic Base Width for Timeline Track Area
  const minTrackWidth = useMemo(() => {
    return Math.round(1100 * zoomLevel);
  }, [zoomLevel]);

  // Current Time Marker
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

  // Measure Canvas Height
  useEffect(() => {
    if (timelineTracksRef.current) {
      setCanvasHeight(timelineTracksRef.current.offsetHeight);
    }
  }, [rooms, showtimes, zoomLevel]);

  // Magnetic snap time calculation
  const calculateMagneticSnappedMinutes = (
    rawMinutes: number,
    duration: number,
    roomId: number
  ): number => {
    const roomShowtimes = showtimes.filter((st) => st.roomId === roomId);
    const step = Math.max(1, snapMinutes);

    for (const st of roomShowtimes) {
      const prevEndPlusBuffer = st.endMinutes + st.cleaningBufferMinutes;
      if (Math.abs(rawMinutes - prevEndPlusBuffer) <= 20) {
        return prevEndPlusBuffer;
      }
    }

    return Math.round(rawMinutes / step) * step;
  };

  const checkTimeConflict = (
    roomId: number,
    startM: number,
    durationM: number,
    bufferM: number,
    ignoreShowtimeId?: number
  ) => {
    const totalEndM = startM + durationM + bufferM;
    const roomShowtimes = showtimes.filter((st) => st.roomId === roomId && st.id !== ignoreShowtimeId);

    const conflict = roomShowtimes.find((st) => {
      const stTotalEndM = st.endMinutes + st.cleaningBufferMinutes;
      return startM < stTotalEndM && totalEndM > st.startMinutes;
    });

    return {
      isConflict: Boolean(conflict),
      conflictWithTitle: conflict?.movieTitle,
    };
  };

  const handleMouseMoveOnTimeline = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineTracksRef.current) return;
    const rect = timelineTracksRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (x < 0 || x > rect.width) {
      setGuideX(null);
      setGuideTime(null);
      return;
    }

    const ratio = Math.max(0, Math.min(1, x / rect.width));
    const totalM = DAY_START_MINUTES + ratio * DAY_TOTAL_MINUTES;
    const step = Math.max(1, snapMinutes);
    const snappedM = Math.round(totalM / step) * step;

    setGuideX(x);
    setGuideTime(minutesToTime(snappedM));
  };

  const handleMouseLeaveTimeline = () => {
    setGuideX(null);
    setGuideTime(null);
  };

  const handleDragOverRoom = (e: React.DragEvent, roomId: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';

    if (!timelineTracksRef.current) return;
    const rect = timelineTracksRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    const rawM = DAY_START_MINUTES + ratio * DAY_TOTAL_MINUTES;

    const showtimeMoveData = e.dataTransfer.getData('application/showtime-move');
    const movieData = e.dataTransfer.getData('application/json');

    let duration = 120;
    let title = 'Suất chiếu';
    let ignoreId: number | undefined;

    if (showtimeMoveData) {
      try {
        const parsed = JSON.parse(showtimeMoveData);
        duration = parsed.duration || 120;
        ignoreId = parsed.showtimeId;
      } catch {
        // ignore
      }
    } else if (movieData) {
      try {
        const movie: AdminMovieOption = JSON.parse(movieData);
        duration = movie.duration || 120;
        title = movie.title;
      } catch {
        // ignore
      }
    }

    const snappedStartM = calculateMagneticSnappedMinutes(rawM, duration, roomId);
    const { isConflict, conflictWithTitle } = checkTimeConflict(roomId, snappedStartM, duration, 15, ignoreId);

    setDragGhost({
      roomId,
      startMinutes: snappedStartM,
      durationMinutes: duration,
      bufferMinutes: 15,
      title,
      isConflict,
      conflictWithTitle,
    });
  };

  const handleDragLeaveRoom = () => {
    setDragGhost(null);
  };

  const handleDropOnRoom = (e: React.DragEvent, roomId: number) => {
    e.preventDefault();
    setDragGhost(null);

    if (!timelineTracksRef.current) return;
    const rect = timelineTracksRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    const rawM = DAY_START_MINUTES + ratio * DAY_TOTAL_MINUTES;

    const showtimeMoveData = e.dataTransfer.getData('application/showtime-move');
    if (showtimeMoveData) {
      try {
        const { showtimeId, duration } = JSON.parse(showtimeMoveData);
        const snappedStartM = calculateMagneticSnappedMinutes(rawM, duration || 120, roomId);
        const startStr = minutesToTime(snappedStartM);
        const endStr = minutesToTime(snappedStartM + (duration || 120));
        onMoveShowtime(Number(showtimeId), roomId, startStr, endStr);
        return;
      } catch {
        // ignore
      }
    }

    const movieData = e.dataTransfer.getData('application/json');
    if (movieData) {
      try {
        const movie: AdminMovieOption = JSON.parse(movieData);
        const snappedStartM = calculateMagneticSnappedMinutes(rawM, movie.duration || 120, roomId);
        const startStr = minutesToTime(snappedStartM);
        onOpenAddModal(roomId, startStr, movie);
      } catch {
        // ignore
      }
    }
  };

  const handleRoomAddAutoLatest = (roomId: number) => {
    const roomShowtimes = showtimes.filter((st) => st.roomId === roomId);
    if (roomShowtimes.length > 0) {
      const latestEndM = Math.max(...roomShowtimes.map((st) => st.endMinutes + st.cleaningBufferMinutes));
      const latestTimeStr = minutesToTime(latestEndM);
      onOpenAddModal(roomId, latestTimeStr);
    } else {
      onOpenAddModal(roomId, '09:30');
    }
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>, roomId: number) => {
    if (
      (e.target as HTMLElement).closest('.showtime-block-item') ||
      (e.target as HTMLElement).closest('.group\\/card')
    ) {
      return;
    }

    if (!timelineTracksRef.current) return;
    const rect = timelineTracksRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    const rawM = DAY_START_MINUTES + ratio * DAY_TOTAL_MINUTES;
    const snappedM = calculateMagneticSnappedMinutes(rawM, 120, roomId);
    const startTimeStr = minutesToTime(snappedM);

    onOpenAddModal(roomId, startTimeStr);
  };

  return (
    <div className="bg-white flex flex-col h-[calc(100vh-210px)] min-h-[560px] overflow-auto text-slate-900 select-none scrollbar-thin font-sans">
      {/* Studio Header Sub-bar */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b border-gray-200 text-xs bg-slate-50/50"
        style={{ minWidth: `${minTrackWidth + 180}px` }}
      >
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-slate-800 text-xs">
            Lịch chiếu (08:00 – 24:00)
          </span>
          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-medium text-[11px] border border-amber-200">
            Giờ vàng (18:00 – 21:30)
          </span>
          <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#7C6FE8] font-medium text-[11px] border border-purple-200">
            Snap: {snapMinutes === 1 ? 'Tự do' : `${snapMinutes}p`}
          </span>
          {isViewingToday && currentTimePercent !== null && (
            <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-medium text-[11px] border border-rose-200 flex items-center gap-1">
              <Clock className="w-3 h-3 text-rose-600" />
              <span>Hiện tại: {minutesToTime(currentTimeMinutes)}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Dọn phòng: 15p</span>
          <span>•</span>
          <span>Kéo thả để xếp lịch</span>
        </div>
      </div>

      {/* Main Grid: Sticky Left Room Headers + Timeline Lanes */}
      <div
        className="flex flex-1 relative items-start"
        style={{ minWidth: `${minTrackWidth + 180}px` }}
      >
        {/* Left Column: Room Names */}
        <div className="w-44 flex flex-col border-r border-gray-200 shrink-0 bg-white sticky left-0 z-20">
          {/* Header Cell */}
          <div className="h-8 px-3 text-[11px] font-semibold text-slate-500 flex items-center border-b border-gray-200 bg-slate-50/80">
            Phòng chiếu ({rooms.length})
          </div>

          {isLoadingRooms ? (
            <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#7C6FE8]" />
              <span>Đang tải phòng...</span>
            </div>
          ) : rooms.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">Chưa có phòng</div>
          ) : (
            rooms.map((room) => (
              <div
                key={room.id}
                className="h-20 px-3 py-2 border-b border-gray-200 flex flex-col justify-between bg-white"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-xs text-slate-900 truncate" title={room.name}>
                    {room.name}
                  </span>
                  <span className="text-[11px] text-[#7C6FE8] font-medium">{room.type}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{room.capacity} Ghế</span>
                  <button
                    onClick={() => handleRoomAddAutoLatest(room.id)}
                    className="text-[#7C6FE8] font-medium hover:underline cursor-pointer flex items-center gap-0.5"
                    title="Thêm suất chiếu nối tiếp suất trước trong phòng này"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Nối tiếp</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Timeline Grid */}
        <div
          ref={timelineTracksRef}
          onMouseMove={handleMouseMoveOnTimeline}
          onMouseLeave={handleMouseLeaveTimeline}
          className="flex-1 flex flex-col relative min-w-0"
        >
          {/* Hour Ruler Header */}
          <div className="h-8 grid grid-cols-16 text-[10px] font-medium text-slate-500 border-b border-gray-200 bg-slate-50/80 sticky top-0 z-10">
            {TIMELINE_HOURS.slice(0, 16).map((hour) => (
              <div key={hour} className="px-1.5 flex items-center justify-start border-r border-gray-200/60 relative">
                <span>{hour < 10 ? `0${hour}:00` : `${hour}:00`}</span>
                <div className="absolute right-1/2 bottom-0 w-[1px] h-1.5 bg-slate-300" />
              </div>
            ))}
          </div>

          {/* Guide Line & Current Time Line */}
          <div className="absolute top-8 bottom-0 left-0 right-0 pointer-events-none z-20">
            <ShowtimesAlignmentGuide
              guideX={guideX}
              guideTime={guideTime}
              height={canvasHeight - 32}
            />

            {isViewingToday && currentTimePercent !== null && (
              <div
                className="absolute top-0 bottom-0 pointer-events-none z-20"
                style={{ left: `${currentTimePercent}%` }}
              >
                <div className="absolute -top-1.5 -translate-x-1/2 w-2 h-2 rounded-full bg-rose-600 shadow-2xs" />
                <div className="w-[1.5px] h-full bg-rose-500" />
              </div>
            )}
          </div>

          {/* Room Tracks Rows */}
          {isLoadingRooms ? (
            <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#7C6FE8]" />
              <span>Đang tải dữ liệu suất chiếu...</span>
            </div>
          ) : rooms.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              Cụm rạp này chưa có phòng chiếu nào được cấu hình.
            </div>
          ) : (
            rooms.map((room, roomIndex) => {
              const roomShowtimes = showtimes.filter((st) => st.roomId === room.id);

              return (
                <div
                  key={room.id}
                  onDragOver={(e) => handleDragOverRoom(e, room.id)}
                  onDragLeave={handleDragLeaveRoom}
                  onDrop={(e) => handleDropOnRoom(e, room.id)}
                  onClick={(e) => handleTrackClick(e, room.id)}
                  className="h-20 relative bg-slate-50/30 border-b border-gray-200 hover:bg-slate-50/70 transition-colors cursor-crosshair hover:z-30"
                >
                  {/* Hour Columns Grid */}
                  <div className="absolute inset-0 grid grid-cols-16 divide-x divide-gray-200/50 pointer-events-none" />

                  {/* Prime-Time Shaded Zone (18:00 - 21:30) */}
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
                      rowIndex={roomIndex}
                      onView={onViewShowtime}
                      onEdit={onEditShowtime}
                      onDelete={onDeleteShowtime}
                    />
                  ))}

                  {/* Live Drag Ghost */}
                  {dragGhost && dragGhost.roomId === room.id && (
                    <div
                      style={{
                        left: `${((Math.max(0, dragGhost.startMinutes - DAY_START_MINUTES)) / DAY_TOTAL_MINUTES) * 100}%`,
                        width: `${(((dragGhost.durationMinutes + dragGhost.bufferMinutes)) / DAY_TOTAL_MINUTES) * 100}%`,
                      }}
                      className={`absolute top-1 bottom-1 rounded-md border-2 border-dashed flex items-center justify-between px-2 text-xs font-mono font-medium pointer-events-none z-30 transition-all ${
                        dragGhost.isConflict
                          ? 'bg-rose-500/20 border-rose-500 text-rose-800'
                          : 'bg-[#7C6FE8]/20 border-[#7C6FE8] text-[#7C6FE8]'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {dragGhost.isConflict ? (
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                        <span className="truncate">
                          {minutesToTime(dragGhost.startMinutes)} – {minutesToTime(dragGhost.startMinutes + dragGhost.durationMinutes)}
                        </span>
                      </div>
                      <span className="text-[10px] opacity-75">+15m</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
