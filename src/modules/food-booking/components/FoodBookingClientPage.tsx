/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · genre: modern-minimal · macrostructure: Workbench · theme: White Minimal · component: FoodBookingClientPage */
'use client';

import React from 'react';
import { Popcorn, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useFoodBooking } from '../hooks/useFoodBooking';
import { BookingStepWizard } from '@/modules/booking/components/BookingStepWizard';
import { FoodItemCard } from './FoodItemCard';
import { FoodBookingSidebar } from './FoodBookingSidebar';
import { SeatTimeoutModal } from '@/modules/booking/components/SeatTimeoutModal';
import { Skeleton } from '@/shared/ui/Skeleton';
import { resetBookingTimer } from '@/modules/booking/services/bookingTimerService';

interface FoodBookingClientPageProps {
  initialCombo?: string;
  combosParam?: string;
  showtimeId?: string;
  movieParam?: string;
  seatsParam?: string;
  dateParam?: string;
  timeParam?: string;
  cinemaParam?: string;
}

export function FoodBookingClientPage({
  initialCombo,
  combosParam,
  showtimeId = 'showtime-101',
  movieParam = 'spiderman-new-beginning',
  seatsParam,
  dateParam,
  timeParam,
  cinemaParam,
}: FoodBookingClientPageProps) {
  const {
    foodItems,
    quantities,
    updateQuantity,
    selectedFoodList,
    totalFoodPrice,
    formattedCountdown,
    isTimeout,
    loading,
  } = useFoodBooking(initialCombo, showtimeId, combosParam);

  const paymentHref = `/booking/payment?showtime_id=${showtimeId}&movie=${movieParam}&seats=${seatsParam}&date=${dateParam}&time=${timeParam}&cinema=${encodeURIComponent(
    cinemaParam || ''
  )}`;

  if (loading) {
    return (
      <div className="w-full pt-28 pb-20 bg-[#FAFAFB] min-h-screen">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 flex flex-col gap-8">
          <Skeleton variant="card" className="w-full h-14 rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <Skeleton variant="card" className="w-full h-40 rounded-3xl" />
              <Skeleton variant="card" className="w-full h-40 rounded-3xl" />
              <Skeleton variant="card" className="w-full h-40 rounded-3xl" />
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
    <div className="w-full flex flex-col font-sans bg-[#FAFAFB] text-gray-900 min-h-screen pt-24 sm:pt-28 pb-24 selection:bg-[#7C6FE8] selection:text-white">
      {/* Main 2-Column Workbench Container */}
      <main className="w-full">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-4 sm:py-6">
          {/* Slim Horizontal Booking Step Wizard Ribbon */}
          <BookingStepWizard
            currentStep={3}
            showtimeId={showtimeId}
            movieSlug={movieParam}
            seatsParam={seatsParam}
            dateParam={dateParam}
            timeParam={timeParam}
            cinemaParam={cinemaParam}
            className="mb-6"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left Column: 68% Width (Food Items List) */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {/* Compact Sleek Header with Direct Skip Action */}
              <div className="flex items-center justify-between pb-1 border-b border-gray-200/80">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-base sm:text-lg font-black text-gray-950 tracking-tight flex items-center gap-2">
                    <Popcorn className="w-4 h-4 text-[#7C6FE8]" />
                    <span>Combo Bắp Nước</span>
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-extrabold border border-emerald-200/80">
                    Tiết kiệm tới 25%
                  </span>
                </div>

                <Link href={paymentHref}>
                  <button
                    type="button"
                    className="text-xs font-bold text-gray-500 hover:text-[#7C6FE8] flex items-center gap-1 transition-colors px-3 py-1.5 rounded-xl hover:bg-gray-100 cursor-pointer"
                  >
                    <span>Bỏ qua bước này</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>

              {/* Food Items 2-Column Grid (Compact & Dense) */}
              {foodItems.length === 0 ? (
                <div className="w-full py-12 px-6 rounded-2xl bg-white border border-dashed border-gray-200 flex flex-col items-center justify-center gap-2.5 text-center shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-[#EEECFB] flex items-center justify-center text-[#7C6FE8]">
                    <Popcorn className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Chưa có combo bắp nước khả dụng
                  </h3>
                  <p className="text-xs text-gray-500 max-w-sm">
                    Bạn có thể tiếp tục trực tiếp đến bước thanh toán vé xem phim.
                  </p>
                  <Link href={paymentHref} className="mt-1">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Tiếp tục thanh toán</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  {foodItems.map((item) => (
                    <FoodItemCard
                      key={item.id}
                      item={item}
                      quantity={quantities[item.id] || 0}
                      onUpdateQuantity={(delta) => updateQuantity(item.id, delta)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: 32% Width (Summary Sidebar) */}
            <div className="lg:col-span-4 sticky top-28">
              <FoodBookingSidebar
                selectedFoodList={selectedFoodList}
                totalFoodPrice={totalFoodPrice}
                formattedCountdown={formattedCountdown}
                showtimeId={showtimeId}
                movieParam={movieParam}
                seatsParam={seatsParam}
                dateParam={dateParam}
                timeParam={timeParam}
                cinemaParam={cinemaParam}
              />
            </div>
          </div>
        </div>
      </main>

      {/* 3. Seat Timeout Expiration Modal Popup */}
      <SeatTimeoutModal
        isOpen={isTimeout}
        movieSlug={movieParam}
        onReset={() => resetBookingTimer(showtimeId)}
      />
    </div>
  );
}


