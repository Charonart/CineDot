import { logger } from '@lib/logger/logger';
import { isRequestCanceled } from '@shared/utils/isRequestCanceled';
import { bookingSelectorApi } from '../api/bookingSelector.api';
import { bookingSelectorMapper } from '../mappers/bookingSelector.mapper';
import { bookingSelectorShowtimeSchema } from '../schemas/bookingSelector.schema';
import { BookingSelectorShowtime } from '../types/bookingSelector.type';
import { z } from 'zod';

export const bookingSelectorService = {

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
