import { axiosClient } from '@lib/axios/axiosClient';
import { ApiResponse } from '@shared/types/api.type';
import { MovieListResponseDTO, MovieDTO } from '../dto/movie.dto';

export const movieApi = {
  getMovies: (params: {
    category?: string;
    status?: string;
    featured?: boolean | string;
    limit?: number;
    page?: number;
    search?: string;
  }): Promise<ApiResponse<MovieListResponseDTO>> =>
    axiosClient.get('/movies', { params }),

  getDetail: (id: number | string): Promise<ApiResponse<MovieDTO>> =>
    axiosClient.get(`/movies/${id}`),
};
