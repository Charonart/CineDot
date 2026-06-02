/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface MovieDetailInfoProps {
  poster: string;
  title: string;
  originalTitle?: string;
  rating: number;
  voteCount: number;
  runtime: number;
  releaseDate: string;
  country: string;
  producer: string;
  genres: string[];
  director: string;
  cast: string[];
  onPlayTrailer: () => void;
}

export const MovieDetailInfo: React.FC<MovieDetailInfoProps> = ({
  poster,
  title,
  originalTitle,
  rating,
  voteCount,
  runtime,
  releaseDate,
  country,
  producer,
  genres,
  director,
  cast,
  onPlayTrailer
}) => {
  const handleScrollToSchedule = (e: React.MouseEvent) => {
    e.preventDefault();
    const scheduleEl = document.getElementById('schedule');
    if (scheduleEl) {
      scheduleEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="movie-info-card fade-up in-view">
      <div className="movie-info-flex">
        <div className="movie-detail-poster-wrap">
          <img src={poster} alt={`${title} Poster`} className="movie-detail-poster" />
        </div>
        <div className="movie-detail-metadata">
          <h1 className="movie-detail-title">
            {title} {originalTitle && <span style={{ fontSize: '18px', fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginTop: '4px' }}>({originalTitle})</span>}
          </h1>

          <div className="hero-meta detail-meta">
            <span className="meta-tag">2D</span>
            <span className="meta-dot">·</span>
            <span>{runtime} phút</span>
            <span className="meta-dot">·</span>
            <span>{releaseDate}</span>
            <span className="meta-dot">·</span>
            <span className="meta-rating">
              ★ {rating} <small>({voteCount} bình chọn)</small>
            </span>
          </div>

          <div className="info-rows">
            <div className="info-row">
              <span className="info-label">Quốc gia:</span>
              <span className="info-value">{country}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Nhà sản xuất:</span>
              <span className="info-value">{producer}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Thể loại:</span>
              <span className="info-value">
                {genres.map((g) => (
                  <span key={g} className="chip" style={{ marginRight: '6px' }}>
                    {g}
                  </span>
                ))}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Đạo diễn:</span>
              <span className="info-value">
                <span className="chip">{director}</span>
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Diễn viên:</span>
              <span className="info-value">
                {cast.map((c) => (
                  <span key={c} className="chip" style={{ marginRight: '6px' }}>
                    {c}
                  </span>
                ))}
              </span>
            </div>
          </div>

          <div className="movie-detail-actions">
            <button 
              type="button" 
              className="btn-primary btn-large" 
              id="detailBookBtn"
              onClick={handleScrollToSchedule}
            >
              Đặt vé ngay
            </button>
            <button 
              type="button" 
              className="btn-ghost btn-large" 
              id="openTrailerBtn3"
              onClick={onPlayTrailer}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
                <polygon points="5,3 19,12 5,21" />
              </svg>
              Xem trailer
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
