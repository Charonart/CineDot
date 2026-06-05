import { axiosClient } from '@lib/axios/axiosClient';
import { ApiResponse } from '@shared/types/api.type';
import { MovieListResponseDTO, MovieDTO, HeroSlideDTO } from '../dto/movie.dto';

export const movieApi = {
  getTrending: (page = 1): Promise<ApiResponse<MovieListResponseDTO>> => 
    axiosClient.get('/movies/trending', { params: { page } }),
  
  getPopular: (page = 1): Promise<ApiResponse<MovieListResponseDTO>> => 
    axiosClient.get('/movies/popular', { params: { page } }),
    
  getDetail: (id: number): Promise<ApiResponse<MovieDTO>> => 
    axiosClient.get(`/movies/${id}`),

  searchMovies: (query: string, page = 1): Promise<ApiResponse<MovieListResponseDTO>> => 
    axiosClient.get('/movies/search', { params: { query, page } }),

  getMovies: (params: { category?: string; limit?: number; page?: number }): Promise<ApiResponse<MovieListResponseDTO>> => 
    axiosClient.get('/movies', { params }),

  getNavbarMovies: (): Promise<ApiResponse<MovieListResponseDTO>> => 
    axiosClient.get('/movies/navbar'),

  getHeroSlides: (): Promise<ApiResponse<HeroSlideDTO[]>> =>
    axiosClient.get('/home/hero-slides'),
};
