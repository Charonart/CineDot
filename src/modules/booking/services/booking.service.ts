import { logger } from '@lib/logger/logger';
import { ApiError } from '@shared/types/api.type';
import { bookingApi } from '../api/booking.api';
import { SeatHoldRequestDTO } from '../dto/booking.dto';
import { bookingMapper } from '../mappers/booking.mapper';
import { bookingShowtimeSchema, seatHoldSchema, seatMapSchema } from '../schemas/booking.schema';
import { BookingShowtime, SeatHold, SeatMap } from '../types/booking.type';

const assertShowtimeId = (showtimeId: string) => {
  if (!showtimeId.trim()) {
    throw new Error('INVALID_SHOWTIME_ID');
  }
};

const normalizeHoldError = (error: unknown) => {
  const apiError = error as Partial<ApiError>;
  if (apiError.code === 'SEAT_NOT_AVAILABLE') return 'SEAT_NOT_AVAILABLE';
  if (apiError.code === 'SHOWTIME_NOT_OPEN_FOR_SALE') return 'SHOWTIME_NOT_OPEN_FOR_SALE';
  return 'FAILED_TO_CREATE_SEAT_HOLD';
};

export const bookingService = {
  getShowtimeDetail: async (showtimeId: string, signal?: AbortSignal): Promise<BookingShowtime> => {
    try {
      assertShowtimeId(showtimeId);
      const response = await bookingApi.getShowtimeDetail(showtimeId, signal);
      const validated = bookingShowtimeSchema.parse(response.data);
      return bookingMapper.toShowtime(validated);
    } catch (error) {
      if (error instanceof Error && error.message === 'INVALID_SHOWTIME_ID') throw error;
      logger.error('[BookingService] getShowtimeDetail failed:', error);
      throw new Error('FAILED_TO_LOAD_SHOWTIME_DETAIL');
    }
  },

  getSeatMap: async (showtimeId: string, signal?: AbortSignal): Promise<SeatMap> => {
    try {
      assertShowtimeId(showtimeId);
      const response = await bookingApi.getSeatMap(showtimeId, signal);
      const validated = seatMapSchema.parse(response.data);
      return bookingMapper.toSeatMap(validated);
    } catch (error) {
      if (error instanceof Error && error.message === 'INVALID_SHOWTIME_ID') throw error;
      logger.error('[BookingService] getSeatMap failed:', error);
      throw new Error('FAILED_TO_LOAD_SEAT_MAP');
    }
  },

  createSeatHold: async (payload: SeatHoldRequestDTO): Promise<SeatHold> => {
    try {
      assertShowtimeId(payload.showtimeId);
      if (payload.seatIds.length === 0) throw new Error('SEAT_NOT_AVAILABLE');
      const response = await bookingApi.createSeatHold(payload);
      const validated = seatHoldSchema.parse(response.data);
      return bookingMapper.toSeatHold(validated);
    } catch (error) {
      if (error instanceof Error && error.message === 'INVALID_SHOWTIME_ID') throw error;
      const code = normalizeHoldError(error);
      logger.error('[BookingService] createSeatHold failed:', error);
      throw new Error(code);
    }
  },
};
