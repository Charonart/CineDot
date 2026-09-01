'use client';

import React, { useState } from 'react';
import {
  CinemaItem,
  PricingFormatTab,
  CinemaPricingFormat,
  CinemaMovieShowtime,
} from '../types/cinemas.types';
import { CinemaPricingTable } from './CinemaPricingTable';
import { CinemaShowtimesSection } from './CinemaShowtimesSection';
import { CinemaAmenities } from './CinemaAmenities';
import { fetchPricingFormat, fetchCinemaShowtimes } from '../services/cinemas.service';

interface CinemaDetailClientProps {
  cinema: CinemaItem;
  initialShowtimes: CinemaMovieShowtime[];
  initialPricingFormat: CinemaPricingFormat;
}

export function CinemaDetailClient({
  cinema,
  initialShowtimes,
  initialPricingFormat,
}: CinemaDetailClientProps) {
  const [activeTab, setActiveTab] = useState<PricingFormatTab>('2d');
  const [pricingFormat, setPricingFormat] = useState<CinemaPricingFormat>(initialPricingFormat);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [showtimes, setShowtimes] = useState<CinemaMovieShowtime[]>(initialShowtimes);
  const [loadingShowtimes, setLoadingShowtimes] = useState<boolean>(false);

  const handleSelectTab = async (tab: PricingFormatTab) => {
    setActiveTab(tab);
    try {
      const data = await fetchPricingFormat(tab);
      if (data) setPricingFormat(data);
    } catch {
      // Fallback
    }
  };

  const handleSelectDate = async (date: string) => {
    setSelectedDate(date);
    setLoadingShowtimes(true);
    try {
      const data = await fetchCinemaShowtimes(cinema.slug, date);
      setShowtimes(data);
    } finally {
      setLoadingShowtimes(false);
    }
  };

  return (
    <>
      {/* 1. Ticket Pricing Table */}
      <section aria-labelledby="pricing-table-heading" className="w-full">
        <h2 id="pricing-table-heading" className="sr-only">
          Bảng giá vé rạp {cinema.name}
        </h2>
        <CinemaPricingTable
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          pricingFormat={pricingFormat}
        />
      </section>

      {/* 2. Showtime Schedule Section */}
      <section aria-labelledby="showtimes-heading" className="w-full">
        <h2 id="showtimes-heading" className="sr-only">
          Lịch chiếu phim tại {cinema.name}
        </h2>
        <CinemaShowtimesSection
          cinemaName={cinema.name}
          showtimes={showtimes}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          loading={loadingShowtimes}
        />
      </section>

      {/* 3. Cinema Amenities & Features */}
      <section aria-labelledby="amenities-heading" className="w-full">
        <h2 id="amenities-heading" className="sr-only">
          Tiện ích tại {cinema.name}
        </h2>
        <CinemaAmenities />
      </section>
    </>
  );
}