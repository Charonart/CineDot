import React from 'react';
import { CinemaCornerClientPage } from '@/modules/cinema-corner/components/CinemaCornerClientPage';

export const metadata = {
  title: 'Góc Điện Ảnh & Blog Tin Tức Phim - CineDot Rạp Phim IMAX',
  description: 'Tổng hợp bài review phim chuyên sâu, tin bên lề rạp phim, góc đạo diễn diễn viên và hậu trường điện ảnh hấp dẫn nhất tại CineDot.',
};

export default function CinemaCornerPage() {
  return <CinemaCornerClientPage />;
}
