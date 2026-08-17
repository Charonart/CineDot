'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Clock, Timer, ArrowRight, ArrowLeft, Ticket, ShoppingBag } from 'lucide-react';
import { SelectedFoodItem } from '../types/food-booking.types';
import { formatShowDate } from '@/modules/booking/services/seat-booking.service';

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

import { getBookingSession } from '@/modules/booking/services/bookingSessionService';

const mockMovieDatabase: Record<string, { title: string; poster: string; format: string; age: string }> = {
  'spiderman-new-beginning': {
    title: 'Người Nhện: Khởi Đầu Mới',
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80',
    format: '2D Phụ Đề',
    age: 'T13',
  }
};

export const FoodBookingSidebar: React.FC<FoodBookingSidebarProps> = ({
  selectedFoodList,
  totalFoodPrice,
  formattedCountdown,
  showtimeId = 'showtime-101',
  movieParam = 'spiderman-new-beginning',
  seatsParam = 'D09,D10',
  dateParam = '31/07',
  timeParam = '18:00',
  cinemaParam = 'Galaxy CineX Hanoi Centre',
}) => {
  // Movie details lookup
  const movieInfo = useMemo(() => {
    const session = getBookingSession(showtimeId);
    if (session) {
      return {
        title: session.movieTitle,
        poster: session.posterUrl || 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80',
        format: session.movieFormat,
        age: session.ageRating || 'T13',
      };
    }
    
    const slug = movieParam || 'spiderman-new-beginning';
    const found = mockMovieDatabase[slug];
    return {
      title: found ? found.title : 'Người Nhện: Khởi Đầu Mới',
      poster: found
        ? found.poster
        : 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80',
      format: found ? found.format : '2D Phụ Đề',
      age: found ? found.age : 'T13',
    };
  }, [movieParam, showtimeId]);

  // Decode Cinema Name
  const decodedCinemaName = useMemo(() => {
    return cinemaParam ? decodeURIComponent(cinemaParam) : 'Galaxy CineX Hanoi Centre';
  }, [cinemaParam]);

  // Formatted Show Date with accurate Day of Week
  const formattedShowDate = useMemo(() => {
    return formatShowDate(dateParam);
  }, [dateParam]);

  // Dynamic ticket price & seat breakdown computation from seatsParam
  const { ticketPrice, seatSummaryText } = useMemo(() => {
    const rawSeats = seatsParam ? seatsParam.split(',').filter(Boolean) : [];
    if (rawSeats.length === 0) {
      return { ticketPrice: 0, seatSummaryText: 'Chưa chọn ghế' };
    }

    let calculatedPrice = 0;
    const stdList: string[] = [];
    const vipList: string[] = [];
    const sweetboxList: string[] = [];

    rawSeats.forEach((id) => {
      const row = id.charAt(0).toUpperCase();
      if (['E', 'F', 'G', 'H'].includes(row)) {
        vipList.push(id);
        calculatedPrice += 140000;
      } else if (['I', 'J'].includes(row)) {
        sweetboxList.push(id);
      } else {
        stdList.push(id);
        calculatedPrice += 110000;
      }
    });

    if (sweetboxList.length > 0) {
      const sweetboxPairs = Math.ceil(sweetboxList.length / 2);
      calculatedPrice += sweetboxPairs * 250000;
    }

    const parts: string[] = [];
    if (stdList.length > 0) parts.push(`Ghế Thường (x${stdList.length}): ${stdList.join(', ')}`);
    if (vipList.length > 0) parts.push(`Ghế VIP (x${vipList.length}): ${vipList.join(', ')}`);
    if (sweetboxList.length > 0) parts.push(`Ghế Đôi Sweetbox: ${sweetboxList.join(', ')}`);

    return {
      ticketPrice: calculatedPrice,
      seatSummaryText: parts.join(' | '),
    };
  }, [seatsParam]);

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

  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-[0_16px_50px_rgba(124,111,232,0.12),0_4px_16px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col gap-5 sticky top-28">
      {/* 1. TOPMOST SECTION INSIDE SIDEBAR: Active Countdown Timer */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
        <div className="flex items-center gap-2 font-bold">
          <Timer className="w-4 h-4 text-amber-600 animate-pulse" />
          <span>Thời gian giữ ghế:</span>
        </div>
        <span className="font-extrabold text-sm text-amber-600 tracking-tight">
          {formattedCountdown}
        </span>
      </div>

      {/* 2. Movie Thumbnail & Title Info */}
      <div className="flex gap-4 items-start border-b border-gray-100 pb-4">
        <div className="w-20 aspect-[2/3] rounded-2xl overflow-hidden bg-slate-900 shrink-0 shadow-md">
          <img
            src={movieInfo.poster}
            alt={movieInfo.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#7C6FE8] text-white text-[10px] font-bold uppercase">
              {movieInfo.format}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
              Khán giả {movieInfo.age}
            </span>
          </div>

          <h3 className="font-bold text-base text-[#131413] leading-snug line-clamp-2">
            {movieInfo.title}
          </h3>
        </div>
      </div>

      {/* 3. Cinema & Showtime Info */}
      <div className="flex flex-col gap-2 text-xs text-slate-700 border-b border-gray-100 pb-4">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-[#7C6FE8] shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="font-bold text-[#131413]">{decodedCinemaName}</span>
            <span className="text-slate-500">Phòng chiếu 01 (IMAX Laser)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#7C6FE8]" />
          <span>Suất: <strong>{timeParam}</strong> - {formattedShowDate}</span>
        </div>
      </div>

      {/* 4. Selected Seats Summary */}
      <div className="flex flex-col gap-1 border-b border-gray-100 pb-4">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Ticket className="w-3.5 h-3.5 text-[#7C6FE8]" />
          <span>Tiền Vé Xem Phim</span>
        </span>
        <div className="flex flex-col gap-1 text-xs pt-1">
          <span className="font-bold text-[#131413] leading-relaxed">{seatSummaryText}</span>
          <span className="font-extrabold text-[#7C6FE8] text-sm self-end">
            {ticketPrice.toLocaleString()}đ
          </span>
        </div>
      </div>

      {/* 5. Selected Food Combos Summary */}
      <div className="flex flex-col gap-2 border-b border-gray-100 pb-4">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <ShoppingBag className="w-3.5 h-3.5 text-[#7C6FE8]" />
          <span>Bắp Nước Đã Chọn ({selectedFoodList.length})</span>
        </span>

        {selectedFoodList.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Chưa chọn thêm bắp nước</p>
        ) : (
          <div className="flex flex-col gap-2 pt-1">
            {selectedFoodList.map((item) => (
              <div
                key={item.food.id}
                className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-gray-100"
              >
                <div className="flex items-center gap-2 font-bold text-[#131413]">
                  <span>{item.food.name}</span>
                  <span className="text-[#7C6FE8]">x{item.quantity}</span>
                </div>
                <span className="font-bold text-slate-700">
                  {(item.food.price * item.quantity).toLocaleString()}đ
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Grand Total Price */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            TỔNG CỘNG
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            (Bao gồm Vé + Bắp Nước)
          </span>
        </div>
        <span className="text-2xl font-extrabold text-[#7C6FE8]">
          {grandTotal.toLocaleString()}đ
        </span>
      </div>

      {/* 7. Action Buttons Row */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Link href={backHref}>
          <button className="w-full py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại</span>
          </button>
        </Link>

        <Link href={paymentHref}>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="w-full py-3 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-[#7C6FE8]/35 cursor-pointer"
          >
            <span>THANH TOÁN</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </Link>
      </div>
    </div>
  );
};
