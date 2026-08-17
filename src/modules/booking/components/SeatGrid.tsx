import React, { useMemo, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  // Process seats: merge couple/sweetbox seats
  const processedSeats = useMemo(() => {
    const sortedSeats = [...seats].sort((a, b) => {
      if (a.row !== b.row) return a.row.localeCompare(b.row);
      return a.number - b.number;
    });

    const result: ProcessedSeat[] = [];
    let i = 0;
    while (i < sortedSeats.length) {
      const seat = sortedSeats[i];
      const isCouple = seat.type.toLowerCase() === 'couple' || seat.type.toLowerCase() === 'sweetbox';
      
      const nextSeat = i + 1 < sortedSeats.length ? sortedSeats[i + 1] : null;
      const isNextCouple = nextSeat && (nextSeat.type.toLowerCase() === 'couple' || nextSeat.type.toLowerCase() === 'sweetbox');

      if (isCouple && nextSeat && isNextCouple && nextSeat.row === seat.row) {
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
          width: SEAT_SIZE + SEAT_GAP, // e.g. 30 + 35 = 65
          label: `${seat.id}-${nextSeat.id}`
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
          width: SEAT_SIZE,
          label: String(seat.id)
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
      // if map is wider than container, scale down. Add some padding.
      const bestScale = Math.min(1, (containerW - 40) / mapWidth);
      setScale(bestScale);
    }
  }, [mapWidth]);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.4));
  const handleResetZoom = () => {
    if (containerRef.current) {
      const bestScale = Math.min(1, (containerRef.current.clientWidth - 40) / mapWidth);
      setScale(bestScale);
    }
  };

  const handleToggle = (seatIds: string[]) => {
    onToggleSeat(seatIds);
  };

  return (
    <div className="w-full flex flex-col gap-2 relative">
      {/* Zoom Controls */}
      <div className="absolute right-0 top-0 z-20 flex flex-col gap-2 bg-white/80 p-2 rounded-xl shadow-sm backdrop-blur-sm border border-gray-100">
        <button onClick={handleZoomIn} className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:border-[#7C6FE8] text-slate-600 hover:text-[#7C6FE8] flex items-center justify-center transition-colors cursor-pointer"><ZoomIn className="w-4 h-4" /></button>
        <button onClick={handleResetZoom} className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:border-[#7C6FE8] text-slate-600 hover:text-[#7C6FE8] flex items-center justify-center transition-colors cursor-pointer"><Maximize className="w-4 h-4" /></button>
        <button onClick={handleZoomOut} className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:border-[#7C6FE8] text-slate-600 hover:text-[#7C6FE8] flex items-center justify-center transition-colors cursor-pointer"><ZoomOut className="w-4 h-4" /></button>
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
            // Determine if fully selected (both merged ids selected)
            const isSelected = seat.seatIds.every(id => selectedSeatIds.includes(id));
            const isBooked = seat.status !== 'AVAILABLE';
            const isVip = seat.type.toLowerCase() === 'vip';
            const isCouple = seat.type.toLowerCase() === 'couple' || seat.type.toLowerCase() === 'sweetbox';

            let baseClass = 'bg-[#F2F2F7] border-gray-300 text-slate-700'; // Standard
            if (isVip) baseClass = 'bg-[#7C6FE8]/15 border-[#7C6FE8]/50 text-[#7C6FE8]';
            if (isCouple) baseClass = 'bg-pink-50 border-pink-300 text-pink-700';

            return (
              <motion.button
                key={seat.id}
                whileHover={!isBooked ? { scale: 1.1, zIndex: 10 } : {}}
                whileTap={!isBooked ? { scale: 0.95 } : {}}
                onClick={() => handleToggle(seat.seatIds)}
                disabled={isBooked}
                title={`Ghế ${seat.label} - ${seat.type}`}
                className={`absolute rounded-xl text-[10px] font-bold flex items-center justify-center transition-colors shadow-sm cursor-pointer border ${
                  isBooked
                    ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed shadow-none'
                    : isSelected
                    ? 'bg-[#7C6FE8] text-white border-[#7C6FE8] shadow-[0_4px_12px_rgba(124,111,232,0.4)]'
                    : `${baseClass} hover:border-[#7C6FE8] hover:bg-white`
                }`}
                style={{
                  left: seat.canvas.cx,
                  top: seat.canvas.cy,
                  width: seat.width,
                  height: SEAT_SIZE,
                  transform: `rotate(${seat.canvas.angle}deg)`
                }}
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
