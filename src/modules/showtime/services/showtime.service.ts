import { showtimeApi } from '../api/showtime.api';
import { showtimeMapper } from '../mappers/showtime.mapper';
import { showtimeListSchema, showtimeSeatListSchema } from '../schemas/showtime.schema';
import { ShowtimeList, ShowtimeSeatMap, ShowtimeQueryParams } from '../types/showtime.type';
import { logger } from '@lib/logger/logger';

export const showtimeService = {
  /**
   * Lấy danh sách suất chiếu của một bộ phim theo ngày.
   * Validate response bằng Zod trước khi map sang domain model.
   */
  getShowtimes: async (movieId: number | string, params: ShowtimeQueryParams): Promise<ShowtimeList> => {
    try {
      const response = await showtimeApi.getShowtimes({
        movieId,
        date: params.date,
        cinemaId: params.cinemaId,
      });
      const validated = showtimeListSchema.parse(response.data);
      return showtimeMapper.toShowtimeList(validated.results, params.date);
    } catch (error) {
      logger.error('[ShowtimeService] getShowtimes failed:', error);
      throw new Error('FAILED_TO_LOAD_SHOWTIMES');
    }
  },

  /**
   * Lấy sơ đồ ghế của một suất chiếu.
   */
  getSeats: async (showtimeId: number | string): Promise<ShowtimeSeatMap> => {
    try {
      const response = await showtimeApi.getSeats(showtimeId);
      const validated = showtimeSeatListSchema.parse(response.data);
      return showtimeMapper.toSeatMap(validated);
    } catch (error) {
      logger.error('[ShowtimeService] getSeats failed:', error);
      throw new Error('FAILED_TO_LOAD_SHOWTIME_SEATS');
    }
  },
};
