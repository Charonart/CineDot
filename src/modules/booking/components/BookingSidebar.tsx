'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowRight, ArrowLeft, Ticket, Timer } from 'lucide-react';
import { ShowtimeBookingInfo, SeatItem } from '../types/seat-booking.types';
import { startBookingTimer } from '../services/bookingTimerService';
import { getBookingSession } from '../services/bookingSessionService';
import { FoodComboSuggestModal } from './FoodComboSuggestModal';

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
}) => {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const [isSuggestModalOpen, setIsSuggestModalOpen] = React.useState(false);

  const selectedCount = selectedSeats.length;
  const isSelected = selectedCount > 0;
  const selectedSeatIdsStr = selectedSeats.map((s) => s.id).join(',');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Group selected seats dynamically by seat type
  const groupedSeats = useMemo(() => {
    const map: Record<string, { typeName: string; seats: SeatItem[]; isCouple: boolean }> = {};

    for (const s of selectedSeats) {
      const typeKey = (s.type || 'STANDARD').toUpperCase();
      const normType = typeKey.toLowerCase();
      const isCouple = normType === 'sweetbox' || normType === 'couple';
      const name = s.typeName || (normType === 'vip' ? 'Ghế VIP' : isCouple ? 'Ghế Đôi Sweetbox' : normType === 'bed' ? 'Ghế Giường Nằm' : normType === 'deluxe' ? 'Ghế Deluxe' : 'Ghế Thường');

      if (!map[typeKey]) {
        map[typeKey] = { typeName: name, seats: [], isCouple };
      }
      map[typeKey].seats.push(s);
    }

    return Object.values(map).map((group) => ({
      typeName: group.typeName,
      countText: group.isCouple
        ? `x${Math.ceil(group.seats.length / 2)} cặp`
        : `x${group.seats.length}`,
      seatIds: group.seats.map((s) => s.id).join(', '),
    }));
  }, [selectedSeats]);

  const foodUrl = `/booking/food?showtime_id=${info.showtimeId}&movie=${info.movieSlug}&seats=${selectedSeatIdsStr}&date=${encodeURIComponent(
    info.showDate
  )}&time=${encodeURIComponent(currentShowTime)}&cinema=${encodeURIComponent(info.cinemaName)}`;

  const paymentUrl = `/booking/payment?showtime_id=${info.showtimeId}&movie=${info.movieSlug}&seats=${selectedSeatIdsStr}&date=${encodeURIComponent(
    info.showDate
  )}&time=${encodeURIComponent(currentShowTime)}&cinema=${encodeURIComponent(info.cinemaName)}`;

  const handleContinueClick = async () => {
    if (!isSelected || isHolding) return;

    // Call API to hold seats
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

    // Officially start the 10-minute hold countdown timer NOW!
    startBookingTimer(String(info.showtimeId));

    // Frequency cap: Check if user has already seen the popup in this booking session
    const upsellKey = `cinedot_food_upsell_seen_${info.showtimeId}`;
    const hasSeenUpsell = typeof window !== 'undefined' && sessionStorage.getItem(upsellKey) === 'true';

    if (!hasSeenUpsell) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(upsellKey, 'true');
      }
      setIsSuggestModalOpen(true);
    } else {
      // Frequency Cap enforced: Directly proceed!
      const session = getBookingSession(String(info.showtimeId));
      if (session?.combos && session.combos.length > 0) {
        router.push(foodUrl);
      } else {
        router.push(paymentUrl);
      }
    }
  };

  const handleSelectFood = () => {
    setIsSuggestModalOpen(false);
    router.push(foodUrl);
  };

  const handleSkipToPayment = () => {
    setIsSuggestModalOpen(false);
    router.push(paymentUrl);
  };

  return (
    <>
      <div className="w-full bg-white rounded-3xl p-6 shadow-[0_16px_50px_rgba(124,111,232,0.12),0_4px_16px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col gap-5 sticky top-28">
        {/* 1. TOPMOST SECTION INSIDE SIDEBAR: Active Countdown Timer (Rendered client-side only to prevent hydration mismatch) */}
        {mounted && isTimerActive && (
          <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <div className="flex items-center gap-2 font-bold">
              <Timer className="w-4 h-4 text-amber-600 animate-pulse" />
              <span>Thời gian giữ ghế:</span>
            </div>
            <span className="font-extrabold text-sm text-amber-600 tracking-tight">
              {formattedCountdown}
            </span>
          </div>
        )}

        {/* 2. Dynamic Movie Thumbnail & Title Info */}
        <div className="flex gap-4 items-start border-b border-gray-100 pb-4">
          <div className="w-20 aspect-[2/3] rounded-2xl overflow-hidden bg-slate-900 shrink-0 shadow-md">
            {info.posterUrl ? (
              <img
                src={info.posterUrl}
                alt={info.movieTitle}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-[10px] p-2 text-center">
                CineDot
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#7C6FE8] text-white text-[10px] font-bold uppercase">
                {info.movieFormat}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                Khán giả {info.ageRating}
              </span>
            </div>

            <h3 className="font-bold text-base text-[#131413] leading-snug line-clamp-2">
              {info.movieTitle}
            </h3>
          </div>
        </div>

        {/* 3. Cinema & Interactive Showtime Info */}
        <div className="flex flex-col gap-2.5 text-xs text-slate-700 border-b border-gray-100 pb-4">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#7C6FE8] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-bold text-[#131413]">{info.cinemaName}</span>
              <span className="text-slate-500">{info.roomName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-[#7C6FE8] w-4 h-4 shrink-0" />
            <span>Suất: <strong>{currentShowTime}</strong> - {info.showDate}</span>
          </div>
        </div>

        {/* 4. Itemized Selected Seats Breakdown */}
        <div className="flex flex-col gap-2 border-b border-gray-100 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-[#7C6FE8]" />
              <span>Ghế Đã Chọn ({selectedCount})</span>
            </span>
          </div>

          {!isSelected ? (
            <p className="text-xs text-slate-400 font-medium italic pt-1">
              Vui lòng nhấp chọn vị trí ghế trên sơ đồ
            </p>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              {groupedSeats.map((group, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 border border-gray-100 flex flex-col gap-1 text-xs"
                >
                  <div className="flex items-center justify-between font-bold text-[#131413]">
                    <span>{group.typeName} ({group.countText})</span>
                  </div>
                  <div className="text-[#7C6FE8] font-bold tracking-wide">
                    {group.seatIds}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. Total Price */}
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Tạm tính tiền vé
              </span>
              {isSelected && (
                <span className="text-[11px] font-semibold text-slate-500">
                  ({selectedCount} ghế đã chọn)
                </span>
              )}
            </div>
            <span className="text-2xl font-extrabold text-[#7C6FE8]">
              {totalPrice.toLocaleString()}đ
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            * Phụ thu giờ vàng/cuối tuần hoặc ưu đãi giảm giá theo suất chiếu sẽ được bóc tách chi tiết tại bước thanh toán.
          </span>
        </div>

        {/* 6. Action Buttons Row */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Link href={`/movies/${info.movieSlug}`}>
            <button className="w-full py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại</span>
            </button>
          </Link>

          <motion.button
            whileHover={isSelected && !isHolding ? { scale: 1.04 } : {}}
            whileTap={isSelected && !isHolding ? { scale: 0.96 } : {}}
            disabled={!isSelected || isHolding}
            onClick={handleContinueClick}
            className={`w-full py-3 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isSelected
                ? 'bg-[#7C6FE8] hover:bg-[#685bc7] text-white shadow-lg shadow-[#7C6FE8]/35'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
            } ${isHolding ? 'opacity-70 cursor-wait' : ''}`}
          >
            <span>{isHolding ? 'Đang xử lý...' : 'Tiếp tục'}</span>
            {!isHolding && <ArrowRight className="w-3.5 h-3.5" />}
          </motion.button>
        </div>
      </div>

      <FoodComboSuggestModal
        isOpen={isSuggestModalOpen}
        onClose={() => setIsSuggestModalOpen(false)}
        onSelectFood={handleSelectFood}
        onSkipToPayment={handleSkipToPayment}
      />
    </>
  );
};
