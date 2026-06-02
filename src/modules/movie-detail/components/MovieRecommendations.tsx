/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { MovieRecommendation } from '../data/movieDetailData';

interface MovieRecommendationsProps {
  recommendations: MovieRecommendation[];
}

export const MovieRecommendations: React.FC<MovieRecommendationsProps> = ({ recommendations }) => {
  return (
    <aside className="detail-sidebar">
      <div className="sidebar-sticky-wrap">
        <h2 className="sidebar-title scroll-text-slide-left">PHIM ĐANG CHIẾU</h2>

        <div className="sidebar-cards">
          {recommendations.map((movie) => (
            <div key={movie.id} className="sidebar-movie-card">
              <div className="sidebar-poster-wrap">
                <img src={movie.poster} alt={movie.title} />
                <span className="sidebar-badge-rating">★ {movie.rating}</span>
                <span className="sidebar-badge-age">{movie.ageRating}</span>
                <div className="sidebar-card-overlay">
                  <Link href={`/movies/detail/${movie.id}`} className="sidebar-overlay-btn">
                    <svg 
                      className="ticket-icon" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="6" y1="12" x2="18" y2="12"></line>
                    </svg>
                    Mua vé
                  </Link>
                </div>
              </div>
              <div className="sidebar-info">
                <h3 
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    window.location.href = `/movies/detail/${movie.id}`;
                  }}
                >
                  {movie.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="sidebar-more-wrap">
          <Link href="/movies" className="sidebar-more-btn">
            Xem thêm
            <svg 
              className="chevron-icon" 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Link>
        </div>
      </div>
    </aside>
  );
};

