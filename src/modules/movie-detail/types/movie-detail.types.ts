export interface ShowtimeSlot {
  id: string;
  time: string;
  roomName: string;
  availableSeats: number;
  totalSeats: number;
}

export interface CinemaShowtimeGroup {
  cinemaId: string;
  cinemaName: string;
  formatGroups: {
    formatName: string;
    showtimes: ShowtimeSlot[];
  }[];
}

export interface DateOption {
  dateStr: string;
  displayDay: string;
  displayDate: string;
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
  duration: string;
  releaseDate: string;
  country: string;
  director: string;
  cast: string[];
  synopsis: string;
  rating: number;
  voteCount: number;
  status: 'NOW_SHOWING' | 'COMING_SOON';
}
