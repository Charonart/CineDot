import { axiosClient } from '@lib/axios/axiosClient';
import { ApiResponse } from '@shared/types/api.type';
import { ShowtimeListDTO, ShowtimeQueryParamsDTO } from '../dto/showtime.dto';

export const showtimeApi = {
  /**
   * GET /api/v1/showtimes?date=2026-05-28&movie_id=1&cinema_id=1
   * Lấy danh sách suất chiếu theo ngày, bộ phim và rạp (snake_case params).
   */
  getShowtimes: (params: ShowtimeQueryParamsDTO): Promise<ApiResponse<ShowtimeListDTO>> =>
    axiosClient.get('/api/v1/showtimes', { params }),

  // NOTE: getSeats (GET /api/v1/showtimes/:id/seats) đã được xóa — trùng lặp với bookingApi.getSeatMap.
  // Để lấy sơ đồ ghế, dùng bookingApi.getSeatMap từ @modules/booking/api/booking.api.
};
