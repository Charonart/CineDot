'use client';

import React from 'react';

interface BookingSummaryHeaderProps {
  movieTitle: string;
  cinemaName: string;
  roomName: string;
  showDate: string;
  showTime: string;
  format: string;
  runtime: number;
}

export const BookingSummaryHeader: React.FC<BookingSummaryHeaderProps> = ({
  movieTitle,
  cinemaName,
  roomName,
  showDate,
  showTime,
  format,
  runtime,
}) => {
  // Back logic - return to movie details page
  const handleBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  // Format date display nicely, e.g. "2026-06-01" -> "Thứ Hai, 01/06/2026"
  const getDayOfWeek = (dateStr: string) => {
    try {
      const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      
      const day = weekdays[date.getDay()];
      const d = String(date.getDate()).padStart(2, '0');
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const y = date.getFullYear();
      
      return `${day}, ${d}/${m}/${y}`;
    } catch {
      return dateStr;
    }
  };

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
      {/* Movie Meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Back navigation action */}
        <button
          type="button"
          onClick={handleBack}
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
              display: 'inline-block'
            }}
          >
            {format}
          </span>
          <h1 
            style={{ 
              fontSize: '22px', 
              fontFamily: 'var(--font-head)', 
              fontStyle: 'italic',
              fontWeight: 600, 
              color: '#131413', 
              margin: '0 0 4px 0',
              lineHeight: 1.2
            }}
          >
            {movieTitle}
          </h1>
          <span style={{ fontSize: '13.5px', color: 'var(--text2)', fontWeight: 500 }}>
            Thời lượng: {runtime} Phút
          </span>
        </div>
      </div>

      {/* Session details */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '32px',
          flexWrap: 'wrap'
        }}
        className="booking-session-meta"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text3)', fontWeight: 600 }}>Rạp chiếu</span>
          <strong style={{ fontSize: '15px', color: '#131413', fontWeight: 600 }}>{cinemaName}</strong>
          <span style={{ fontSize: '13px', color: 'var(--text2)', fontWeight: 500 }}>{roomName}</span>
        </div>

        <div style={{ width: '1px', height: '36px', background: 'var(--border)' }} className="meta-divider" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text3)', fontWeight: 600 }}>Suất chiếu</span>
          <strong style={{ fontSize: '15px', color: '#131413', fontWeight: 600 }}>{showTime}</strong>
          <span style={{ fontSize: '13px', color: 'var(--text2)', fontWeight: 500 }}>{getDayOfWeek(showDate)}</span>
        </div>
      </div>
    </header>
  );
};
