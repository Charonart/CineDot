'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SeatItem, SeatType, SeatStatus, SeatCanvas } from '../types/seat-booking.types';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface SeatGridProps {
  seats: SeatItem[];
  selectedSeatIds: string[];
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
  onToggleSeat,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Constants based on API coordinates
  const SEAT_SIZE = 30;
  const SEAT_GAP = 35; // Distance between cx of adjacent seats

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
          width: SEAT_SIZE + SEAT_GAP, // 30 + 35 = 65px
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
          width: isCouple ? SEAT_SIZE * 1.5 : SEAT_SIZE,
          label: String(seat.id),
          color: seat.color || (normType === 'vip' ? '#7C6FE8' : isCouple ? '#EC4899' : '#64748B'),
          typeName: seat.typeName,
          price: seat.price,
        });
        i += 1;
      }
    }
    return result;
  }, [seats]);

  // Calculate bounding box to set container size
  const { maxX, maxY } = useMemo(() => {
    let mx = 0;
    let my = 0;
    processedSeats.forEach((s) => {
      if (s.canvas.cx > mx) mx = s.canvas.cx;
      if (s.canvas.cy > my) my = s.canvas.cy;
    });
    return { maxX: mx, maxY: my };
  }, [processedSeats]);

  const mapWidth = maxX + SEAT_SIZE * 3; 
  const mapHeight = maxY + SEAT_SIZE * 3;

  // Auto-fit scale on mount
  useEffect(() => {
    if (containerRef.current && mapWidth > 0) {
      const containerW = containerRef.current.clientWidth;
      const bestScale = Math.min(1, (containerW - 40) / mapWidth);
      setScale(bestScale);
    }
  }, [mapWidth]);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.4));
  const handleResetZoom = () => {
    if (containerRef.current && mapWidth > 0) {
      const bestScale = Math.min(1, (containerRef.current.clientWidth - 40) / mapWidth);
      setScale(bestScale);
    }
  };

  const handleToggle = (seatIds: string[]) => {
    onToggleSeat(seatIds);
  };

  return (
    <div className="w-full flex flex-col gap-2 relative select-none">
      {/* Zoom Controls */}
      <div className="absolute right-0 top-0 z-20 flex flex-col gap-2 bg-white/80 p-2 rounded-xl shadow-sm backdrop-blur-sm border border-gray-100">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:border-[#7C6FE8] text-slate-600 hover:text-[#7C6FE8] flex items-center justify-center transition-colors cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetZoom}
          className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:border-[#7C6FE8] text-slate-600 hover:text-[#7C6FE8] flex items-center justify-center transition-colors cursor-pointer"
        >
          <Maximize className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:border-[#7C6FE8] text-slate-600 hover:text-[#7C6FE8] flex items-center justify-center transition-colors cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      <div 
        ref={containerRef}
        className="w-full h-[500px] overflow-auto scrollbar-thin scrollbar-thumb-gray-300 bg-[#FAFAFA] rounded-2xl border border-dashed border-gray-200 flex items-center justify-center relative cursor-grab active:cursor-grabbing"
      >
        <div 
          className="relative transition-transform duration-200 ease-out origin-center"
          style={{
            width: mapWidth,
            height: mapHeight,
            transform: `scale(${scale})`
          }}
        >
          {processedSeats.map((seat) => {
            const isSelected = seat.seatIds.every((id) => selectedSeatIds.includes(id));
            const isBooked = seat.status !== 'AVAILABLE';
            const normType = (seat.type || 'standard').toLowerCase();
            const isStandard = normType === 'standard' || normType === 'regular';
            const seatColor = seat.color || '#64748B';

            let dynamicBg = `${seatColor}1A`; // ~10% tint
            let dynamicBorder = seatColor;
            let dynamicText = seatColor;

            if (isStandard) {
              dynamicBg = '#F2F2F7';
              dynamicBorder = '#CBD5E1';
              dynamicText = '#334155';
            }

            if (isBooked) {
              if (seat.status === 'HOLDING') {
                dynamicBg = '#FEF3C7'; // Amber-100
                dynamicBorder = '#F59E0B'; // Amber-500
                dynamicText = '#B45309'; // Amber-700
              } else {
                dynamicBg = '#E2E8F0';
                dynamicBorder = '#CBD5E1';
                dynamicText = '#94A3B8';
              }
            } else if (isSelected) {
              dynamicBg = '#7C6FE8';
              dynamicBorder = '#7C6FE8';
              dynamicText = '#FFFFFF';
            }

            const tooltipText =
              seat.status === 'HOLDING'
                ? `Ghế ${seat.label} (Đang có người giữ)`
                : isBooked
                ? `Ghế ${seat.label} (Đã được đặt)`
                : `Ghế ${seat.label} (${seat.typeName || seat.type}) - ${seat.price.toLocaleString('vi-VN')}đ`;

            return (
              <motion.button
                key={seat.id}
                whileHover={!isBooked ? { scale: 1.1, zIndex: 10 } : {}}
                whileTap={!isBooked ? { scale: 0.95 } : {}}
                onClick={() => handleToggle(seat.seatIds)}
                disabled={isBooked}
                title={tooltipText}
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
                className={`absolute rounded-xl text-[10px] font-black flex items-center justify-center transition-colors shadow-2xs cursor-pointer border ${
                  isBooked
                    ? 'cursor-not-allowed shadow-none'
                    : isSelected
                    ? 'shadow-[0_4px_12px_rgba(124,111,232,0.5)] z-20'
                    : 'hover:brightness-95'
                }`}
              >
                {seat.label}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
