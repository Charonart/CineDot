/* eslint-disable @next/next/no-img-element, @next/next/no-html-link-for-pages, react-hooks/exhaustive-deps */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MovieCard } from '@modules/movie/components';

type TabType = 'now-showing' | 'coming-soon' | 'imax' | 'nationwide';

interface MovieData {
  id: string;
  title: string;
  posterUrl: string;
  format?: string;
  rating: string;
  genre: string;
}

interface ComingMovieData {
  id: string;
  title: string;
  posterUrl: string;
  releaseDate: string;
}

const moviesDb = {
  'now-showing': [
    {
      id: 'dune-part-two',
      title: 'Dune: Part Two',
      posterUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&q=80',
      format: 'IMAX',
      rating: '8.7',
      genre: 'Sci-Fi'
    },
    {
      id: 'godzilla-x-kong',
      title: 'Godzilla x Kong',
      posterUrl: 'https://images.unsplash.com/photo-1620421680010-0766ff230392?w=400&q=80',
      format: '4DX',
      rating: '7.2',
      genre: 'Action'
    },
    {
      id: 'ghostbusters-frozen-empire',
      title: 'Ghostbusters: Frozen Empire',
      posterUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&q=80',
      rating: '6.9',
      genre: 'Comedy'
    },
    {
      id: 'civil-war',
      title: 'Civil War',
      posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80',
      format: 'Dolby',
      rating: '7.5',
      genre: 'Thriller'
    },
    {
      id: 'furiosa',
      title: 'Furiosa',
      posterUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      format: 'IMAX',
      rating: '7.8',
      genre: 'Action'
    },
    {
      id: 'inside-out-2',
      title: 'Inside Out 2',
      posterUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80',
      rating: '8.1',
      genre: 'Animation'
    },
    {
      id: 'kingdom-of-the-planet',
      title: 'Kingdom of the Planet',
      posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80',
      format: '4DX',
      rating: '7.0',
      genre: 'Sci-Fi'
    }
  ] as MovieData[],
  'coming-soon': [
    {
      id: 'deadpool-wolverine',
      title: 'Deadpool & Wolverine',
      posterUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80',
      releaseDate: '26/07/2024'
    },
    {
      id: 'alien-romulus',
      title: 'Alien: Romulus',
      posterUrl: 'https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=600&q=80',
      releaseDate: '16/08/2024'
    },
    {
      id: 'joker-folie-a-deux',
      title: 'Joker: Folie à Deux',
      posterUrl: 'https://images.unsplash.com/photo-1605979257913-1704eb7b6246?w=600&q=80',
      releaseDate: '04/10/2024'
    },
    {
      id: 'venom-last-dance',
      title: 'Venom: The Last Dance',
      posterUrl: 'https://images.unsplash.com/photo-1570824104453-508955ab713e?w=600&q=80',
      releaseDate: '08/11/2024'
    }
  ] as ComingMovieData[],
  'imax': [
    {
      id: 'dune-part-two',
      title: 'Dune: Part Two',
      posterUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&q=80',
      format: 'IMAX',
      rating: '8.7',
      genre: 'Sci-Fi'
    },
    {
      id: 'furiosa',
      title: 'Furiosa',
      posterUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      format: 'IMAX',
      rating: '7.8',
      genre: 'Action'
    },
    {
      id: 'deadpool-wolverine-imax',
      title: 'Deadpool & Wolverine',
      posterUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80',
      format: 'IMAX',
      rating: 'Sắp chiếu',
      genre: 'Action'
    },
    {
      id: 'godzilla-x-kong-imax',
      title: 'Godzilla x Kong',
      posterUrl: 'https://images.unsplash.com/photo-1620421680010-0766ff230392?w=400&q=80',
      format: 'IMAX / 4DX',
      rating: '7.2',
      genre: 'Action'
    }
  ] as MovieData[],
  'nationwide': [
    {
      id: 'ghostbusters-frozen-empire',
      title: 'Ghostbusters: Frozen Empire',
      posterUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&q=80',
      rating: '6.9',
      genre: 'Comedy'
    },
    {
      id: 'civil-war',
      title: 'Civil War',
      posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80',
      format: 'Dolby',
      rating: '7.5',
      genre: 'Thriller'
    },
    {
      id: 'inside-out-2',
      title: 'Inside Out 2',
      posterUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80',
      rating: '8.1',
      genre: 'Animation'
    },
    {
      id: 'kingdom-of-the-planet',
      title: 'Kingdom of the Planet',
      posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80',
      format: '4DX',
      rating: '7.0',
      genre: 'Sci-Fi'
    },
    {
      id: 'godzilla-x-kong',
      title: 'Godzilla x Kong',
      posterUrl: 'https://images.unsplash.com/photo-1620421680010-0766ff230392?w=400&q=80',
      format: '4DX',
      rating: '7.2',
      genre: 'Action'
    }
  ] as MovieData[]
};

export const HomeMovieSections: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('now-showing');
  const [currentIndex, setCurrentIndex] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);
  const tabRefs = {
    'now-showing': useRef<HTMLButtonElement>(null),
    'coming-soon': useRef<HTMLButtonElement>(null),
    'imax': useRef<HTMLButtonElement>(null),
    'nationwide': useRef<HTMLButtonElement>(null),
  };

  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

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

  const activeMoviesList = moviesDb[activeTab] || [];
  const totalCards = activeMoviesList.length;

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
  }, [activeTab]);

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

  const showSliderControls = activeTab !== 'coming-soon';

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
          {/* NOW SHOWING, IMAX, NATIONWIDE PANELS */}
          {activeTab !== 'coming-soon' ? (
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
                  {(moviesDb[activeTab] as MovieData[]).map((movie) => (
                    <MovieCard
                      key={movie.id}
                      id={movie.id}
                      title={movie.title}
                      posterUrl={movie.posterUrl}
                      format={movie.format}
                      rating={movie.rating}
                      genre={movie.genre}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* COMING SOON PANEL */
            <div className="tab-panel active show" id="tab-coming-soon">
              <div className="coming-grid">
                {moviesDb['coming-soon'].map((movie) => (
                  <div key={movie.id} className="coming-card">
                    <div className="coming-poster-wrap">
                      <img src={movie.posterUrl} alt={movie.title} />
                      <div className="coming-overlay"></div>
                    </div>
                    <div className="coming-info">
                      <span className="release-date">{movie.releaseDate}</span>
                      <h3>{movie.title}</h3>
                      <button 
                        className="btn-outline btn-sm"
                        onClick={() => alert(`🔔 Đã đăng ký nhận thông báo phim: ${movie.title}`)}
                      >
                        Nhận thông báo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* VIEW ALL CTA */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
          <a
            href="/movies"
            className="btn-outline"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Xem thêm &gt;
          </a>
        </div>

      </div>
    </section>
  );
};
