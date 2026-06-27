import { axiosClient } from '@lib/axios/axiosClient';
import { ApiResponse } from '@shared/types/api.type';
import { AdminMovieDTO, AdminMovieListResponseDTO } from '../dto/admin-movie.dto';

export const adminMovieApi = {
  getMovies: (params?: {
    page?: number;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<AdminMovieListResponseDTO>> =>
    axiosClient.get('/admin/movies', { params }),

  getDetail: (id: number | string): Promise<ApiResponse<AdminMovieDTO>> =>
    axiosClient.get(`/admin/movies/${id}`),

  createMovie: (data: Omit<AdminMovieDTO, 'id' | 'rating'>): Promise<ApiResponse<AdminMovieDTO>> =>
    axiosClient.post('/admin/movies', data),

  updateMovie: (id: number | string, data: Partial<Omit<AdminMovieDTO, 'id'>>): Promise<ApiResponse<AdminMovieDTO>> =>
    axiosClient.put(`/admin/movies/${id}`, data),

  deleteMovie: (id: number | string): Promise<ApiResponse<{ success: boolean; message: string }>> =>
    axiosClient.delete(`/admin/movies/${id}`),

  getCredits: (movieId: number | string): Promise<ApiResponse<any>> =>
    axiosClient.get(`/movies/${movieId}/credits`),

  addCredit: (movieId: number | string, data: { person_id: number | string; credit_type: 'cast' | 'crew'; character_name?: string; order?: number }): Promise<ApiResponse<any>> =>
    axiosClient.post(`/movies/${movieId}/credits`, data),

  deleteCredit: (movieId: number | string, creditId: number | string, type: 'cast' | 'crew'): Promise<ApiResponse<any>> =>
    axiosClient.delete(`/movies/${movieId}/credits/${creditId}`, { params: { type } }),
};
