import { GenreDTO } from './movie.dto';

export interface AdminMovieDTO {
  id: number | string;
  title: string;
  original_title?: string;
  status: 'now_showing' | 'coming_soon' | 'stopped';
  release_date: string;
  rating: number;
  runtime: number;
  age_rating: string;
  poster_url: string;
  backdrop_url?: string;
  trailer_url?: string;
  overview: string;
  genres: GenreDTO[];
}

export interface AdminMovieListResponseDTO {
  page: number;
  results: AdminMovieDTO[];
  total_pages: number;
  total_results: number;
}
