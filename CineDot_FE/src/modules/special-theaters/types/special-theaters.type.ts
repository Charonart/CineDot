// ─── Special Theaters Domain Types ────────────────────────────────────────

export type TheaterType = 'imax' | '4dx' | 'dolby-atmos' | 'kids';

export const THEATER_TYPE_LABELS: Record<TheaterType, string> = {
  imax: 'IMAX',
  '4dx': '4DX',
  'dolby-atmos': 'Dolby Atmos',
  kids: 'Cine de Kids',
};

export interface TheaterFeature {
  icon: string;
  title: string;
  description: string;
}

export interface CinemaRef {
  id: string;
  name: string;
  address: string;
  slug: string;
  href: string;
}

export interface MovieRef {
  id: string;
  slug: string;
  title: string;
  posterUrl: string;
  rating: number;
  bookingHref: string;
}

export interface TheaterTypeData {
  type: TheaterType;
  name: string;
  tagline: string;
  description: string;
  heroImageUrl: string;
  features: TheaterFeature[];
  technology: string;
  supportedCinemas: CinemaRef[];
  nowShowingMovies: MovieRef[];
}
