'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, Bell, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { fetchShowtimeSchedule } from '../services/movie-detail.service';
import { CinemaShowtimeGroup } from '../types/movie-detail.types';

interface ShowtimeScheduleSectionProps {
  movieSlug?: string;
  isComingSoon?: boolean;
}

const generateDateOptions = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayStr = i === 0 ? 'Hôm nay' : ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][d.getDay()];
    const dateQuery = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const displayDate = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    dates.push({ dateStr: dateQuery, displayDay: dayStr, displayDate });
  }
  return dates;
};

export const ShowtimeScheduleSection: React.FC<ShowtimeScheduleSectionProps> = ({
  movieSlug = 'conan-movie-27',
  isComingSoon = false,
}) => {
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuthStore();

  const dateOptions = useMemo(() => generateDateOptions(), []);
  
  const [selectedDateStr, setSelectedDateStr] = useState(dateOptions[0].dateStr);
  const [selectedRegion, setSelectedRegion] = useState('Toàn quốc');
  const [selectedCinemaFilter, setSelectedCinemaFilter] = useState('Tất cả rạp');
  const [openDropdown, setOpenDropdown] = useState<'region' | 'cinema' | null>(null);
  const [isNotified, setIsNotified] = useState(false);
  const [schedule, setSchedule] = useState<CinemaShowtimeGroup[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const comingSoonSlugs = ['joker-folie-a-deux', 'venom-the-last-dance', 'gladiator-2', 'wicked-part-one'];
  const isComingSoonMovie = isComingSoon || comingSoonSlugs.includes(movieSlug);

  useEffect(() => {
    if (isComingSoonMovie) return;
    setLoadingSchedule(true);
    fetchShowtimeSchedule(movieSlug, selectedDateStr, selectedRegion)
      .then((data) => {
        setSchedule(data);
      })
      .finally(() => {
        setLoadingSchedule(false);
      });
  }, [movieSlug, selectedDateStr, selectedRegion, isComingSoonMovie]);

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -140, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 140, behavior: 'smooth' });
    }
  };

  const handleShowtimeClick = (targetUrl: string) => {
    router.push(targetUrl);
  };

  const regionOptions = ['Toàn quốc', 'Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ'];
  
  // Compute distinct cinemas from the schedule to populate the cinema filter dropdown
  const cinemaFilterOptions = useMemo(() => {
    const names = new Set(schedule.map(c => c.cinemaName));
    return ['Tất cả rạp', ...Array.from(names)];
  }, [schedule]);

  const filteredSchedule = useMemo(() => {
    if (selectedCinemaFilter === 'Tất cả rạp') return schedule;
    return schedule.filter(c => c.cinemaName === selectedCinemaFilter);
  }, [schedule, selectedCinemaFilter]);

  return (
    <div
      id="showtime-schedule"
      className="w-full flex flex-col gap-6 pt-2"
    >
      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-[#131413] flex items-center gap-2">
        <span className="w-1.5 h-6 bg-[#7C6FE8] rounded-full inline-block" />
        <span>Lịch Chiếu</span>
      </h2>

      {isComingSoonMovie ? (
        /* Coming Soon Notice Card */
        <div className="w-full p-8 rounded-3xl bg-amber-50/80 border border-amber-200 text-center flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shadow-md">
            <Bell className="w-7 h-7 animate-bounce" />
          </div>
          <h3 className="font-extrabold text-base text-amber-900">
            Phim Sắp Khởi Chiếu - Chưa Mở Bán Vé Trực Tuyến
          </h3>
          <p className="text-xs text-amber-700 max-w-md leading-relaxed font-medium">
            Bộ phim này hiện đang ở trạng thái sắp khởi chiếu và chưa mở bán suất chiếu. Vui lòng bấm đăng ký để nhận thông báo mở bán vé sớm nhất từ CineDot!
          </p>
          <button
            onClick={() => setIsNotified(true)}
            className={`px-6 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              isNotified
                ? 'bg-emerald-600 text-white'
                : 'bg-[#7C6FE8] hover:bg-[#685bc7] text-white shadow-md shadow-[#7C6FE8]/30'
            }`}
          >
            {isNotified ? '✓ ĐÃ ĐĂNG KÝ NHẬN THÔNG BÁO' : '🔔 NHẬN THÔNG BÁO MỞ BÁN VÉ'}
          </button>
        </div>
      ) : (
        <>
          {/* Top Toolbar Bar */}
          <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 relative z-30">
            {/* Left: Date Selector Carousel */}
            <div className="flex items-center gap-1.5 shrink-0 max-w-full">
              <button
                onClick={handleScrollLeft}
                className="w-8 h-8 rounded-lg border border-gray-200 hover:border-[#7C6FE8] text-slate-500 hover:text-[#7C6FE8] flex items-center justify-center transition-colors cursor-pointer shrink-0 z-10 bg-white shadow-2xs"
                title="Ngày trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div
                ref={scrollRef}
                className="overflow-x-auto scrollbar-none py-1 flex items-center gap-2 max-w-[270px] sm:max-w-[340px] md:max-w-[380px] scroll-smooth"
              >
                {dateOptions.map((d) => {
                  const isActive = d.dateStr === selectedDateStr;
                  return (
                    <button
                      key={d.dateStr}
                      onClick={() => setSelectedDateStr(d.dateStr)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex flex-col items-center gap-0.5 transition-all shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-[#7C6FE8] text-white shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-gray-200'
                      }`}
                    >
                      <span>{d.displayDay}</span>
                      <span className="text-[11px] font-semibold">{d.displayDate}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleScrollRight}
                className="w-8 h-8 rounded-lg border border-gray-200 hover:border-[#7C6FE8] text-slate-500 hover:text-[#7C6FE8] flex items-center justify-center transition-colors cursor-pointer shrink-0 z-10 bg-white shadow-2xs"
                title="Ngày tiếp theo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Region & Cinema Dropdowns */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative w-36 sm:w-40">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'region' ? null : 'region')}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 hover:border-[#7C6FE8] text-slate-700 font-semibold text-xs flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="truncate">{selectedRegion}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                <AnimatePresence>
                  {openDropdown === 'region' && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute right-0 top-full mt-1.5 w-full bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-[100] overflow-hidden"
                    >
                      {regionOptions.map((reg) => (
                        <button
                          key={reg}
                          onClick={() => {
                            setSelectedRegion(reg);
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-[#7C6FE8]/10 hover:text-[#7C6FE8] transition-colors"
                        >
                          {reg}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative w-40 sm:w-44">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'cinema' ? null : 'cinema')}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 hover:border-[#7C6FE8] text-slate-700 font-semibold text-xs flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="truncate">{selectedCinemaFilter}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                <AnimatePresence>
                  {openDropdown === 'cinema' && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute right-0 top-full mt-1.5 w-full bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-[100] overflow-hidden"
                    >
                      {cinemaFilterOptions.map((cinema) => (
                        <button
                          key={cinema}
                          onClick={() => {
                            setSelectedCinemaFilter(cinema);
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-[#7C6FE8]/10 hover:text-[#7C6FE8] transition-colors truncate"
                        >
                          {cinema}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Cinema Cards Section */}
          <div className="flex flex-col gap-8 pt-2 relative min-h-[300px]">
            {loadingSchedule ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                <Loader2 className="w-8 h-8 text-[#7C6FE8] animate-spin" />
              </div>
            ) : filteredSchedule.length === 0 ? (
              <div className="w-full py-12 flex flex-col items-center justify-center text-slate-500 gap-3">
                <p className="text-sm font-semibold">Không tìm thấy suất chiếu nào phù hợp.</p>
                <p className="text-xs">Vui lòng chọn ngày hoặc rạp khác.</p>
              </div>
            ) : (
              filteredSchedule.map((cinema) => (
                <div key={cinema.cinemaId} className="flex flex-col gap-4">
                  <h3 className="font-bold text-base text-[#131413]">{cinema.cinemaName}</h3>

                  <div className="flex flex-col gap-4">
                    {cinema.formatGroups.map((group, gIdx) => (
                      <div
                        key={gIdx}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                      >
                        <div className="sm:col-span-4 text-xs font-semibold text-slate-600 leading-snug">
                          {group.formatName}
                        </div>

                        <div className="sm:col-span-8 flex flex-wrap gap-2.5">
                          {group.showtimes.map((st) => {
                            const targetUrl = `/booking/seats?movie=${movieSlug}&showtime_id=${st.id}&date=${selectedDateStr}&time=${st.time}&cinema=${encodeURIComponent(
                              cinema.cinemaName
                            )}`;

                            return (
                              <button
                                key={st.id}
                                onClick={() => handleShowtimeClick(targetUrl)}
                                className="w-20 py-2 rounded-lg bg-white hover:bg-[#7C6FE8] text-slate-700 hover:text-white border border-gray-200 hover:border-[#7C6FE8] font-bold text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                              >
                                {st.time}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};
