'use client';

import React, { useState, Suspense } from 'react';
import { 
  MovieDetailHeroStatic, 
  MovieDetailInfo, 
  MovieOverview, 
  MovieSchedule, 
  MovieRecommendations 
} from '@modules/movie-detail/components';
import { getMovieDetailBySlug } from '@modules/movie-detail/data/movieDetailData';
import { useSearchParams } from 'next/navigation';
import { TrailerModal } from '@/shared/components/visual';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function MovieDetailPageContent({ params }: PageProps) {
  const { slug } = React.use(params);
  const movie = getMovieDetailBySlug(slug);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const searchParams = useSearchParams();
  const focus = searchParams.get('focus');

  React.useEffect(() => {
    if (focus === 'schedule') {
      // Small timeout to allow content layout rendering
      const timer = setTimeout(() => {
        const scheduleEl = document.getElementById('schedule');
        if (scheduleEl) {
          scheduleEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [focus]);

  return (
    <main className="movie-detail-page">
      
      {/* SECTION 2 — TRAILER / HERO VIDEO SECTION */}
      <MovieDetailHeroStatic 
        backdrop={movie.backdrop} 
        title={movie.title} 
        onPlayTrailer={() => setIsTrailerOpen(true)} 
      />

      {/* MAIN WRAPPER FOR 2-COLUMN LAYOUT */}
      <div className="detail-container">
        <div className="detail-main-layout">
          
          {/* LEFT COLUMN (68%) */}
          <div className="detail-main-content">
            
            {/* SECTION 3A — MOVIE POSTER + METADATA BLOCK */}
            <MovieDetailInfo 
              poster={movie.poster}
              title={movie.title}
              originalTitle={movie.originalTitle}
              rating={movie.rating}
              voteCount={movie.voteCount}
              runtime={movie.runtime}
              releaseDate={movie.releaseDate}
              country={movie.country}
              producer={movie.producer}
              genres={movie.genres}
              director={movie.director}
              cast={movie.cast}
              onPlayTrailer={() => setIsTrailerOpen(true)}
            />

            {/* SECTION 4 — MOVIE CONTENT SECTION */}
            <MovieOverview overview={movie.overview} />

            {/* SECTION 5 — SHOWTIME SCHEDULE SECTION */}
            <MovieSchedule cinemas={movie.cinemas} />

          </div>

          {/* RIGHT COLUMN (32%) — RECOMMENDED SIDEBAR */}
          <MovieRecommendations recommendations={movie.recommendations} />

        </div>
      </div>

      {/* CINEMATIC TRAILER MODAL */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        videoSrc={movie.trailerUrl}
        poster={movie.poster}
        title={movie.title}
      />

    </main>
  );
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
