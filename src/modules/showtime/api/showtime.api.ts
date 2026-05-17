import { axiosClient } from '@lib/axios/axiosClient';
import { ApiResponse } from '@shared/types/api.type';
import { ShowtimeListDTO, ShowtimeSeatListDTO, ShowtimeQueryParamsDTO } from '../dto/showtime.dto';

export const showtimeApi = {
  /**
   * GET /api/showtimes
   * Lấy danh sách suất chiếu theo ngày.
   * Backend filter: startTime >= date 00:00:00 AND startTime < nextDay 00:00:00
   */
  getShowtimes: (params: ShowtimeQueryParamsDTO): Promise<ApiResponse<ShowtimeListDTO>> =>
    axiosClient.get('/showtimes', { params }),

  /**
   * GET /api/showtimes/:id/seats
   * Lấy trạng thái ghế của một suất chiếu.
   * Backend chỉ tính bookedSeats với status: PAID | CONFIRMED | SUCCESS
   */
  getSeats: (showtimeId: number): Promise<ApiResponse<ShowtimeSeatListDTO>> =>
    axiosClient.get(`/showtimes/${showtimeId}/seats`),
};
