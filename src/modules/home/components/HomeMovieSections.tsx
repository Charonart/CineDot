/* eslint-disable @next/next/no-img-element, react-hooks/exhaustive-deps */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MovieCard } from '@modules/movie/components';
import { useMoviesList } from '@/modules/movie/hooks/useMovies';
import { appRoutes } from '@/shared/routes/appRoutes';

type TabType = 'now-showing' | 'coming-soon' | 'imax' | 'nationwide';

export const HomeMovieSections: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('now-showing');
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data, isLoading, isError } = useMoviesList({ 
    category: activeTab,
    limit: activeTab === 'now-showing' ? 8 : undefined,
  });

  const sliderRef = useRef<HTMLDivElement>(null);
  const tabRefs = {
    'now-showing': useRef<HTMLButtonElement>(null),
    'coming-soon': useRef<HTMLButtonElement>(null),
    'imax': useRef<HTMLButtonElement>(null),
    'nationwide': useRef<HTMLButtonElement>(null),
  };

  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

  const movies = data?.items || [];
  const totalCards = movies.length;

  // Dynamic layout measurements
  const getVisibleCount = () => {
    if (typeof window === 'undefined') return 4;
    const w = window.innerWidth;
    if (w <= 480) return 1;
    if (w <= 700) return 2;
    if (w <= 1100) return 3;
    return 4;
  };

  const getCardWidth = () => {
    if (!sliderRef.current || !sliderRef.current.children[0]) return 0;
    const firstCard = sliderRef.current.children[0] as HTMLElement;
    return firstCard.offsetWidth + 20; // width + gap
  };

  const getMaxIndex = () => {
    const visible = getVisibleCount();
    return Math.max(0, totalCards - visible);
  };

  // Re-align indicator on activeTab switch & window resize
  const alignIndicator = () => {
    const activeBtn = tabRefs[activeTab].current;
    if (activeBtn) {
      setIndicatorStyle({
        left: `${activeBtn.offsetLeft}px`,
        width: `${activeBtn.offsetWidth}px`,
      });
    }
  };

  useEffect(() => {
    alignIndicator();
    setCurrentIndex(0); // Reset index on tab change

    window.addEventListener('resize', alignIndicator);
    return () => window.removeEventListener('resize', alignIndicator);
  }, [activeTab, totalCards]);

  const slidePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const slideNext = () => {
    const maxIdx = getMaxIndex();
    setCurrentIndex((prev) => Math.min(maxIdx, prev + 1));
  };

  const maxIndex = getMaxIndex();
  const cardWidth = getCardWidth();
  const translateX = currentIndex * cardWidth;

  const showSliderControls = activeTab !== 'coming-soon' && totalCards > getVisibleCount();

  return (
    <section className="section movies-section fade-up in-view" id="movies">
      <div className="container">
        
        {/* SECTION HEADER & TAB NAV */}
        <div className="section-header-tabs">
          <div className="header-left">
            <p className="section-eyebrow">Khám phá</p>
            <h2 className="section-title scroll-text-slide-left in-view">
              Khám phá{' '}
              <span className="highlight-text" data-variant="underline" data-color="primary">
                Phim
              </span>
            </h2>
          </div>

          <div className="tabs-nav-container">
            <div className="tabs-nav" id="movieTabsNav">
              <button
                ref={tabRefs['now-showing']}
                className={`tab-btn ${activeTab === 'now-showing' ? 'active' : ''}`}
                onClick={() => setActiveTab('now-showing')}
              >
                Đang chiếu
              </button>
              <button
                ref={tabRefs['coming-soon']}
                className={`tab-btn ${activeTab === 'coming-soon' ? 'active' : ''}`}
                onClick={() => setActiveTab('coming-soon')}
              >
                Sắp chiếu
              </button>
              <button
                ref={tabRefs['imax']}
                className={`tab-btn ${activeTab === 'imax' ? 'active' : ''}`}
                onClick={() => setActiveTab('imax')}
              >
                Phim IMAX
              </button>
              <button
                ref={tabRefs['nationwide']}
                className={`tab-btn ${activeTab === 'nationwide' ? 'active' : ''}`}
                onClick={() => setActiveTab('nationwide')}
              >
                Toàn quốc
              </button>
              <span className="tab-glow-indicator" style={indicatorStyle}></span>
            </div>
          </div>

          {/* SLIDER CONTROLS */}
          {showSliderControls && (
            <div 
              className="slider-controls" 
              id="tabSliderControls"
              style={{
                opacity: showSliderControls ? 1 : 0,
                pointerEvents: showSliderControls ? 'all' : 'none',
                transition: 'opacity 0.3s ease'
              }}
            >
              <button
                type="button"
                className="slider-btn"
                id="sliderPrev"
                aria-label="Previous"
                onClick={slidePrev}
                style={{ opacity: currentIndex === 0 ? 0.35 : 1 }}
                disabled={currentIndex === 0}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15,18 9,12 15,6" />
                </svg>
              </button>
              <button
                type="button"
                className="slider-btn"
                id="sliderNext"
                aria-label="Next"
                onClick={slideNext}
                style={{ opacity: currentIndex >= maxIndex ? 0.35 : 1 }}
                disabled={currentIndex >= maxIndex}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* TABS PANELS CONTENT */}
        <div className="tabs-content" style={{ minHeight: '520px' }}>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>Đang tải danh sách phim...</p>
            </div>
          ) : isError ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
              <p style={{ color: 'var(--color-accent)', fontSize: '15px' }}>Không thể tải phim. Vui lòng thử lại.</p>
            </div>
          ) : movies.length === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px' }}>Không có phim nào trong danh mục này.</p>
            </div>
          ) : activeTab !== 'coming-soon' ? (
            /* NOW SHOWING, IMAX, NATIONWIDE PANELS */
            <div className="tab-panel active show" id={`tab-${activeTab}`}>
              <div className="slider-track-wrap">
                <div
                  ref={sliderRef}
                  className="movie-slider animate-slide"
                  id={`${activeTab}Slider`}
                  style={{
                    transform: `translateX(-${translateX}px)`,
                    display: 'flex',
                    transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                    gap: '20px'
                  }}
                >
                  {movies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      id={movie.id}
                      slug={movie.slug}
                      title={movie.title}
                      posterUrl={movie.posterUrl}
                      format={movie.formatTags && movie.formatTags[0]}
                      rating={movie.rating}
                      genre={movie.genres && movie.genres[0] ? movie.genres[0].name : 'Điện ảnh'}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* COMING SOON PANEL */
            <div className="tab-panel active show" id="tab-coming-soon">
              <div className="coming-grid">
                {movies.map((movie) => {
                  const detailUrl = appRoutes.movieDetail(movie.slug || String(movie.id));
                  return (
                    <div key={movie.id} className="coming-card">
                      <div className="coming-poster-wrap">
                        <Link href={detailUrl}>
                          <img src={movie.posterUrl} alt={movie.title} style={{ cursor: 'pointer' }} />
                        </Link>
                        <div className="coming-overlay"></div>
                      </div>
                      <div className="coming-info">
                        <span className="release-date">{movie.releaseDate || 'Sắp chiếu'}</span>
                        <h3>
                          <Link href={detailUrl} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {movie.title}
                          </Link>
                        </h3>
                        <button 
                          type="button"
                          className="btn-outline btn-sm"
                          onClick={() => alert(`🔔 Đã đăng ký nhận thông báo phim: ${movie.title}`)}
                        >
                          Nhận thông báo
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* VIEW ALL CTA */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
          <Link
            href={appRoutes.movies}
            className="btn-outline"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Xem thêm &gt;
          </Link>
        </div>

      </div>
    </section>
  );
};
