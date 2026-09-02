import { MovieStatus } from '@/shared/utils/movieStatusHelper';

export type MovieListingTab = 'now-showing' | 'coming-soon' | 'now_showing' | 'upcoming';

export interface MovieListingItem {
  id: string;
  slug: string;
  title: string;
  originalTitle?: string;
  posterUrl: string;
  trailerUrl: string;
  formatBadge: string;
  ageRating: string;
  genre: string[];
  duration: string;
  releaseDate: string;
  rating: number;
  voteCount?: number;
  imdbId?: string;
  imdbUrl?: string;
  status: MovieStatus;
  isHot?: boolean;
}
