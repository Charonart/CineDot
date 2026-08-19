export type MovieStatus = 'NOW_SHOWING' | 'COMING_SOON' | 'STOPPED';

export interface GenreItem {
  id: number;
  name: string;
  slug?: string;
}

export interface AdminMovieItem {
  id: string;
  slug: string;
  title: string;
  originalTitle: string;
  overview: string;
  releaseDate: string;
  originalLanguage: string;
  adult: boolean;
  popularity: number;
  durationMinutes: number;
  duration: string;
  status: MovieStatus;
  rawStatus: string;
  posterUrl: string;
  rawPosterPath: string;
  backdropUrl?: string;
  rawBackdropPath?: string;
  trailerUrl?: string;
  genreIds: number[];
  genres: GenreItem[];
  genre: string[];
  rating: number;
  formatBadge?: string;
}

export interface AdminMovieCredit {
  id: string;
  movieId?: string;
  name: string;
  characterName?: string;
  role: 'DIRECTOR' | 'ACTOR';
  avatarUrl?: string;
  order?: number;
}
