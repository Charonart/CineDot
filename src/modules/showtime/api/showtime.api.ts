import { axiosClient } from '@lib/axios/axiosClient';
import { ApiResponse } from '@shared/types/api.type';
import { ShowtimeListDTO, ShowtimeSeatListDTO, ShowtimeQueryParamsDTO } from '../dto/showtime.dto';

export const showtimeApi = {
  /**
   * GET /api/movies/:movieId/showtimes?date=YYYY-MM-DD
   * Lấy danh sách suất chiếu của một bộ phim theo ngày.
   */
  getShowtimes: (movieId: number, params: ShowtimeQueryParamsDTO): Promise<ApiResponse<ShowtimeListDTO>> =>
    axiosClient.get(`/movies/${movieId}/showtimes`, { params }),

  /**
   * GET /api/showtimes/:showtimeId/seats
   * Lấy sơ đồ ghế của một suất chiếu.
   */
  getSeats: (showtimeId: number): Promise<ApiResponse<ShowtimeSeatListDTO>> =>
    axiosClient.get(`/showtimes/${showtimeId}/seats`),
};
