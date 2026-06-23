import { axiosClient } from '@lib/axios/axiosClient';
import { ApiResponse } from '@shared/types/api.type';
import { ShowtimeListDTO, ShowtimeQueryParamsDTO } from '../dto/showtime.dto';

export const showtimeApi = {
  /**
   * GET /api/v1/showtimes?movieId=...&cinemaId=...&date=...
   * Lấy danh sách suất chiếu của một bộ phim theo rạp và ngày.
   */
  getShowtimes: (params: ShowtimeQueryParamsDTO): Promise<ApiResponse<ShowtimeListDTO>> =>
    axiosClient.get('/showtimes', { params }),

  // NOTE: getSeats (GET /showtimes/:id/seats) đã được xóa — trùng lặp với bookingApi.getSeatMap.
  // Để lấy sơ đồ ghế, dùng bookingApi.getSeatMap từ @modules/booking/api/booking.api.
};
