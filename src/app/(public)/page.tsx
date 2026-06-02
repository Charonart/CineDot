'use client';

import React from 'react';
import { HomeHero, HomeMovieSections, HomeCinemaLocations, HomeMembership, HomeTrailerSection } from '@modules/home/components';

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeMovieSections />
      <HomeCinemaLocations />
      <HomeMembership />
      <HomeTrailerSection />
    </>
  );
}
