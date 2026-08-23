import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown, Check, Film, Building2 } from 'lucide-react';
import { TimeFilterKey, DashboardFiltersState } from '../../types/adminReport.types';
import { useAdminCinemas } from '../../hooks/useAdminCinemas';
import { useAdminMovies } from '../../hooks/useAdminMovies';

interface DashboardFiltersProps {
  filters: DashboardFiltersState;
  onChange: (updated: Partial<DashboardFiltersState>) => void;
}

const TIME_OPTIONS: { key: TimeFilterKey; label: string }[] = [
  { key: 'today', label: 'Hôm nay' },
  { key: '7d', label: '7 ngày qua' },
  { key: '30d', label: '30 ngày qua' },
  { key: 'this_month', label: 'Tháng này' },
  { key: 'last_month', label: 'Tháng trước' },
  { key: 'custom', label: 'Tùy chỉnh' },
];

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({ filters, onChange }) => {
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);
  const [isMovieOpen, setIsMovieOpen] = useState(false);

  const cinemaRef = useRef<HTMLDivElement>(null);
  const movieRef = useRef<HTMLDivElement>(null);

  // Fetch real cinemas and movies from backend
  const { cinemasList } = useAdminCinemas({ per_page: 50 });
  const { moviesList } = useAdminMovies({ per_page: 50 });

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cinemaRef.current && !cinemaRef.current.contains(event.target as Node)) {
        setIsCinemaOpen(false);
      }
      if (movieRef.current && !movieRef.current.contains(event.target as Node)) {
        setIsMovieOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCinemaLabel =
    filters.cinemaId === 'ALL' || !filters.cinemaId
      ? 'Tất cả cụm rạp'
      : cinemasList.find((c) => String(c.id) === String(filters.cinemaId))?.name || 'Tất cả cụm rạp';

  const selectedMovieLabel =
    filters.movieId === 'ALL' || !filters.movieId
      ? 'Tất cả phim'
      : moviesList.find((m) => String(m.id) === String(filters.movieId))?.title || 'Tất cả phim';

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* 1. Time Range Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
          {TIME_OPTIONS.map((tf) => {
            const isSelected = filters.timeFilter === tf.key;
            return (
              <button
                key={tf.key}
                onClick={() => onChange({ timeFilter: tf.key })}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#7C6FE8] text-white shadow-sm shadow-[#7C6FE8]/25 font-extrabold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tf.label}
              </button>
            );
          })}
        </div>

        {/* 2. Cinema & Movie Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
          {/* Cinema Filter Dropdown */}
          <div ref={cinemaRef} className="relative">
            <button
              onClick={() => {
                setIsCinemaOpen(!isCinemaOpen);
                setIsMovieOpen(false);
              }}
              className={`flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                isCinemaOpen
                  ? 'border-[#7C6FE8] bg-purple-50/60 text-[#7C6FE8] shadow-xs'
                  : 'border-slate-200 text-slate-700 hover:border-[#7C6FE8] hover:bg-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0" />
              <span className="max-w-[140px] truncate">{selectedCinemaLabel}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isCinemaOpen ? 'rotate-180 text-[#7C6FE8]' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {isCinemaOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-64 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-2xl p-1.5 shadow-xl z-50 flex flex-col gap-0.5"
                >
                  <button
                    onClick={() => {
                      onChange({ cinemaId: 'ALL' });
                      setIsCinemaOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      filters.cinemaId === 'ALL' || !filters.cinemaId
                        ? 'bg-purple-50 text-[#7C6FE8]'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>Tất cả cụm rạp</span>
                    {(filters.cinemaId === 'ALL' || !filters.cinemaId) && (
                      <Check className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0 ml-2" />
                    )}
                  </button>

                  {cinemasList.map((cinema) => {
                    const isSelected = String(filters.cinemaId) === String(cinema.id);
                    return (
                      <button
                        key={cinema.id}
                        onClick={() => {
                          onChange({ cinemaId: String(cinema.id) });
                          setIsCinemaOpen(false);
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-purple-50 text-[#7C6FE8]'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span className="truncate">{cinema.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Movie Filter Dropdown */}
          <div ref={movieRef} className="relative">
            <button
              onClick={() => {
                setIsMovieOpen(!isMovieOpen);
                setIsCinemaOpen(false);
              }}
              className={`flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                isMovieOpen
                  ? 'border-[#7C6FE8] bg-purple-50/60 text-[#7C6FE8] shadow-xs'
                  : 'border-slate-200 text-slate-700 hover:border-[#7C6FE8] hover:bg-white'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0" />
              <span className="max-w-[140px] truncate">{selectedMovieLabel}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isMovieOpen ? 'rotate-180 text-[#7C6FE8]' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {isMovieOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-64 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-2xl p-1.5 shadow-xl z-50 flex flex-col gap-0.5"
                >
                  <button
                    onClick={() => {
                      onChange({ movieId: 'ALL' });
                      setIsMovieOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      filters.movieId === 'ALL' || !filters.movieId
                        ? 'bg-purple-50 text-[#7C6FE8]'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>Tất cả phim</span>
                    {(filters.movieId === 'ALL' || !filters.movieId) && (
                      <Check className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0 ml-2" />
                    )}
                  </button>

                  {moviesList.map((movie) => {
                    const isSelected = String(filters.movieId) === String(movie.id);
                    return (
                      <button
                        key={movie.id}
                        onClick={() => {
                          onChange({ movieId: String(movie.id) });
                          setIsMovieOpen(false);
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-purple-50 text-[#7C6FE8]'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span className="truncate">{movie.title}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 3. Custom Date Range Pickers (Visible when 'custom' is active) */}
      {filters.timeFilter === 'custom' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs"
        >
          <span className="font-bold text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#7C6FE8]" />
            <span>Khoảng ngày tùy chỉnh:</span>
          </span>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => onChange({ startDate: e.target.value })}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-bold focus:border-[#7C6FE8] focus:bg-white focus:outline-hidden text-xs"
            />
            <span className="text-slate-400 font-bold">→</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => onChange({ endDate: e.target.value })}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-bold focus:border-[#7C6FE8] focus:bg-white focus:outline-hidden text-xs"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};
