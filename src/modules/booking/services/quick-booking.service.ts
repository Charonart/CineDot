import { logger } from '@lib/logger/logger';
import { quickBookingApi } from '../api/quick-booking.api';
import { quickBookingMapper } from '../mappers/quick-booking.mapper';
import {
  quickBookingCinemaListSchema,
  quickBookingDateListSchema,
  quickBookingMovieListSchema,
  quickBookingShowtimeListSchema,
} from '../schemas/quick-booking.schema';
import {
  QuickBookingCinema,
  QuickBookingDate,
  QuickBookingMovie,
  QuickBookingShowtime,
} from '../types/quick-booking.type';

export const quickBookingService = {
  getMovies: async (signal?: AbortSignal): Promise<QuickBookingMovie[]> => {
    try {
      const response = await quickBookingApi.getMovies(signal);
      const validated = quickBookingMovieListSchema.parse(response.data);
      return validated.map(quickBookingMapper.toMovieModel);
    } catch (error) {
      logger.error('[QuickBookingService] getMovies failed:', error);
      throw new Error('FAILED_TO_LOAD_QUICK_BOOKING_MOVIES');
    }
  },

  getCinemas: async (movieId: string, signal?: AbortSignal): Promise<QuickBookingCinema[]> => {
    if (!movieId) return [];

    try {
      const response = await quickBookingApi.getCinemas(movieId, signal);
      const validated = quickBookingCinemaListSchema.parse(response.data);
      return validated
        .map(quickBookingMapper.toCinemaModel)
        .filter((cinema) => cinema.movieIds.includes(movieId));
    } catch (error) {
      logger.error('[QuickBookingService] getCinemas failed:', error);
      throw new Error('FAILED_TO_LOAD_QUICK_BOOKING_CINEMAS');
    }
  },

  getDates: async (
    movieId: string,
    cinemaId: string,
    signal?: AbortSignal,
  ): Promise<QuickBookingDate[]> => {
    if (!movieId || !cinemaId) return [];

    try {
      const response = await quickBookingApi.getDates(movieId, cinemaId, signal);
      const validated = quickBookingDateListSchema.parse(response.data);
      return validated
        .map(quickBookingMapper.toDateModel)
        .filter((date) => date.movieId === movieId && date.cinemaId === cinemaId);
    } catch (error) {
      logger.error('[QuickBookingService] getDates failed:', error);
      throw new Error('FAILED_TO_LOAD_QUICK_BOOKING_DATES');
    }
  },

  getShowtimes: async (
    movieId: string,
    cinemaId: string,
    date: string,
    signal?: AbortSignal,
  ): Promise<QuickBookingShowtime[]> => {
    if (!movieId || !cinemaId || !date) return [];

    try {
      const response = await quickBookingApi.getShowtimes(movieId, cinemaId, date, signal);
      const validated = quickBookingShowtimeListSchema.parse(response.data);
      return validated
        .map(quickBookingMapper.toShowtimeModel)
        .filter((showtime) =>
          showtime.movieId === movieId &&
          showtime.cinemaId === cinemaId &&
          showtime.date === date,
        );
    } catch (error) {
      logger.error('[QuickBookingService] getShowtimes failed:', error);
      throw new Error('FAILED_TO_LOAD_QUICK_BOOKING_SHOWTIMES');
    }
  },
};
