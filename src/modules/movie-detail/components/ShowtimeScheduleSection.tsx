'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, Bell, Loader2, MapPin, Film, Building2 } from 'lucide-react';
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
    if (!isAuthenticated) {
      openAuthModal('login', 'Vui lòng đăng nhập tài khoản để chọn ghế và đặt vé trực tuyến.', targetUrl);
      return;
    }
    router.push(targetUrl);
  };

  const regionOptions = ['Toàn quốc', 'Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ'];
  
  const cinemaFilterOptions = useMemo(() => {
    const names = new Set(schedule.map(c => c.cinemaName));
    return ['Tất cả rạp', ...Array.from(names)];
  }, [schedule]);

  const filteredSchedule = useMemo(() => {
    if (selectedCinemaFilter === 'Tất cả rạp') return schedule;
    return schedule.filter(c => c.cinemaName === selectedCinemaFilter);
  }, [schedule, selectedCinemaFilter]);

  return (
    <div id="showtime-schedule" className="w-full flex flex-col gap-6 pt-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-950 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-[#7C6FE8] rounded-full inline-block" />
          <span>Lịch Chiếu Phim</span>
        </h2>
      </div>

      {isComingSoonMovie ? (
        /* Coming Soon Notice Card */
        <div className="w-full p-8 sm:p-10 rounded-3xl bg-amber-50/90 border border-amber-200 text-center flex flex-col items-center gap-3 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shadow-xs">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-amber-950">
            Phim Sắp Khởi Chiếu — Chưa Mở Bán Vé Trực Tuyến
          </h3>
          <p className="text-xs text-amber-800 max-w-md leading-relaxed font-medium">
            Bộ phim này hiện đang ở trạng thái sắp khởi chiếu. Quý khách vui lòng bấm nút nhận thông báo để được cập nhật lịch chiếu sớm nhất!
          </p>
          <button
            type="button"
            onClick={() => setIsNotified(true)}
            className={`px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              isNotified
                ? 'bg-emerald-600 text-white'
                : 'bg-[#7C6FE8] hover:bg-[#685bc7] text-white shadow-sm'
            }`}
          >
            {isNotified ? '✓ ĐÃ ĐĂNG KÝ NHẬN THÔNG BÁO' : 'NHẬN THÔNG BÁO KHI MỞ BÁN'}
          </button>
        </div>
      ) : (
        <>
          {/* Top Toolbar Bar - Date Selector & Dropdown Filters */}
          <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 sm:p-2.5 rounded-2xl bg-white border border-gray-200/90 shadow-sm relative z-30">
            {/* Left: Date Selector Carousel */}
            <div className="flex items-center gap-1 shrink-0 max-w-full">
              <button
                type="button"
                onClick={handleScrollLeft}
                className="w-7 h-7 rounded-lg border border-gray-200 hover:border-[#7C6FE8] text-gray-500 hover:text-[#7C6FE8] flex items-center justify-center transition-colors cursor-pointer shrink-0 z-10 bg-white shadow-2xs"
                title="Ngày trước"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div
                ref={scrollRef}
                className="overflow-x-auto scrollbar-none py-0.5 flex items-center gap-1.5 max-w-[240px] sm:max-w-[300px] md:max-w-[340px] scroll-smooth"
              >
                {dateOptions.map((d) => {
                  const isActive = d.dateStr === selectedDateStr;
                  return (
                    <button
                      key={d.dateStr}
                      type="button"
                      onClick={() => setSelectedDateStr(d.dateStr)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex flex-col items-center gap-0.5 transition-all shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-[#7C6FE8] text-white shadow-sm'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200/70'
                      }`}
                    >
                      <span className="text-[11px]">{d.displayDay}</span>
                      <span className="text-[10px] font-semibold opacity-90">{d.displayDate}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleScrollRight}
                className="w-7 h-7 rounded-lg border border-gray-200 hover:border-[#7C6FE8] text-gray-500 hover:text-[#7C6FE8] flex items-center justify-center transition-colors cursor-pointer shrink-0 z-10 bg-white shadow-2xs"
                title="Ngày tiếp theo"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Separator Divider */}
            <div className="hidden sm:block w-[1px] h-6 bg-gray-200 self-center mx-0.5" />

            {/* Right: Region & Cinema Dropdowns */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative w-32 sm:w-36">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'region' ? null : 'region')}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 hover:border-[#7C6FE8] text-gray-800 font-semibold text-xs flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0" />
                    <span className="truncate">{selectedRegion}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
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
                          type="button"
                          onClick={() => {
                            setSelectedRegion(reg);
                            setOpenDropdown(null);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors ${
                            selectedRegion === reg ? 'bg-[#7C6FE8] text-white' : 'text-gray-700 hover:bg-purple-50 hover:text-[#7C6FE8]'
                          }`}
                        >
                          {reg}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative w-36 sm:w-44">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'cinema' ? null : 'cinema')}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 hover:border-[#7C6FE8] text-gray-800 font-semibold text-xs flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Building2 className="w-3.5 h-3.5 text-[#7C6FE8] shrink-0" />
                    <span className="truncate">{selectedCinemaFilter}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
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
                          type="button"
                          onClick={() => {
                            setSelectedCinemaFilter(cinema);
                            setOpenDropdown(null);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors truncate ${
                            selectedCinemaFilter === cinema ? 'bg-[#7C6FE8] text-white' : 'text-gray-700 hover:bg-purple-50 hover:text-[#7C6FE8]'
                          }`}
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
          <div className="flex flex-col gap-5 pt-2 relative min-h-[240px]">
            {loadingSchedule ? (
              <div className="py-16 flex items-center justify-center gap-2 text-gray-500 text-xs">
                <Loader2 className="w-5 h-5 text-[#7C6FE8] animate-spin" />
                <span>Đang tải lịch chiếu...</span>
              </div>
            ) : filteredSchedule.length === 0 ? (
              <div className="w-full py-14 bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-500 gap-2 text-center">
                <Film className="w-8 h-8 text-gray-400" />
                <p className="text-sm font-bold text-gray-900">Không tìm thấy suất chiếu nào phù hợp</p>
                <p className="text-xs text-gray-500">Quý khách vui lòng chọn ngày khác hoặc cụm rạp lân cận.</p>
              </div>
            ) : (
              filteredSchedule.map((cinema) => (
                <div
                  key={cinema.cinemaId}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200/80 shadow-sm flex flex-col gap-4"
                >
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <MapPin className="w-4 h-4 text-[#7C6FE8]" />
                    <h3 className="font-extrabold text-sm sm:text-base text-gray-950">
                      {cinema.cinemaName}
                    </h3>
                  </div>

                  <div className="flex flex-col gap-4">
                    {cinema.formatGroups.map((group, gIdx) => (
                      <div
                        key={gIdx}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                      >
                        <div className="sm:col-span-4 text-xs font-bold text-gray-700 leading-snug">
                          {group.formatName}
                        </div>

                        <div className="sm:col-span-8 flex flex-wrap gap-2">
                          {group.showtimes.map((st) => {
                            const targetUrl = `/booking/seats?movie=${movieSlug}&showtime_id=${st.id}&date=${selectedDateStr}&time=${st.time}&cinema=${encodeURIComponent(
                              cinema.cinemaName
                            )}`;

                            return (
                              <button
                                key={st.id}
                                type="button"
                                onClick={() => handleShowtimeClick(targetUrl)}
                                className="w-20 py-2 rounded-xl bg-gray-50 hover:bg-[#7C6FE8] text-gray-800 hover:text-white border border-gray-200 hover:border-transparent font-bold text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
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
