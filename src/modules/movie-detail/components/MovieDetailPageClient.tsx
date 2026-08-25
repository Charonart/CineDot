'use client';

import React from 'react';
import { useMovieDetail } from '../hooks/useMovieDetail';
import { MovieDetailHero } from './MovieDetailHero';
import { MovieMetadataHeader } from './MovieMetadataHeader';
import { MovieOverviewSection } from './MovieOverviewSection';
import { ShowtimeScheduleSection } from './ShowtimeScheduleSection';
import { RecommendedSidebar } from './RecommendedSidebar';
import { MOCK_RECOMMENDED_MOVIES } from '../mocks/mockMovieDetailData';
import { Skeleton } from '@/shared/ui/Skeleton';

interface MovieDetailPageClientProps {
  slug: string;
}

export function MovieDetailPageClient({ slug }: MovieDetailPageClientProps) {
  const { movie, loading, recommended } = useMovieDetail(slug);

  const scrollToSchedule = () => {
    const el = document.getElementById('showtime-schedule');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading || !movie) {
    return (
      <div className="w-full pt-28 pb-20 bg-[#FEFEFE] min-h-screen">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 flex flex-col gap-8">
          <Skeleton variant="card" className="w-full h-[400px] rounded-3xl" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <Skeleton variant="text" className="w-2/3 h-10" />
              <Skeleton variant="card" className="w-full h-48 rounded-2xl" />
            </div>
            <div className="lg:col-span-4">
              <Skeleton variant="card" className="w-full h-80 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col font-sans bg-[#FEFEFE] text-[#131413] selection:bg-[#7C6FE8] selection:text-white">
      {/* 1. Hero Backdrop Image */}
      <MovieDetailHero
        bannerUrl={movie.bannerUrl}
        posterUrl={movie.posterUrl}
        title={movie.title}
        trailerUrl={movie.trailerUrl}
        videos={movie.videos}
      />

      {/* 2. Main Content Container (max-w-[1240px] strictly) */}
      <main className="w-full pb-20">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 pt-4">
          {/* 2-Column Content Layout starting from top: 68% Left / 32% Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: 68% Width (lg:col-span-8 - Metadata, Synopsis & Showtimes) */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              {/* 1. Movie Metadata Header (Poster overlaps Hero + Title & Spec details) */}
              <MovieMetadataHeader movie={movie} onBookClick={scrollToSchedule} />

              {/* 2. Movie Overview / Synopsis */}
              <MovieOverviewSection synopsis={movie.synopsis} />

              {/* 3. Showtime Schedule Section */}
              <ShowtimeScheduleSection
                movieSlug={movie.slug}
                isComingSoon={movie.status === 'COMING_SOON'}
              />
            </div>

            {/* Right Column: 32% Width (lg:col-span-4 - Hot Recommended Movies Sidebar aligned alongside Title) */}
            <div className="lg:col-span-4 pt-4 lg:pt-6">
              <RecommendedSidebar movies={recommended} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
