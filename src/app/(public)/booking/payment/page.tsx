import React from 'react';
import { PaymentClientPage } from '@/modules/payment/components/PaymentClientPage';

interface PaymentPageProps {
  searchParams: Promise<{
    showtime_id?: string;
    movie?: string;
    seats?: string;
    combos?: string;
    date?: string;
    time?: string;
    cinema?: string;
  }>;
}

export const metadata = {
  title: 'Thanh Toán Vé Xem Phim - CineDot Rạp Phim IMAX',
  description: 'Thanh toán vé xem phim và combo bắp nước an toàn, bảo mật qua MoMo, ZaloPay, VietQR, Thẻ ATM và Thẻ Quốc Tế tại rạp CineDot.',
};

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const { showtime_id, movie, seats, combos, date, time, cinema } = await searchParams;

  return (
    <PaymentClientPage
      showtimeId={showtime_id || 'showtime-101'}
      movieParam={movie}
      seatsParam={seats}
      combosParam={combos}
      dateParam={date}
      timeParam={time}
      cinemaParam={cinema}
    />
  );
}
