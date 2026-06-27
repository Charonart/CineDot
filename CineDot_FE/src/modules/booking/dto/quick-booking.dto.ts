export type QuickBookingMovieStatusDTO = 'now-showing' | 'coming-soon';

export interface QuickBookingMovieDTO {
  id: string;
  title: string;
  status: QuickBookingMovieStatusDTO;
}

export interface QuickBookingCinemaDTO {
  id: string;
  name: string;
  movieIds: string[];
}

export interface QuickBookingDateDTO {
  id: string;
  label: string;
  movieId: string;
  cinemaId: string;
}

export interface QuickBookingShowtimeDTO {
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
