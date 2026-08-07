'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Film, MapPin, Calendar, Clock } from 'lucide-react';
import { PromoBanner } from '../types/home.types';
import { Button } from '@/shared/ui/Button';

interface HeroPromoCarouselProps {
  banners: PromoBanner[];
  onQuickBook?: (selection: { movieId: string; cinemaId: string; date: string; time: string }) => void;
}

export const HeroPromoCarousel: React.FC<HeroPromoCarouselProps> = ({ banners, onQuickBook }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [movieId, setMovieId] = useState('');
  const [cinemaId, setCinemaId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Active dropdown state
  const [openDropdown, setOpenDropdown] = useState<'movie' | 'cinema' | 'date' | 'time' | null>(null);

  // Sequential unlock conditions
  const isCinemaDisabled = !movieId;
  const isDateDisabled = !movieId || !cinemaId;
  const isTimeDisabled = !movieId || !cinemaId || !date;
  const isSubmitDisabled = !movieId || !cinemaId || !date || !time;

  const moviesList = [
    { id: '', title: '-- Chọn Phim --' },
    { id: 'm-1', title: 'Người Nhện: Du Hành Vũ Trụ' },
    { id: 'm-2', title: 'Conan 27: Ngôi Sao 5 Cánh' },
    { id: 'm-3', title: 'The Odyssey: Thảm Họa' },
    { id: 'm-4', title: 'Kẻ Trộm Mặt Trăng 4' },
  ];

  const cinemasList = [
    { id: '', name: '-- Chọn Rạp --' },
    { id: 'c-1', name: 'CineDot Landmark 81' },
    { id: 'c-2', name: 'CineDot Quận 1' },
    { id: 'c-3', name: 'CineDot Cầu Giấy' },
  ];

  const datesList = [
    { id: '', label: '-- Chọn Ngày --' },
    { id: 'today', label: 'Hôm nay (29/07)' },
    { id: 'tomorrow', label: 'Ngày mai (30/07)' },
    { id: 'friday', label: 'Thứ Sáu (31/07)' },
  ];

  const timesList = [
    { id: '', label: '-- Chọn Giờ --' },
    { id: '18:30', label: '18:30 - IMAX' },
    { id: '19:45', label: '19:45 - 2D' },
    { id: '21:15', label: '21:15 - 4DX' },
  ];

  // Handlers with Auto-Jump Logic
  const handleSelectMovie = (id: string) => {
    setMovieId(id);
    if (!id) {
      setCinemaId('');
      setDate('');
      setTime('');
      setOpenDropdown(null);
    } else {
      setTimeout(() => setOpenDropdown('cinema'), 150);
    }
  };

  const handleSelectCinema = (id: string) => {
    setCinemaId(id);
    if (!id) {
      setDate('');
      setTime('');
      setOpenDropdown(null);
    } else {
      setTimeout(() => setOpenDropdown('date'), 150);
    }
  };

  const handleSelectDate = (id: string) => {
    setDate(id);
    if (!id) {
      setTime('');
      setOpenDropdown(null);
    } else {
      setTimeout(() => setOpenDropdown('time'), 150);
    }
  };

  const handleSelectTime = (id: string) => {
    setTime(id);
    setOpenDropdown(null);
  };

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
    if (onQuickBook && !isSubmitDisabled) {
      onQuickBook({ movieId, cinemaId, date, time });
    }
  };

  const currentBanner = banners[currentIndex] || banners[0];

  const getSelectedMovieLabel = () => moviesList.find((m) => m.id === movieId)?.title || '-- Chọn Phim --';
  const getSelectedCinemaLabel = () => cinemasList.find((c) => c.id === cinemaId)?.name || '-- Chọn Rạp --';
  const getSelectedDateLabel = () => datesList.find((d) => d.id === date)?.label || '-- Chọn Ngày --';
  const getSelectedTimeLabel = () => timesList.find((t) => t.id === time)?.label || '-- Chọn Giờ --';

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
            {/* Step 1: CHỌN PHIM (Crisp Bold Black Text) */}
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
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full mt-3 w-64 rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-gray-100 p-2 z-[100] flex flex-col gap-1"
                  >
                    {moviesList.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectMovie(m.id)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-colors ${
                          m.id === ''
                            ? 'text-slate-400 italic font-normal border-b border-gray-100 hover:bg-slate-50'
                            : movieId === m.id
                            ? 'bg-[#7C6FE8]/15 text-[#7C6FE8] font-bold'
                            : 'text-slate-800 font-semibold hover:bg-slate-100 hover:text-[#7C6FE8]'
                        }`}
                      >
                        {m.title}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Step 2: CHỌN RẠP */}
            <div className={`relative px-4 sm:px-6 py-1 transition-all duration-300 ${isCinemaDisabled ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
              <label className="text-[10px] font-bold text-[#7C6FE8] uppercase tracking-wider block mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#7C6FE8]" />
                <span>CHỌN RẠP</span>
              </label>
              <button
                type="button"
                disabled={isCinemaDisabled}
                onClick={() => setOpenDropdown(openDropdown === 'cinema' ? null : 'cinema')}
                className="w-full text-left font-bold text-xs sm:text-sm text-[#131413] flex items-center justify-between gap-1 group py-0.5 transition-all"
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
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full mt-3 w-56 rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-gray-100 p-2 z-[100] flex flex-col gap-1"
                  >
                    {cinemasList.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectCinema(c.id)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-colors ${
                          c.id === ''
                            ? 'text-slate-400 italic font-normal border-b border-gray-100 hover:bg-slate-50'
                            : cinemaId === c.id
                            ? 'bg-[#7C6FE8]/15 text-[#7C6FE8] font-bold'
                            : 'text-slate-800 font-semibold hover:bg-slate-100 hover:text-[#7C6FE8]'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
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
                className="w-full text-left font-bold text-xs sm:text-sm text-[#131413] flex items-center justify-between gap-1 group py-0.5 transition-all"
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
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full mt-3 w-52 rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-gray-100 p-2 z-[100] flex flex-col gap-1"
                  >
                    {datesList.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => handleSelectDate(d.id)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-colors ${
                          d.id === ''
                            ? 'text-slate-400 italic font-normal border-b border-gray-100 hover:bg-slate-50'
                            : date === d.id
                            ? 'bg-[#7C6FE8]/15 text-[#7C6FE8] font-bold'
                            : 'text-slate-800 font-semibold hover:bg-slate-100 hover:text-[#7C6FE8]'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
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
                className="w-full text-left font-bold text-xs sm:text-sm text-[#131413] flex items-center justify-between gap-1 group py-0.5 transition-all"
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
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full mt-3 w-48 rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-gray-100 p-2 z-[100] flex flex-col gap-1"
                  >
                    {timesList.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleSelectTime(t.id)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-colors ${
                          t.id === ''
                            ? 'text-slate-400 italic font-normal border-b border-gray-100 hover:bg-slate-50'
                            : time === t.id
                            ? 'bg-[#7C6FE8]/15 text-[#7C6FE8] font-bold'
                            : 'text-slate-800 font-semibold hover:bg-slate-100 hover:text-[#7C6FE8]'
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitDisabled}
            className={`w-full md:w-auto px-8 shrink-0 transition-all ${
              isSubmitDisabled
                ? 'opacity-50 cursor-not-allowed shadow-none'
                : 'shadow-[0_8px_24px_rgba(124,111,232,0.4)] hover:scale-105'
            }`}
          >
            MUA VÉ
          </Button>
        </form>
      </div>
    </section>
  );
};
