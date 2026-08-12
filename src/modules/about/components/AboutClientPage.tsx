'use client';

import React from 'react';
import { AboutHero } from './AboutHero';
import { AboutCoreValues } from './AboutCoreValues';
import { AboutGallery } from './AboutGallery';
import { AboutTimeline } from './AboutTimeline';
import { AboutFaqAccordion } from './AboutFaqAccordion';
import { AboutContactForm } from './AboutContactForm';

export function AboutClientPage() {
  return (
    <div className="w-full flex flex-col font-sans bg-[#FEFEFE] text-[#131413] min-h-screen pt-28 pb-20 selection:bg-[#7C6FE8] selection:text-white">
      <main className="w-full">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
          {/* 1. Hero Showcase Section */}
          <AboutHero />

          {/* 2. Core Values & Vision */}
          <AboutCoreValues />

          {/* 3. CineDot Architectural Experience Gallery */}
          <AboutGallery />

          {/* 4. Brand Timeline History */}
          <AboutTimeline />

          {/* 5. Frequently Asked Questions (FAQ Accordion) */}
          <AboutFaqAccordion />

          {/* 6. Contact & Headquarters Form */}
          <AboutContactForm />
        </div>
      </main>
    </div>
  );
}
