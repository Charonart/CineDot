'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/store/useAuthStore';
import {
  fetchQuickBookingMovies,
  fetchMovieShowtimesTree,
} from '../services/home.service';
import { DynamicDateOption, QuickShowtimeOption } from '../types/home.types';

interface QuickMovieOption {
  id: string;
  slug: string;
  title: string;
}

interface QuickCinemaOption {
  id: string;
  name: string;
}

interface BookingStripProps {
  onQuickBook?: (selection: { movieId: string; cinemaId: string; date: string; time: string }) => void;
}

export const BookingStrip: React.FC<BookingStripProps> = ({ onQuickBook }) => {
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const [moviesList, setMoviesList] = useState<QuickMovieOption[]>([]);
  const [cinemasList, setCinemasList] = useState<QuickCinemaOption[]>([]);
  const [datesList, setDatesList] = useState<DynamicDateOption[]>([]);
  const [timesList, setTimesList] = useState<QuickShowtimeOption[]>([]);
  const [showtimesTree, setShowtimesTree] = useState<any[]>([]);

  const [movieId, setMovieId] = useState('');
  const [cinemaId, setCinemaId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadMovies() {
      const list = await fetchQuickBookingMovies();
      if (isMounted && list.length > 0) {
        setMoviesList(list);
      }
    }
    loadMovies();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleMovieChange = async (newMovieId: string) => {
    setMovieId(newMovieId);
    setCinemaId('');
    setDate('');
    setTime('');
    setCinemasList([]);
    setDatesList([]);
    setTimesList([]);
    setShowtimesTree([]);

    if (!newMovieId) return;
    const movie = moviesList.find((m) => m.id === newMovieId);
    if (movie) {
      const tree = await fetchMovieShowtimesTree(movie.slug);
      setShowtimesTree(tree);

      const cinemaMap = new Map<string, string>();
      tree.forEach((day: any) => {
        if (Array.isArray(day.cinemas)) {
          day.cinemas.forEach((c: any) => {
            const cObj = c.cinema || {};
            const cId = String(cObj.cinema_id || cObj.id || c.cinema_id || '');
            const cName = cObj.cinema_name || cObj.name || c.cinema_name || '';
            const hasTimes = Array.isArray(c.times) && c.times.length > 0;
            if (cId && cName && hasTimes && !cinemaMap.has(cId)) {
              cinemaMap.set(cId, cName);
            }
          });
        }
      });
      setCinemasList(Array.from(cinemaMap.entries()).map(([cId, name]) => ({ id: cId, name })));
    }
  };

  const handleCinemaChange = (newCinemaId: string) => {
    setCinemaId(newCinemaId);
    setDate('');
    setTime('');
    setDatesList([]);
    setTimesList([]);

    if (!newCinemaId) return;

    const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const validDates: DynamicDateOption[] = [];
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    showtimesTree.forEach((day: any) => {
      const hasShowtimesForCinema = Array.isArray(day.cinemas) && day.cinemas.some((c: any) => {
        const cObj = c.cinema || {};
        const cId = String(cObj.cinema_id || cObj.id || c.cinema_id || '');
        return cId === String(newCinemaId) && Array.isArray(c.times) && c.times.length > 0;
      });

      if (hasShowtimesForCinema && day.date) {
        const d = new Date(day.date);
        const isToday = day.date === todayStr;
        const isTomorrow = day.date === tomorrowStr;
        const dayLabel = isToday ? 'Hôm nay' : isTomorrow ? 'Ngày mai' : (daysOfWeek[d.getDay()] || 'Ngày chiếu');
        const dateFormatted = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;

        validDates.push({
          id: day.date,
          dateStr: dateFormatted,
          label: `${dayLabel} (${dateFormatted})`,
        });
      }
    });

    setDatesList(validDates);
  };

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    setTime('');
    setTimesList([]);

    if (!newDate || !cinemaId) return;

    const dayEntry = showtimesTree.find((d: any) => d.date === newDate);
    const cinemaEntry = dayEntry?.cinemas?.find((c: any) => {
      const cObj = c.cinema || {};
      const cId = String(cObj.cinema_id || cObj.id || c.cinema_id || '');
      return cId === String(cinemaId);
    });

    const slots: QuickShowtimeOption[] = [];
    if (cinemaEntry && Array.isArray(cinemaEntry.times)) {
      cinemaEntry.times.forEach((st: any) => {
        const startTime = st.time || (st.showtime_start ? new Date(st.showtime_start).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '19:30');
        const room = st.room || {};
        const format = room.room_type || st.format || '2D';
        const roomName = room.room_name ? ` (${room.room_name})` : '';

        slots.push({
          id: String(st.showtime_id || st.id),
          showtimeId: st.showtime_id || st.id || '',
          time: startTime,
          format,
          label: `${startTime} - ${format}${roomName}`,
        });
      });
    }

    setTimesList(slots);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieId || !cinemaId || !date || !time) return;

    const targetUrl = `/booking/seats?showtime_id=${encodeURIComponent(time)}`;
    if (!isAuthenticated) {
      openAuthModal('login', 'Vui lòng đăng nhập tài khoản để chọn ghế và đặt vé trực tuyến.', targetUrl);
      return;
    }

    if (onQuickBook) {
      onQuickBook({ movieId, cinemaId, date, time });
    } else {
      router.push(targetUrl);
    }
  };

  return (
    <section className="relative z-20 max-w-[1240px] mx-auto px-8 -mt-24 mb-24">
      <form
        onSubmit={handleSubmit}
        className="glass-card rounded-full p-4 flex flex-col md:flex-row items-center justify-between shadow-glass border border-white/50 gap-4 md:gap-0"
      >
        <div className="flex-1 flex items-center px-4 w-full">
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1">
              CHỌN PHIM
            </span>
            <select
              value={movieId}
              onChange={(e) => handleMovieChange(e.target.value)}
              className="bg-transparent border-none p-0 text-sm font-medium text-[var(--text)] focus:ring-0 appearance-none cursor-pointer outline-none w-full"
            >
              <option value="">-- Chọn Phim --</option>
              {moviesList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="hidden md:block w-[1px] h-10 bg-slate-800/10 mx-2" />

        <div className="flex-1 flex items-center px-4 w-full">
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1">
              CHỌN RẠP
            </span>
            <select
              value={cinemaId}
              disabled={!movieId}
              onChange={(e) => handleCinemaChange(e.target.value)}
              className="bg-transparent border-none p-0 text-sm font-medium text-[var(--text)] focus:ring-0 appearance-none cursor-pointer outline-none w-full disabled:opacity-50"
            >
              <option value="">-- Chọn Rạp --</option>
              {cinemasList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="hidden md:block w-[1px] h-10 bg-slate-800/10 mx-2" />

        <div className="flex-1 flex items-center px-4 w-full">
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1">
              NGÀY XEM
            </span>
            <select
              value={date}
              disabled={!cinemaId}
              onChange={(e) => handleDateChange(e.target.value)}
              className="bg-transparent border-none p-0 text-sm font-medium text-[var(--text)] focus:ring-0 appearance-none cursor-pointer outline-none w-full disabled:opacity-50"
            >
              <option value="">-- Chọn Ngày --</option>
              {datesList.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="hidden md:block w-[1px] h-10 bg-slate-800/10 mx-2" />

        <div className="flex-1 flex items-center px-4 w-full">
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1">
              SUẤT CHIẾU
            </span>
            <select
              value={time}
              disabled={!date}
              onChange={(e) => setTime(e.target.value)}
              className="bg-transparent border-none p-0 text-sm font-medium text-[var(--text)] focus:ring-0 appearance-none cursor-pointer outline-none w-full disabled:opacity-50"
            >
              <option value="">-- Chọn Giờ --</option>
              {timesList.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={!movieId || !cinemaId || !date || !time}
          className="w-full md:w-auto ml-0 md:ml-4 bg-[#7C6FE8] text-white px-8 py-4 rounded-full text-sm font-bold tracking-wide hover:bg-[#685bc7] transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          MUA VÉ
        </button>
      </form>
    </section>
  );
};
