'use client';

import React, { useState, useEffect } from 'react';
import { useSeatBooking } from '../hooks/useSeatBooking';
import { BookingStepWizard } from './BookingStepWizard';
import { SeatBookingHeader } from './SeatBookingHeader';
import { SeatLegend } from './SeatLegend';
import { CinemaScreen } from './CinemaScreen';
import { SeatGrid } from './SeatGrid';
import { BookingSidebar } from './BookingSidebar';
import { SeatTimeoutModal } from './SeatTimeoutModal';
import { Skeleton } from '@/shared/ui/Skeleton';
import { hasActiveBookingTimer, resetBookingTimer } from '../services/bookingTimerService';

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
  const {
    bookingInfo,
    seats,
    selectedSeatIds,
    toggleSelectSeat,
    selectedSeats,
    totalPrice,
    formattedCountdown,
    isTimeout,
    loading,
    isHolding,
    holdError,
    handleHoldSeats,
  } = useSeatBooking(showtimeId, movieParam, initialSeatsParam, dateParam, timeParam, cinemaParam);

  const [isTimerActive, setIsTimerActive] = useState<boolean>(() => hasActiveBookingTimer(showtimeId));
  const [currentShowTime, setCurrentShowTime] = useState('19:30');

  useEffect(() => {
    if (bookingInfo) {
      setCurrentShowTime(bookingInfo.showTime);
    }
  }, [bookingInfo]);

  if (loading || !bookingInfo) {
    return (
      <div className="w-full pt-28 pb-20 bg-[#FEFEFE] min-h-screen">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 flex flex-col gap-8">
          <Skeleton variant="card" className="w-full h-14 rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <Skeleton variant="card" className="w-full h-[450px] rounded-3xl" />
            </div>
            <div className="lg:col-span-4">
              <Skeleton variant="card" className="w-full h-96 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedSeatIdsStr = selectedSeatIds.join(',');

  return (
    <div className="w-full flex flex-col font-sans bg-[#FEFEFE] text-[#131413] min-h-screen pt-24 pb-20 selection:bg-[#7C6FE8] selection:text-white relative">
      {/* 1. Step Progress Wizard Bar */}
      <BookingStepWizard currentStep={2} />

      {/* 2. Main 2-Column Container */}
      <main className="w-full">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: 68% Width (lg:col-span-8 - Seat Map & Screen) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Interactive Quick Showtime Switcher */}
              <SeatBookingHeader
                currentShowTime={currentShowTime}
                onSelectShowTime={(newTime) => setCurrentShowTime(newTime)}
              />

              {/* Main Seat Map White Card */}
              <div className="w-full bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 shadow-[0_16px_50px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col gap-6 items-center">
                {/* Cinema Screen Curved LED */}
                <CinemaScreen />

                {/* Seat Grid A1-J12 */}
                <SeatGrid
                  seats={seats}
                  selectedSeatIds={selectedSeatIds}
                  onToggleSeat={toggleSelectSeat}
                />

                {/* Seat Legend & Price Tariff Bar */}
                <SeatLegend />
              </div>
            </div>

            {/* Right Column: 32% Width (lg:col-span-4 - Booking Summary Sidebar) */}
            <div className="lg:col-span-4">
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

      {/* 4. Seat Timeout Expiration Modal Popup */}
      <SeatTimeoutModal
        isOpen={isTimeout}
        movieSlug={bookingInfo.movieSlug}
        onReset={() => resetBookingTimer(showtimeId)}
      />
    </div>
  );
}
