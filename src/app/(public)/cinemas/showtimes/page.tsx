import type { Metadata } from 'next';
import { CinemasPage } from '@/modules/cinemas/components/CinemasPage';

export const metadata: Metadata = {
  title: 'Lịch Chiếu Theo Rạp — CineDot',
  description: 'Xem lịch chiếu phim theo từng rạp CineDot. Tìm suất chiếu gần nhất và đặt vé ngay.',
};

export default function CinemaShowtimesPage() {
  // Showtimes tab is shown in the cinemas listing — this page redirects to cinema list with showtime context
  return <CinemasPage />;
}
