/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · genre: modern-minimal · theme: White Minimal · component: FoodBookingSidebar */
'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Clock, Timer, ArrowRight, ArrowLeft, Ticket, ShoppingBag, Loader2 } from 'lucide-react';
import { SelectedFoodItem } from '../types/food-booking.types';
import { formatShowDate, seatBookingService } from '@/modules/booking/services/seat-booking.service';
import { getBookingSession, clearBookingSession } from '@/modules/booking/services/bookingSessionService';
import { resetBookingTimer } from '@/modules/booking/services/bookingTimerService';
import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';


interface FoodBookingSidebarProps {
  selectedFoodList: SelectedFoodItem[];
  totalFoodPrice: number;
  formattedCountdown: string;
  showtimeId?: string;
  movieParam?: string;
  seatsParam?: string;
  dateParam?: string;
  timeParam?: string;
  cinemaParam?: string;
}

export const FoodBookingSidebar: React.FC<FoodBookingSidebarProps> = ({
  selectedFoodList,
  totalFoodPrice,
  formattedCountdown,
  showtimeId = '1',
  movieParam,
  seatsParam,
  dateParam,
  timeParam,
  cinemaParam,
}) => {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);

  // Movie details lookup from real booking session
  const movieInfo = useMemo(() => {
    const session = getBookingSession(showtimeId);
    if (session) {
      return {
        title: session.movieTitle,
        poster: session.posterUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
        format: session.movieFormat,
        age: session.ageRating || 'P',
      };
    }

    return {
      title: movieParam ? decodeURIComponent(movieParam).replace(/-/g, ' ').toUpperCase() : 'Thông tin phim',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      format: '2D Phụ Đề',
      age: 'P',
    };
  }, [movieParam, showtimeId]);

  // Decode Cinema Name
  const decodedCinemaName = useMemo(() => {
    const session = getBookingSession(showtimeId);
    if (session?.cinemaName) return session.cinemaName;
    return cinemaParam ? decodeURIComponent(cinemaParam) : 'CineDot Cinema';
  }, [cinemaParam, showtimeId]);

  // Formatted Show Date with accurate Day of Week
  const formattedShowDate = useMemo(() => {
    const session = getBookingSession(showtimeId);
    return formatShowDate(dateParam || session?.showDate);
  }, [dateParam, showtimeId]);

  // Dynamic ticket price & seat breakdown computation
  const { ticketPrice, seatSummaryText } = useMemo(() => {
    const session = getBookingSession(showtimeId);
    if (session?.ticketTotalPrice && session?.seatSummaryText) {
      return {
        ticketPrice: session.ticketTotalPrice,
        seatSummaryText: session.seatSummaryText,
      };
    }

    const rawSeats = seatsParam ? seatsParam.split(',').filter(Boolean) : [];
    if (rawSeats.length === 0) {
      return { ticketPrice: 0, seatSummaryText: 'Chưa chọn ghế' };
    }

    const basePrice = session?.basePrice || 90000;

    let calculatedPrice = 0;
    const stdList: string[] = [];
    const vipList: string[] = [];
    const sweetboxList: string[] = [];

    rawSeats.forEach((id) => {
      const row = id.charAt(0).toUpperCase();
      if (['E', 'F', 'G', 'H'].includes(row)) {
        vipList.push(id);
        calculatedPrice += basePrice + 20000;
      } else if (['I', 'J'].includes(row)) {
        sweetboxList.push(id);
      } else {
        stdList.push(id);
        calculatedPrice += basePrice;
      }
    });

    if (sweetboxList.length > 0) {
      const sweetboxPairs = Math.ceil(sweetboxList.length / 2);
      calculatedPrice += sweetboxPairs * (basePrice + 40000) * 2;
    }

    const parts: string[] = [];
    if (stdList.length > 0) parts.push(`Ghế Thường (x${stdList.length}): ${stdList.join(', ')}`);
    if (vipList.length > 0) parts.push(`Ghế VIP (x${vipList.length}): ${vipList.join(', ')}`);
    if (sweetboxList.length > 0) parts.push(`Ghế Đôi Sweetbox: ${sweetboxList.join(', ')}`);

    return {
      ticketPrice: calculatedPrice,
      seatSummaryText: parts.join(' | '),
    };
  }, [seatsParam, showtimeId]);

  const grandTotal = ticketPrice + totalFoodPrice;

  // Format selected combos query string e.g. "food-1:1,food-2:2"
  const combosQueryParam = useMemo(() => {
    if (selectedFoodList.length === 0) return '';
    return selectedFoodList.map((item) => `${item.food.id}:${item.quantity}`).join(',');
  }, [selectedFoodList]);

  // Build Href for Back & Next buttons preserving ALL parameters
  const backHref = `/booking/seats?showtime_id=${showtimeId}&movie=${movieParam}&seats=${seatsParam}&date=${dateParam}&time=${timeParam}&cinema=${encodeURIComponent(
    decodedCinemaName
  )}`;

  const paymentHref = `/booking/payment?showtime_id=${showtimeId}&movie=${movieParam}&seats=${seatsParam}&date=${dateParam}&time=${timeParam}&cinema=${encodeURIComponent(
    decodedCinemaName
  )}${combosQueryParam ? `&combos=${encodeURIComponent(combosQueryParam)}` : ''}`;

  // Handle Return to Seat Select with Booking Cancel API call
  const handleReturnToSeats = async () => {
    if (isCancelling) return;
    setIsCancelling(true);

    try {
      const { cancelBookingAndReleaseSeats } = await import('@/modules/booking/services/bookingSessionService');
      await cancelBookingAndReleaseSeats(showtimeId);
    } finally {
      setIsCancelling(false);
      router.push(backHref);
    }
  };


  return (
    <aside
      aria-label="Tóm tắt đơn hàng bắp nước"
      className="w-full bg-white rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-200/90 flex flex-col gap-4 sticky top-28 select-none transition-colors"
    >
      {/* 1. Countdown Timer */}
      <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-900 text-xs">
        <div className="flex items-center gap-2 font-bold">
          <Timer className="w-4 h-4 text-amber-600 animate-pulse" />
          <span>Thời gian giữ ghế:</span>
        </div>
        <span className="font-extrabold text-sm text-amber-700 font-mono tracking-wider">
          {formattedCountdown}
        </span>
      </div>

      {/* 2. Movie Info */}
      <div className="flex gap-3.5 items-start border-b border-gray-100 pb-4">
        <div className="w-16 aspect-[2/3] rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <img
            src={movieInfo.poster}
            alt={movieInfo.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md bg-[#7C6FE8] text-white text-[9px] font-black uppercase tracking-wider">
              {movieInfo.format}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[9px] font-bold border border-amber-200/80">
              Khán giả {movieInfo.age}
            </span>
          </div>

          <h3 className="font-extrabold text-sm text-gray-950 leading-snug line-clamp-2">
            {movieInfo.title}
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
            <span className="font-bold text-gray-950">{decodedCinemaName}</span>
            <span className="text-gray-500 font-medium">Phòng chiếu IMAX Laser</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-lg bg-[#EEECFB] flex items-center justify-center text-[#7C6FE8] shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <span>
            Suất: <strong className="text-gray-950 font-bold">{timeParam}</strong> — {formattedShowDate}
          </span>
        </div>
      </div>

      {/* 4. Selected Seats Summary */}
      <div className="flex flex-col gap-1 border-b border-gray-100 pb-3.5">
        <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <Ticket className="w-3.5 h-3.5 text-[#7C6FE8]" />
          <span>Tiền Vé Xem Phim</span>
        </span>
        <div className="flex flex-col gap-1 text-xs pt-1">
          <span className="font-bold text-gray-950 leading-relaxed">{seatSummaryText}</span>
          <span className="font-extrabold text-[#7C6FE8] text-sm self-end">
            {ticketPrice.toLocaleString('vi-VN')}đ
          </span>
        </div>
      </div>

      {/* 5. Selected Food Combos Summary */}
      <div className="flex flex-col gap-2 border-b border-gray-100 pb-3.5">
        <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <ShoppingBag className="w-3.5 h-3.5 text-[#7C6FE8]" />
          <span>Bắp Nước Đã Chọn ({selectedFoodList.length})</span>
        </span>

        {selectedFoodList.length === 0 ? (
          <p className="text-xs text-gray-400 italic pt-0.5">Chưa chọn thêm bắp nước</p>
        ) : (
          <div className="flex flex-col gap-1.5 pt-0.5">
            {selectedFoodList.map((item) => (
              <div
                key={item.food.id}
                className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-gray-50 border border-gray-200/70"
              >
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <span>{item.food.name}</span>
                  <span className="text-[#7C6FE8] font-black">x{item.quantity}</span>
                </div>
                <span className="font-extrabold text-gray-900">
                  {(item.food.price * item.quantity).toLocaleString('vi-VN')}đ
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Grand Total Price */}
      <div className="flex items-center justify-between pt-0.5">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            TỔNG CỘNG
          </span>
          <span className="text-[10px] font-medium text-gray-400">
            (Vé + Bắp Nước)
          </span>
        </div>
        <span className="text-2xl font-black text-[#7C6FE8]">
          {grandTotal.toLocaleString('vi-VN')}đ
        </span>
      </div>

      {/* 7. Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <button
          type="button"
          onClick={handleReturnToSeats}
          disabled={isCancelling}
          className="w-full py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isCancelling ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7C6FE8]" />
          ) : (
            <ArrowLeft className="w-3.5 h-3.5" />
          )}
          <span>{isCancelling ? 'Đang hủy...' : 'Quay lại'}</span>
        </button>

        <Link href={paymentHref}>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-[0_4px_14px_rgba(124,111,232,0.35)] cursor-pointer"
          >
            <span>THANH TOÁN</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </Link>
      </div>
    </aside>
  );
};


