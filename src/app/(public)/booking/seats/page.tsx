import React from 'react';
import { SeatBookingClientPage } from '@/modules/booking/components/SeatBookingClientPage';

interface SeatBookingPageProps {
  searchParams: Promise<{
    showtime_id?: string;
    movie?: string;
    seats?: string;
    date?: string;
    time?: string;
    cinema?: string;
  }>;
}

export const metadata = {
  title: 'Chọn Ghế Xem Phim - CineDot Rạp Phim IMAX',
  description: 'Lựa chọn vị trí ghế ngồi ưa thích trong phòng chiếu IMAX tại hệ thống rạp CineDot.',
};

export default async function SeatBookingPage({ searchParams }: SeatBookingPageProps) {
  const { showtime_id, movie, seats, date, time, cinema } = await searchParams;
  const showtimeId = showtime_id || 'showtime-101';

  return (
    <SeatBookingClientPage
      showtimeId={showtimeId}
      movieParam={movie}
      initialSeatsParam={seats}
      dateParam={date}
      timeParam={time}
      cinemaParam={cinema}
    />
  );
}
