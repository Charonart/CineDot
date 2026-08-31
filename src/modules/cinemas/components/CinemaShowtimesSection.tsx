'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Film, Calendar, Clock, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { CinemaMovieShowtime } from '../types/cinemas.types';
import { Skeleton } from '@/shared/ui/Skeleton';
import { isShowtimePassed } from '@/shared/utils/showtimeHelper';

interface CinemaShowtimesSectionProps {
  cinemaName: string;
  showtimes: CinemaMovieShowtime[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  loading: boolean;
}

export const CinemaShowtimesSection: React.FC<CinemaShowtimesSectionProps> = ({
  cinemaName,
  showtimes,
  selectedDate,
  onSelectDate,
  loading,
}) => {
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuthStore();

  // Generate dynamic 7-day options
  const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const today = new Date();
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const isoDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayLabel = i === 0 ? 'Hôm nay' : i === 1 ? 'Ngày mai' : daysOfWeek[d.getDay()];
    const dateFormatted = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;

    return {
      isoDate,
      dayLabel,
      dateFormatted,
    };
  });

  const filteredShowtimes = useMemo(() => {
    return showtimes
      .map((movie) => ({
        ...movie,
        slots: movie.slots.filter(
          (slot) =>
            !isShowtimePassed({
              dateStr: selectedDate,
              timeStr: slot.time,
            })
        ),
      }))
      .filter((movie) => movie.slots.length > 0);
  }, [showtimes, selectedDate]);

  const handleSelectSlot = (showtimeId: string | number) => {
    const targetUrl = `/booking/seats?showtime_id=${encodeURIComponent(String(showtimeId))}`;
    if (!isAuthenticated) {
      openAuthModal('login', 'Vui lòng đăng nhập tài khoản để chọn ghế và đặt vé trực tuyến.', targetUrl);
      return;
    }
    router.push(targetUrl);
  };

  return (
    <div className="w-full flex flex-col gap-6 pt-4 border-t border-gray-100">
      {/* Title & Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-[#131413] flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#7C6FE8] rounded-full inline-block" />
            <span>Lịch Chiếu Phim Tại Rạp</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Chọn suất chiếu bên dưới để đặt vé trực tiếp tại <span className="font-bold text-slate-700">{cinemaName}</span>
          </p>
        </div>
      </div>

      {/* Date Carousel Selector */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {dateOptions.map((opt) => {
          const isSelected = selectedDate === opt.isoDate;
          return (
            <button
              key={opt.isoDate}
              onClick={() => onSelectDate(opt.isoDate)}
              className={`px-4 py-3 rounded-2xl flex flex-col items-center justify-center min-w-[105px] shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#7C6FE8] text-white shadow-lg shadow-[#7C6FE8]/30 scale-[1.02]'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-gray-200/60'
              }`}
            >
              <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isSelected ? 'text-purple-100' : 'text-slate-400'}`}>
                {opt.dayLabel}
              </span>
              <span className="text-sm font-extrabold mt-0.5">
                {opt.dateFormatted}
              </span>
            </button>
          );
        })}
      </div>

      {/* Movie Showtimes List */}
      <div className="w-full flex flex-col gap-4">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-gray-100 flex gap-4">
                <Skeleton variant="card" className="w-24 h-36 rounded-xl shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                  <Skeleton variant="text" className="w-48 h-6 rounded-md" />
                  <Skeleton variant="text" className="w-32 h-4 rounded-md" />
                  <div className="flex gap-2 mt-4">
                    <Skeleton variant="text" className="w-20 h-10 rounded-xl" />
                    <Skeleton variant="text" className="w-20 h-10 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredShowtimes.length === 0 ? (
          <div className="w-full py-12 px-6 rounded-2xl bg-slate-50 border border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-200/60 text-slate-400 flex items-center justify-center">
              <Film className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-extrabold text-slate-700">
                Chưa có suất chiếu khả dụng trong ngày đã chọn
              </h4>
              <p className="text-xs text-slate-400">
                Các suất chiếu của ngày này có thể đã kết thúc. Vui lòng chọn ngày chiếu khác bạn nhé!
              </p>
            </div>
          </div>
        ) : (
          filteredShowtimes.map((movie) => (
            <motion.div
              key={movie.movieId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:border-[#7C6FE8]/40 hover:shadow-md transition-all flex flex-col sm:flex-row gap-5"
            >
              {/* Poster */}
              <div className="w-24 sm:w-28 aspect-[2/3] rounded-xl overflow-hidden shadow-sm shrink-0 bg-slate-900">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Info & Slots */}
              <div className="flex-1 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-[#7C6FE8] text-white text-[10px] font-extrabold tracking-wider uppercase">
                      {movie.ageRating}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {movie.duration}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      • {movie.genres}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 hover:text-[#7C6FE8] transition-colors">
                    {movie.title}
                  </h3>
                </div>

                {/* Showtime Pills Grid */}
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#7C6FE8]" />
                    <span>Suất chiếu có sẵn:</span>
                  </span>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    {movie.slots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => handleSelectSlot(slot.showtimeId)}
                        className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-[#7C6FE8] text-slate-700 hover:text-white border border-gray-200/80 hover:border-[#7C6FE8] transition-all flex flex-col items-center justify-center cursor-pointer group shadow-2xs hover:shadow-md hover:shadow-[#7C6FE8]/25"
                      >
                        <span className="text-xs font-extrabold group-hover:text-white">
                          {slot.time}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 group-hover:text-purple-100">
                          {slot.format} ({slot.roomName})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
