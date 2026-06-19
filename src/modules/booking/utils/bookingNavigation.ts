import { BookingSession } from '../types';

export function buildSeatsUrlFromSession(session: Partial<BookingSession>): string | null {
  const { movie, cinema, showtime } = session;
  if (!movie?.slug || !cinema?.name || !showtime?.date || !showtime?.time) {
    return null;
  }
  const params = new URLSearchParams({
    movie: movie.slug,
    cinema: cinema.name,
    date: showtime.date,
    time: showtime.time,
  });
  return `/booking/seats?${params.toString()}`;
}

/**
 * Builds the URL for the seat selection page using a stable showtimeId.
 * Preferred over buildSeatsUrlFromSession when a numeric showtimeId is available.
 */
export function buildSeatsUrlFromShowtimeId(showtimeId: string | number): string {
  return `/booking/seats?showtimeId=${encodeURIComponent(String(showtimeId))}`;
}

export function buildMovieDetailUrlFromSession(session: Partial<BookingSession>): string | null {
  if (!session.movie?.slug) return null;
  return `/movies/detail/${session.movie.slug}?focus=schedule`;
}

export function buildFoodsUrl(): string {
  return '/booking/foods';
}

export function buildPaymentUrl(): string {
  return '/booking/payment';
}

export function buildBookingFailedUrl(reason: string): string {
  return `/booking/failed?reason=${encodeURIComponent(reason)}`;
}

/**
 * Root booking page — the standalone CGV-style movie/cinema/showtime selector.
 */
export function buildBookingRootUrl(): string {
  return '/booking';
}

/**
 * Cancel booking destination.
 * Redirects to movie detail page when the movie slug is known,
 * otherwise falls back to /movies.
 */
export function buildCancelBookingUrl(movieSlug?: string | null): string {
  if (movieSlug) {
    return `/movies/detail/${movieSlug}`;
  }
  return '/movies';
}
