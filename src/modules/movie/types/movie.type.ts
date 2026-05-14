export interface Genre {
  id: number;
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
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  rating: number;
  voteCount: number;
  genres: Genre[];
  runtime?: number;
}

export interface MovieList {
  items: Movie[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
}
