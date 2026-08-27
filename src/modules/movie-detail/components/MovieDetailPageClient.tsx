'use client';

import React from 'react';
import { useMovieDetail } from '../hooks/useMovieDetail';
import { MovieDetailHero } from './MovieDetailHero';
import { MovieMetadataHeader } from './MovieMetadataHeader';
import { MovieOverviewSection } from './MovieOverviewSection';
import { ShowtimeScheduleSection } from './ShowtimeScheduleSection';
import { RecommendedSidebar } from './RecommendedSidebar';

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
      <div className="w-full pt-28 pb-20 bg-[#FAFAFB] min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-col gap-8">
          <div className="w-full h-[360px] rounded-3xl bg-gray-200 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="w-2/3 h-10 rounded-xl bg-gray-200 animate-pulse" />
              <div className="w-full h-48 rounded-2xl bg-gray-200 animate-pulse" />
            </div>
            <div className="lg:col-span-4">
              <div className="w-full h-80 rounded-2xl bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col font-sans bg-[#FAFAFB] text-gray-900 min-h-screen selection:bg-[#7C6FE8] selection:text-white">
      {/* 1. Hero Backdrop Stage */}
      <MovieDetailHero
        bannerUrl={movie.bannerUrl}
        posterUrl={movie.posterUrl}
        title={movie.title}
        trailerUrl={movie.trailerUrl}
        videos={movie.videos}
      />

      {/* 2. Main Content Container */}
      <main className="w-full pb-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: 68% Width (lg:col-span-8) */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* 1. Movie Metadata Header */}
              <MovieMetadataHeader movie={movie} onBookClick={scrollToSchedule} />

              {/* 2. Movie Overview / Synopsis */}
              <MovieOverviewSection synopsis={movie.synopsis} />

              {/* 3. Showtime Schedule Section */}
              <ShowtimeScheduleSection
                movieSlug={movie.slug}
                isComingSoon={movie.status === 'COMING_SOON'}
              />
            </div>

            {/* Right Column: 32% Width (lg:col-span-4) */}
            <div className="lg:col-span-4 pt-4 lg:pt-0">
              <RecommendedSidebar movies={recommended} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
