export interface GenreDTO {
  id: number | string;
  name: string;
}

export interface MovieDTO {
  id: number | string;
  slug?: string;
  title: string;
  originalTitle?: string;
  overview: string;
  posterUrl: string;
  backdropUrl?: string | null;
  releaseDate?: string | null;
  rating: number;
  voteCount: number;
  genres: GenreDTO[];
  runtime?: number | null;
  formatTags?: string[];
  status?: 'now-showing' | 'coming-soon';
  ageRating?: string;
}

export interface MovieListResponseDTO {
  page: number;
  results: MovieDTO[];
  totalPages: number;
  totalResults: number;
}

export interface HeroSlideDTO {
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
}
