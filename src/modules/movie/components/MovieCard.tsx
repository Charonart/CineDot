/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrailerModal } from '@/shared/components/visual';

interface Movie {
  id: string | number;
  title: string;
  posterUrl: string;
  format?: string;
  rating?: string | number;
  genre?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  genres?: any[];
}

interface MovieCardProps {
  id?: string | number;
  title?: string;
  posterUrl?: string;
  format?: string;
  rating?: string | number;
  genre?: string;
  movie?: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = (props) => {
  const router = useRouter();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const movie = props.movie || {
    id: props.id || '',
    title: props.title || '',
    posterUrl: props.posterUrl || '',
    format: props.format,
    rating: props.rating || '',
    genre: props.genre || ''
  };

  const { title, posterUrl, format } = movie;
  const id = String(movie.id);
  const rating = movie.rating !== undefined ? String(movie.rating) : '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const genre = movie.genre || (movie.genres && movie.genres.map((g: any) => typeof g === 'string' ? g : (g.name || '')).join(', ')) || '';

  return (
    <>
      <div className="movie-card">
        <div 
          className="movie-poster-wrap" 
          onClick={() => router.push(`/movies/detail/${id}`)}
          style={{ cursor: 'pointer' }}
        >
          <img src={posterUrl} alt={title} className="movie-poster" />
          <div className="movie-overlay" onClick={(e) => e.stopPropagation()}>
            <a 
              href={`/movies/detail/${id}`} 
              className="btn-primary movie-action-btn" 
              aria-label="Mua vé"
            >
              Mua vé
            </a>
            <button 
              type="button"
              className="btn-ghost movie-action-btn trailer-btn" 
              aria-label="Xem trailer" 
              data-movie-id={id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsTrailerOpen(true);
              }}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                style={{ marginRight: '6px' }}
              >
                <polygon points="5,3 19,12 5,21" />
              </svg>
              Trailer
            </button>
          </div>
          {format && <span className="movie-format-badge">{format}</span>}
        </div>
        <div className="movie-info">
          <h3 
            onClick={() => router.push(`/movies/detail/${id}`)}
            style={{ cursor: 'pointer' }}
          >
            {title}
          </h3>
          <div className="movie-meta-row">
            <span className="rating">★ {rating}</span>
            <span className="genre-tag">{genre}</span>
          </div>
        </div>
      </div>

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        videoSrc="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
        poster={posterUrl}
        title={title}
      />
    </>
  );
};
