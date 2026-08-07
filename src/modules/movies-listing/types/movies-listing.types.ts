export type MovieListingTab = 'now-showing' | 'coming-soon';

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
  status: 'NOW_SHOWING' | 'COMING_SOON';
  isHot?: boolean;
}
