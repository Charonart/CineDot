'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Film, MapPin, Calendar, Clock, Loader2, Play, Ticket, ChevronLeft, ChevronRight } from 'lucide-react';
import { PromoBanner, DynamicDateOption, QuickShowtimeOption } from '../types/home.types';
import {
  fetchQuickBookingMovies,
  fetchHomeCinemas,
  fetchMovieShowtimesTree,
  fetchCinemaShowtimesTree,
  HomeCinemaOption,
} from '../services/home.service';
import { isShowtimePassed, filterUpcomingShowtimes } from '@/shared/utils/showtimeHelper';
import { MOCK_PROMO_BANNERS } from '../mocks/mockHomeData';
import { useTrailerStore } from '@/shared/store/trailerStore';

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
  const openTrailer = useTrailerStore((state) => state.openTrailer);
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
        if (cId !== String(targetCinemaId) || !Array.isArray(c.times) || c.times.length === 0) return false;

        // Ensure date has at least 1 upcoming showtime
        return c.times.some((st: any) => !isShowtimePassed({
          dateStr: day.date,
          timeStr: st.time,
          showtimeStart: st.showtime_start,
        }));
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

  // 4. Date selection handler -> Load Showtimes
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
          const isPassed = isShowtimePassed({
            dateStr: selectedDateId,
            timeStr: st.time,
            showtimeStart: st.showtime_start,
          });
          if (isPassed) return;

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
        const isPassed = isShowtimePassed({
          dateStr: selectedDateId,
          timeStr: st.time,
          showtimeStart: st.showtime_start,
        });
        if (isPassed) return;

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

  // 5. Time selection handler
  const handleSelectTime = (selectedTimeId: string) => {
    setTime(selectedTimeId);
    setOpenDropdown(null);
  };

  // Conditions
  const isDateDisabled = !movieId || !cinemaId;
  const isTimeDisabled = !movieId || !cinemaId || !date || timesList.length === 0;
  const isSubmitDisabled = !movieId || !cinemaId || !date || !time;

  const activeBanners = useMemo(() => {
    return banners && banners.length > 0 ? banners : MOCK_PROMO_BANNERS;
  }, [banners]);

  // Auto-slide every 6s
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

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

  const currentBanner = activeBanners[currentIndex % activeBanners.length] || activeBanners[0];

  const getSelectedMovieLabel = () => selectedMovie?.title || (loadingMovies ? 'Đang lọc phim...' : 'Chọn Phim');
  const getSelectedCinemaLabel = () => selectedCinema?.name || (loadingCinemas ? 'Đang tìm rạp...' : 'Chọn Cụm Rạp');
  const getSelectedDateLabel = () => datesList.find((d) => d.id === date)?.label || (loadingDates ? 'Đang tải ngày...' : 'Chọn Ngày');
  const getSelectedTimeLabel = () => {
    if (loadingTimes) return 'Đang tải suất...';
    if (date && timesList.length === 0) return 'Đã hết suất hôm nay';
    return timesList.find((t) => t.id === time || String(t.showtimeId) === time)?.label || 'Chọn Suất Chiếu';
  };

  const handlePrevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  return (
    <section className="relative w-full overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16 bg-[#FAFAFB]">
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-col gap-6 lg:gap-8">
        {/* TOP: Cinematic Marquee Banner */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.4/1] max-h-[480px] rounded-3xl overflow-hidden shadow-[0_16px_45px_rgba(0,0,0,0.18)] border border-gray-200/50 group bg-slate-950">
          <AnimatePresence mode="wait">
            {currentBanner && (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={currentBanner.imageUrl}
                  alt={currentBanner.title}
                  className="w-full h-full object-cover object-center animate-drift"
                />

                {/* Atmospheric Vignette and Gradients */}
                <div className="absolute inset-0 hero-overlay" />
                <div className="absolute inset-0 hero-side-fade hidden md:block" />

                {/* Banner Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14 text-white z-10">
                  <div className="flex flex-col gap-3 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-[#7C6FE8] text-white text-[11px] font-bold tracking-wide uppercase shadow-sm">
                        {currentBanner.badgeText || 'ĐANG CHIẾU'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-semibold text-white border border-white/20">
                        IMAX 3D Laser • Dolby Atmos
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] text-white drop-shadow-md">
                      {currentBanner.title}
                    </h1>

                    <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 max-w-xl leading-relaxed">
                      Trải nghiệm siêu phẩm điện ảnh với hình ảnh sắc nét gấp 4 lần và âm thanh sống động đến từng chi tiết tại hệ thống rạp CineDot.
                    </p>

                    {/* Quick CTA Actions */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => openTrailer('https://www.youtube.com/watch?v=cqGjhVJWtEg', currentBanner.imageUrl, currentBanner.title)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs sm:text-sm font-bold backdrop-blur-md transition-all cursor-pointer shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5 text-white fill-white" />
                        <span>Xem Trailer</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const dock = document.getElementById('quick-booking-dock');
                          dock?.scrollIntoView({ behavior: 'smooth' });
                          setOpenDropdown('movie');
                        }}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
                      >
                        <Ticket className="w-4 h-4" />
                        <span>Đặt Vé Nhanh</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevSlide}
            aria-label="Previous Slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-[#7C6FE8] text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextSlide}
            aria-label="Next Slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-[#7C6FE8] text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Carousel Progress Dots */}
          <div className="absolute bottom-5 right-6 flex items-center gap-2 z-20">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex % activeBanners.length === idx
                    ? 'w-8 bg-[#7C6FE8] shadow-sm'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>

        {/* BOTTOM: 1-Click Floating Quick Booking Dock */}
        <div id="quick-booking-dock" className="relative z-30 w-full">
          <form
            onSubmit={handleSubmit}
            className="glass-dock rounded-2xl lg:rounded-full p-2.5 sm:p-3 flex flex-col lg:flex-row items-center justify-between gap-3 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-gray-200/90 bg-white/95 backdrop-blur-xl"
          >
            <div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-0 lg:divide-x lg:divide-gray-200 items-center">
              {/* 1. CHỌN PHIM */}
              <div className="relative px-3 sm:px-5 py-1.5">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-[#7C6FE8]" />
                    <span>1. Chọn Phim</span>
                  </span>
                  {movieId && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'movie' ? null : 'movie')}
                  className="w-full text-left font-bold text-xs sm:text-sm text-gray-900 flex items-center justify-between gap-2 group py-1 transition-all cursor-pointer"
                >
                  <span className="truncate">{getSelectedMovieLabel()}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-[#7C6FE8] transition-transform duration-200 shrink-0 ${openDropdown === 'movie' ? 'rotate-180 text-[#7C6FE8]' : ''}`} />
                </button>

                <AnimatePresence>
                  {openDropdown === 'movie' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-2 w-72 max-h-[300px] overflow-y-auto scrollbar-thin rounded-2xl bg-white border border-gray-200 shadow-[0_16px_45px_rgba(0,0,0,0.12)] p-2 z-[100] flex flex-col gap-1 text-gray-800"
                    >
                      {loadingMovies ? (
                        <div className="px-3 py-3 text-xs text-gray-500 flex items-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7C6FE8]" />
                          <span>Đang lọc danh sách phim...</span>
                        </div>
                      ) : moviesList.length === 0 ? (
                        <div className="px-3 py-3 text-xs text-gray-500 italic">Không có phim đang chiếu tại rạp này</div>
                      ) : (
                        moviesList.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => handleSelectMovie(m.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                              movieId === m.id
                                ? 'bg-[#7C6FE8] text-white shadow-sm'
                                : 'text-gray-700 hover:bg-purple-50 hover:text-[#7C6FE8]'
                            }`}
                          >
                            <span className="truncate">{m.title}</span>
                            {movieId === m.id && <span className="text-[10px]">✓</span>}
                          </button>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. CHỌN RẠP */}
              <div className="relative px-3 sm:px-5 py-1.5">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#7C6FE8]" />
                    <span>2. Chọn Rạp</span>
                  </span>
                  {cinemaId && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'cinema' ? null : 'cinema')}
                  className="w-full text-left font-bold text-xs sm:text-sm text-gray-900 flex items-center justify-between gap-2 group py-1 transition-all cursor-pointer"
                >
                  <span className="truncate">{getSelectedCinemaLabel()}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-[#7C6FE8] transition-transform duration-200 shrink-0 ${openDropdown === 'cinema' ? 'rotate-180 text-[#7C6FE8]' : ''}`} />
                </button>

                <AnimatePresence>
                  {openDropdown === 'cinema' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-2 w-72 max-h-[300px] overflow-y-auto scrollbar-thin rounded-2xl bg-white border border-gray-200 shadow-[0_16px_45px_rgba(0,0,0,0.12)] p-2 z-[100] flex flex-col gap-1 text-gray-800"
                    >
                      {loadingCinemas ? (
                        <div className="px-3 py-3 text-xs text-gray-500 flex items-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7C6FE8]" />
                          <span>Đang tìm rạp chiếu...</span>
                        </div>
                      ) : cinemasList.length === 0 ? (
                        <div className="px-3 py-3 text-xs text-gray-500 italic">Chưa có rạp chiếu phim này</div>
                      ) : (
                        cinemasList.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => handleSelectCinema(c.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                              cinemaId === c.id
                                ? 'bg-[#7C6FE8] text-white shadow-sm'
                                : 'text-gray-700 hover:bg-purple-50 hover:text-[#7C6FE8]'
                            }`}
                          >
                            <span className="truncate">{c.name}</span>
                            {cinemaId === c.id && <span className="text-[10px]">✓</span>}
                          </button>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. NGÀY XEM */}
              <div className={`relative px-3 sm:px-5 py-1.5 transition-all ${isDateDisabled ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#7C6FE8]" />
                    <span>3. Ngày Xem</span>
                  </span>
                  {date && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </div>
                <button
                  type="button"
                  disabled={isDateDisabled}
                  onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}
                  className="w-full text-left font-bold text-xs sm:text-sm text-gray-900 flex items-center justify-between gap-2 group py-1 transition-all cursor-pointer"
                >
                  <span className="truncate">{getSelectedDateLabel()}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-[#7C6FE8] transition-transform duration-200 shrink-0 ${openDropdown === 'date' ? 'rotate-180 text-[#7C6FE8]' : ''}`} />
                </button>

                <AnimatePresence>
                  {openDropdown === 'date' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-2 w-64 max-h-[300px] overflow-y-auto scrollbar-thin rounded-2xl bg-white border border-gray-200 shadow-[0_16px_45px_rgba(0,0,0,0.12)] p-2 z-[100] flex flex-col gap-1 text-gray-800"
                    >
                      {datesList.length === 0 ? (
                        <div className="px-3 py-3 text-xs text-gray-500 italic">Không có ngày chiếu khả dụng</div>
                      ) : (
                        datesList.map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => handleSelectDate(d.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                              date === d.id
                                ? 'bg-[#7C6FE8] text-white shadow-sm'
                                : 'text-gray-700 hover:bg-purple-50 hover:text-[#7C6FE8]'
                            }`}
                          >
                            <span>{d.label}</span>
                            {date === d.id && <span className="text-[10px]">✓</span>}
                          </button>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 4. SUẤT CHIẾU */}
              <div className={`relative px-3 sm:px-5 py-1.5 transition-all ${isTimeDisabled ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#7C6FE8]" />
                    <span>4. Suất Chiếu</span>
                  </span>
                  {time && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </div>
                <button
                  type="button"
                  disabled={isTimeDisabled}
                  onClick={() => setOpenDropdown(openDropdown === 'time' ? null : 'time')}
                  className="w-full text-left font-bold text-xs sm:text-sm text-gray-900 flex items-center justify-between gap-2 group py-1 transition-all cursor-pointer"
                >
                  <span className="truncate">{getSelectedTimeLabel()}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-[#7C6FE8] transition-transform duration-200 shrink-0 ${openDropdown === 'time' ? 'rotate-180 text-[#7C6FE8]' : ''}`} />
                </button>

                <AnimatePresence>
                  {openDropdown === 'time' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-2 w-72 max-h-[300px] overflow-y-auto scrollbar-thin rounded-2xl bg-white border border-gray-200 shadow-[0_16px_45px_rgba(0,0,0,0.12)] p-2 z-[100] flex flex-col gap-1 text-gray-800"
                    >
                      {loadingTimes ? (
                        <div className="px-3 py-3 text-xs text-gray-500 flex items-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7C6FE8]" />
                          <span>Đang tải suất chiếu...</span>
                        </div>
                      ) : timesList.length === 0 ? (
                        <div className="px-3 py-3 text-xs text-gray-500 italic">Hết suất chiếu trong ngày này</div>
                      ) : (
                        timesList.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => handleSelectTime(t.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                              time === t.id
                                ? 'bg-[#7C6FE8] text-white shadow-sm'
                                : 'text-gray-700 hover:bg-purple-50 hover:text-[#7C6FE8]'
                            }`}
                          >
                            <span>{t.label}</span>
                            {time === t.id && <span className="text-[10px]">✓</span>}
                          </button>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* 1-Click Fast Book Button */}
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={`w-full lg:w-auto px-8 py-3.5 rounded-xl lg:rounded-full font-extrabold text-xs uppercase tracking-wider shrink-0 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isSubmitDisabled
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  : 'bg-[#7C6FE8] hover:bg-[#685bc7] text-white shadow-sm shadow-[#7C6FE8]/30 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              <span>CHỌN GHẾ NGAY</span>
              <span className="text-xs">→</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
