/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · theme: White Minimal · component: BookingSidebar */
'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowRight, ArrowLeft, Ticket, Timer, ShieldCheck } from 'lucide-react';
import { ShowtimeBookingInfo, SeatItem } from '../types/seat-booking.types';
import { startBookingTimer } from '../services/bookingTimerService';

interface BookingSidebarProps {
  info: ShowtimeBookingInfo;
  currentShowTime: string;
  selectedSeats: SeatItem[];
  totalPrice: number;
  isTimerActive: boolean;
  formattedCountdown: string;
  isHolding: boolean;
  holdError: string | null;
  onHoldSeats: () => Promise<any>;
  onOpenComboModal?: () => void;
}

export const BookingSidebar: React.FC<BookingSidebarProps> = ({
  info,
  currentShowTime,
  selectedSeats,
  totalPrice,
  isTimerActive,
  formattedCountdown,
  isHolding,
  holdError,
  onHoldSeats,
  onOpenComboModal,
}) => {

  const router = useRouter();
  const selectedCount = selectedSeats.length;
  const isSelected = selectedCount > 0;
  const selectedSeatIdsStr = selectedSeats.map((s) => s.id).join(',');

  // Group selected seats dynamically by seat type
  const groupedSeats = useMemo(() => {
    const map: Record<string, { typeName: string; seats: SeatItem[]; isCouple: boolean; color: string }> = {};

    for (const s of selectedSeats) {
      const typeKey = (s.type || 'STANDARD').toUpperCase();
      const normType = typeKey.toLowerCase();
      const isCouple = normType === 'sweetbox' || normType === 'couple';
      const isVip = normType === 'vip';
      const name = s.typeName || (isVip ? 'Ghế VIP' : isCouple ? 'Ghế Đôi Sweetbox' : 'Ghế Thường');
      const color = isVip ? '#7C6FE8' : isCouple ? '#EC4899' : '#64748B';

      if (!map[typeKey]) {
        map[typeKey] = { typeName: name, seats: [], isCouple, color };
      }
      map[typeKey].seats.push(s);
    }

    return Object.values(map).map((group) => ({
      typeName: group.typeName,
      color: group.color,
      countText: group.isCouple
        ? `x${Math.ceil(group.seats.length / 2)} cặp`
        : `x${group.seats.length}`,
      seatIds: group.seats.map((s) => s.id).join(', '),
    }));
  }, [selectedSeats]);

  const handleContinueClick = async () => {
    if (!isSelected || isHolding) return;

    const res = await onHoldSeats();
    if (res?.success === false) {
      if (res.needsAuth) {
        import('@/shared/store/useAuthStore').then(({ useAuthStore }) => {
          useAuthStore.getState().openAuthModal('login');
        });
        return;
      }
      alert(res.message || 'Lỗi giữ ghế, vui lòng thử lại.');
      return;
    }

    startBookingTimer(String(info.showtimeId));

    if (onOpenComboModal) {
      onOpenComboModal();
    } else {
      const foodUrl = `/booking/food?showtime_id=${info.showtimeId}&movie=${info.movieSlug}&seats=${selectedSeatIdsStr}&date=${encodeURIComponent(
        info.showDate
      )}&time=${encodeURIComponent(currentShowTime)}&cinema=${encodeURIComponent(info.cinemaName)}`;
      router.push(foodUrl);
    }
  };


  return (
    <aside
      aria-label="Thông tin vé và đặt chỗ"
      className="w-full bg-white rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-200/90 flex flex-col gap-4 sticky top-28 transition-colors select-none"
    >
      {/* 1. Countdown Timer (When active) */}
      {isTimerActive && (
        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-900 text-xs">
          <div className="flex items-center gap-2 font-bold">
            <Timer className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>Thời gian giữ ghế:</span>
          </div>
          <span className="font-extrabold text-sm text-amber-700 font-mono tracking-wider">
            {formattedCountdown}
          </span>
        </div>
      )}

      {/* 2. Movie Info */}
      <div className="flex gap-3.5 items-start border-b border-gray-100 pb-4">
        <div className="w-16 aspect-[2/3] rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <img
            src={info.posterUrl}
            alt={info.movieTitle}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md bg-[#7C6FE8] text-white text-[9px] font-black uppercase tracking-wider">
              {info.movieFormat}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[9px] font-bold border border-amber-200/80">
              Khán giả {info.ageRating}
            </span>
          </div>

          <h3 className="font-extrabold text-sm text-gray-950 leading-snug line-clamp-2">
            {info.movieTitle}
          </h3>
        </div>
      </div>

      {/* 3. Cinema & Showtime Info */}
      <div className="flex flex-col gap-2.5 text-xs text-gray-700 border-b border-gray-100 pb-3.5">
        <div className="flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-lg bg-[#EEECFB] flex items-center justify-center text-[#7C6FE8] shrink-0 mt-0.5">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-950">{info.cinemaName}</span>
            <span className="text-gray-500 font-medium">{info.roomName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-lg bg-[#EEECFB] flex items-center justify-center text-[#7C6FE8] shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <span>
            Suất: <strong className="text-gray-950 font-bold">{currentShowTime}</strong> — {info.showDate}
          </span>
        </div>
      </div>

      {/* 4. Selected Seats Breakdown */}
      <div className="flex flex-col gap-2 border-b border-gray-100 pb-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Ticket className="w-3.5 h-3.5 text-[#7C6FE8]" />
            <span>Ghế Đã Chọn ({selectedCount})</span>
          </span>
        </div>

        {!isSelected ? (
          <p className="text-xs text-gray-400 font-medium italic pt-0.5">
            Vui lòng nhấp chọn ghế trên sơ đồ
          </p>
        ) : (
          <div className="flex flex-col gap-2 pt-0.5">
            {groupedSeats.map((group, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-gray-50 border border-gray-200/70 flex flex-col gap-1 text-xs"
              >
                <div className="flex items-center justify-between font-bold text-gray-900">
                  <span className="flex items-center gap-1.5">
                    <span
                      style={{ backgroundColor: group.color }}
                      className="w-2 h-2 rounded-full shrink-0"
                    />
                    {group.typeName}
                  </span>
                  <span className="text-gray-500 font-semibold">{group.countText}</span>
                </div>
                <div className="text-[#7C6FE8] font-black text-sm tracking-wide">
                  {group.seatIds}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Total Price */}
      <div className="flex flex-col gap-1 pt-0.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Tạm tính tiền vé
          </span>
          <span className="text-2xl font-black text-[#7C6FE8]">
            {totalPrice.toLocaleString('vi-VN')}đ
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>Đã bao gồm thuế GTGT (VAT) & bảo hiểm vé</span>
        </div>
      </div>

      {/* 6. Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <Link href={`/movies/${info.movieSlug}`}>
          <button
            type="button"
            className="w-full py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại</span>
          </button>
        </Link>

        <motion.button
          type="button"
          whileHover={isSelected && !isHolding ? { scale: 1.02 } : {}}
          whileTap={isSelected && !isHolding ? { scale: 0.98 } : {}}
          disabled={!isSelected || isHolding}
          onClick={handleContinueClick}
          className={`w-full py-3 rounded-full font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            isSelected
              ? 'bg-[#7C6FE8] hover:bg-[#685bc7] text-white shadow-[0_4px_14px_rgba(124,111,232,0.35)]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
          } ${isHolding ? 'opacity-70 cursor-wait' : ''}`}
        >
          <span>{isHolding ? 'Đang xử lý...' : 'Tiếp tục'}</span>
          {!isHolding && <ArrowRight className="w-3.5 h-3.5" />}
        </motion.button>
      </div>
    </aside>
  );
};

