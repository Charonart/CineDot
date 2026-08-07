import React from 'react';
import { HomePageClient } from '@/modules/home/components/HomePageClient';

export const metadata = {
  title: 'CineDot - Hệ Thống Đặt Vé Xem Phim Trực Tuyến Đỉnh Cao',
  description: 'Trải nghiệm xem phim đỉnh cao tại hệ thống rạp CineDot. Đặt vé trực tuyến nhanh chóng, tiện lợi với trải nghiệm mượt mà.',
};

export default function HomePage() {
  return <HomePageClient />;
}
