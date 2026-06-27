import {
  QuickBookingCinemaDTO,
  QuickBookingDateDTO,
  QuickBookingShowtimeDTO,
} from '../dto/quick-booking.dto';
import { Movie } from '@/modules/movie/types/movie.type';
import {
  QuickBookingCinema,
  QuickBookingDate,
  QuickBookingShowtime,
  SelectOption,
} from '../types/quick-booking.type';

export const quickBookingMapper = {
  toCinemaModel: (dto: QuickBookingCinemaDTO): QuickBookingCinema => ({
    id: dto.id,
    name: dto.name,
    movieIds: dto.movieIds,
  }),

  toDateModel: (dto: QuickBookingDateDTO): QuickBookingDate => ({
    id: dto.id,
    label: dto.label,
    movieId: dto.movieId,
    cinemaId: dto.cinemaId,
  }),

  toShowtimeModel: (dto: QuickBookingShowtimeDTO): QuickBookingShowtime => ({
    id: dto.id,
    movieId: dto.movieId,
    cinemaId: dto.cinemaId,
    date: dto.date,
    dateLabel: dto.dateLabel,
    time: dto.time,
    roomName: dto.roomName,
    screenType: dto.screenType,
    availableSeats: dto.availableSeats,
  }),

  toMovieOptions: (movies: Movie[]): SelectOption[] =>
    movies.map((movie) => ({ value: String(movie.id), label: movie.title })),

  toCinemaOptions: (cinemas: QuickBookingCinema[]): SelectOption[] =>
    cinemas.map((cinema) => ({ value: cinema.id, label: cinema.name })),

  toDateOptions: (dates: QuickBookingDate[]): SelectOption[] =>
    dates.map((date) => ({ value: date.id, label: date.label })),

  toShowtimeOptions: (showtimes: QuickBookingShowtime[]): SelectOption[] =>
    showtimes.map((showtime) => ({
      value: showtime.id,
      label: `${showtime.time} - ${showtime.roomName} - ${showtime.screenType} - Còn ${showtime.availableSeats} ghế`,
    })),
};
