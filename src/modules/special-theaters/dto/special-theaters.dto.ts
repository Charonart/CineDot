// ─── Special Theaters DTOs ─────────────────────────────────────────────────

export type TheaterType = 'imax' | '4dx' | 'dolby-atmos' | 'kids';

export interface TheaterFeatureDTO {
  icon: string;
  title: string;
  description: string;
}

export interface CinemaRefDTO {
  id: string;
  name: string;
  address: string;
  slug: string;
}

export interface MovieRefDTO {
  id: string;
  slug: string;
  title: string;
  posterUrl: string;
  rating: number;
}

export interface TheaterTypeDTO {
  type: TheaterType;
  name: string;
  tagline: string;
  description: string;
  heroImageUrl: string;
  features: TheaterFeatureDTO[];
  technology: string;
  supportedCinemas: CinemaRefDTO[];
  nowShowingMovies: MovieRefDTO[];
}
