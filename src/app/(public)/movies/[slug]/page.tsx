import React from 'react';
import { MovieDetailPageClient } from '@/modules/movie-detail/components/MovieDetailPageClient';

interface MovieDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: MovieDetailPageProps) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug || '';
    const formattedTitle = slug
      ? slug
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')
      : 'Chi Tiết Phim';

    return {
      title: `${formattedTitle} - CineDot Rạp Phim IMAX`,
      description: `Xem lịch chiếu phim, mua vé và xem trailer bộ phim ${formattedTitle} tại hệ thống rạp CineDot.`,
    };
  } catch {
    return {
      title: 'Chi Tiết Phim - CineDot Rạp Phim IMAX',
    };
  }
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || 'conan-movie-27';

  return <MovieDetailPageClient slug={slug} />;
}
