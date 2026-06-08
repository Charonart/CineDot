export type QuickBookingMovieStatus = 'now-showing' | 'coming-soon';
export type QuickBookingDropdown = 'movie' | 'cinema' | 'date' | 'showtime';

export interface SelectOption {
  value: string;
  label: string;
}

export interface QuickBookingMovie {
  id: string;
  title: string;
  status: QuickBookingMovieStatus;
}

export interface QuickBookingCinema {
  id: string;
  name: string;
  movieIds: string[];
}

export interface QuickBookingDate {
  id: string;
  label: string;
  movieId: string;
  cinemaId: string;
}

export interface QuickBookingShowtime {
  id: string;
  movieId: string;
  cinemaId: string;
  date: string;
  dateLabel: string;
  time: string;
  roomName: string;
  screenType: string;
  availableSeats: number;
}
