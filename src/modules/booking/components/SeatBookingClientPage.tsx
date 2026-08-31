/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · genre: modern-minimal · macrostructure: Workbench · theme: White Minimal · component: SeatBookingClientPage */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSeatBooking } from '../hooks/useSeatBooking';
import { BookingStepWizard } from './BookingStepWizard';
import { SeatBookingHeader, SiblingShowtimeItem } from './SeatBookingHeader';
import { SeatLegend } from './SeatLegend';
import { CinemaScreen } from './CinemaScreen';
import { SeatGrid } from './SeatGrid';
import { BookingSidebar } from './BookingSidebar';
import { BookingSummaryBar } from './BookingSummaryBar';
import { SeatTimeoutModal } from './SeatTimeoutModal';
import { ExpiredShowtimeModal } from './ExpiredShowtimeModal';
import { Skeleton } from '@/shared/ui/Skeleton';
import { hasActiveBookingTimer, resetBookingTimer } from '../services/bookingTimerService';
import { seatBookingService } from '../services/seat-booking.service';
import { getBookingSession } from '../services/bookingSessionService';

interface SeatBookingClientPageProps {
  showtimeId: string;
  movieParam?: string;
  initialSeatsParam?: string;
  dateParam?: string;
  timeParam?: string;
  cinemaParam?: string;
}

export function SeatBookingClientPage({
  showtimeId,
  movieParam,
  initialSeatsParam,
  dateParam,
  timeParam,
  cinemaParam,
}: SeatBookingClientPageProps) {
  const router = useRouter();

  const {
    bookingInfo,
    seats,
    seatTypes,
    selectedSeatIds,
    otherSelectingSeatIds,
    toggleSelectSeat,
    selectedSeats,
    totalPrice,
    formattedCountdown,
    isTimeout,
    isExpiredShowtime,
    loading,
    isHolding,
    holdError,
    handleHoldSeats,
  } = useSeatBooking(showtimeId, movieParam, initialSeatsParam, dateParam, timeParam, cinemaParam);

  const [isTimerActive, setIsTimerActive] = useState<boolean>(() => {
    const session = getBookingSession(showtimeId);
    return Boolean(session?.bookingId) && hasActiveBookingTimer(showtimeId);
  });
  const [currentShowTime, setCurrentShowTime] = useState('19:30');
  const [siblingShowtimes, setSiblingShowtimes] = useState<SiblingShowtimeItem[]>([]);

  useEffect(() => {
    const session = getBookingSession(showtimeId);
    if (!session?.bookingId) {
      resetBookingTimer(showtimeId);
      setIsTimerActive(false);
    }
  }, [showtimeId]);


  useEffect(() => {
    if (bookingInfo) {
      setCurrentShowTime(bookingInfo.showTime);

      seatBookingService
        .fetchSiblingShowtimes(
          bookingInfo.movieSlug || movieParam || '1',
          bookingInfo.showDate || dateParam,
          bookingInfo.cinemaName || cinemaParam
        )
        .then((items) => {
          if (items.length > 0) {
            setSiblingShowtimes(items);
          }
        })
        .catch(() => {});
    }
  }, [bookingInfo, movieParam, dateParam, cinemaParam]);

  const handleSelectSiblingShowtime = (item: SiblingShowtimeItem) => {
    if (item.id === showtimeId) return;
    const targetUrl = `/booking/seats?showtime_id=${item.id}&movie=${movieParam || bookingInfo?.movieSlug || ''}&date=${dateParam || bookingInfo?.showDate || ''}&time=${item.time}&cinema=${encodeURIComponent(cinemaParam || bookingInfo?.cinemaName || '')}`;
    router.push(targetUrl);
  };


  if (loading || !bookingInfo) {
    return (
      <div className="w-full pt-28 pb-20 bg-[#FAFAFB] min-h-screen">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 flex flex-col gap-8">
          <Skeleton variant="card" className="w-full h-14 rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <Skeleton variant="card" className="w-full h-[480px] rounded-3xl" />
            </div>
            <div className="lg:col-span-4">
              <Skeleton variant="card" className="w-full h-96 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col font-sans bg-[#FAFAFB] text-gray-900 min-h-screen pt-24 sm:pt-28 pb-24 selection:bg-[#7C6FE8] selection:text-white relative">
      {/* Main 2-Column Workbench Layout */}
      <main className="w-full">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-4 sm:py-6">
          {/* Slim Horizontal Booking Step Wizard Ribbon */}
          <BookingStepWizard
            currentStep={2}
            showtimeId={showtimeId}
            movieSlug={bookingInfo.movieSlug || movieParam}
            movieTitle={bookingInfo.movieTitle}
            dateParam={bookingInfo.showDate || dateParam}
            timeParam={currentShowTime}
            cinemaParam={bookingInfo.cinemaName || cinemaParam}
            seatsParam={selectedSeats.map((s) => s.id).join(',')}
            className="mb-6"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left Column: 68% Width (lg:col-span-8 - Seat Map & Screen Workspace) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Interactive Quick Showtime Switcher */}
              <SeatBookingHeader
                currentShowTime={currentShowTime}
                currentShowtimeId={showtimeId}
                showtimes={siblingShowtimes}
                onSelectShowTime={handleSelectSiblingShowtime}
              />

              {/* Main Seat Map White Card */}
              <div className="w-full bg-white rounded-3xl p-5 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.05)] border border-gray-200/90 flex flex-col gap-6 items-center">
                {/* Cinema Screen Curved LED */}
                <CinemaScreen />

                {/* Seat Grid Map */}
                <SeatGrid
                  seats={seats}
                  selectedSeatIds={selectedSeatIds}
                  otherSelectingSeatIds={otherSelectingSeatIds}
                  onToggleSeat={toggleSelectSeat}
                />

                {/* Seat Legend & Dynamic Price Tariff Bar */}
                <SeatLegend
                  seatTypes={seatTypes}
                  seats={seats}
                  basePrice={bookingInfo?.basePrice || 110000}
                />
              </div>
            </div>

            {/* Right Column: 32% Width (lg:col-span-4 - Booking Summary Sidebar) */}
            <div className="lg:col-span-4 hidden lg:block sticky top-28">
              <BookingSidebar
                info={bookingInfo}
                currentShowTime={currentShowTime}
                selectedSeats={selectedSeats}
                totalPrice={totalPrice}
                isTimerActive={isTimerActive}
                formattedCountdown={formattedCountdown}
                isHolding={isHolding}
                holdError={holdError}
                onHoldSeats={handleHoldSeats}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Floating Bottom Bar (Screens < lg) */}
      <div className="block lg:hidden">
        <BookingSummaryBar
          selectedSeatLabels={selectedSeats.map((s) => s.id).join(', ')}
          selectedCount={selectedSeats.length}
          totalPrice={totalPrice}
          showtimeId={showtimeId}
        />
      </div>

      {/* 3. Seat Timeout Expiration Alert Modal */}
      <SeatTimeoutModal
        isOpen={isTimeout}
        movieSlug={bookingInfo.movieSlug}
        onReset={() => resetBookingTimer(showtimeId)}
      />

      {/* 4. Expired Showtime Guard Modal */}
      <ExpiredShowtimeModal
        isOpen={isExpiredShowtime}
        movieSlug={bookingInfo.movieSlug}
        showTime={bookingInfo.showTime || currentShowTime}
        showDate={bookingInfo.showDate || dateParam}
        siblingShowtimes={siblingShowtimes}
        onSelectSiblingShowtime={handleSelectSiblingShowtime}
      />
    </div>
  );
}


