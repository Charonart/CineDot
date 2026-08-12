import React from 'react';
import { FoodBookingClientPage } from '@/modules/food-booking/components/FoodBookingClientPage';

interface FoodBookingPageProps {
  searchParams: Promise<{
    showtime_id?: string;
    combo?: string;
    combos?: string;
    movie?: string;
    seats?: string;
    date?: string;
    time?: string;
    cinema?: string;
  }>;
}

export const metadata = {
  title: 'Chọn Bắp Nước & Combo - CineDot Rạp Phim IMAX',
  description: 'Thưởng thức các bộ Combo Bắp Rang Phô Mai, Caramel, Pepsi thơm ngon ưu đãi đặc biệt tại rạp CineDot.',
};

export default async function FoodBookingPage({ searchParams }: FoodBookingPageProps) {
  const { showtime_id, combo, combos, movie, seats, date, time, cinema } = await searchParams;

  return (
    <FoodBookingClientPage
      initialCombo={combo}
      combosParam={combos}
      showtimeId={showtime_id || 'showtime-101'}
      movieParam={movie}
      seatsParam={seats}
      dateParam={date}
      timeParam={time}
      cinemaParam={cinema}
    />
  );
}
