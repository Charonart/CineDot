import React from 'react';
import type { Metadata } from 'next';
import { MoviesListingClientPage } from '@/modules/movies-listing/components/MoviesListingClientPage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://cinedot.vn';

export const metadata: Metadata = {
  title: 'Phim Sắp Chiếu - Danh Sách Phim Bom Tấn Mới Nhất | CineDot',
  description:
    'Khám phá danh sách phim sắp chiếu tại rạp CineDot toàn quốc. Theo dõi trailer, thông tin diễn viên và ngày khởi chiếu các bộ phim bom tấn đỉnh cao sắp ra mắt.',
  keywords: [
    'phim sắp chiếu',
    'phim bom tấn sắp ra mắt',
    'lịch khởi chiếu phim',
    'trailer phim mới',
    'rạp CineDot',
  ],
  alternates: {
    canonical: `${siteUrl}/movies/coming-soon`,
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: `${siteUrl}/movies/coming-soon`,
    siteName: 'CineDot',
    title: 'Phim Sắp Chiếu - Danh Sách Phim Bom Tấn Mới Nhất | CineDot',
    description:
      'Khám phá danh sách phim sắp chiếu tại rạp CineDot toàn quốc. Theo dõi trailer và ngày khởi chiếu các bộ phim bom tấn sắp ra mắt.',
    images: [
      {
        url: `${siteUrl}/assets/cinedot-og.jpg`,
        width: 1200,
        height: 630,
        alt: 'Phim Sắp Chiếu tại CineDot',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phim Sắp Chiếu - Danh Sách Phim Bom Tấn Mới Nhất | CineDot',
    description:
      'Khám phá danh sách phim sắp chiếu tại rạp CineDot toàn quốc. Xem trailer và ngày khởi chiếu.',
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
      name: 'Phim sắp chiếu',
      item: `${siteUrl}/movies/coming-soon`,
    },
  ],
};

export default function ComingSoonMoviesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <MoviesListingClientPage initialTab="coming-soon" />
    </>
  );
}