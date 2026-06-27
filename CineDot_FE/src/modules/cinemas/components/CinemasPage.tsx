'use client';

import React from 'react';
import Link from 'next/link';
import { useCinemas } from '../hooks/useCinemas';
import { Cinema } from '../types/cinemas.type';
import { appRoutes } from '@/shared/routes/appRoutes';

function FormatBadge({ format }: { format: string }) {
  const colorMap: Record<string, string> = {
    IMAX: '#0EA5E9',
    '4DX': '#F59E0B',
    'Dolby Atmos': '#8B5CF6',
    '3D': '#10B981',
    '2D': '#6B7280',
  };
  const color = colorMap[format] || '#6B7280';
  return (
    <span
      className="cinema-format-badge"
      style={{ background: `${color}20`, color, borderColor: `${color}40` }}
    >
      {format}
    </span>
  );
}

function CinemaCard({ cinema }: { cinema: Cinema }) {
  return (
    <div className="cinema-card">
      <div className="cinema-card-image-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cinema.imageUrl} alt={cinema.name} className="cinema-card-image" loading="lazy" />
        {cinema.isFeatured && <span className="cinema-featured-badge">★ Nổi bật</span>}
      </div>
      <div className="cinema-card-body">
        <h3 className="cinema-card-name">{cinema.name}</h3>
        <p className="cinema-card-address">📍 {cinema.address}</p>
        <p className="cinema-card-hours">🕘 {cinema.openingHours}</p>
        <div className="cinema-card-formats">
          {cinema.formats.map((f) => <FormatBadge key={f} format={f} />)}
        </div>
        <div className="cinema-card-stats">
          <span>{cinema.totalScreens} phòng chiếu</span>
          <span className="cinema-dot" aria-hidden="true">·</span>
          <span>{cinema.totalSeats.toLocaleString()} chỗ ngồi</span>
        </div>
        <div className="cinema-card-actions">
          <Link href={cinema.href} className="btn-cinema-detail">
            Xem chi tiết
          </Link>
          <Link href={cinema.showtimesHref} className="btn-primary cinema-showtimes-btn">
            Xem suất chiếu
          </Link>
        </div>
      </div>
    </div>
  );
}

function CinemaSkeleton() {
  return (
    <div className="cinema-card cinema-card--skeleton">
      <div className="skeleton-image skeleton-image--card" />
      <div className="cinema-card-body">
        <div className="skeleton-line" />
        <div className="skeleton-line skeleton-line--medium" />
        <div className="skeleton-line skeleton-line--short" />
      </div>
    </div>
  );
}

export function CinemasPage() {
  const { data, isLoading, isError } = useCinemas();
  const cinemas = data?.items || [];

  return (
    <div className="cinemas-page">
      {/* Hero */}
      <section className="cinemas-hero">
        <div className="cinemas-hero-bg" aria-hidden="true" />
        <div className="container cinemas-hero-content">
          <div className="cinemas-hero-badge">🎭 Hệ Thống Rạp CineDot</div>
          <h1 className="cinemas-hero-title">Hệ Thống Rạp CINE</h1>
          <p className="cinemas-hero-subtitle">
            Khám phá hệ thống {cinemas.length || '14+'}  rạp chiếu phim CineDot trên toàn quốc
            với công nghệ hiện đại và trải nghiệm đẳng cấp
          </p>
          <div className="cinemas-hero-actions">
            <Link href={appRoutes.cinemaShowtimes} className="btn-primary">
              Xem lịch chiếu
            </Link>
            <Link href={appRoutes.cinemaPricing} className="btn-secondary">
              Bảng giá vé
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="cinemas-stats">
        <div className="container cinemas-stats-grid">
          {[
            { value: '14+', label: 'Rạp toàn quốc' },
            { value: '100+', label: 'Phòng chiếu' },
            { value: '20,000+', label: 'Chỗ ngồi' },
            { value: '5', label: 'Thành phố lớn' },
          ].map((stat) => (
            <div key={stat.label} className="cinemas-stat-item">
              <div className="cinemas-stat-value">{stat.value}</div>
              <div className="cinemas-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Cinema Grid */}
      <section className="cinemas-list">
        <div className="container">
          <div className="cinemas-section-header">
            <h2 className="cinemas-section-title">Danh Sách Rạp</h2>
            <div className="cinemas-filter-row">
              <Link href={appRoutes.cinemaShowtimes} className="cinemas-quick-link">
                Lịch chiếu theo rạp →
              </Link>
              <Link href={appRoutes.cinemaPricing} className="cinemas-quick-link">
                Bảng giá →
              </Link>
            </div>
          </div>

          {isError && (
            <div className="cinemas-error-state">
              <span className="state-icon">⚠️</span>
              <p>Không thể tải danh sách rạp. Vui lòng thử lại sau.</p>
            </div>
          )}

          {isLoading ? (
            <div className="cinemas-grid">
              {Array.from({ length: 6 }).map((_, i) => <CinemaSkeleton key={i} />)}
            </div>
          ) : cinemas.length === 0 ? (
            <div className="cinemas-empty-state">
              <span className="state-icon">🎭</span>
              <p>Chưa có thông tin rạp.</p>
            </div>
          ) : (
            <div className="cinemas-grid">
              {cinemas.map((cinema) => <CinemaCard key={cinema.id} cinema={cinema} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
