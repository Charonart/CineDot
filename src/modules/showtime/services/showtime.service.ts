import { showtimeApi } from '../api/showtime.api';
import { showtimeMapper } from '../mappers/showtime.mapper';
import { showtimeListSchema, showtimeSeatListSchema } from '../schemas/showtime.schema';
import { ShowtimeList, ShowtimeSeatMap, ShowtimeQueryParams } from '../types/showtime.type';
import { logger } from '@lib/logger/logger';

export const showtimeService = {
  /**
   * Lấy danh sách suất chiếu theo ngày.
   * Validate response bằng Zod trước khi map sang domain model.
   */
  getShowtimes: async (params: ShowtimeQueryParams): Promise<ShowtimeList> => {
    try {
      const response = await showtimeApi.getShowtimes(params);
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
  getSeats: async (showtimeId: number): Promise<ShowtimeSeatMap> => {
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
