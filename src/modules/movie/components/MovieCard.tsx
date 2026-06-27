/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import Link from 'next/link';
import { useTrailerStore } from '@/shared/store/trailerStore';
import { appRoutes } from '@/shared/routes/appRoutes';

interface Genre {
  id: number | string;
  name: string;
}

interface Movie {
  id: string | number;
  slug?: string;
  title: string;
  posterUrl: string;
  format?: string;
  rating?: string | number;
  genre?: string;
  genres?: Genre[] | string[];
}

interface MovieCardProps {
  id?: string | number;
  slug?: string;
  title?: string;
  posterUrl?: string;
  format?: string;
  rating?: string | number;
  genre?: string;
  movie?: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = (props) => {
  const openTrailer = useTrailerStore((state) => state.openTrailer);

  const movie: Movie = props.movie || {
    id: props.id || '',
    slug: props.slug,
    title: props.title || '',
    posterUrl: props.posterUrl || '',
    format: props.format,
    rating: props.rating || '',
    genre: props.genre || '',
  };

  const { title, posterUrl, format } = movie;
  const id = String(movie.id);
  const slug = movie.slug || id;

  const detailUrl = appRoutes.movieDetail(slug);
  const scheduleUrl = appRoutes.movieSchedule(slug);

  const rating = movie.rating !== undefined && movie.rating !== ''
    ? String(movie.rating)
    : 'N/A';

  const genre =
    movie.genre ||
    (movie.genres
      ? movie.genres
          .map((g) => (typeof g === 'string' ? g : g.name))
          .filter(Boolean)
          .join(', ')
      : '');

  return (
    <>
      <div className="movie-card">
        <div className="movie-poster-wrap">
          <Link
            href={detailUrl}
            className="movie-poster-link"
            aria-label={`Xem chi tiết phim ${title}`}
            style={{ display: 'block', cursor: 'pointer' }}
          >
            <img src={posterUrl} alt={title} className="movie-poster" />
          </Link>

          <div className="movie-overlay">
            <Link
              href={scheduleUrl}
              className="btn-primary movie-action-btn"
              aria-label={`Mua vé phim ${title}`}
            >
              Mua vé
            </Link>

            <button
              type="button"
              className="btn-ghost movie-action-btn trailer-btn"
              aria-label={`Xem trailer phim ${title}`}
              data-movie-id={id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openTrailer(
                  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
                  posterUrl,
                  title
                );
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
          <h3>
            <Link
              href={detailUrl}
              className="movie-title-link"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              {title}
            </Link>
          </h3>

          <div className="movie-meta-row">
            <span className="rating">★ {rating}</span>
            {genre && <span className="genre-tag">{genre}</span>}
          </div>
        </div>
      </div>
    </>
  );
};