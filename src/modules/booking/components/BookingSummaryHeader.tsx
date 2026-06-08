'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BookingShowtime } from '../types/booking.type';

interface BookingSummaryHeaderProps {
  showtime: BookingShowtime;
}

const formatShowDate = (dateStr: string) => {
  try {
    const date = new Date(`${dateStr}T00:00:00+07:00`);
    if (Number.isNaN(date.getTime())) return dateStr;

    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Asia/Ho_Chi_Minh',
    }).format(date);
  } catch {
    return dateStr;
  }
};

export const BookingSummaryHeader: React.FC<BookingSummaryHeaderProps> = ({ showtime }) => {
  const router = useRouter();

  return (
    <header
      className="booking-summary-header"
      style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '24px 32px',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text)',
            cursor: 'pointer',
            transition: 'var(--transition)',
          }}
          className="back-btn"
          aria-label="Quay lại"
          onMouseEnter={(e) => (e.currentTarget.style.background = '#eef0f2')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg2)')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div>
          <span
            className="badge"
            style={{
              background: '#CFC9EB',
              color: '#131413',
              fontWeight: 600,
              fontSize: '11px',
              padding: '4px 10px',
              borderRadius: '6px',
              marginBottom: '6px',
              display: 'inline-block',
            }}
          >
            {showtime.room.screenType}
          </span>
          <h1
            style={{
              fontSize: '22px',
              fontFamily: 'var(--font-head)',
              fontStyle: 'italic',
              fontWeight: 600,
              color: '#131413',
              margin: '0 0 4px 0',
              lineHeight: 1.2,
            }}
          >
            {showtime.movie.title}
          </h1>
          <span style={{ fontSize: '13.5px', color: 'var(--text2)', fontWeight: 500 }}>
            Thời lượng: {showtime.movie.runtime} phút · {showtime.movie.ageRating}
          </span>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
          flexWrap: 'wrap',
        }}
        className="booking-session-meta"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text3)', fontWeight: 600 }}>Rạp chiếu</span>
          <strong style={{ fontSize: '15px', color: '#131413', fontWeight: 600 }}>{showtime.cinema.name}</strong>
          <span style={{ fontSize: '13px', color: 'var(--text2)', fontWeight: 500 }}>{showtime.room.name}</span>
        </div>

        <div style={{ width: '1px', height: '36px', background: 'var(--border)' }} className="meta-divider" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text3)', fontWeight: 600 }}>Suất chiếu</span>
          <strong style={{ fontSize: '15px', color: '#131413', fontWeight: 600 }}>{showtime.showTime}</strong>
          <span style={{ fontSize: '13px', color: 'var(--text2)', fontWeight: 500 }}>{formatShowDate(showtime.showDate)}</span>
        </div>
      </div>
    </header>
  );
};
