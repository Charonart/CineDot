import React from 'react';
import { MoviesListingClientPage } from '@/modules/movies-listing/components/MoviesListingClientPage';
import { MovieListingTab } from '@/modules/movies-listing/types/movies-listing.types';

interface MoviesPageProps {
  searchParams: Promise<{
    tab?: string;
  }>;
}

export const metadata = {
  title: 'Danh Sách Phim Đang Chiếu & Sắp Chiếu - CineDot Rạp Phim IMAX',
  description: 'Khám phá danh sách phim bom tấn mới nhất đang chiếu và sắp chiếu tại hệ thống rạp CineDot. Đặt vé trực tuyến nhanh chóng.',
};

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const { tab } = await searchParams;
  const initialTab: MovieListingTab = (tab === 'upcoming' || tab === 'coming-soon') ? 'upcoming' : 'now_showing';

  return <MoviesListingClientPage initialTab={initialTab} />;
}
