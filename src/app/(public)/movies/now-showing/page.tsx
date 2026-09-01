import React from 'react';
import type { Metadata } from 'next';
import { MoviesListingClientPage } from '@/modules/movies-listing/components/MoviesListingClientPage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://cinedot.vn';

export const metadata: Metadata = {
  title: 'Phim Đang Chiếu - Lịch Chiếu & Đặt Vé Phim Chiếu Rạp Mới Nhất | CineDot',
  description:
    'Danh sách phim đang chiếu tại các cụm rạp CineDot toàn quốc. Đặt vé xem phim trực tuyến màn hình IMAX Laser và âm thanh Dolby Atmos nhanh chóng, tiện lợi.',
  keywords: [
    'phim đang chiếu',
    'lịch chiếu phim rạp',
    'đặt vé xem phim',
    'giá vé phim chiếu rạp',
    'rạp CineDot',
    'suất chiếu hôm nay',
  ],
  alternates: {
    canonical: `${siteUrl}/movies/now-showing`,
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: `${siteUrl}/movies/now-showing`,
    siteName: 'CineDot',
    title: 'Phim Đang Chiếu - Lịch Chiếu & Đặt Vé Phim Chiếu Rạp Mới Nhất | CineDot',
    description:
      'Danh sách phim đang chiếu tại các cụm rạp CineDot toàn quốc. Đặt vé xem phim trực tuyến màn hình IMAX Laser.',
    images: [
      {
        url: `${siteUrl}/assets/cinedot-og.jpg`,
        width: 1200,
        height: 630,
        alt: 'Phim Đang Chiếu tại CineDot',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phim Đang Chiếu - Lịch Chiếu & Đặt Vé Phim Chiếu Rạp Mới Nhất | CineDot',
    description:
      'Danh sách phim đang chiếu tại các cụm rạp CineDot toàn quốc. Đặt vé xem phim trực tuyến.',
    images: [`${siteUrl}/assets/cinedot-og.jpg`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Trang chủ',
      item: siteUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Phim đang chiếu',
      item: `${siteUrl}/movies/now-showing`,
    },
  ],
};

export default function NowShowingMoviesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <MoviesListingClientPage initialTab="now-showing" />
    </>
  );
}