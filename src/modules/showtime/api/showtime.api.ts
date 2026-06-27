import { axiosClient } from '@lib/axios/axiosClient';
import { ApiResponse } from '@shared/types/api.type';
import { ShowtimeListDTO, ShowtimeSeatListDTO, ShowtimeQueryParamsDTO } from '../dto/showtime.dto';

export const showtimeApi = {
  /**
   * GET /api/v1/showtimes?movieId=...&cinemaId=...&date=...
   * Lấy danh sách suất chiếu của một bộ phim theo rạp và ngày.
   */
  getShowtimes: (params: ShowtimeQueryParamsDTO): Promise<ApiResponse<ShowtimeListDTO>> =>
    axiosClient.get('/showtimes', { params }),

  /**
   * GET /api/v1/showtimes/:showtimeId/seats
   * Lấy sơ đồ ghế của một suất chiếu.
   */
  getSeats: (showtimeId: number | string): Promise<ApiResponse<ShowtimeSeatListDTO>> =>
    axiosClient.get(`/showtimes/${showtimeId}/seats`),
};
