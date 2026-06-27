'use client';

import React from 'react';
import Link from 'next/link';
import { useEvent } from '../hooks/useEvents';
import { appRoutes } from '@/shared/routes/appRoutes';

interface EventDetailPageProps {
  slug: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function EventDetailPage({ slug }: EventDetailPageProps) {
  const { data: event, isLoading, isError } = useEvent(slug);

  if (isLoading) {
    return (
      <div className="event-detail-page">
        <div className="container">
          <div className="skeleton-image skeleton-image--featured" style={{ marginBottom: '2rem' }} />
          <div className="skeleton-line skeleton-line--hero" />
          <div className="skeleton-line" />
          <div className="skeleton-line skeleton-line--medium" />
        </div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="event-detail-page">
        <div className="container">
          <div className="events-error-state">
            <span className="state-icon">⚠️</span>
            <p>Không tìm thấy sự kiện này.</p>
            <Link href={appRoutes.events} className="btn-primary" style={{ marginTop: '1rem' }}>
              Quay lại Sự Kiện
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="event-detail-page">
      {/* Hero Image */}
      <div className="event-detail-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={event.imageUrl} alt={event.title} className="event-detail-hero-image" />
        <div className="event-detail-hero-overlay">
          <div className="container">
            <nav className="article-breadcrumb event-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Trang chủ</Link>
              <span aria-hidden="true"> / </span>
              <Link href={appRoutes.events}>Sự Kiện</Link>
              <span aria-hidden="true"> / </span>
              <span aria-current="page">{event.title}</span>
            </nav>
            {event.badge && <span className="event-badge">{event.badge}</span>}
            <h1 className="event-detail-title">{event.title}</h1>
            <div className="event-detail-dates">
              🗓 {formatDate(event.startDate)}
              {event.endDate && ` — ${formatDate(event.endDate)}`}
            </div>
          </div>
        </div>
      </div>

      <div className="container event-detail-body">
        <div className="event-detail-main">
          <p className="event-detail-desc">{event.description}</p>
          {event.content && (
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: event.content }}
            />
          )}
          {event.highlights && event.highlights.length > 0 && (
            <div className="event-highlights">
              <h2 className="event-highlights-title">Điểm nổi bật</h2>
              <ul className="event-highlights-list">
                {event.highlights.map((hl, i) => (
                  <li key={i} className="event-highlight-item">
                    <span className="event-highlight-icon">✓</span>
                    {hl}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="event-detail-sidebar">
          <div className="event-detail-info-card">
            <h3 className="event-info-card-title">Thông tin sự kiện</h3>
            <div className="event-info-row">
              <span className="event-info-label">Thể loại</span>
              <span>{event.categoryLabel}</span>
            </div>
            <div className="event-info-row">
              <span className="event-info-label">Bắt đầu</span>
              <span>{formatDate(event.startDate)}</span>
            </div>
            {event.endDate && (
              <div className="event-info-row">
                <span className="event-info-label">Kết thúc</span>
                <span>{formatDate(event.endDate)}</span>
              </div>
            )}
            {event.location && (
              <div className="event-info-row">
                <span className="event-info-label">Địa điểm</span>
                <span>{event.location}</span>
              </div>
            )}
            {event.condition && (
              <div className="event-condition event-detail-condition">
                <span className="event-condition-label">Điều kiện áp dụng:</span>
                <p>{event.condition}</p>
              </div>
            )}
            <Link href={appRoutes.movies} className="btn-primary" style={{ width: '100%', textAlign: 'center', marginTop: '1rem' }}>
              {event.ctaLabel}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
