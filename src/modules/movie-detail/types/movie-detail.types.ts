export interface ShowtimeSlot {
  id: string;
  time: string;
  endTime?: string;
  roomName?: string;
  screen?: string;
  format?: string;
  screen_type?: string;
  sound_technology?: string;
  features?: string[];
  price?: number | string;
  availableSeats: number;
  totalSeats: number;
}

export interface FormatShowtimeGroup {
  formatName: string;
  showtimes: ShowtimeSlot[];
}

export interface CinemaShowtimeGroup {
  cinemaId: string;
  cinemaName: string;
  cinemaAddress?: string;
  province?: string;
  phone?: string;
  formatGroups: FormatShowtimeGroup[];
}

export interface DateOption {
  dateStr: string;
  displayDay: string;
  displayDate: string;
}

export interface MovieCastMember {
  id: number | string;
  personId?: number | string;
  name: string;
  character?: string;
  profileUrl?: string;
  order?: number;
}

export interface MovieCrewMember {
  id: number | string;
  personId?: number | string;
  name: string;
  job: string;
  department?: string;
  profileUrl?: string;
}

export interface MovieVideoItem {
  videoId: number | string;
  name: string;
  key: string;
  site: string;
  type: string;
  official: boolean;
  thumbnailUrl?: string;
}

export interface MovieReviewItem {
  review_id: number;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface MovieDetail {
  id: string;
  slug: string;
  title: string;
  originalTitle?: string;
  posterUrl: string;
  backdropUrl: string;
  bannerUrl: string;
  trailerUrl: string;
  formatBadge: string;
  ageRating: string;
  genre: string[];
  genreIds?: number[];
  duration: string;
  releaseDate: string;
  country: string;
  director: string;
  directorId?: string | number | null;
  cast: string[];
  castMembers?: MovieCastMember[];
  crewMembers?: MovieCrewMember[];
  videos?: MovieVideoItem[];
  synopsis: string;
  rating: number;
  voteCount: number;
  status: 'NOW_SHOWING' | 'COMING_SOON';
  updated_at?: string;
}
