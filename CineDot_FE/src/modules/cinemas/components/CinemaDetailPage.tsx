'use client';

import React from 'react';
import Link from 'next/link';
import { useCinema } from '../hooks/useCinemas';
import { appRoutes } from '@/shared/routes/appRoutes';

interface CinemaDetailPageProps {
  slug: string;
}

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
    <span className="cinema-format-badge" style={{ background: `${color}20`, color, borderColor: `${color}40` }}>
      {format}
    </span>
  );
}

export function CinemaDetailPage({ slug }: CinemaDetailPageProps) {
  const { data: cinema, isLoading, isError } = useCinema(slug);

  if (isLoading) {
    return (
      <div className="cinema-detail-page">
        <div className="skeleton-image skeleton-image--hero" />
        <div className="container">
          <div className="skeleton-line skeleton-line--hero" style={{ marginTop: '2rem' }} />
          <div className="skeleton-line" />
          <div className="skeleton-line skeleton-line--medium" />
        </div>
      </div>
    );
  }

  if (isError || !cinema) {
    return (
      <div className="cinema-detail-page">
        <div className="container">
          <div className="cinemas-error-state">
            <span className="state-icon">⚠️</span>
            <p>Không tìm thấy rạp này.</p>
            <Link href={appRoutes.cinemas} className="btn-primary" style={{ marginTop: '1rem' }}>
              Xem danh sách rạp
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cinema-detail-page">
      {/* Hero */}
      <div className="cinema-detail-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cinema.imageUrl} alt={cinema.name} className="cinema-detail-hero-image" />
        <div className="cinema-detail-hero-overlay">
          <div className="container">
            <nav className="article-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Trang chủ</Link>
              <span aria-hidden="true"> / </span>
              <Link href={appRoutes.cinemas}>Rạp CineDot</Link>
              <span aria-hidden="true"> / </span>
              <span aria-current="page">{cinema.name}</span>
            </nav>
            <h1 className="cinema-detail-title">{cinema.name}</h1>
            <p className="cinema-detail-address">📍 {cinema.address}, {cinema.city}</p>
          </div>
        </div>
      </div>

      <div className="container cinema-detail-body">
        <div className="cinema-detail-main">
          {/* Formats */}
          <div className="cinema-detail-section">
            <h2 className="cinema-detail-section-title">Định Dạng Phòng Chiếu</h2>
            <div className="cinema-detail-formats">
              {cinema.formats.map((f) => <FormatBadge key={f} format={f} />)}
            </div>
          </div>

          {/* Amenities */}
          <div className="cinema-detail-section">
            <h2 className="cinema-detail-section-title">Tiện Ích</h2>
            <ul className="cinema-amenities-list">
              {cinema.amenities.map((a) => (
                <li key={a} className="cinema-amenity-item">
                  <span className="cinema-amenity-icon">✓</span> {a}
                </li>
              ))}
            </ul>
          </div>

          {/* Screens */}
          {cinema.screens && cinema.screens.length > 0 && (
            <div className="cinema-detail-section">
              <h2 className="cinema-detail-section-title">Phòng Chiếu</h2>
              <div className="cinema-screens-grid">
                {cinema.screens.map((screen) => (
                  <div key={screen.id} className="cinema-screen-card">
                    <span className="cinema-screen-name">{screen.name}</span>
                    <span className="cinema-screen-capacity">{screen.capacity} chỗ</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="cinema-detail-sidebar">
          <div className="cinema-info-card">
            <h3 className="cinema-info-title">Thông Tin Liên Hệ</h3>
            <div className="cinema-info-row">
              <span className="cinema-info-icon">📞</span>
              <a href={`tel:${cinema.phone}`} className="cinema-info-value">{cinema.phone}</a>
            </div>
            {cinema.email && (
              <div className="cinema-info-row">
                <span className="cinema-info-icon">✉️</span>
                <a href={`mailto:${cinema.email}`} className="cinema-info-value">{cinema.email}</a>
              </div>
            )}
            <div className="cinema-info-row">
              <span className="cinema-info-icon">🕘</span>
              <span className="cinema-info-value">{cinema.openingHours}</span>
            </div>
            <div className="cinema-info-row">
              <span className="cinema-info-icon">🎬</span>
              <span className="cinema-info-value">{cinema.totalScreens} phòng · {cinema.totalSeats.toLocaleString()} chỗ</span>
            </div>
            <a
              href={cinema.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary cinema-map-btn"
              aria-label="Xem bản đồ rạp"
            >
              🗺 Xem Bản Đồ
            </a>
            <Link href={`${appRoutes.movies}?category=now-showing`} className="btn-primary cinema-booking-btn">
              Đặt Vé Ngay
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
