export interface Genre {
  id: number | string;
  name: string;
}

export interface Trailer {
  id: string;
  key: string;
  name: string;
  type: string;
  site: string;
  thumbnail: string;
}

export interface Movie {
  id: number | string;
  slug?: string;
  title: string;
  originalTitle?: string;
  description: string;
  posterUrl: string;
  backdropUrl?: string | null;
  releaseDate?: string | null;
  rating: number;
  voteCount: number;
  genres: Genre[];
  runtime?: number | null;
  formatTags?: string[];
  status?: 'now-showing' | 'coming-soon';
  ageRating?: string;
  detailHref?: string;
  bookingHref?: string;
}

export interface MovieList {
  items: Movie[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
}

export interface HeroSlide {
  id: number | string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  backdropUrl: string;
  posterUrl: string;
  runtime: number;
  rating: number;
  ageRating: string;
  formatTags: string[];
  trailerUrl: string;
  status: string;
  detailHref: string;
  bookingHref: string;
}
