/**
 * Admin Movie DTOs (Data Transfer Objects)
 * Matching Backend API specs (CineDot V2 API Specification & Laravel Requests)
 */

export interface GenreItemDTO {
  id: number;
  genre_id?: number;
  name: string;
  genre_name?: string;
  slug?: string;
}

export interface AdminMovieItemDTO {
  id?: string | number;
  movie_id?: string | number;
  slug?: string;
  title: string;
  original_title?: string;
  originalTitle?: string;
  overview?: string;
  synopsis?: string;
  description?: string;
  release_date?: string;
  releaseDate?: string;
  original_language?: string;
  originalLanguage?: string;
  age_rating?: string;
  ageRating?: string;
  popularity?: number | string;
  vote_average?: number;
  vote_count?: number;
  voteCount?: number;
  rating?: number | string;
  imdb_id?: string;
  imdbId?: string;
  imdb_url?: string;
  imdbUrl?: string;
  tmdb_id?: number;
  poster_path?: string;
  poster_url?: string;
  posterUrl?: string;
  backdrop_path?: string;
  backdrop_url?: string;
  backdropUrl?: string;
  trailer_url?: string;
  trailerUrl?: string;
  duration?: number | string;
  duration_minutes?: number;
  status: 'now_showing' | 'upcoming' | 'ended' | 'coming_soon' | 'stopped' | 'NOW_SHOWING' | 'COMING_SOON' | 'UPCOMING' | string;
  genre_ids?: number[];
  genres?: GenreItemDTO[] | string[];
  genre?: string[];
  videos?: Array<{ name?: string; key?: string; site?: string; type?: string }>;
  created_at?: string;
  updated_at?: string;
}

export interface AdminMovieListRequestDTO {
  search?: string;
  status?: string;
  genre_id?: string | number;
  page?: number;
  per_page?: number;
  limit?: number;
  sort_by?: string;
  sort_dir?: string;
  filters?: Record<string, any>;
}

export interface CreateMovieRequestDTO {
  title: string;
  original_title?: string;
  overview?: string;
  release_date?: string;
  original_language?: string;
  popularity?: number;
  backdrop_path?: string;
  poster_path: string;
  duration_minutes: number;
  status: 'now_showing' | 'upcoming' | 'ended' | 'coming_soon' | 'stopped' | string;
  genre_ids: number[];
  trailer_url?: string;
  vote_average?: number;
  vote_count?: number;
  imdb_id?: string;
  age_rating?: string;
  ageRating?: string;
}

export interface UpdateMovieRequestDTO {
  title?: string;
  original_title?: string;
  overview?: string;
  release_date?: string;
  original_language?: string;
  popularity?: number;
  backdrop_path?: string;
  poster_path?: string;
  duration_minutes?: number;
  status?: 'now_showing' | 'upcoming' | 'ended' | 'coming_soon' | 'stopped' | string;
  vote_average?: number;
  vote_count?: number;
  imdb_id?: string;
  age_rating?: string;
  ageRating?: string;
  genre_ids?: number[];
  trailer_url?: string;
}

export interface TmdbSyncRequestDTO {
  sync_type?: 'now_showing' | 'upcoming' | 'popular' | string;
  query?: string;
  tmdb_id?: number;
}

export interface TmdbSearchResultDTO {
  id: number;
  title: string;
  original_title?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  imdb_id?: string;
  overview?: string;
  genres?: string[] | GenreItemDTO[];
}
