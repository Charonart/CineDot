'use client';

import React from 'react';
import { useHomeData } from '../hooks/useHomeData';
import { HeroPromoCarousel } from './HeroPromoCarousel';
import { MovieTabsSection } from './MovieTabsSection';
import { CinemaCornerSection } from './CinemaCornerSection';
import { PromotionsSection } from './PromotionsSection';
import { MobileAppBanner } from './MobileAppBanner';
import { SeoContentSection } from './SeoContentSection';

export function HomePageClient() {
  const { banners, movies, articles, promotions, loading } = useHomeData();

  return (
    <div className="w-full flex flex-col font-sans bg-[var(--bg)] text-[var(--text)] selection:bg-[#7C6FE8] selection:text-white">
      {/* Section 1: Hero Carousel & Quick Booking Strip */}
      <HeroPromoCarousel banners={banners} />

      {/* Section 2: Movie Tabs (8 Movie Cards Grid) */}
      <MovieTabsSection movies={movies} isLoading={loading} />

      {/* Section 3: Cinema Corner (1 Large Featured + 3 Small Articles) */}
      <CinemaCornerSection articles={articles} />

      {/* Section 4: Promotions Grid (4 Cards) */}
      <PromotionsSection promotions={promotions} />

      {/* Section 5: App Mobile Download Banner + QR Code */}
      <MobileAppBanner />

      {/* Section 6: Unified SEO & Brand Showcase Section (Includes button to /about) */}
      <SeoContentSection />
    </div>
  );
}
