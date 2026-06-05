/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useHeroSlides } from '@/modules/movie/hooks/useMovies';
import { appRoutes } from '@/shared/routes/appRoutes';
import { QuickBookingPanel } from './QuickBookingPanel';
import { TrailerModal } from '@/shared/components/visual';

export const HomeHero: React.FC = () => {
  const { data: slides = [], isLoading, isError } = useHeroSlides();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [activeTrailer, setActiveTrailer] = useState<{ src: string; title: string; poster: string } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play interval setting (6 seconds)
  useEffect(() => {
    if (slides.length <= 1 || isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Check prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        return; // respect user preference
      }
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [slides.length, isPaused]);

  if (isLoading) {
    return (
      <section 
        className="hero" 
        id="hero" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '760px', 
          height: '85vh', 
          background: '#0B0C0B' 
        }}
      >
        <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Đang tải phim nổi bật...</p>
      </section>
    );
  }

  if (isError || slides.length === 0) {
    return (
      <section 
        className="hero" 
        id="hero" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '760px', 
          height: '85vh', 
          background: '#0B0C0B' 
        }}
      >
        <p style={{ color: 'var(--color-error)' }}>Không thể tải danh sách phim nổi bật.</p>
        <QuickBookingPanel />
      </section>
    );
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleOpenTrailer = (slide: typeof slides[0]) => {
    setActiveTrailer({
      src: slide.trailerUrl,
      title: slide.title,
      poster: slide.posterUrl,
    });
    setIsTrailerOpen(true);
  };

  return (
    <>
      <section 
        className="hero" 
        id="hero"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="hero-slider" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}>
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <div 
                key={slide.id} 
                className={`hero-slide ${isActive ? 'is-active' : ''}`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  opacity: isActive ? 1 : 0,
                  zIndex: isActive ? 2 : 1,
                  transition: 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                <div className="hero-background" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                  <img
                    src={slide.backdropUrl}
                    alt={slide.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center 30%',
                    }}
                  />
                  <div 
                    className="hero-overlay" 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to right, rgba(10, 10, 10, 0.92) 0%, rgba(10, 10, 10, 0.65) 50%, rgba(10, 10, 10, 0.25) 100%), linear-gradient(to top, rgba(10, 10, 10, 0.85) 0%, transparent 60%)'
                    }}
                  ></div>
                </div>

                <div className="hero-content">
                  <div className="hero-info-card fade-up in-view" style={{ maxWidth: '620px' }}>
                    <span className="badge" style={{ marginBottom: '12px' }}>
                      {slide.status === 'now-showing' ? 'Đang chiếu' : 'Sắp chiếu'}
                    </span>
                    <div className="hero-tagline">
                      Đặt vé nhanh. Xem phim hay.{' '}
                      <span className="highlight-text" data-variant="underline" data-color="accent">
                        Trải nghiệm điện ảnh cao cấp.
                      </span>
                    </div>
                    <h1 
                      className="hero-title"
                      style={{
                        fontSize: 'clamp(52px, 7vw, 104px)',
                        lineHeight: '0.95',
                      }}
                    >
                      {slide.title}
                    </h1>
                    <div className="hero-meta">
                      {slide.formatTags?.map((tag) => (
                        <span key={tag} className="meta-tag">{tag}</span>
                      ))}
                      <span className="meta-dot">·</span>
                      <span>{slide.runtime} phút</span>
                      <span className="meta-dot">·</span>
                      <span className="meta-rating">★ {slide.rating}</span>
                      <span className="meta-dot">·</span>
                      <span 
                        className="meta-tag" 
                        style={{ 
                          background: '#ef4444', 
                          color: '#fff', 
                          borderColor: '#ef4444', 
                          fontSize: '11px', 
                          padding: '3px 8px' 
                        }}
                      >
                        {slide.ageRating}
                      </span>
                    </div>
                    <p 
                      className="hero-desc"
                      style={{
                        maxWidth: '560px',
                      }}
                    >
                      {slide.description}
                    </p>
                    <div className="hero-actions">
                      <Link
                        href={appRoutes.movieSchedule(slide.slug)}
                        className="btn-primary btn-large"
                        onFocus={() => setIsPaused(true)}
                        onBlur={() => setIsPaused(false)}
                      >
                        Đặt vé
                      </Link>
                      <button 
                        type="button"
                        className="btn-ghost btn-large" 
                        onClick={() => handleOpenTrailer(slide)}
                        onFocus={() => setIsPaused(true)}
                        onBlur={() => setIsPaused(false)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                           <polygon points="5,3 19,12 5,21" />
                        </svg>
                        Xem trailer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Next/Prev Navigation controls */}
        <div 
          className="hero-nav-controls"
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 10,
          }}
        >
          <button
            type="button"
            className="slider-btn"
            aria-label="Previous Slide"
            onClick={handlePrev}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div 
            className="hero-dots"
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`hero-dot ${index === currentIndex ? 'active' : ''}`}
                aria-label={`Go to slide ${index + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
                style={{
                  width: index === currentIndex ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '999px',
                  background: index === currentIndex ? 'var(--color-accent-deep, #7C6FE8)' : 'rgba(255, 255, 255, 0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            ))}
          </div>

          <button
            type="button"
            className="slider-btn"
            aria-label="Next Slide"
            onClick={handleNext}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </button>
        </div>

        <div className="hero-scroll-hint">
          <span>Cuộn xuống</span>
          <div className="scroll-line"></div>
        </div>

        {/* QUICK BOOKING PANEL */}
        <QuickBookingPanel />
      </section>

      {activeTrailer && (
        <TrailerModal
          isOpen={isTrailerOpen}
          onClose={() => setIsTrailerOpen(false)}
          videoSrc={activeTrailer.src}
          poster={activeTrailer.poster}
          title={activeTrailer.title}
        />
      )}
    </>
  );
};
