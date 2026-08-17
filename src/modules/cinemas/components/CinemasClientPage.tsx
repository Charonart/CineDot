'use client';

import React from 'react';
import { useCinemas } from '../hooks/useCinemas';
import { CinemaSidebar } from './CinemaSidebar';
import { CinemaDetailHeader } from './CinemaDetailHeader';
import { CinemaPricingTable } from './CinemaPricingTable';
import { CinemaShowtimesSection } from './CinemaShowtimesSection';
import { CinemaAmenities } from './CinemaAmenities';
import { Skeleton } from '@/shared/ui/Skeleton';

export function CinemasClientPage() {
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

  return (
    <div className="w-full flex flex-col font-sans bg-[#FEFEFE] text-[#131413] min-h-screen pt-28 pb-20 selection:bg-[#7C6FE8] selection:text-white">
      <main className="w-full">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
          {/* Header Title */}
          <div className="flex flex-col gap-2 mb-8">
            <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-widest">
              HỆ THỐNG CỤM RẠP CINEDOT
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#131413]">
              Rạp Chiếu Phim & Bảng Giá Vé
            </h1>
          </div>

          {/* Asymmetric 2-Column Dashboard Grid: 320px Left / Remainder Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cinema Selector Sidebar (lg:col-span-4 - 320px) */}
            <div className="lg:col-span-4">
              <CinemaSidebar
                cities={cities}
                selectedCity={selectedCity}
                onSelectCity={setSelectedCity}
                cinemas={cinemas}
                selectedCinema={selectedCinema}
                onSelectCinema={setSelectedCinema}
              />
            </div>

            {/* Right Column: Premium Cinema Details & Pricing (lg:col-span-8) */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              {loading || !selectedCinema ? (
                <div className="flex flex-col gap-6">
                  <Skeleton variant="card" className="w-full h-[300px] rounded-3xl" />
                  <Skeleton variant="card" className="w-full h-[200px] rounded-2xl" />
                </div>
              ) : (
                <>
                  {/* 1. Cinema Header Banner & Info */}
                  <CinemaDetailHeader cinema={selectedCinema} />

                  {/* 2. Modern Ticket Price Table */}
                  <CinemaPricingTable
                    activeTab={pricingTab}
                    onSelectTab={setPricingTab}
                    pricingFormat={pricingFormat}
                  />

                  {/* 3. Live Cinema Showtimes */}
                  <div id="cinema-showtimes">
                    <CinemaShowtimesSection
                      cinemaName={selectedCinema.name}
                      showtimes={showtimes}
                      selectedDate={showtimeDate}
                      onSelectDate={setShowtimeDate}
                      loading={loadingShowtimes}
                    />
                  </div>

                  {/* 4. Premium Amenities */}
                  <CinemaAmenities />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
