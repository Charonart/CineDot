import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  fetchCinemaDetail,
  fetchCinemaShowtimes,
  fetchPricingFormat,
} from '@/modules/cinemas/services/cinemas.service';
import { CinemaDetailHeader } from '@/modules/cinemas/components/CinemaDetailHeader';
import { CinemaDetailClient } from '@/modules/cinemas/components/CinemaDetailClient';

interface CinemaDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CinemaDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cinema = await fetchCinemaDetail(slug);

  if (!cinema) {
    return {
      title: 'Rạp Chiếu Không Tồn Tại - CineDot',
      description: 'Cụm rạp bạn đang tìm kiếm không tồn tại hoặc đã tạm dừng hoạt động.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${cinema.name} - Lịch chiếu & Thông tin rạp | CineDot`;
  const description =
    cinema.description && cinema.description.length > 20
      ? `${cinema.name} tại ${cinema.address}, ${cinema.city}. ${cinema.description}`
      : `Xem lịch chiếu phim, giá vé và đặt vé xem phim online tại cụm rạp ${cinema.name} (${cinema.address}). Hotline: ${cinema.phone}.`;

  const ogImage = cinema.bannerUrl || '/assets/cinedot-og.jpg';

  return {
    title,
    description,
    alternates: {
      canonical: `/cinemas/${cinema.slug}`,
    },
    openGraph: {
      type: 'website',
      locale: 'vi_VN',
      url: `/cinemas/${cinema.slug}`,
      siteName: 'CineDot',
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: cinema.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function CinemaDetailPage({ params }: CinemaDetailPageProps) {
  const { slug } = await params;
  const [cinema, showtimes, pricingFormat] = await Promise.all([
    fetchCinemaDetail(slug),
    fetchCinemaShowtimes(slug),
    fetchPricingFormat('2d'),
  ]);

  if (!cinema) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://cinedot.vn';

  const theaterSchema = {
    '@context': 'https://schema.org',
    '@type': 'MovieTheater',
    name: cinema.name,
    url: `${siteUrl}/cinemas/${cinema.slug}`,
    telephone: cinema.phone,
    description: cinema.description,
    image: cinema.bannerUrl || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: cinema.address,
      addressLocality: cinema.city,
      addressCountry: 'VN',
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
        name: 'Hệ thống rạp',
        item: `${siteUrl}/cinemas`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: cinema.name,
        item: `${siteUrl}/cinemas/${cinema.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(theaterSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="w-full flex flex-col font-sans bg-[#FEFEFE] text-[#131413] min-h-screen pt-28 pb-20 selection:bg-[#7C6FE8] selection:text-white">
        <main className="w-full">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-8 flex flex-col gap-10">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <Link href="/" className="hover:text-[#7C6FE8] transition-colors">
                Trang chủ
              </Link>
              <span>/</span>
              <Link href="/cinemas" className="hover:text-[#7C6FE8] transition-colors">
                Hệ thống rạp
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-bold">{cinema.name}</span>
            </nav>

            {/* 1. Cinema Header Banner & Info */}
            <CinemaDetailHeader cinema={cinema} />

            {/* 2. Interactive Sections (Pricing, Showtimes, Amenities) */}
            <CinemaDetailClient
              cinema={cinema}
              initialShowtimes={showtimes}
              initialPricingFormat={pricingFormat}
            />
          </div>
        </main>
      </div>
    </>
  );
}