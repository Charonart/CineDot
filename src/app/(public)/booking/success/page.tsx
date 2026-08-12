import React from 'react';
import { BookingSuccessClientPage } from '@/modules/booking-success/components/BookingSuccessClientPage';

interface BookingSuccessPageProps {
  searchParams: Promise<{
    booking_id?: string;
    movie?: string;
    seats?: string;
    date?: string;
    time?: string;
    cinema?: string;
    total?: string;
  }>;
}

export const metadata = {
  title: 'Đặt Vé Thành Công - CineDot Rạp Phim IMAX',
  description: 'Chúc mừng bạn đã hoàn tất thanh toán vé xem phim điện tử QR Code tại hệ thống rạp CineDot.',
};

export default async function BookingSuccessPage({ searchParams }: BookingSuccessPageProps) {
  const { booking_id, movie, seats, date, time, cinema, total } = await searchParams;

  return (
    <BookingSuccessClientPage
      bookingIdParam={booking_id}
      movieParam={movie}
      seatsParam={seats}
      dateParam={date}
      timeParam={time}
      cinemaParam={cinema}
      totalParam={total}
    />
  );
}
