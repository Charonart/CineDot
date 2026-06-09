/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import { QuickBookingPanel } from './QuickBookingPanel';
import { useHeroSlides } from '@/modules/movie/hooks/useMovies';

export const HomeHero: React.FC = () => {
  const { data: slides = [], isLoading, isError } = useHeroSlides();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);

  const length = slides.length;
  const leftIndex = length > 0 ? (activeIndex - 1 + length) % length : 0;
  const rightIndex = length > 0 ? (activeIndex + 1) % length : 0;

  const handleNext = () => {
    if (length === 0) return;
    setActiveIndex((prev) => (prev + 1) % length);
    setResetCounter((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (length === 0) return;
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
    if (isHovered || length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered, resetCounter, length]);

  if (isLoading) {
    return (
      <section className="hero hero-circular-showcase hero-image-carousel-section" id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Đang tải phim nổi bật...</p>
      </section>
    );
  }

  if (isError || slides.length === 0) {
    return (
      <section className="hero hero-circular-showcase hero-image-carousel-section" id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-error)' }}>Không thể tải danh sách phim nổi bật.</p>
        <QuickBookingPanel />
      </section>
    );
  }

  return (
    <section className="hero hero-circular-showcase hero-image-carousel-section" id="hero">
      {/* Background Slideshow (Fades backdrop images dynamically) */}
      <div className="hero-showcase-bg-container">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`hero-showcase-bg-slide ${idx === activeIndex ? 'is-active' : ''}`}
          >
            <img
              src={slide.backdropUrl}
              alt={`${slide.title} backdrop`}
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
            {slides.map((slide, idx) => {
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
                  key={slide.id}
                  className={`hero-banner-card ${positionClass}`}
                  onClick={() => handleSelectCard(idx)}
                >
                  <img
                    src={slide.backdropUrl}
                    alt={slide.title}
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
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import { QuickBookingPanel } from './QuickBookingPanel';
import { useHeroSlides } from '@/modules/movie/hooks/useMovies';

export const HomeHero: React.FC = () => {
  const { data: slides = [], isLoading, isError } = useHeroSlides();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);

  const length = slides.length;
  const leftIndex = length > 0 ? (activeIndex - 1 + length) % length : 0;
  const rightIndex = length > 0 ? (activeIndex + 1) % length : 0;

  const handleNext = () => {
    if (length === 0) return;
    setActiveIndex((prev) => (prev + 1) % length);
    setResetCounter((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (length === 0) return;
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
    if (isHovered || length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered, resetCounter, length]);

  if (isLoading) {
    return (
      <section className="hero hero-circular-showcase hero-image-carousel-section" id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Đang tải phim nổi bật...</p>
      </section>
    );
  }

  if (isError || slides.length === 0) {
    return (
      <section className="hero hero-circular-showcase hero-image-carousel-section" id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-error)' }}>Không thể tải danh sách phim nổi bật.</p>
        <QuickBookingPanel />
      </section>
    );
  }

  return (
    <section className="hero hero-circular-showcase hero-image-carousel-section" id="hero">
      {/* Background Slideshow (Fades backdrop images dynamically) */}
      <div className="hero-showcase-bg-container">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`hero-showcase-bg-slide ${idx === activeIndex ? 'is-active' : ''}`}
          >
            <img
              src={slide.backdropUrl}
              alt={`${slide.title} backdrop`}
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
            {slides.map((slide, idx) => {
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
                  key={slide.id}
                  className={`hero-banner-card ${positionClass}`}
                  onClick={() => handleSelectCard(idx)}
                >
                  <img
                    src={slide.backdropUrl}
                    alt={slide.title}
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
