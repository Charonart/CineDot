import React from 'react';
import type { Metadata } from 'next';
import { HomePageClient } from '@/modules/home/components/HomePageClient';

export const metadata: Metadata = {
  title: 'CineDot - Hệ Thống Đặt Vé Xem Phim Trực Tuyến Đỉnh Cao',
  description:
    'Trải nghiệm xem phim đỉnh cao tại hệ thống rạp CineDot. Đặt vé trực tuyến nhanh chóng, tiện lợi với trải nghiệm mượt mà, màn hình IMAX Laser và âm thanh Dolby Atmos.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CineDot - Hệ Thống Đặt Vé Xem Phim Trực Tuyến Đỉnh Cao',
    description:
      'Trải nghiệm xem phim đỉnh cao tại hệ thống rạp CineDot. Đặt vé trực tuyến nhanh chóng, tiện lợi.',
    url: '/',
  },
};

export default function HomePage() {
  return <HomePageClient />;
}