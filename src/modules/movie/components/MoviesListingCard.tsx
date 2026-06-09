/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { MovieListingItem } from '../data/moviesListingData';
import { appRoutes } from '@/shared/routes/appRoutes';

interface MoviesListingCardProps {
  movie: MovieListingItem & { slug?: string }; // Allow slug parameter
  onPlayTrailer: (movie: MovieListingItem) => void;
}

export const MoviesListingCard: React.FC<MoviesListingCardProps> = ({ movie, onPlayTrailer }) => {
  const { id, slug, title, poster, rating, ageRating, category, genre, format } = movie;

  const ageClass = ageRating ? ageRating.toLowerCase() : 'p';
  const resolvedSlug = slug || String(id);
  const detailUrl = appRoutes.movieDetail(resolvedSlug);
  const bookingUrl = appRoutes.movieSchedule(resolvedSlug);

  const metaInfo = category === 'coming-soon' ? (
    <span className="release-date" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-accent-deep)', textTransform: 'uppercase' }}>
      Sắp chiếu hè
    </span>
  ) : (
    <span className="rating">★ {rating || '9.0'}</span>
  );

  return (
    <div className="movie-card" data-movie-id={id}>
      <div className="movie-poster-wrap">
        <img src={poster} alt={title} className="movie-poster" loading="lazy" />
        
        {/* Classification Badge */}
        <span className={`age-rating-badge ${ageClass}`}>{ageRating}</span>
        
        {/* Hover Actions Overlay */}
        <div className="movie-overlay">
          <Link 
            href={bookingUrl} 
            className="btn-primary movie-action-btn dat-ve-btn" 
            aria-label="Đặt vé"
          >
            Đặt vé
          </Link>
          <button 
            type="button"
            className="btn-ghost movie-action-btn trailer-btn" 
            aria-label="Xem trailer" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPlayTrailer(movie);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
              <polygon points="5,3 19,12 5,21" />
            </svg>
            Trailer
          </button>
        </div>
        
        {format && <span className="movie-format-badge">{format.split(' ')[0]}</span>}
      </div>
      <div className="movie-info">
        <h3>
          <Link href={detailUrl} className="movie-title-link" style={{ color: 'inherit', textDecoration: 'none' }}>
            {title}
          </Link>
        </h3>
        <div className="movie-meta-row">
          {metaInfo}
          <span className="genre-tag">{genre ? genre.split(' / ')[0] : 'Điện ảnh'}</span>
        </div>
      </div>
    </div>
  );
};
