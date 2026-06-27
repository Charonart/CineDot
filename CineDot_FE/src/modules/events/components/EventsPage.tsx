'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useEvents } from '../hooks/useEvents';
import { EventCategory, EVENT_CATEGORY_LABELS, Event } from '../types/events.type';
import { appRoutes } from '@/shared/routes/appRoutes';

const CATEGORIES: { value: EventCategory | undefined; label: string }[] = [
  { value: undefined, label: 'Tất Cả' },
  { value: 'now', label: 'Đang diễn ra' },
  { value: 'promotions', label: 'Ưu đãi đặc biệt' },
  { value: 'news', label: 'Tin tức' },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function EventCard({ event, featured = false }: { event: Event; featured?: boolean }) {
  if (featured) {
    return (
      <div className="event-featured-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={event.imageUrl} alt={event.title} className="event-featured-image" />
        <div className="event-featured-overlay">
          <div className="event-featured-meta">
            {event.badge && <span className="event-badge">{event.badge}</span>}
            <span className="event-category-label">{event.categoryLabel}</span>
          </div>
          <h2 className="event-featured-title">{event.title}</h2>
          <p className="event-featured-desc">{event.description}</p>
          <div className="event-dates">
            <span>🗓 {formatDate(event.startDate)}</span>
            {event.endDate && <span> — {formatDate(event.endDate)}</span>}
          </div>
          <Link href={event.href} className="btn-primary event-cta">
            {event.ctaLabel}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="event-card">
      <Link href={event.href} className="event-card-image-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={event.imageUrl} alt={event.title} className="event-card-image" loading="lazy" />
        {event.badge && <span className="event-badge event-badge--over">{event.badge}</span>}
      </Link>
      <div className="event-card-body">
        <div className="event-card-meta">
          <span className="event-category-label">{event.categoryLabel}</span>
          <div className="event-card-dates">
            <span>🗓 {formatDate(event.startDate)}</span>
            {event.endDate && <span> — {formatDate(event.endDate)}</span>}
          </div>
        </div>
        <Link href={event.href} className="event-card-title">{event.title}</Link>
        <p className="event-card-desc">{event.description}</p>
        {event.condition && (
          <div className="event-condition">
            <span className="event-condition-label">Điều kiện:</span> {event.condition}
          </div>
        )}
        <Link href={event.href} className="btn-event-cta">
          {event.ctaLabel} →
        </Link>
      </div>
    </div>
  );
}

function EventSkeleton() {
  return (
    <div className="event-card event-card--skeleton">
      <div className="skeleton-image skeleton-image--card" />
      <div className="event-card-body">
        <div className="skeleton-line skeleton-line--short" />
        <div className="skeleton-line" />
        <div className="skeleton-line skeleton-line--medium" />
      </div>
    </div>
  );
}

interface EventsPageProps {
  initialCategory?: EventCategory;
}

export function EventsPage({ initialCategory }: EventsPageProps) {
  const [activeCategory, setActiveCategory] = useState<EventCategory | undefined>(initialCategory);
  const { data, isLoading, isError } = useEvents(activeCategory);

  const events = data?.items || [];
  const featuredEvent = events.find((e) => e.isFeatured) || events[0];
  const gridEvents = events.filter((e) => e.id !== featuredEvent?.id);

  return (
    <div className="events-page">
      {/* Hero */}
      <section className="events-hero">
        <div className="events-hero-bg" aria-hidden="true" />
        <div className="container events-hero-content">
          <div className="events-hero-badge">🎉 Sự Kiện & Ưu Đãi</div>
          <h1 className="events-hero-title">Sự Kiện & Ưu Đãi</h1>
          <p className="events-hero-subtitle">
            Khám phá sự kiện điện ảnh đặc biệt, ưu đãi độc quyền và tin tức nóng nhất từ CineDot
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="events-categories">
        <div className="container">
          <div className="events-tabs" role="tablist">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value ?? 'all'}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat.value}
                className={`events-tab ${activeCategory === cat.value ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="events-category-nav">
            {(['now', 'promotions', 'news'] as EventCategory[]).map((cat) => (
              <Link
                key={cat}
                href={appRoutes.eventCategory(cat)}
                className={`events-cat-link ${initialCategory === cat ? 'active' : ''}`}
              >
                {EVENT_CATEGORY_LABELS[cat]}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="events-content">
        <div className="container">
          {isError && (
            <div className="events-error-state">
              <span className="state-icon">⚠️</span>
              <p>Không thể tải sự kiện. Vui lòng thử lại sau.</p>
            </div>
          )}

          {isLoading ? (
            <>
              <div className="skeleton-image skeleton-image--featured" style={{ marginBottom: '2rem' }} />
              <div className="events-grid">
                {Array.from({ length: 6 }).map((_, i) => <EventSkeleton key={i} />)}
              </div>
            </>
          ) : events.length === 0 ? (
            <div className="events-empty-state">
              <span className="state-icon">🎭</span>
              <p>Hiện không có sự kiện nào trong mục này.</p>
            </div>
          ) : (
            <>
              {featuredEvent && <EventCard event={featuredEvent} featured />}
              <div className="events-grid">
                {gridEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
