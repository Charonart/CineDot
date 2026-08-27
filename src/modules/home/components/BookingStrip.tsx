'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Film, MapPin, Calendar, Clock, Loader2 } from 'lucide-react';
import { DynamicDateOption, QuickShowtimeOption } from '../types/home.types';
import {
  fetchQuickBookingMovies,
  fetchHomeCinemas,
  fetchMovieShowtimesTree,
  fetchCinemaShowtimesTree,
  HomeCinemaOption,
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
  const [allMoviesList, setAllMoviesList] = useState<QuickMovieOption[]>([]);
  const [allCinemasList, setAllCinemasList] = useState<HomeCinemaOption[]>([]);

  const [moviesList, setMoviesList] = useState<QuickMovieOption[]>([]);
  const [cinemasList, setCinemasList] = useState<HomeCinemaOption[]>([]);
  const [datesList, setDatesList] = useState<DynamicDateOption[]>([]);
  const [timesList, setTimesList] = useState<QuickShowtimeOption[]>([]);

  const [showtimesTree, setShowtimesTree] = useState<any[]>([]);
  const [cinemaShowtimesData, setCinemaShowtimesData] = useState<any[]>([]);

  const [movieId, setMovieId] = useState('');
  const [cinemaId, setCinemaId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const [loadingMovies, setLoadingMovies] = useState(false);
  const [loadingCinemas, setLoadingCinemas] = useState(false);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingTimes, setLoadingTimes] = useState(false);

  const [openDropdown, setOpenDropdown] = useState<'movie' | 'cinema' | 'date' | 'time' | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function initData() {
      const [movies, cinemas] = await Promise.all([
        fetchQuickBookingMovies(),
        fetchHomeCinemas(),
      ]);

      if (isMounted) {
        if (movies && movies.length > 0) {
          setAllMoviesList(movies);
          setMoviesList(movies);
        }
        if (cinemas && cinemas.length > 0) {
          setAllCinemasList(cinemas);
          setCinemasList(cinemas);
        }
      }
    }
    initData();
    return () => {
      isMounted = false;
    };
  }, []);

  const selectedMovie = useMemo(() => {
    return allMoviesList.find((m) => m.id === movieId) || moviesList.find((m) => m.id === movieId);
  }, [allMoviesList, moviesList, movieId]);

  const selectedCinema = useMemo(() => {
    return allCinemasList.find((c) => c.id === cinemaId) || cinemasList.find((c) => c.id === cinemaId);
  }, [allCinemasList, cinemasList, cinemaId]);

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

  const handleSelectMovie = async (id: string) => {
    setMovieId(id);
    setDate('');
    setTime('');
    setDatesList([]);
    setTimesList([]);

    if (!id) {
      setOpenDropdown(null);
      if (cinemaId) {
        setCinemasList(allCinemasList);
      } else {
        setMoviesList(allMoviesList);
        setCinemasList(allCinemasList);
      }
      return;
    }

    const movie = allMoviesList.find((m) => m.id === id) || moviesList.find((m) => m.id === id);
    if (movie) {
      setLoadingCinemas(true);
      try {
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

        const matchingCinemas: HomeCinemaOption[] = allCinemasList.filter((c) => cinemaMap.has(c.id));
        if (matchingCinemas.length === 0 && cinemaMap.size > 0) {
          cinemaMap.forEach((name, cId) => {
            matchingCinemas.push({ id: cId, name });
          });
        }

        setCinemasList(matchingCinemas.length > 0 ? matchingCinemas : allCinemasList);

        if (cinemaId && cinemaMap.has(cinemaId)) {
          const dates = buildDatesFromMovieTree(tree, cinemaId);
          setDatesList(dates);
          setTimeout(() => setOpenDropdown('date'), 120);
          return;
        } else if (cinemaId && !cinemaMap.has(cinemaId)) {
          setCinemaId('');
        }
      } finally {
        setLoadingCinemas(false);
      }
    }

    setTimeout(() => setOpenDropdown('cinema'), 120);
  };

  const handleSelectCinema = async (selectedCinemaId: string) => {
    setCinemaId(selectedCinemaId);
    setDate('');
    setTime('');
    setDatesList([]);
    setTimesList([]);

    if (!selectedCinemaId) {
      setOpenDropdown(null);
      if (movieId) {
        setMoviesList(allMoviesList);
      } else {
        setMoviesList(allMoviesList);
        setCinemasList(allCinemasList);
      }
      return;
    }

    const cinema = allCinemasList.find((c) => c.id === selectedCinemaId) || cinemasList.find((c) => c.id === selectedCinemaId);

    if (movieId && showtimesTree.length > 0) {
      const dates = buildDatesFromMovieTree(showtimesTree, selectedCinemaId);
      setDatesList(dates);
      setTimeout(() => setOpenDropdown('date'), 120);
      return;
    }

    setLoadingMovies(true);
    try {
      const cinemaTree = await fetchCinemaShowtimesTree(cinema?.slug || selectedCinemaId);
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

      const matchingMovies: QuickMovieOption[] = allMoviesList.filter((m) =>
        movieMap.has(m.id) || movieMap.has(m.slug)
      );

      if (matchingMovies.length > 0) {
        setMoviesList(matchingMovies);
      } else if (movieMap.size > 0) {
        setMoviesList(Array.from(movieMap.values()));
      } else {
        setMoviesList(allMoviesList);
      }
    } finally {
      setLoadingMovies(false);
    }

    setTimeout(() => setOpenDropdown('movie'), 120);
  };

  const handleSelectDate = (selectedDateId: string) => {
    setDate(selectedDateId);
    setTime('');
    setTimesList([]);

    if (!selectedDateId || !cinemaId || !movieId) {
      setOpenDropdown(null);
      return;
    }

    const slots: QuickShowtimeOption[] = [];

    if (showtimesTree.length > 0) {
      const dayEntry = showtimesTree.find((d: any) => d.date === selectedDateId);
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
            label: `${startTime} • ${format}${roomName}`,
          });
        });
      }
    } else if (cinemaShowtimesData.length > 0) {
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
          label: `${startTime} • ${format}`,
        });
      });
    }

    setTimesList(slots);
    setTimeout(() => setOpenDropdown('time'), 120);
  };

  const handleSelectTime = (selectedTimeId: string) => {
    setTime(selectedTimeId);
    setOpenDropdown(null);
  };

  const isDateDisabled = !movieId || !cinemaId;
  const isTimeDisabled = !movieId || !cinemaId || !date;
  const isSubmitDisabled = !movieId || !cinemaId || !date || !time;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    if (onQuickBook) {
      onQuickBook({ movieId, cinemaId, date, time });
    } else {
      const selectedTimeSlot = timesList.find((t) => t.id === time);
      const targetUrl = `/booking/seats?showtime_id=${encodeURIComponent(time)}&movie=${encodeURIComponent(selectedMovie?.slug || '')}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(selectedTimeSlot?.time || '')}&cinema=${encodeURIComponent(selectedCinema?.name || '')}`;
      router.push(targetUrl);
    }
  };

  const getSelectedMovieLabel = () => selectedMovie?.title || (loadingMovies ? 'Đang lọc phim...' : 'Chọn Phim');
  const getSelectedCinemaLabel = () => selectedCinema?.name || (loadingCinemas ? 'Đang tìm rạp...' : 'Chọn Cụm Rạp');
  const getSelectedDateLabel = () => datesList.find((d) => d.id === date)?.label || (loadingDates ? 'Đang tải ngày...' : 'Chọn Ngày');
  const getSelectedTimeLabel = () => timesList.find((t) => t.id === time || String(t.showtimeId) === time)?.label || (loadingTimes ? 'Đang tải suất...' : 'Chọn Suất Chiếu');

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-dock rounded-2xl lg:rounded-full p-3 sm:p-4 flex flex-col lg:flex-row items-center justify-between gap-4 transition-all"
    >
      <div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-0 lg:divide-x lg:divide-white/10 items-center">
        {/* 1. CHỌN PHIM */}
        <div className="relative px-3 sm:px-5 py-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-[#7C6FE8]" />
              <span>1. Chọn Phim</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === 'movie' ? null : 'movie')}
            className="w-full text-left font-bold text-xs sm:text-sm text-white flex items-center justify-between gap-2 group py-1 cursor-pointer"
          >
            <span className="truncate">{getSelectedMovieLabel()}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-[#7C6FE8] transition-transform ${openDropdown === 'movie' ? 'rotate-180 text-[#7C6FE8]' : ''}`} />
          </button>

          <AnimatePresence>
            {openDropdown === 'movie' && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                className="absolute left-0 top-full mt-2 w-72 max-h-[300px] overflow-y-auto scrollbar-thin rounded-2xl bg-[#141320] border border-[#7C6FE8]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-2 z-[100] flex flex-col gap-1"
              >
                {loadingMovies ? (
                  <div className="px-3 py-3 text-xs text-gray-400 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7C6FE8]" />
                    <span>Đang lọc danh sách phim...</span>
                  </div>
                ) : moviesList.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMovie(m.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                      movieId === m.id ? 'bg-[#7C6FE8] text-white' : 'text-gray-200 hover:bg-white/10'
                    }`}
                  >
                    {m.title}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. CHỌN RẠP */}
        <div className="relative px-3 sm:px-5 py-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#7C6FE8]" />
              <span>2. Chọn Rạp</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === 'cinema' ? null : 'cinema')}
            className="w-full text-left font-bold text-xs sm:text-sm text-white flex items-center justify-between gap-2 group py-1 cursor-pointer"
          >
            <span className="truncate">{getSelectedCinemaLabel()}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-[#7C6FE8] transition-transform ${openDropdown === 'cinema' ? 'rotate-180 text-[#7C6FE8]' : ''}`} />
          </button>

          <AnimatePresence>
            {openDropdown === 'cinema' && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                className="absolute left-0 top-full mt-2 w-72 max-h-[300px] overflow-y-auto scrollbar-thin rounded-2xl bg-[#141320] border border-[#7C6FE8]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-2 z-[100] flex flex-col gap-1"
              >
                {loadingCinemas ? (
                  <div className="px-3 py-3 text-xs text-gray-400 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7C6FE8]" />
                    <span>Đang tìm rạp chiếu...</span>
                  </div>
                ) : cinemasList.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCinema(c.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                      cinemaId === c.id ? 'bg-[#7C6FE8] text-white' : 'text-gray-200 hover:bg-white/10'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. NGÀY XEM */}
        <div className={`relative px-3 sm:px-5 py-2 ${isDateDisabled ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#7C6FE8]" />
              <span>3. Ngày Xem</span>
            </span>
          </div>
          <button
            type="button"
            disabled={isDateDisabled}
            onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}
            className="w-full text-left font-bold text-xs sm:text-sm text-white flex items-center justify-between gap-2 group py-1 cursor-pointer"
          >
            <span className="truncate">{getSelectedDateLabel()}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-[#7C6FE8] transition-transform ${openDropdown === 'date' ? 'rotate-180 text-[#7C6FE8]' : ''}`} />
          </button>

          <AnimatePresence>
            {openDropdown === 'date' && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                className="absolute left-0 top-full mt-2 w-64 max-h-[300px] overflow-y-auto scrollbar-thin rounded-2xl bg-[#141320] border border-[#7C6FE8]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-2 z-[100] flex flex-col gap-1"
              >
                {datesList.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => handleSelectDate(d.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                      date === d.id ? 'bg-[#7C6FE8] text-white' : 'text-gray-200 hover:bg-white/10'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. SUẤT CHIẾU */}
        <div className={`relative px-3 sm:px-5 py-2 ${isTimeDisabled ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#7C6FE8]" />
              <span>4. Suất Chiếu</span>
            </span>
          </div>
          <button
            type="button"
            disabled={isTimeDisabled}
            onClick={() => setOpenDropdown(openDropdown === 'time' ? null : 'time')}
            className="w-full text-left font-bold text-xs sm:text-sm text-white flex items-center justify-between gap-2 group py-1 cursor-pointer"
          >
            <span className="truncate">{getSelectedTimeLabel()}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-[#7C6FE8] transition-transform ${openDropdown === 'time' ? 'rotate-180 text-[#7C6FE8]' : ''}`} />
          </button>

          <AnimatePresence>
            {openDropdown === 'time' && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                className="absolute left-0 top-full mt-2 w-72 max-h-[300px] overflow-y-auto scrollbar-thin rounded-2xl bg-[#141320] border border-[#7C6FE8]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-2 z-[100] flex flex-col gap-1"
              >
                {timesList.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectTime(t.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                      time === t.id ? 'bg-[#7C6FE8] text-white' : 'text-gray-200 hover:bg-white/10'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitDisabled}
        className={`w-full lg:w-auto px-8 py-3.5 rounded-xl lg:rounded-full font-bold text-xs sm:text-sm shrink-0 transition-all flex items-center justify-center gap-2 cursor-pointer ${
          isSubmitDisabled
            ? 'bg-white/10 text-gray-400 cursor-not-allowed border border-white/5'
            : 'bg-[#7C6FE8] hover:bg-[#6d60df] text-white shadow-[0_0_25px_rgba(124,111,232,0.6)] hover:scale-105 active:scale-95'
        }`}
      >
        <span>CHỌN GHẾ NGAY</span>
        <span className="text-xs">→</span>
      </button>
    </form>
  );
};
