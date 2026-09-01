import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MovieDetailPageClient } from '@/modules/movie-detail/components/MovieDetailPageClient';
import { fetchMovieDetail } from '@/modules/movie-detail/services/movie-detail.service';

interface MovieDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: MovieDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const movie = await fetchMovieDetail(slug);

  if (!movie) {
    return {
      title: 'Phim Không Tồn Tại - CineDot',
      description: 'Bộ phim bạn đang tìm kiếm không tồn tại hoặc đã ngừng chiếu tại cụm rạp CineDot.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://cinedot.vn').replace(/\/+$/, '');
  const title = `${movie.title} - Lịch chiếu & Đặt vé | CineDot`;
  const description =
    movie.synopsis && movie.synopsis.length > 10
      ? movie.synopsis.length > 160
        ? `${movie.synopsis.slice(0, 157)}...`
        : movie.synopsis
      : `Xem lịch chiếu phim, mua vé online và theo dõi trailer bộ phim ${movie.title} tại hệ thống rạp CineDot chuẩn quốc tế.`;

  const ogImageUrl = movie.backdropUrl || movie.posterUrl || `${siteUrl}/assets/cinedot-og.jpg`;
  const ogImage = ogImageUrl.startsWith('http') ? ogImageUrl : `${siteUrl}${ogImageUrl.startsWith('/') ? '' : '/'}${ogImageUrl}`;

  return {
    title,
    description,
    keywords: [
      movie.title,
      movie.originalTitle,
      `lịch chiếu ${movie.title}`,
      `đặt vé ${movie.title}`,
      `giá vé ${movie.title}`,
      `trailer ${movie.title}`,
      'phim chiếu rạp',
      'vé xem phim',
      ...(Array.isArray(movie.genre) ? movie.genre : []),
    ].filter(Boolean) as string[],
    alternates: {
      canonical: `${siteUrl}/movies/${movie.slug}`,
    },
    openGraph: {
      type: 'video.movie',
      locale: 'vi_VN',
      url: `${siteUrl}/movies/${movie.slug}`,
      siteName: 'CineDot',
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `Poster phim ${movie.title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { slug } = await params;
  const movie = await fetchMovieDetail(slug);

  if (!movie) {
    notFound();
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://cinedot.vn').replace(/\/+$/, '');

  // Format ISO 8601 duration e.g. 120 phút -> PT120M
  const durationMatch = movie.duration?.match(/\d+/);
  const isoDuration = durationMatch ? `PT${durationMatch[0]}M` : undefined;

  const movieSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    alternateName: movie.originalTitle || undefined,
    url: `${siteUrl}/movies/${movie.slug}`,
    image: [movie.posterUrl, movie.backdropUrl].filter(Boolean),
    description: movie.synopsis || undefined,
    dateCreated: movie.releaseDate || undefined,
    datePublished: movie.releaseDate || undefined,
    genre: Array.isArray(movie.genre) ? movie.genre : undefined,
    duration: isoDuration,
    contentRating: movie.ageRating || undefined,
    inLanguage: 'vi',
  };

  if (movie.country) {
    movieSchema.countryOfOrigin = {
      '@type': 'Country',
      name: movie.country,
    };
  }

  if (movie.trailerUrl) {
    movieSchema.trailer = {
      '@type': 'VideoObject',
      name: `Trailer chính thức ${movie.title}`,
      description: `Trailer chính thức phim ${movie.title} tại cụm rạp CineDot`,
      thumbnailUrl: movie.backdropUrl || movie.posterUrl,
      embedUrl: movie.trailerUrl,
      uploadDate: movie.releaseDate || undefined,
    };
  }

  if (movie.director) {
    movieSchema.director = {
      '@type': 'Person',
      name: movie.director,
    };
  }

  if (Array.isArray(movie.castMembers) && movie.castMembers.length > 0) {
    movieSchema.actor = movie.castMembers.slice(0, 10).map((actor) => ({
      '@type': 'Person',
      name: actor.name,
    }));
  }

  if (movie.rating > 0 && movie.voteCount > 0) {
    movieSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: movie.rating,
      reviewCount: movie.voteCount,
      bestRating: 10,
      worstRating: 1,
    };
  }

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
        name: 'Danh sách phim',
        item: `${siteUrl}/movies`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: movie.title,
        item: `${siteUrl}/movies/${movie.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(movieSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <MovieDetailPageClient slug={slug} initialMovie={movie} />
    </>
  );
}