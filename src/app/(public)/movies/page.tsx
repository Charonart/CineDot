import React from 'react';
import type { Metadata } from 'next';
import { MoviesListingClientPage } from '@/modules/movies-listing/components/MoviesListingClientPage';
import { MovieListingTab } from '@/modules/movies-listing/types/movies-listing.types';

interface MoviesPageProps {
  searchParams: Promise<{
    tab?: string;
    category?: string;
    status?: string;
  }>;
}

export async function generateMetadata({ searchParams }: MoviesPageProps): Promise<Metadata> {
  const { tab, category, status } = await searchParams;
  const isComingSoon =
    tab === 'coming-soon' ||
    category === 'coming-soon' ||
    category === 'coming_soon' ||
    status === 'upcoming' ||
    status === 'coming_soon';

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://cinedot.vn').replace(/\/+$/, '');

  if (isComingSoon) {
    const title = 'Phim Sắp Chiếu - Danh Sách Phim Chiếu Rạp Mới Nhất | CineDot';
    const description =
      'Khám phá danh sách phim sắp chiếu mới nhất tại hệ thống rạp CineDot toàn quốc. Xem trailer, ngày khởi chiếu và thông tin các bộ phim bom tấn sắp ra mắt.';
    return {
      title,
      description,
      keywords: ['phim sắp chiếu', 'phim chiếu rạp sắp tới', 'trailer phim mới', 'phim bom tấn', 'lịch khởi chiếu phim', 'CineDot'],
      alternates: {
        canonical: `${siteUrl}/movies?category=coming-soon`,
      },
      openGraph: {
        type: 'website',
        locale: 'vi_VN',
        title,
        description,
        url: `${siteUrl}/movies?category=coming-soon`,
        siteName: 'CineDot',
        images: [
          {
            url: `${siteUrl}/assets/cinedot-og.jpg`,
            width: 1200,
            height: 630,
            alt: 'Phim Sắp Chiếu CineDot',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [`${siteUrl}/assets/cinedot-og.jpg`],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }

  const title = 'Phim Đang Chiếu - Lịch Chiếu & Đặt Vé Phim Chiếu Rạp | CineDot';
  const description =
    'Danh sách phim đang chiếu tại các cụm rạp CineDot toàn quốc. Đặt vé xem phim trực tuyến màn hình IMAX Laser và âm thanh Dolby Atmos nhanh chóng, tiện lợi.';

  return {
    title,
    description,
    keywords: ['phim đang chiếu', 'lịch chiếu phim', 'đặt vé phim', 'vé xem phim rạp', 'CineDot', 'rạp chiếu phim'],
    alternates: {
      canonical: `${siteUrl}/movies`,
    },
    openGraph: {
      type: 'website',
      locale: 'vi_VN',
      title,
      description,
      url: `${siteUrl}/movies`,
      siteName: 'CineDot',
      images: [
        {
          url: `${siteUrl}/assets/cinedot-og.jpg`,
          width: 1200,
          height: 630,
          alt: 'Phim Đang Chiếu CineDot',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/assets/cinedot-og.jpg`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const { tab, category, status } = await searchParams;

  const isComingSoon =
    tab === 'coming-soon' ||
    category === 'coming-soon' ||
    category === 'coming_soon' ||
    status === 'upcoming' ||
    status === 'coming_soon';

  const initialTab: MovieListingTab = isComingSoon ? 'coming-soon' : 'now-showing';
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://cinedot.vn').replace(/\/+$/, '');

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
        name: isComingSoon ? 'Phim sắp chiếu' : 'Phim đang chiếu',
        item: `${siteUrl}/movies${isComingSoon ? '?category=coming-soon' : ''}`,
      },
    ],
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: isComingSoon ? 'Phim sắp chiếu tại CineDot' : 'Phim đang chiếu tại CineDot',
    url: `${siteUrl}/movies${isComingSoon ? '?category=coming-soon' : ''}`,
    description: isComingSoon
      ? 'Danh sách các bộ phim sắp khởi chiếu tại cụm rạp CineDot.'
      : 'Danh sách các bộ phim đang chiếu và lịch chiếu vé tại cụm rạp CineDot.',
    inLanguage: 'vi-VN',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <MoviesListingClientPage initialTab={initialTab} />
    </>
  );
}