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
