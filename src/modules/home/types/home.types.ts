import { MovieStatus } from '@/shared/utils/movieStatusHelper';

export interface PromoBanner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  badgeText?: string;
}

export interface MovieCardItem {
  id: string;
  title: string;
  slug: string;
  genre: string;
  duration: string;
  rating: number;
  voteCount?: number;
  imdbId?: string;
  imdbUrl?: string;
  ageRating: string;
  posterUrl: string;
  status: MovieStatus;
  isHot?: boolean;
  formatBadge?: string; // e.g. 'IMAX', '4DX', '2D', 'Dolby Atmos'
  trailerUrl?: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: 'review' | 'blog' | 'backstage';
  imageUrl: string;
  publishDate: string;
  ratingScore?: number;
  likeCount?: number;
  shareCount?: number;
}

export interface PromotionItem {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  subtitle?: string;
}

export interface QuickBookingSelection {
  movieId: string;
  cinemaId: string;
  date: string;
  time: string;
}

export interface DynamicDateOption {
  id: string;
  label: string;
  dateStr: string;
}

export interface QuickShowtimeOption {
  id: string;
  label: string;
  time: string;
  format: string;
  showtimeId: string | number;
}
