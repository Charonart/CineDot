'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Tv,
  Volume2,
  Users,
  Sparkles,
  Info,
  X,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { RoomLayoutData, RoomLayoutSeat } from '../types/cinemas.types';
import { fetchRoomLayout } from '../services/cinemas.service';

interface CinemaRoomLayoutViewerProps {
  roomId: number | string;
  roomName: string;
  roomType?: string;
  screenType?: string;
  soundTechnology?: string;
  totalSeats?: number;
  onClose?: () => void;
}

export const CinemaRoomLayoutViewer: React.FC<CinemaRoomLayoutViewerProps> = ({
  roomId,
  roomName,
  roomType = '2D Digital',
  screenType,
  soundTechnology,
  totalSeats,
  onClose,
}) => {
  const [layout, setLayout] = useState<RoomLayoutData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [scale, setScale] = useState<number>(1);
  const [hoveredSeat, setHoveredSeat] = useState<RoomLayoutSeat | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // 1. Fetch real layout coordinates
  useEffect(() => {
    let isMounted = true;
    async function loadLayout() {
      setLoading(true);
      try {
        const data = await fetchRoomLayout(roomId);
        if (isMounted) {
          setLayout(data);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadLayout();
    return () => {
      isMounted = false;
    };
  }, [roomId]);

  // 2. Compute bounding box coordinates for SVG auto-fit
  const { minX, maxX, minY, maxY, svgWidth, svgHeight } = useMemo(() => {
    if (!layout?.seats || layout.seats.length === 0) {
      return { minX: 0, maxX: 600, minY: 0, maxY: 400, svgWidth: 680, svgHeight: 450 };
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    layout.seats.forEach((seat) => {
      const cx = seat.cx ?? 0;
      const cy = seat.cy ?? 0;
      if (cx < minX) minX = cx;
      if (cx > maxX) maxX = cx;
      if (cy < minY) minY = cy;
      if (cy > maxY) maxY = cy;
    });

    const paddingX = 60;
    const paddingY = 70;
    const computedWidth = Math.max(maxX - minX + paddingX * 2, 600);
    const computedHeight = Math.max(maxY - minY + paddingY * 2 + 60, 400);

    return {
      minX: minX - paddingX,
      maxX: maxX + paddingX,
      minY: minY - paddingY,
      maxY: maxY + paddingY,
      svgWidth: computedWidth,
      svgHeight: computedHeight,
    };
  }, [layout]);

  // 3. Zoom controls
  const handleZoomIn = () => setScale((s) => Math.min(s + 0.15, 1.6));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.15, 0.7));
  const handleResetZoom = () => setScale(1);

  // Helper: map seat type to visual palette
  const getSeatStyling = (type: string) => {
    const t = (type || '').toUpperCase();
    if (t.includes('SWEETBOX') || t.includes('COUPLE')) {
      return {
        fill: '#FFE4E6',
        stroke: '#F43F5E',
        text: '#BE123C',
        label: 'Sweetbox Đôi',
        badgeClass: 'bg-rose-50 text-rose-600 border-rose-200',
        width: 62,
      };
    }
    if (t.includes('VIP')) {
      return {
        fill: '#FEF3C7',
        stroke: '#F59E0B',
        text: '#B45309',
        label: 'Ghế VIP Iris',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        width: 32,
      };
    }
    if (t.includes('DELUXE') || t.includes('BED')) {
      return {
        fill: '#E0F2FE',
        stroke: '#0284C7',
        text: '#0369A1',
        label: 'Ghế Giường Nằm',
        badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
        width: 36,
      };
    }
    return {
      fill: '#F1F5F9',
      stroke: '#94A3B8',
      text: '#475569',
      label: 'Ghế Tiêu Chuẩn',
      badgeClass: 'bg-slate-50 text-slate-600 border-slate-200',
      width: 32,
    };
  };

  const screenConfig = layout?.screen;
  const screenLabel = screenConfig?.label || (
    roomType.toLowerCase().includes('imax')
      ? 'MÀN HÌNH CONG IMAX LASER 12-CHANNEL'
      : roomType.toLowerCase().includes('screenx')
      ? 'MÀN HÌNH CHÍNH SCREENX 270°'
      : roomType.toLowerCase().includes('onyx')
      ? 'MÀN HÌNH SAMSUNG ONYX 4K LED'
      : 'MÀN HÌNH CHIẾU RẠP CINEDOT LASER'
  );

  return (
    <div className="w-full bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden flex flex-col transition-all">
      {/* 1. Header Bar */}
      <div className="px-5 py-4 bg-slate-950 text-white flex items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#7C6FE8]/20 text-[#A594F9] flex items-center justify-center font-black">
            <Layers className="w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-white">
                {roomName}
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-[#7C6FE8] text-white text-[10px] font-extrabold tracking-wide uppercase">
                {roomType}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Sơ đồ bố trí chỗ ngồi thực tế (Chế độ xem khán giả tham khảo)
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Đóng sơ đồ"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 2. Tech Specs & Zoom Strip */}
      <div className="px-5 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3 text-xs font-semibold text-slate-300">
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap text-[11px]">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#A594F9]" />
            <span>Sức chứa: <strong className="text-white">{totalSeats || layout?.total_seats || 96} ghế</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <Tv className="w-3.5 h-3.5 text-sky-400" />
            <span className="truncate">Màn chiếu: <strong className="text-white">{screenType || 'Laser High-Contrast'}</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate">Âm thanh: <strong className="text-white">{soundTechnology || 'Dolby Atmos 64-Ch'}</strong></span>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            className="px-2 py-0.5 text-[10px] font-extrabold text-slate-300 hover:text-white transition-colors"
            title="Mặc định 100%"
          >
            {Math.round(scale * 100)}%
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Phóng to"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Theater Canvas View Area */}
      <div
        ref={canvasRef}
        className="w-full relative min-h-[400px] max-h-[550px] overflow-auto bg-[#0A0E17] p-8 flex flex-col items-center justify-start select-none scrollbar-thin scrollbar-thumb-slate-700"
      >
        {loading ? (
          <div className="w-full h-72 flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="w-7 h-7 border-2 border-[#7C6FE8] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold">Đang tải sơ đồ phòng chiếu...</span>
          </div>
        ) : (
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out',
            }}
            className="flex flex-col items-center"
          >
            {/* Screen Arc with Ambient Glow */}
            <div className="w-full max-w-lg flex flex-col items-center gap-2 mb-8">
              <div className="relative w-full flex items-center justify-center">
                <div className="absolute -top-3 inset-x-8 h-8 bg-gradient-to-b from-[#7C6FE8]/30 to-transparent blur-md rounded-full pointer-events-none" />
                
                <svg
                  viewBox="0 0 500 36"
                  className="w-full h-8 text-[#7C6FE8] drop-shadow-[0_0_12px_rgba(124,111,232,0.6)]"
                >
                  <path
                    d="M 15,30 Q 250,5 485,30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A594F9] flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>{screenLabel}</span>
              </span>
            </div>

            {/* Scaled Seats SVG Canvas */}
            <svg
              width={svgWidth}
              height={svgHeight}
              viewBox={`${minX} ${minY} ${svgWidth} ${svgHeight}`}
              className="overflow-visible"
            >
              {layout?.seats.map((seat) => {
                const style = getSeatStyling(seat.type);
                const isHovered = hoveredSeat?.seat_id === seat.seat_id;
                const isCouple = style.width > 32;
                const seatW = style.width;
                const seatH = 26;

                return (
                  <g
                    key={seat.seat_id}
                    transform={`translate(${seat.cx}, ${seat.cy}) rotate(${seat.angle || 0})`}
                    onMouseEnter={() => setHoveredSeat(seat)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    className="cursor-default"
                  >
                    {/* Seat Body Rectangle */}
                    <rect
                      x={-seatW / 2}
                      y={-seatH / 2}
                      width={seatW}
                      height={seatH}
                      rx={6}
                      ry={6}
                      fill={isHovered ? '#FFFFFF' : style.fill}
                      stroke={isHovered ? '#7C6FE8' : style.stroke}
                      strokeWidth={isHovered ? 2 : 1.2}
                      className="transition-all duration-150 drop-shadow-xs"
                    />

                    {/* Seat Headrest Indicator */}
                    <rect
                      x={-seatW / 2 + 4}
                      y={-seatH / 2 + 3}
                      width={seatW - 8}
                      height={5}
                      rx={2}
                      fill={isHovered ? '#7C6FE8' : style.stroke}
                      opacity={0.7}
                    />

                    {/* Seat Code Text */}
                    <text
                      x={0}
                      y={4}
                      textAnchor="middle"
                      fill={isHovered ? '#7C6FE8' : style.text}
                      fontSize={isCouple ? '9px' : '9.5px'}
                      fontWeight="800"
                      fontFamily="sans-serif"
                      letterSpacing="0.2px"
                    >
                      {seat.seat_id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* Hovered Seat Floating Tooltip */}
        <AnimatePresence>
          {hoveredSeat && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="fixed bottom-24 bg-slate-950 text-white px-4 py-2 rounded-xl border border-slate-700 shadow-2xl flex items-center gap-2.5 text-xs z-50 pointer-events-none"
            >
              <span className="font-extrabold text-[#A594F9]">
                Ghế {hoveredSeat.seat_id}
              </span>
              <span className="text-slate-500">•</span>
              <span className="font-semibold text-slate-300">
                {getSeatStyling(hoveredSeat.type).label}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Bottom Legend Bar */}
      <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white text-xs">
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-3.5 h-3.5 rounded bg-slate-200 border border-slate-400 inline-block" />
            <span>Ghế Thường</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-3.5 h-3.5 rounded bg-amber-200 border border-amber-500 inline-block" />
            <span>Ghế VIP</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-5 h-3.5 rounded bg-rose-200 border border-rose-500 inline-block" />
            <span>Sweetbox Đôi</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Info className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0" />
          <span>Sơ đồ mô phỏng tỷ lệ thực. Để đặt vé, vui lòng chọn suất chiếu tương ứng.</span>
        </div>
      </div>
    </div>
  );
};
