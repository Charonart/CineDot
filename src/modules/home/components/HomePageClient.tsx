'use client';

import React from 'react';
import { useHomeData } from '../hooks/useHomeData';
import { HeroPromoCarousel } from './HeroPromoCarousel';
import { MovieTabsSection } from './MovieTabsSection';
import { PromotionsSection } from './PromotionsSection';
import { MobileAppBanner } from './MobileAppBanner';
import { SeoContentSection } from './SeoContentSection';

export function HomePageClient() {
  const { banners, movies, promotions, loading } = useHomeData();

  return (
    <div className="w-full flex flex-col font-sans bg-[#FAFAFB] text-gray-900 selection:bg-[#7C6FE8] selection:text-white min-h-screen">
      {/* Section 1: Cinematic Marquee Hero Carousel & 1-Click Floating Quick Booking Dock */}
      <HeroPromoCarousel banners={banners} />

      {/* Section 2: Addictive Movie Browsing Showcase with Instant Format Filters */}
      <MovieTabsSection movies={movies} isLoading={loading} />

      {/* Section 3: VIP Member Events & Exclusive Cinema Promotions */}
      <PromotionsSection promotions={promotions} />

      {/* Section 4: CineDot 5-Star Mobile App Showcase */}
      <MobileAppBanner />

      {/* Section 5: Atmospheric Cinema Network Statement */}
      <SeoContentSection />
    </div>
  );
}
