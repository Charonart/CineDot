'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Film,
  Calendar,
  Clock,
  Sparkles,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { getStoredAuthToken } from '@/shared/utils/authStorage';
import { CinemaMovieShowtime } from '../types/cinemas.types';
import { Skeleton } from '@/shared/ui/Skeleton';
import { isShowtimePassed } from '@/shared/utils/showtimeHelper';
import { AgeRatingBadge } from '@/shared/components/ui/AgeRatingBadge';

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

  const [selectedTechFilter, setSelectedTechFilter] = useState('ALL');

  const TECH_FORMAT_FILTERS = [
    { id: 'ALL', label: 'Tất Cả' },
    { id: 'imax', label: 'IMAX Laser' },
    { id: 'screenx', label: 'ScreenX 270°' },
    { id: 'dolby', label: 'Dolby Atmos' },
    { id: 'onyx', label: 'Samsung Onyx LED' },
    { id: 'gold', label: 'Gold Class VIP' },
    { id: '3d', label: '3D Digital' },
  ];

  const filteredShowtimes = useMemo(() => {
    return showtimes
      .map((movie) => ({
        ...movie,
        slots: movie.slots.filter((slot) => {
          const isPassed = isShowtimePassed({
            dateStr: selectedDate,
            timeStr: slot.time,
          });
          if (isPassed) return false;

          if (selectedTechFilter !== 'ALL') {
            const rawFormat = (slot.format || '').toLowerCase();
            const rawRoom = (slot.roomName || '').toLowerCase();
            const rawScreen = (slot.screenType || '').toLowerCase();
            const target = selectedTechFilter.toLowerCase();
            if (!rawFormat.includes(target) && !rawRoom.includes(target) && !rawScreen.includes(target)) {
              return false;
            }
          }
          return true;
        }),
      }))
      .filter((movie) => movie.slots.length > 0);
  }, [showtimes, selectedDate, selectedTechFilter]);

  const handleSelectSlot = (showtimeId: string | number, movieSlug?: string, timeStr?: string) => {
    const targetUrl = `/booking/seats?showtime_id=${encodeURIComponent(
      String(showtimeId)
    )}&movie=${encodeURIComponent(movieSlug || '')}&date=${encodeURIComponent(
      selectedDate
    )}&time=${encodeURIComponent(timeStr || '')}&cinema=${encodeURIComponent(cinemaName)}`;

    const isAuthed = isAuthenticated || Boolean(useAuthStore.getState().token || getStoredAuthToken());
    if (!isAuthed) {
      openAuthModal('login', 'Vui lòng đăng nhập tài khoản để chọn ghế và đặt vé trực tuyến.', targetUrl);
      return;
    }
    router.push(targetUrl);
  };

  return (
    <section id="cinema-showtimes" className="w-full flex flex-col gap-5 scroll-mt-28">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#7C6FE8]" />
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Lịch Chiếu Phim Tại Rạp
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Chọn suất chiếu bên dưới để chọn ghế và đặt vé tại <strong className="text-slate-800 font-bold">{cinemaName}</strong>
          </p>
        </div>
      </div>

      {/* 2. 7-Day Date Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {dateOptions.map((opt) => {
          const isSelected = selectedDate === opt.isoDate;
          return (
            <button
              key={opt.isoDate}
              type="button"
              onClick={() => onSelectDate(opt.isoDate)}
              className={`px-4 py-3 rounded-2xl flex flex-col items-center justify-center min-w-[105px] shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/15 scale-[1.02] ring-2 ring-[#7C6FE8]'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs'
              }`}
            >
              <span
                className={`text-[10px] font-extrabold uppercase tracking-wider ${
                  isSelected ? 'text-[#D8D4F7]' : 'text-slate-400'
                }`}
              >
                {opt.dayLabel}
              </span>
              <span className="text-sm font-extrabold mt-0.5 font-mono tabular-nums">
                {opt.dateFormatted}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Technology Format Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TECH_FORMAT_FILTERS.map((tf) => {
          const isActive = selectedTechFilter === tf.id;
          return (
            <button
              key={tf.id}
              type="button"
              onClick={() => setSelectedTechFilter(tf.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#7C6FE8] text-white shadow-xs font-extrabold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 border border-slate-200/60'
              }`}
            >
              {tf.label}
            </button>
          );
        })}
      </div>

      {/* 4. Movie Showtimes List */}
      <div className="w-full flex flex-col gap-4">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="p-5 rounded-3xl bg-white border border-slate-200/80 flex gap-4">
                <Skeleton variant="card" className="w-24 h-36 rounded-2xl shrink-0" />
                <div className="flex-1 flex flex-col gap-2.5">
                  <Skeleton variant="text" className="w-48 h-6 rounded-md" />
                  <Skeleton variant="text" className="w-32 h-4 rounded-md" />
                  <div className="flex gap-2 mt-3">
                    <Skeleton variant="text" className="w-24 h-11 rounded-xl" />
                    <Skeleton variant="text" className="w-24 h-11 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredShowtimes.length === 0 ? (
          <div className="w-full py-12 px-6 rounded-3xl bg-white border border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
              <Film className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1 max-w-md">
              <h4 className="text-sm font-bold text-slate-800">
                Không có suất chiếu phù hợp trong ngày đã chọn
              </h4>
              <p className="text-xs text-slate-400">
                Các suất chiếu của khung giờ này có thể đã kết thúc hoặc không khớp bộ lọc định dạng. Vui lòng chọn ngày chiếu khác.
              </p>
            </div>
          </div>
        ) : (
          filteredShowtimes.map((movie) => (
            <motion.div
              key={movie.movieId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#7C6FE8]/50 hover:shadow-sm transition-all flex flex-col sm:flex-row gap-5"
            >
              {/* Poster */}
              <div className="w-24 sm:w-28 aspect-[2/3] rounded-2xl overflow-hidden shadow-xs shrink-0 bg-slate-900">
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
                    <AgeRatingBadge ageRating={movie.ageRating} size="xs" variant="solid" />
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {movie.duration}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      • {movie.genres}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 hover:text-[#7C6FE8] transition-colors leading-snug">
                    {movie.title}
                  </h3>
                </div>

                {/* Showtime Pills Grid */}
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#7C6FE8]" />
                    <span>Suất chiếu có sẵn:</span>
                  </span>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    {movie.slots.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => handleSelectSlot(slot.showtimeId, movie.slug, slot.time)}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-[#7C6FE8] text-slate-800 hover:text-white border border-slate-200 hover:border-[#7C6FE8] transition-all flex flex-col items-center justify-center cursor-pointer group shadow-2xs hover:shadow-md hover:shadow-[#7C6FE8]/20"
                      >
                        <span className="text-xs font-extrabold group-hover:text-white font-mono">
                          {slot.time}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 group-hover:text-purple-100">
                          {slot.format} • {slot.roomName}
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
    </section>
  );
};
