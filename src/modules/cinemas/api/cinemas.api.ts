import { axiosClient } from '@lib/axios/axiosClient';
import { ApiResponse } from '@shared/types/api.type';
import { CinemaListResponseDTO, CinemaDTO, PricingDTO } from '../dto/cinemas.dto';

export const cinemasApi = {
  /**
   * GET /api/v1/cinemas?province_id=1&search=CGV
   * Lấy danh sách rạp, có thể lọc theo tỉnh/thành và tên.
   */
  getCinemas: (params?: {
    province_id?: number;
    search?: string;
    page?: number;
  }): Promise<ApiResponse<CinemaListResponseDTO>> =>
    axiosClient.get('/api/v1/cinemas', { params }),

  /**
   * GET /api/v1/cinemas/:id
   * Lấy chi tiết một rạp theo id hoặc slug.
   */
  getCinema: (slug: string): Promise<ApiResponse<CinemaDTO>> =>
    axiosClient.get(`/api/v1/cinemas/${slug}`),

  // ─── Internal / Non-Postman endpoints (giữ để mock mode hoạt động) ──────────

  /** @internal Dùng trong mock mode cho trang bảng giá */
  getPricing: (): Promise<ApiResponse<PricingDTO>> =>
    axiosClient.get('/cinemas/pricing'),

  /** @internal Dùng trong mock mode cho schedule page */
  getShowtimes: (params?: { cinemaId?: string; date?: string }): Promise<ApiResponse<unknown>> =>
    axiosClient.get('/cinemas/showtimes', { params }),
};
