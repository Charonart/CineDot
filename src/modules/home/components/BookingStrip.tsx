'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/store/useAuthStore';
import {
  fetchQuickBookingMovies,
  fetchHomeCinemas,
  fetchMovieShowtimesTree,
  fetchCinemaShowtimesTree,
  HomeCinemaOption,
  DynamicDateOption,
  QuickShowtimeOption,
} from '../services/home.service';

interface QuickMovieOption {
  id: string;
  slug: string;
  title: string;
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

  // Cached showtime trees
  const [movieShowtimesTree, setMovieShowtimesTree] = useState<any[]>([]);
  const [cinemaShowtimesData, setCinemaShowtimesData] = useState<any[]>([]);

  // Selected values
  const [movieId, setMovieId] = useState('');
  const [cinemaId, setCinemaId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // 1. Initial Load: Fetch both All Movies & All Cinemas
  useEffect(() => {
    let isMounted = true;
    async function initData() {
      const [movies, cinemas] = await Promise.all([
        fetchQuickBookingMovies(),
        fetchHomeCinemas(),
      ]);

      if (isMounted) {
        if (movies && movies.length > 0) {
          setAllMovies(movies);
          setAvailableMovies(movies);
        }
        if (cinemas && cinemas.length > 0) {
          setAllCinemas(cinemas);
          setAvailableCinemas(cinemas);
        }
      }
    }
    initData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Helper: Build dynamic date options from a showtime tree for a specific cinema
  const buildDatesFromMovieTree = useCallback((tree: any[], targetCinemaId: string) => {
    const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const validDates: DynamicDateOption[] = [];
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    tree.forEach((day: any) => {
      const hasShowtimesForCinema = Array.isArray(day.cinemas) && day.cinemas.some((c: any) => {
        const cObj = c.cinema || {};
        const cId = String(cObj.cinema_id || cObj.id || c.cinema_id || '');
        return cId === String(targetCinemaId) && Array.isArray(c.times) && c.times.length > 0;
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

    return validDates;
  }, []);

  // Helper: Build dynamic date options from cinema showtimes data
  const buildDatesFromCinemaData = useCallback((cinemaData: any[], targetMovieIdOrSlug: string) => {
    const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const validDates: DynamicDateOption[] = [];
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // If cinemaData is an array of dates or movies
    cinemaData.forEach((item: any) => {
      const dayDate = item.date || item.showDate || todayStr;
      const d = new Date(dayDate);
      const isToday = dayDate === todayStr;
      const isTomorrow = dayDate === tomorrowStr;
      const dayLabel = isToday ? 'Hôm nay' : isTomorrow ? 'Ngày mai' : (daysOfWeek[d.getDay()] || 'Ngày chiếu');
      const dateFormatted = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;

      if (!validDates.some((v) => v.id === dayDate)) {
        validDates.push({
          id: dayDate,
          dateStr: dateFormatted,
          label: `${dayLabel} (${dateFormatted})`,
        });
      }
    });

    return validDates;
  }, []);

  // 2. Handle Movie Selection
  const handleMovieChange = async (newMovieId: string) => {
    setMovieId(newMovieId);
    setDate('');
    setTime('');
    setDatesList([]);
    setTimesList([]);

    if (!newMovieId) {
      // User cleared movie selection
      setMovieShowtimesTree([]);
      if (cinemaId) {
        // Cinema is still selected -> Keep availableMovies filtered for that cinema
        setAvailableCinemas(allCinemas);
      } else {
        // Reset everything to all
        setAvailableMovies(allMovies);
        setAvailableCinemas(allCinemas);
      }
      return;
    }

    const movie = allMovies.find((m) => m.id === newMovieId);
    if (!movie) return;

    // Fetch showtime tree for this movie
    const tree = await fetchMovieShowtimesTree(movie.slug);
    setMovieShowtimesTree(tree);

    // Extract all cinemas that have showtimes for this movie
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

    const matchingCinemas: HomeCinemaOption[] = allCinemas.filter((c) => cinemaMap.has(c.id));
    // If not found in allCinemas, construct from map
    if (matchingCinemas.length === 0 && cinemaMap.size > 0) {
      cinemaMap.forEach((name, id) => {
        matchingCinemas.push({ id, name });
      });
    }
    setAvailableCinemas(matchingCinemas.length > 0 ? matchingCinemas : allCinemas);

    // Check if current cinemaId is valid for this movie
    if (cinemaId && cinemaMap.has(cinemaId)) {
      const dates = buildDatesFromMovieTree(tree, cinemaId);
      setDatesList(dates);
    } else if (cinemaId && !cinemaMap.has(cinemaId)) {
      setCinemaId('');
    }
  };

  // 3. Handle Cinema Selection
  const handleCinemaChange = async (newCinemaId: string) => {
    setCinemaId(newCinemaId);
    setDate('');
    setTime('');
    setDatesList([]);
    setTimesList([]);

    if (!newCinemaId) {
      // User cleared cinema selection
      setCinemaShowtimesData([]);
      if (movieId) {
        // Movie is still selected -> Keep availableCinemas filtered for that movie
        setAvailableMovies(allMovies);
      } else {
        // Reset everything to all
        setAvailableMovies(allMovies);
        setAvailableCinemas(allCinemas);
      }
      return;
    }

    const cinema = allCinemas.find((c) => c.id === newCinemaId);

    // Case A: Movie is ALREADY selected
    if (movieId && movieShowtimesTree.length > 0) {
      const dates = buildDatesFromMovieTree(movieShowtimesTree, newCinemaId);
      setDatesList(dates);
      return;
    }

    // Case B: Movie is NOT selected yet -> Fetch cinema's showtimes to filter available movies
    const cinemaTree = await fetchCinemaShowtimesTree(cinema?.slug || newCinemaId);
    setCinemaShowtimesData(cinemaTree);

    const movieMap = new Map<string, { id: string; slug: string; title: string }>();

    cinemaTree.forEach((item: any) => {
      const mObj = item.movie || item;
      const mId = String(mObj.movie_id || mObj.id || '');
      const mSlug = mObj.slug || '';
      const mTitle = mObj.title || mObj.name || '';
      const hasTimes = (Array.isArray(item.slots) && item.slots.length > 0) || (Array.isArray(item.times) && item.times.length > 0);

      if ((mId || mSlug) && mTitle && hasTimes) {
        const key = mId || mSlug;
        if (!movieMap.has(key)) {
          movieMap.set(key, {
            id: mId || key,
            slug: mSlug || 'movie-detail',
            title: mTitle,
          });
        }
      }
    });

    const matchingMovies: QuickMovieOption[] = allMovies.filter((m) =>
      movieMap.has(m.id) || movieMap.has(m.slug)
    );

    if (matchingMovies.length > 0) {
      setAvailableMovies(matchingMovies);
    } else if (movieMap.size > 0) {
      setAvailableMovies(Array.from(movieMap.values()));
    } else {
      setAvailableMovies(allMovies);
    }
  };

  // 4. Handle Date Selection
  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    setTime('');
    setTimesList([]);

    if (!newDate || !cinemaId || !movieId) return;

    const slots: QuickShowtimeOption[] = [];

    // Prioritize movieShowtimesTree
    if (movieShowtimesTree.length > 0) {
      const dayEntry = movieShowtimesTree.find((d: any) => d.date === newDate);
      const cinemaEntry = dayEntry?.cinemas?.find((c: any) => {
        const cObj = c.cinema || {};
        const cId = String(cObj.cinema_id || cObj.id || c.cinema_id || '');
        return cId === String(cinemaId);
      });

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
    } else if (cinemaShowtimesData.length > 0) {
      // Fallback to cinemaShowtimesData
      const movieEntry = cinemaShowtimesData.find((item: any) => {
        const m = item.movie || item;
        return String(m.movie_id || m.id) === String(movieId) || m.slug === movieId;
      });

      const rawSlots = movieEntry?.slots || movieEntry?.times || [];
      rawSlots.forEach((st: any) => {
        const startTime = st.time || (st.showtime_start ? new Date(st.showtime_start).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '19:30');
        const format = st.format || st.roomName || '2D';
        slots.push({
          id: String(st.showtimeId || st.id),
          showtimeId: st.showtimeId || st.id || '',
          time: startTime,
          format,
          label: `${startTime} - ${format}`,
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
      const selectedMovie = allMovies.find((m) => m.id === movieId);
      const selectedCinema = allCinemas.find((c) => c.id === cinemaId);
      const selectedTimeSlot = timesList.find((t) => t.id === time);

      const targetUrl = `/booking/seats?showtime_id=${encodeURIComponent(time)}&movie=${encodeURIComponent(selectedMovie?.slug || '')}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(selectedTimeSlot?.time || '')}&cinema=${encodeURIComponent(selectedCinema?.name || '')}`;
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
              {availableMovies.map((m) => (
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
              onChange={(e) => handleCinemaChange(e.target.value)}
              className="bg-transparent border-none p-0 text-sm font-medium text-[var(--text)] focus:ring-0 appearance-none cursor-pointer outline-none w-full"
            >
              <option value="">-- Chọn Rạp --</option>
              {availableCinemas.map((c) => (
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
              disabled={!movieId || !cinemaId}
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
