import React from 'react';
import type { Metadata } from 'next';
import { MoviesListingClientPage } from '@/modules/movies-listing/components/MoviesListingClientPage';
import { MovieListingTab } from '@/modules/movies-listing/types/movies-listing.types';

interface MoviesPageProps {
  searchParams: Promise<{
    tab?: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Danh Sách Phim Đang Chiếu & Sắp Chiếu - CineDot Rạp Phim IMAX',
  description:
    'Khám phá danh sách phim bom tấn mới nhất đang chiếu và sắp chiếu tại hệ thống rạp CineDot. Đặt vé xem phim trực tuyến nhanh chóng với ưu đãi độc quyền.',
  alternates: {
    canonical: '/movies',
  },
  openGraph: {
    title: 'Danh Sách Phim Đang Chiếu & Sắp Chiếu - CineDot Rạp Phim IMAX',
    description:
      'Khám phá danh sách phim bom tấn mới nhất đang chiếu và sắp chiếu tại hệ thống rạp CineDot.',
    url: '/movies',
  },
};

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const { tab } = await searchParams;
  const initialTab: MovieListingTab = tab === 'coming-soon' ? 'coming-soon' : 'now-showing';

  return <MoviesListingClientPage initialTab={initialTab} />;
}