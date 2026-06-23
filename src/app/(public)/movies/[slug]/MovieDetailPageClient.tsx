'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  MovieDetailHeroStatic,
  MovieDetailInfo,
  MovieOverview,
  MovieSchedule,
  MovieRecommendations
} from '@modules/movie-detail/components';
import { TrailerModal } from '@/shared/components/visual';
import { MovieDetail } from '@modules/movie-detail/types/movie-detail.type';

interface MovieDetailPageClientProps {
  movie: MovieDetail;
}

export default function MovieDetailPageClient({ movie }: MovieDetailPageClientProps) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const searchParams = useSearchParams();
  const focus = searchParams.get('focus');

  /**
   * Query-param scroll: dùng cho ?focus=schedule
   * (booking cancellation flow → quay lại trang phim và scroll tới lịch chiếu).
   */
  useEffect(() => {
    if (focus === 'schedule') {
      const timer = setTimeout(() => {
        const scheduleEl = document.getElementById('schedule');
        if (scheduleEl) {
          scheduleEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [focus]);

  return (
    <main className="movie-detail-page">
      {/* SECTION 2 — TRAILER / HERO VIDEO SECTION */}
      <MovieDetailHeroStatic
        backdrop={movie.backdropUrl}
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
              poster={movie.posterUrl}
              title={movie.title}
              originalTitle={movie.originalTitle}
              rating={movie.rating}
              voteCount={movie.voteCount}
              runtime={movie.runtime || 0}
              releaseDate={movie.releaseDate}
              country={movie.country}
              producer={movie.producer}
              genres={movie.genres.map((g) => g.name)}
              director={movie.director}
              cast={movie.cast}
              onPlayTrailer={() => setIsTrailerOpen(true)}
            />

            {/* SECTION 4 — MOVIE CONTENT SECTION */}
            <MovieOverview overview={movie.description} />

            {/* SECTION 5 — SHOWTIME SCHEDULE SECTION */}
            <div id="schedule">
              <MovieSchedule movieId={movie.id} />
            </div>

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
        poster={movie.posterUrl}
        title={movie.title}
      />
    </main>
  );
}
