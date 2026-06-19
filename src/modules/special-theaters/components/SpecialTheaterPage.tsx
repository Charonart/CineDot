'use client';

import React from 'react';
import Link from 'next/link';
import { useSpecialTheater } from '../hooks/useSpecialTheaters';
import { TheaterType, THEATER_TYPE_LABELS } from '../types/special-theaters.type';
import { appRoutes } from '@/shared/routes/appRoutes';

const THEATER_TYPES: TheaterType[] = ['imax', '4dx', 'dolby-atmos', 'kids'];

interface SpecialTheaterPageProps {
  type: TheaterType;
}

export function SpecialTheaterPage({ type }: SpecialTheaterPageProps) {
  const { data: theater, isLoading, isError } = useSpecialTheater(type);

  if (isLoading) {
    return (
      <div className="special-theater-page">
        <div className="skeleton-image" style={{ height: '60vh' }} />
        <div className="container">
          <div className="skeleton-line skeleton-line--hero" style={{ marginTop: '2rem' }} />
          <div className="skeleton-line" />
          <div className="skeleton-line skeleton-line--medium" />
        </div>
      </div>
    );
  }

  if (isError || !theater) {
    return (
      <div className="special-theater-page">
        <div className="container">
          <div className="cinemas-error-state">
            <span className="state-icon">⚠️</span>
            <p>Không thể tải thông tin phòng chiếu này.</p>
            <Link href={appRoutes.specialTheaters} className="btn-primary" style={{ marginTop: '1rem' }}>
              Xem Rạp Đặc Biệt
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="special-theater-page">
      {/* Hero */}
      <section className="special-theater-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={theater.heroImageUrl} alt={theater.name} className="special-theater-hero-image" />
        <div className="special-theater-hero-overlay">
          <div className="container special-theater-hero-content">
            <div className="special-theater-type-tabs">
              {THEATER_TYPES.map((t) => (
                <Link
                  key={t}
                  href={appRoutes.specialTheaterType(t)}
                  className={`special-type-tab ${t === type ? 'active' : ''}`}
                  aria-current={t === type ? 'page' : undefined}
                >
                  {THEATER_TYPE_LABELS[t]}
                </Link>
              ))}
            </div>
            <h1 className="special-theater-hero-title">{theater.name}</h1>
            <p className="special-theater-hero-tagline">{theater.tagline}</p>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="special-theater-desc-section">
        <div className="container">
          <div className="special-theater-desc-grid">
            <div className="special-theater-desc">
              <p>{theater.description}</p>
              <div className="special-theater-tech-badge">
                <span className="tech-icon">🔬</span>
                <span>{theater.technology}</span>
              </div>
            </div>
            <div className="special-theater-features">
              {theater.features.map((f) => (
                <div key={f.title} className="special-feature-card">
                  <div className="special-feature-icon" aria-hidden="true">{f.icon}</div>
                  <div>
                    <div className="special-feature-title">{f.title}</div>
                    <div className="special-feature-desc">{f.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Supported Cinemas */}
      {theater.supportedCinemas.length > 0 && (
        <section className="special-theater-cinemas-section">
          <div className="container">
            <h2 className="special-theater-section-title">Rạp hỗ trợ {theater.name}</h2>
            <div className="special-theater-cinemas-list">
              {theater.supportedCinemas.map((cinema) => (
                <div key={cinema.id} className="special-cinema-ref-card">
                  <div className="special-cinema-ref-info">
                    <Link href={cinema.href} className="special-cinema-ref-name">{cinema.name}</Link>
                    <p className="special-cinema-ref-address">📍 {cinema.address}</p>
                  </div>
                  <Link href={cinema.href} className="btn-secondary special-cinema-detail-btn">
                    Xem chi tiết
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Now Showing */}
      {theater.nowShowingMovies.length > 0 && (
        <section className="special-theater-movies-section">
          <div className="container">
            <h2 className="special-theater-section-title">Phim đang chiếu định dạng {theater.name}</h2>
            <div className="special-theater-movies-grid">
              {theater.nowShowingMovies.map((movie) => (
                <div key={movie.id} className="special-movie-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={movie.posterUrl} alt={movie.title} className="special-movie-poster" loading="lazy" />
                  <div className="special-movie-info">
                    <span className="special-movie-rating">⭐ {movie.rating.toFixed(1)}</span>
                    <h3 className="special-movie-title">{movie.title}</h3>
                    <Link href={movie.bookingHref} className="btn-primary special-movie-book-btn">
                      Đặt vé
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
