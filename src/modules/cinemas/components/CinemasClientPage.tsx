'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCinemas } from '../hooks/useCinemas';
import { CinemaBranchSwitcher } from './CinemaBranchSwitcher';
import { CinemaDetailHeader } from './CinemaDetailHeader';
import { CinemaShowtimesSection } from './CinemaShowtimesSection';
import { CinemaPricingTable } from './CinemaPricingTable';
import { CinemaRoomsSection } from './CinemaRoomsSection';
import { CinemaLocationAmenities } from './CinemaLocationAmenities';
import { Skeleton } from '@/shared/ui/Skeleton';

type CinemaTabType = 'showtimes' | 'pricing' | 'rooms' | 'location';

export function CinemasClientPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlTab = (searchParams ? searchParams.get('tab') : null) as CinemaTabType | null;

  const [activeTab, setActiveTab] = useState<CinemaTabType>(
    urlTab && ['showtimes', 'pricing', 'rooms', 'location'].includes(urlTab)
      ? urlTab
      : 'showtimes'
  );

  const {
    cities,
    selectedCity,
    setSelectedCity,
    cinemas,
    selectedCinema,
    setSelectedCinema,
    pricingTab,
    setPricingTab,
    pricingFormat,
    showtimes,
    showtimeDate,
    setShowtimeDate,
    loading,
    loadingShowtimes,
  } = useCinemas();

  const handleTabChange = (tab: CinemaTabType) => {
    setActiveTab(tab);
    // Smooth scroll down to tab content if needed
    const el = document.getElementById('cinema-command-center');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const tabs: { id: CinemaTabType; label: string; count?: number }[] = [
    { id: 'showtimes', label: 'Lịch Chiếu Phim' },
    { id: 'pricing', label: 'Bảng Giá Vé' },
    {
      id: 'rooms',
      label: 'Hệ Thống Phòng Chiếu',
      count: selectedCinema?.rooms?.length,
    },
    { id: 'location', label: 'Vị Trí & Tiện Ích' },
  ];

  return (
    <div className="w-full flex flex-col font-sans bg-[#FAFAFB] text-slate-900 min-h-screen pt-28 pb-20 selection:bg-[#7C6FE8] selection:text-white">
      <main className="w-full">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
          {/* 1. Page Header */}
          <div className="flex flex-col gap-1.5 pb-4 border-b border-slate-200/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7C6FE8]">
              Hệ Thống Rạp Chiếu Phim Toàn Quốc
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Cụm Rạp & Bảng Giá Vé CineDot
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl">
              Khám phá hệ thống rạp tiêu chuẩn quốc tế, công nghệ màn chiếu Laser Christie 4K, âm thanh Dolby Atmos và biểu giá vé niêm yết
            </p>
          </div>

          {/* 2. Top Branch Switcher (Horizontal City Filters & Cinema Carousel) */}
          <CinemaBranchSwitcher
            cities={cities}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            cinemas={cinemas}
            selectedCinema={selectedCinema}
            onSelectCinema={setSelectedCinema}
          />

          {loading || !selectedCinema ? (
            <div className="flex flex-col gap-6 w-full">
              <Skeleton variant="card" className="w-full h-[320px] rounded-3xl" />
              <div className="grid grid-cols-4 gap-3">
                <Skeleton variant="card" className="w-full h-14 rounded-2xl" />
                <Skeleton variant="card" className="w-full h-14 rounded-2xl" />
                <Skeleton variant="card" className="w-full h-14 rounded-2xl" />
                <Skeleton variant="card" className="w-full h-14 rounded-2xl" />
              </div>
              <Skeleton variant="card" className="w-full h-[380px] rounded-3xl" />
            </div>
          ) : (
            <div className="flex flex-col gap-7 w-full">
              {/* 3. Cinema Showcase Masthead */}
              <CinemaDetailHeader
                cinema={selectedCinema}
                onSelectTab={(tab) => handleTabChange(tab as CinemaTabType)}
              />

              {/* 4. Segmented Cinema Command Center (Sticky Tab Bar) */}
              <div
                id="cinema-command-center"
                className="w-full sticky top-20 z-30 pt-2 pb-2 bg-[#FAFAFB]/95 backdrop-blur-md"
              >
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-x-auto scrollbar-none">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => handleTabChange(tab.id)}
                        className={`flex-1 min-w-[140px] sm:min-w-0 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          isActive
                            ? 'bg-slate-900 text-white shadow-xs font-extrabold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                        }`}
                      >
                        <span>{tab.label}</span>
                        {tab.count !== undefined && tab.count > 0 && (
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {tab.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Active View Canvas */}
              <div className="w-full min-h-[450px]">
                <AnimatePresence mode="wait">
                  {activeTab === 'showtimes' && (
                    <motion.div
                      key="showtimes"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CinemaShowtimesSection
                        cinemaName={selectedCinema.name}
                        showtimes={showtimes}
                        selectedDate={showtimeDate}
                        onSelectDate={setShowtimeDate}
                        loading={loadingShowtimes}
                      />
                    </motion.div>
                  )}

                  {activeTab === 'pricing' && (
                    <motion.div
                      key="pricing"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CinemaPricingTable
                        activeTab={pricingTab}
                        onSelectTab={setPricingTab}
                        pricingFormat={pricingFormat}
                      />
                    </motion.div>
                  )}

                  {activeTab === 'rooms' && (
                    <motion.div
                      key="rooms"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CinemaRoomsSection
                        rooms={selectedCinema.rooms || []}
                        cinemaName={selectedCinema.name}
                      />
                    </motion.div>
                  )}

                  {activeTab === 'location' && (
                    <motion.div
                      key="location"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CinemaLocationAmenities cinema={selectedCinema} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
