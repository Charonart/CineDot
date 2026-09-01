/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · theme: White Minimal · component: SeatGrid */
'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SeatItem, SeatType, SeatStatus, SeatCanvas } from '../types/seat-booking.types';
import { ZoomIn, ZoomOut, Maximize, Info } from 'lucide-react';

interface SeatGridProps {
  seats: SeatItem[];
  selectedSeatIds: string[];
  otherSelectingSeatIds?: string[];
  onToggleSeat: (seatIdOrIds: string | string[]) => void;
}

interface ProcessedSeat {
  id: string;
  seatIds: string[];
  row: string;
  type: SeatType;
  status: SeatStatus;
  canvas: SeatCanvas;
  width: number;
  label: string;
  color?: string;
  typeName?: string;
  price: number;
}

export const SeatGrid: React.FC<SeatGridProps> = ({
  seats,
  selectedSeatIds,
  otherSelectingSeatIds = [],
  onToggleSeat,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [hoveredSeat, setHoveredSeat] = useState<ProcessedSeat | null>(null);

  // Constants based on API coordinates
  const SEAT_SIZE = 32;
  const SEAT_GAP = 36;

  // Process seats: merge couple/sweetbox seats naturally by pair (1-2, 3-4, 5-6...)
  const processedSeats = useMemo(() => {
    const sortedSeats = [...seats].sort((a, b) => {
      if (a.row !== b.row) return a.row.localeCompare(b.row);
      return a.number - b.number;
    });

    const result: ProcessedSeat[] = [];
    let i = 0;
    while (i < sortedSeats.length) {
      const seat = sortedSeats[i];
      const normType = (seat.type || 'standard').toLowerCase();
      const isCouple = normType === 'couple' || normType === 'sweetbox';
      const isDeluxe = normType === 'deluxe';
      const isBed = normType === 'bed';
      
      const nextSeat = i + 1 < sortedSeats.length ? sortedSeats[i + 1] : null;
      const isNextCouple = nextSeat && ((nextSeat.type || 'standard').toLowerCase() === 'couple' || (nextSeat.type || 'standard').toLowerCase() === 'sweetbox');

      // Pair natural odd-even couple seats (e.g. 1 & 2, 3 & 4) in the same row
      const isNaturalPair =
        isCouple &&
        nextSeat &&
        isNextCouple &&
        nextSeat.row === seat.row &&
        (seat.number % 2 !== 0 && nextSeat.number === seat.number + 1);

      if (isNaturalPair && nextSeat) {
        result.push({
          id: `${seat.id}-${nextSeat.id}`,
          seatIds: [seat.id, nextSeat.id],
          row: seat.row,
          type: seat.type,
          status: seat.status === 'AVAILABLE' && nextSeat.status === 'AVAILABLE' ? 'AVAILABLE' : 'BOOKED',
          canvas: {
            cx: seat.canvas?.cx || 0,
            cy: seat.canvas?.cy || 0,
            angle: seat.canvas?.angle || 0,
          },
          width: SEAT_SIZE + SEAT_GAP, // ~68px
          label: `${seat.id}-${nextSeat.id}`,
          color: seat.color || '#EC4899',
          typeName: seat.typeName || 'Ghế Đôi Sweetbox',
          price: seat.price + nextSeat.price,
        });
        i += 2;
      } else {
        result.push({
          id: seat.id,
          seatIds: [seat.id],
          row: seat.row,
          type: seat.type,
          status: seat.status,
          canvas: {
            cx: seat.canvas?.cx || 0,
            cy: seat.canvas?.cy || 0,
            angle: seat.canvas?.angle || 0,
          },
          width: isCouple ? SEAT_SIZE * 1.6 : isBed ? SEAT_SIZE * 1.8 : isDeluxe ? SEAT_SIZE * 1.3 : SEAT_SIZE,
          label: String(seat.id),
          color: seat.color || (normType === 'vip' ? '#7C6FE8' : isCouple ? '#EC4899' : isDeluxe ? '#D97706' : isBed ? '#059669' : '#64748B'),
          typeName: seat.typeName || (normType === 'vip' ? 'Ghế VIP' : isCouple ? 'Ghế Đôi' : isDeluxe ? 'Ghế Deluxe Ngả Lưng' : isBed ? 'Giường Nằm VIP Bed' : 'Ghế Thường'),
          price: seat.price,
        });
        i += 1;
      }
    }
    return result;
  }, [seats]);

  // Calculate bounding box to set container size
  const { maxX, maxY, rowPositions } = useMemo(() => {
    let mx = 0;
    let my = 0;
    const rowsMap = new Map<string, number>();

    processedSeats.forEach((s) => {
      if (s.canvas.cx > mx) mx = s.canvas.cx;
      if (s.canvas.cy > my) my = s.canvas.cy;
      if (!rowsMap.has(s.row)) {
        rowsMap.set(s.row, s.canvas.cy);
      }
    });

    const rowsArr = Array.from(rowsMap.entries()).map(([row, cy]) => ({ row, cy }));
    return { maxX: mx, maxY: my, rowPositions: rowsArr };
  }, [processedSeats]);

  const mapWidth = maxX + SEAT_SIZE * 3.5; 
  const mapHeight = maxY + SEAT_SIZE * 3.5;

  // Auto-fit scale on mount and resize
  useEffect(() => {
    if (containerRef.current && mapWidth > 0) {
      const containerW = containerRef.current.clientWidth;
      const bestScale = Math.min(1, (containerW - 48) / mapWidth);
      setScale(bestScale);
    }
  }, [mapWidth]);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 1.8));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.45));
  const handleResetZoom = () => {
    if (containerRef.current && mapWidth > 0) {
      const bestScale = Math.min(1, (containerRef.current.clientWidth - 48) / mapWidth);
      setScale(bestScale);
    }
  };

  const handleToggle = (seatIds: string[]) => {
    onToggleSeat(seatIds);
  };

  return (
    <div className="w-full flex flex-col gap-3 relative select-none">
      {/* Top Utility Header & Controls */}
      <div className="w-full flex items-center justify-between px-1 z-20">
        {/* Active Hover / Selection Info Bar */}
        <div className="flex items-center gap-2 min-h-7">
          {hoveredSeat ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-xs text-gray-800 font-semibold">
              <span className="font-extrabold text-gray-950">Ghế {hoveredSeat.label}</span>
              <span className="text-gray-300">•</span>
              <span style={{ color: hoveredSeat.color }} className="font-bold">
                {hoveredSeat.typeName}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-[#7C6FE8] font-extrabold">
                {hoveredSeat.price.toLocaleString('vi-VN')}đ
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
              <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>Di chuột hoặc chạm vào ghế để xem chi tiết vị trí & giá vé</span>
            </div>
          )}
        </div>

        {/* Zoom Controls Pill */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-200/90">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-7 h-7 rounded-xl bg-gray-50 hover:bg-[#EEECFB] border border-gray-200/80 hover:border-[#7C6FE8]/40 text-gray-600 hover:text-[#7C6FE8] flex items-center justify-center transition-colors cursor-pointer"
            title="Phóng to sơ đồ ghế"
            aria-label="Phóng to"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            className="w-7 h-7 rounded-xl bg-gray-50 hover:bg-[#EEECFB] border border-gray-200/80 hover:border-[#7C6FE8]/40 text-gray-600 hover:text-[#7C6FE8] flex items-center justify-center transition-colors cursor-pointer"
            title="Vừa màn hình"
            aria-label="Thu phóng chuẩn"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-7 h-7 rounded-xl bg-gray-50 hover:bg-[#EEECFB] border border-gray-200/80 hover:border-[#7C6FE8]/40 text-gray-600 hover:text-[#7C6FE8] flex items-center justify-center transition-colors cursor-pointer"
            title="Thu nhỏ sơ đồ ghế"
            aria-label="Thu nhỏ"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Seat Viewport Canvas */}
      <div 
        ref={containerRef}
        className="w-full h-[490px] overflow-auto scrollbar-thin scrollbar-thumb-gray-300 bg-[#FAFAFB] rounded-2xl border border-gray-200/90 flex items-center justify-center relative cursor-grab active:cursor-grabbing p-6"
      >
        <div 
          className="relative transition-transform duration-150 ease-out origin-center"
          style={{
            width: mapWidth,
            height: mapHeight,
            transform: `scale(${scale})`
          }}
        >
          {/* Left & Right Row Letter Indicators */}
          {rowPositions.map(({ row, cy }) => (
            <React.Fragment key={row}>
              <div
                style={{ top: cy + 4, left: 10 }}
                className="absolute w-5 h-5 rounded-full bg-gray-200/70 border border-gray-300/80 text-gray-600 font-extrabold text-[10px] flex items-center justify-center pointer-events-none select-none"
              >
                {row}
              </div>
              <div
                style={{ top: cy + 4, left: mapWidth - 30 }}
                className="absolute w-5 h-5 rounded-full bg-gray-200/70 border border-gray-300/80 text-gray-600 font-extrabold text-[10px] flex items-center justify-center pointer-events-none select-none"
              >
                {row}
              </div>
            </React.Fragment>
          ))}

          {/* Seat Grid Map Elements */}
          {processedSeats.map((seat) => {
            const isSelected = seat.seatIds.every((id) => selectedSeatIds.includes(id));
            const isOtherSelecting = !isSelected && seat.seatIds.some((id) => otherSelectingSeatIds.includes(id));
            const isBooked = seat.status !== 'AVAILABLE';
            const normType = (seat.type || 'standard').toLowerCase();
            const isStandard = normType === 'standard' || normType === 'regular';
            const isVip = normType === 'vip';
            const isCouple = normType === 'couple' || normType === 'sweetbox';
            const isDeluxe = normType === 'deluxe';
            const isBed = normType === 'bed';

            let dynamicBg = '#F8FAFC';
            let dynamicBorder = '#CBD5E1';
            let dynamicText = '#334155';

            if (isVip) {
              dynamicBg = '#F3F0FF';
              dynamicBorder = '#7C6FE8';
              dynamicText = '#6B5BD6';
            } else if (isCouple) {
              dynamicBg = '#FDF2F8';
              dynamicBorder = '#EC4899';
              dynamicText = '#DB2777';
            } else if (isDeluxe) {
              dynamicBg = '#FFFBEB';
              dynamicBorder = '#D97706';
              dynamicText = '#B45309';
            } else if (isBed) {
              dynamicBg = '#ECFDF5';
              dynamicBorder = '#059669';
              dynamicText = '#047857';
            }

            if (isBooked) {
              if (seat.status === 'HOLDING') {
                dynamicBg = '#FEF3C7';
                dynamicBorder = '#F59E0B';
                dynamicText = '#B45309';
              } else {
                dynamicBg = '#F1F5F9';
                dynamicBorder = '#E2E8F0';
                dynamicText = '#94A3B8';
              }
            } else if (isSelected) {
              dynamicBg = '#7C6FE8';
              dynamicBorder = '#685BC7';
              dynamicText = '#FFFFFF';
            } else if (isOtherSelecting) {
              dynamicBg = '#FFFBEB';
              dynamicBorder = '#F59E0B';
              dynamicText = '#D97706';
            }

            return (
              <button
                key={seat.id}
                type="button"
                onMouseEnter={() => setHoveredSeat(seat)}
                onMouseLeave={() => setHoveredSeat(null)}
                onClick={() => handleToggle(seat.seatIds)}
                disabled={isBooked}
                aria-label={`Ghế ${seat.label} - ${seat.typeName} - ${seat.price.toLocaleString('vi-VN')}đ`}
                style={{
                  left: seat.canvas.cx,
                  top: seat.canvas.cy,
                  width: seat.width,
                  height: SEAT_SIZE,
                  transform: `rotate(${seat.canvas.angle}deg)`,
                  backgroundColor: dynamicBg,
                  borderColor: dynamicBorder,
                  color: dynamicText,
                }}
                className={`absolute rounded-xl text-[10px] font-black flex items-center justify-center transition-all duration-100 cursor-pointer border select-none ${
                  isBooked
                    ? 'cursor-not-allowed opacity-60'
                    : isSelected
                    ? 'shadow-[0_2px_8px_rgba(124,111,232,0.4)] z-20 ring-2 ring-[#7C6FE8]/30 font-black'
                    : isOtherSelecting
                    ? 'ring-2 ring-amber-400 ring-offset-1 animate-pulse z-15 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                    : 'hover:border-gray-500 hover:shadow-xs'
                }`}
              >
                {seat.label}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

