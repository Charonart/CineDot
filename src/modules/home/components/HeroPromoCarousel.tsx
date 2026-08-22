'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Film, MapPin, Calendar, Clock, Loader2 } from 'lucide-react';
import { PromoBanner, DynamicDateOption, QuickShowtimeOption } from '../types/home.types';
import {
  fetchQuickBookingMovies,
  fetchHomeCinemas,
  fetchMovieShowtimesTree,
  fetchCinemaShowtimesTree,
  HomeCinemaOption,
} from '../services/home.service';
import { Button } from '@/shared/ui/Button';

interface QuickMovieOption {
  id: string;
  slug: string;
  title: string;
}

interface HeroPromoCarouselProps {
  banners: PromoBanner[];
  onQuickBook?: (selection: { movieId: string; cinemaId: string; date: string; time: string }) => void;
}

export const HeroPromoCarousel: React.FC<HeroPromoCarouselProps> = ({ banners, onQuickBook }) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Master lists
  const [allMoviesList, setAllMoviesList] = useState<QuickMovieOption[]>([]);
  const [allCinemasList, setAllCinemasList] = useState<HomeCinemaOption[]>([]);

  // Filtered Dynamic Data Lists
  const [moviesList, setMoviesList] = useState<QuickMovieOption[]>([]);
  const [cinemasList, setCinemasList] = useState<HomeCinemaOption[]>([]);
  const [datesList, setDatesList] = useState<DynamicDateOption[]>([]);
  const [timesList, setTimesList] = useState<QuickShowtimeOption[]>([]);

  // Tree cache for currently selected movie / cinema
  const [showtimesTree, setShowtimesTree] = useState<any[]>([]);
  const [cinemaShowtimesData, setCinemaShowtimesData] = useState<any[]>([]);

  // Selection States
  const [movieId, setMovieId] = useState('');
  const [cinemaId, setCinemaId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Loading indicators for async fetch
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [loadingCinemas, setLoadingCinemas] = useState(false);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingTimes, setLoadingTimes] = useState(false);

  // Active dropdown state
  const [openDropdown, setOpenDropdown] = useState<'movie' | 'cinema' | 'date' | 'time' | null>(null);

  // 1. Initial Load: Fetch Both Movies and Cinemas
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

  // 2. Movie selection handler -> Load Cinemas that ACTUALLY have showtimes for this movie
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

        // Extract ONLY cinemas that have showtimes for this movie
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

        // If cinema is already selected and is in matching cinemas, calculate dates
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

  // 3. Cinema selection handler -> Filter Movies or Load Dates
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

    // Case A: Movie is ALREADY selected -> Calculate dates from existing showtimesTree
    if (movieId && showtimesTree.length > 0) {
      const dates = buildDatesFromMovieTree(showtimesTree, selectedCinemaId);
      setDatesList(dates);
      setTimeout(() => setOpenDropdown('date'), 120);
      return;
    }

    // Case B: Movie is NOT selected yet -> Fetch cinema's showtimes to filter available movies
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

  // 4. Date selection handler -> Load Showtimes for (Movie, Cinema, Date)
  const handleSelectDate = (selectedDateId: string) => {
    setDate(selectedDateId);
    setTime('');
    setTimesList([]);

    if (!selectedDateId || !cinemaId || !movieId) {
      setOpenDropdown(null);
      return;
    }

    const slots: QuickShowtimeOption[] = [];

    // Prioritize showtimesTree (from movie)
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
            label: `${startTime} - ${format}${roomName}`,
          });
        });
      }
    } else if (cinemaShowtimesData.length > 0) {
      // Fallback from cinemaShowtimesData
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
    setTimeout(() => setOpenDropdown('time'), 120);
  };

  // 5. Time selection handler
  const handleSelectTime = (selectedTimeId: string) => {
    setTime(selectedTimeId);
    setOpenDropdown(null);
  };

  // Conditions
  const isCinemaDisabled = false; // Never disabled: user can choose Cinema first!
  const isDateDisabled = !movieId || !cinemaId;
  const isTimeDisabled = !movieId || !cinemaId || !date;
  const isSubmitDisabled = !movieId || !cinemaId || !date || !time;

  // Auto-slide every 5s
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

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

  const currentBanner = banners[currentIndex] || banners[0];

  const getSelectedMovieLabel = () => selectedMovie?.title || (loadingMovies ? 'Đang lọc phim...' : '-- Chọn Phim --');
  const getSelectedCinemaLabel = () => selectedCinema?.name || (loadingCinemas ? 'Đang tìm rạp...' : '-- Chọn Rạp --');
  const getSelectedDateLabel = () => datesList.find((d) => d.id === date)?.label || (loadingDates ? 'Đang tải ngày...' : '-- Chọn Ngày --');
  const getSelectedTimeLabel = () => timesList.find((t) => t.id === time || String(t.showtimeId) === time)?.label || (loadingTimes ? 'Đang tải suất...' : '-- Chọn Giờ --');

  return (
    <section className="w-full bg-[var(--bg2)] pb-12 pt-28">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 flex flex-col gap-6">
        {/* Top: Auto Promo Carousel Slider */}
        <div className="relative w-full aspect-[21/9] sm:aspect-[24/8] max-h-[380px] rounded-3xl overflow-hidden shadow-2xl bg-slate-900 group">
          {currentBanner && (
            <>
              <img
                src={currentBanner.imageUrl}
                alt={currentBanner.title}
                className="w-full h-full object-cover transition-opacity duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6 sm:p-8">
                <div className="flex flex-col gap-2 max-w-xl text-white">
                  {currentBanner.badgeText && (
                    <span className="self-start px-3 py-1 rounded-full bg-[#7C6FE8] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                      {currentBanner.badgeText}
                    </span>
                  )}
                  <h2 className="text-xl sm:text-3xl font-bold tracking-tight leading-tight">
                    {currentBanner.title}
                  </h2>
                </div>
              </div>
            </>
          )}

          {/* Dots Indicator */}
          <div className="absolute bottom-4 right-6 flex items-center gap-2 z-10">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-8 bg-[#7C6FE8]' : 'bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom: Quick Booking Strip (CRISP BOLD BLACK TEXT FOR OPENED STEPS) */}
        <form
          onSubmit={handleSubmit}
          className="relative z-40 w-full bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-full p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between shadow-[0_20px_50px_rgba(124,111,232,0.16),0_4px_16px_rgba(0,0,0,0.04)] ring-1 ring-white/80 gap-3"
        >
          <div className="w-full flex-1 grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-slate-200/80 items-center">
            {/* Step 1: CHỌN PHIM */}
            <div className="relative px-4 sm:px-6 py-1">
              <label className="text-[10px] font-bold text-[#7C6FE8] uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Film className="w-3 h-3 text-[#7C6FE8]" />
                <span>CHỌN PHIM</span>
              </label>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'movie' ? null : 'movie')}
                className="w-full text-left font-bold text-xs sm:text-sm text-[#131413] flex items-center justify-between gap-1 group py-0.5 transition-all cursor-pointer"
              >
                <span className="truncate">{getSelectedMovieLabel()}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 group-hover:text-[#7C6FE8] transition-transform ${openDropdown === 'movie' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {openDropdown === 'movie' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full mt-3 w-64 max-h-[260px] overflow-y-auto scrollbar-none rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-gray-100 p-2 z-[100] flex flex-col gap-1"
                  >
                    {loadingMovies ? (
                      <div className="px-3 py-2 text-xs text-slate-400 italic flex items-center gap-1.5">
                        <Loader2 className="w-3 h-3 animate-spin text-[#7C6FE8]" />
                        <span>Đang lọc danh sách phim...</span>
                      </div>
                    ) : moviesList.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-slate-400 italic">Không có phim đang chiếu tại rạp này</div>
                    ) : (
                      moviesList.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => handleSelectMovie(m.id)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                            movieId === m.id
                              ? 'bg-[#7C6FE8]/15 text-[#7C6FE8] font-bold'
                              : 'text-slate-800 font-semibold hover:bg-slate-100 hover:text-[#7C6FE8]'
                          }`}
                        >
                          {m.title}
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Step 2: CHỌN RẠP */}
            <div className="relative px-4 sm:px-6 py-1 transition-all duration-300 opacity-100">
              <label className="text-[10px] font-bold text-[#7C6FE8] uppercase tracking-wider block mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#7C6FE8]" />
                <span>CHỌN RẠP</span>
              </label>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'cinema' ? null : 'cinema')}
                className="w-full text-left font-bold text-xs sm:text-sm text-[#131413] flex items-center justify-between gap-1 group py-0.5 transition-all cursor-pointer"
              >
                <span className="truncate">{getSelectedCinemaLabel()}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 group-hover:text-[#7C6FE8] transition-transform ${openDropdown === 'cinema' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {openDropdown === 'cinema' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full mt-3 w-64 max-h-[260px] overflow-y-auto scrollbar-none rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-gray-100 p-2 z-[100] flex flex-col gap-1"
                  >
                    {loadingCinemas ? (
                      <div className="px-3 py-2 text-xs text-slate-400 italic flex items-center gap-1.5">
                        <Loader2 className="w-3 h-3 animate-spin text-[#7C6FE8]" />
                        <span>Đang tìm rạp chiếu...</span>
                      </div>
                    ) : cinemasList.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-slate-400 italic">Chưa có rạp chiếu phim này</div>
                    ) : (
                      cinemasList.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleSelectCinema(c.id)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                            cinemaId === c.id
                              ? 'bg-[#7C6FE8]/15 text-[#7C6FE8] font-bold'
                              : 'text-slate-800 font-semibold hover:bg-slate-100 hover:text-[#7C6FE8]'
                          }`}
                        >
                          {c.name}
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Step 3: NGÀY XEM */}
            <div className={`relative px-4 sm:px-6 py-1 transition-all duration-300 ${isDateDisabled ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
              <label className="text-[10px] font-bold text-[#7C6FE8] uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#7C6FE8]" />
                <span>NGÀY XEM</span>
              </label>
              <button
                type="button"
                disabled={isDateDisabled}
                onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}
                className="w-full text-left font-bold text-xs sm:text-sm text-[#131413] flex items-center justify-between gap-1 group py-0.5 transition-all cursor-pointer"
              >
                <span className="truncate">{getSelectedDateLabel()}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 group-hover:text-[#7C6FE8] transition-transform ${openDropdown === 'date' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {openDropdown === 'date' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full mt-3 w-56 max-h-[260px] overflow-y-auto scrollbar-none rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-gray-100 p-2 z-[100] flex flex-col gap-1"
                  >
                    {datesList.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-slate-400 italic">Không có suất chiếu phù hợp</div>
                    ) : (
                      datesList.map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => handleSelectDate(d.id)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                            date === d.id
                              ? 'bg-[#7C6FE8]/15 text-[#7C6FE8] font-bold'
                              : 'text-slate-800 font-semibold hover:bg-slate-100 hover:text-[#7C6FE8]'
                          }`}
                        >
                          {d.label}
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Step 4: SUẤT CHIẾU */}
            <div className={`relative px-4 sm:px-6 py-1 transition-all duration-300 ${isTimeDisabled ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
              <label className="text-[10px] font-bold text-[#7C6FE8] uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#7C6FE8]" />
                <span>SUẤT CHIẾU</span>
              </label>
              <button
                type="button"
                disabled={isTimeDisabled}
                onClick={() => setOpenDropdown(openDropdown === 'time' ? null : 'time')}
                className="w-full text-left font-bold text-xs sm:text-sm text-[#131413] flex items-center justify-between gap-1 group py-0.5 transition-all cursor-pointer"
              >
                <span className="truncate">{getSelectedTimeLabel()}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 group-hover:text-[#7C6FE8] transition-transform ${openDropdown === 'time' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {openDropdown === 'time' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full mt-3 w-64 max-h-[260px] overflow-y-auto scrollbar-none rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-gray-100 p-2 z-[100] flex flex-col gap-1"
                  >
                    {loadingTimes ? (
                      <div className="px-3 py-2 text-xs text-slate-400 italic">Đang tải suất chiếu...</div>
                    ) : timesList.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-slate-400 italic">Hết suất chiếu trong ngày</div>
                    ) : (
                      timesList.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => handleSelectTime(t.id)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                            time === t.id
                              ? 'bg-[#7C6FE8]/15 text-[#7C6FE8] font-bold'
                              : 'text-slate-800 font-semibold hover:bg-slate-100 hover:text-[#7C6FE8]'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Action Button */}
          <Button
            type="submit"
            disabled={isSubmitDisabled}
            className={`w-full md:w-auto px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm shrink-0 shadow-lg transition-all cursor-pointer ${
              isSubmitDisabled
                ? 'bg-[#7C6FE8]/40 text-white cursor-not-allowed shadow-none'
                : 'bg-[#7C6FE8] hover:bg-[#685bc7] text-white shadow-[#7C6FE8]/30 hover:scale-105'
            }`}
          >
            MUA VÉ
          </Button>
        </form>
      </div>
    </section>
  );
};
