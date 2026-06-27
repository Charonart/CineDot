import { axiosClient } from '@lib/axios/axiosClient';
import { ApiResponse } from '@shared/types/api.type';
import { CinemaListResponseDTO, CinemaDTO, PricingDTO } from '../dto/cinemas.dto';

export const cinemasApi = {
  getCinemas: (params?: { city?: string; page?: number }): Promise<ApiResponse<CinemaListResponseDTO>> =>
    axiosClient.get('/cinemas', { params }),

  getCinema: (slug: string): Promise<ApiResponse<CinemaDTO>> =>
    axiosClient.get(`/cinemas/${slug}`),

  getPricing: (): Promise<ApiResponse<PricingDTO>> =>
    axiosClient.get('/cinemas/pricing'),

  getShowtimes: (params?: { cinemaId?: string; date?: string }): Promise<ApiResponse<unknown>> =>
    axiosClient.get('/cinemas/showtimes', { params }),
};
