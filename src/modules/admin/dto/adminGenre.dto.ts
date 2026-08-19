/**
 * Admin Genre DTOs
 * API Contracts with CineDot Backend
 */

export interface AdminGenreItemDTO {
  id: number;
  genre_name: string;
  name?: string;
  slug?: string;
  movies_count?: number;
  moviesCount?: number;
}

export interface AdminGenreListResponseDTO {
  page: number;
  results: AdminGenreItemDTO[];
  totalPages: number;
  totalResults: number;
}

export interface CreateGenreRequestDTO {
  genre_name: string;
}

export interface UpdateGenreRequestDTO {
  genre_name: string;
}

export interface GenreMovieDetailDTO {
  id?: number | string;
  movie_id?: number | string;
  title: string;
  original_title?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  duration?: number | string;
  status?: string;
  vote_average?: number;
  rating?: number;
}

export interface GenreMovieListResponseDTO {
  genre: AdminGenreItemDTO;
  totalResults: number;
  results: GenreMovieDetailDTO[];
}
