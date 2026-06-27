/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import { QuickBookingPanel } from './QuickBookingPanel';
import { HERO_BANNERS } from '../data/heroMovies';

export const HomeHero: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);

  const length = HERO_BANNERS.length;
  const leftIndex = (activeIndex - 1 + length) % length;
  const rightIndex = (activeIndex + 1) % length;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % length);
    setResetCounter((prev) => prev + 1);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + length) % length);
    setResetCounter((prev) => prev + 1);
  };

  const handleSelectCard = (index: number) => {
    if (index === activeIndex) return; // Optional active click behavior (displays visual only)
    setActiveIndex(index);
    setResetCounter((prev) => prev + 1);
  };

  // Autoplay Effect
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered, resetCounter, length]);

  return (
    <section className="hero hero-circular-showcase hero-image-carousel-section" id="hero">
      {/* Background Slideshow (Fades backdrop images dynamically) */}
      <div className="hero-showcase-bg-container">
        {HERO_BANNERS.map((banner, idx) => (
          <div
            key={banner.id}
            className={`hero-showcase-bg-slide ${idx === activeIndex ? 'is-active' : ''}`}
          >
            <img
              src={banner.image}
              alt={`${banner.alt} backdrop`}
            />
          </div>
        ))}
        <div className="hero-showcase-overlay"></div>
      </div>

      {/* Main Showcase Content (Centered Carousel) */}
      <div className="hero-showcase-content">
        <div
          className="hero-banner-carousel-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Previous control button */}
          <button
            type="button"
            className="hero-gallery-control hero-gallery-prev"
            onClick={handlePrev}
            aria-label="Xem banner trước"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          {/* Carousel Wrapper */}
          <div className="hero-banner-carousel">
            {HERO_BANNERS.map((banner, idx) => {
              let positionClass = 'is-hidden';
              if (idx === activeIndex) {
                positionClass = 'is-active';
              } else if (idx === leftIndex) {
                positionClass = 'is-left';
              } else if (idx === rightIndex) {
                positionClass = 'is-right';
              }

              return (
                <div
                  key={banner.id}
                  className={`hero-banner-card ${positionClass}`}
                  onClick={() => handleSelectCard(idx)}
                >
                  <img
                    src={banner.image}
                    alt={banner.alt}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&q=80';
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Next control button */}
          <button
            type="button"
            className="hero-gallery-control hero-gallery-next"
            onClick={handleNext}
            aria-label="Xem banner tiếp theo"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      {/* QUICK BOOKING PANEL (Positioned absolute outside the showcase grid and gallery transformations) */}
      <QuickBookingPanel />
    </section>
  );
};
