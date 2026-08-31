import React from 'react';
import { BookingSuccessClientPage } from '@/modules/booking-success/components/BookingSuccessClientPage';

interface BookingSuccessPageProps {
  searchParams: Promise<{
    booking_id?: string;
    booking_code?: string;
    showtime_id?: string;
    showtimeId?: string;
    movie?: string;
    seats?: string;
    date?: string;
    time?: string;
    cinema?: string;
    total?: string;
    amount?: string;
    status?: string;
    id?: string;
    code?: string;
    order_id?: string;
    vnp_TxnRef?: string;
    vnp_ResponseCode?: string;
    vnp_TransactionNo?: string;
    apptransid?: string;
  }>;
}

export const metadata = {
  title: 'Đặt Vé Thành Công - CineDot Rạp Phim IMAX',
  description: 'Chúc mừng bạn đã hoàn tất thanh toán vé xem phim điện tử QR Code tại hệ thống rạp CineDot.',
};

export default async function BookingSuccessPage({ searchParams }: BookingSuccessPageProps) {
  const params = await searchParams;

  const bookingIdParam =
    params.booking_code ||
    params.booking_id ||
    params.code ||
    params.id ||
    params.order_id ||
    params.vnp_TxnRef ||
    params.apptransid;

  const showtimeIdParam = params.showtime_id || params.showtimeId;
  const totalParam = params.total || params.amount;

  return (
    <BookingSuccessClientPage
      bookingIdParam={bookingIdParam}
      showtimeIdParam={showtimeIdParam}
      movieParam={params.movie}
      seatsParam={params.seats}
      dateParam={params.date}
      timeParam={params.time}
      cinemaParam={params.cinema}
      totalParam={totalParam}
      statusParam={params.status || (params.vnp_ResponseCode && params.vnp_ResponseCode !== '00' ? 'failed' : undefined)}
    />
  );
}

