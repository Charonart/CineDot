import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { movieDetailService } from '@modules/movie-detail/services/movie-detail.service';
import MovieDetailPageClient from './MovieDetailPageClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * SSR Strategy: Generate Dynamic Metadata for SEO
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const movie = await movieDetailService.getMovieDetailBySlug(slug);
    return {
      title: `${movie.title} | CineDot`,
      description: movie.description || `Thông tin chi tiết phim ${movie.title} trên CineDot`,
      openGraph: {
        title: movie.title,
        description: movie.description,
        images: [movie.backdropUrl],
      },
    };
  } catch {
    return { title: 'Movie Not Found | CineDot' };
  }
}

async function MovieDetailPageContent({ params }: PageProps) {
  const { slug } = await params;
  
  let movie;
  try {
    movie = await movieDetailService.getMovieDetailBySlug(slug);
  } catch {
    notFound();
  }

  return <MovieDetailPageClient movie={movie} />;
}

export default function MovieDetailPage({ params }: PageProps) {
  return (
    <Suspense 
      fallback={
        <div 
          className="movie-detail-page" 
          style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'var(--color-background)',
            color: 'var(--color-text-primary)'
          }}
        >
          <p style={{ fontSize: '16px', fontWeight: 500 }}>Đang tải thông tin phim...</p>
        </div>
      }
    >
      <MovieDetailPageContent params={params} />
    </Suspense>
  );
}
