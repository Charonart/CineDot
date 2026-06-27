import { Movie, MovieList } from './movie.type';

export interface AdminMovieModel extends Movie {
  status?: 'now-showing' | 'coming-soon' | 'stopped';
  releaseDate?: string | null;
  runtime?: number | null;
  ageRating?: string;
  trailerUrl?: string;
  backdropUrl?: string | null;
}

export interface AdminMovieListModel {
  items: AdminMovieModel[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
}
