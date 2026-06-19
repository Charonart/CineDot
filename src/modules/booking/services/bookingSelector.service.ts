import { logger } from '@lib/logger/logger';
import { isRequestCanceled } from '@shared/utils/isRequestCanceled';
import { bookingSelectorApi } from '../api/bookingSelector.api';
import { bookingSelectorMapper } from '../mappers/bookingSelector.mapper';
import {
  bookingSelectorMovieSchema,
  bookingSelectorShowtimeSchema,
} from '../schemas/bookingSelector.schema';
import { BookingSelectorMovie, BookingSelectorShowtime } from '../types/bookingSelector.type';
import { z } from 'zod';

export const bookingSelectorService = {
  getBookingSelectorMovies: async (signal?: AbortSignal): Promise<BookingSelectorMovie[]> => {
    try {
      const response = await bookingSelectorApi.getBookingSelectorMovies(signal);
      const rawMovies = Array.isArray(response.data)
        ? response.data
        : (response.data as any)?.results || [];
      const validated = z.array(bookingSelectorMovieSchema).parse(rawMovies);
      return validated.map(bookingSelectorMapper.toMovie);
    } catch (error) {
      if (isRequestCanceled(error)) {
        throw error;
      }
      logger.error('[BookingSelectorService] getBookingSelectorMovies failed:', error);
      throw new Error('FAILED_TO_LOAD_SELECTOR_MOVIES');
    }
  },

  getBookingSelectorShowtimes: async (
    movieId: string,
    date: string,
    signal?: AbortSignal
  ): Promise<BookingSelectorShowtime[]> => {
    try {
      if (!movieId || !date) return [];
      const response = await bookingSelectorApi.getBookingSelectorShowtimes(movieId, date, signal);
      const rawShowtimes = Array.isArray(response.data)
        ? response.data
        : (response.data as any)?.results || [];
      const validated = z.array(bookingSelectorShowtimeSchema).parse(rawShowtimes);
      return validated.map(bookingSelectorMapper.toShowtime);
    } catch (error) {
      if (isRequestCanceled(error)) {
        throw error;
      }
      logger.error('[BookingSelectorService] getBookingSelectorShowtimes failed:', error);
      throw new Error('FAILED_TO_LOAD_SELECTOR_SHOWTIMES');
    }
  },
};
