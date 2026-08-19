/**
 * Admin Genre Domain Models & UI State Types
 */

export interface AdminGenreItem {
  id: number;
  name: string;
  moviesCount: number;
}

export interface GenreMovieItem {
  id: string;
  title: string;
  originalTitle: string;
  posterUrl: string;
  backdropUrl?: string;
  releaseDate: string;
  duration: string;
  status: string;
  rating: number;
}

export interface AdminGenrePagination {
  currentPage: number;
  totalPages: number;
  totalResults: number;
}
