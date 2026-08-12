'use client';

import React from 'react';
import { useFoodBooking } from '../hooks/useFoodBooking';
import { BookingStepWizard } from '@/modules/booking/components/BookingStepWizard';
import { FoodCategoryFilter } from './FoodCategoryFilter';
import { FoodItemCard } from './FoodItemCard';
import { FoodBookingSidebar } from './FoodBookingSidebar';
import { SeatTimeoutModal } from '@/modules/booking/components/SeatTimeoutModal';
import { Skeleton } from '@/shared/ui/Skeleton';

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
    activeCategory,
    setActiveCategory,
    quantities,
    updateQuantity,
    selectedFoodList,
    totalFoodPrice,
    formattedCountdown,
    isTimeout,
    loading,
  } = useFoodBooking(initialCombo, showtimeId, combosParam);

  if (loading) {
    return (
      <div className="w-full pt-24 pb-20 bg-[#FEFEFE] min-h-screen">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 flex flex-col gap-8">
          <Skeleton variant="card" className="w-full h-14 rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <Skeleton variant="card" className="w-full h-64 rounded-3xl" />
              <Skeleton variant="card" className="w-full h-64 rounded-3xl" />
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
    <div className="w-full flex flex-col font-sans bg-[#FEFEFE] text-[#131413] min-h-screen pt-24 pb-20 selection:bg-[#7C6FE8] selection:text-white">
      {/* 1. Step Wizard Bar (Step 3: Chọn thức ăn ACTIVE, 60% progress) */}
      <BookingStepWizard currentStep={3} />

      {/* 2. Main 2-Column Container */}
      <main className="w-full">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: 68% Width (lg:col-span-8 - Food Categories & Items) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Category Filter Bar */}
              <FoodCategoryFilter
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
              />

              {/* Food Items List */}
              <div className="flex flex-col gap-4">
                {foodItems.map((item) => (
                  <FoodItemCard
                    key={item.id}
                    item={item}
                    quantity={quantities[item.id] || 0}
                    onUpdateQuantity={(delta) => updateQuantity(item.id, delta)}
                  />
                ))}
              </div>
            </div>

            {/* Right Column: 32% Width (lg:col-span-4 - Summary Sidebar) */}
            <div className="lg:col-span-4">
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
      />
    </div>
  );
}
