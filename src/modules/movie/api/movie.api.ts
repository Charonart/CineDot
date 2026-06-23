import { axiosClient } from '@lib/axios/axiosClient';
import { ApiResponse } from '@shared/types/api.type';
import { MovieListResponseDTO, MovieDTO } from '../dto/movie.dto';
import {
  MovieDetailDTO,
  CreditsDTO,
  VideoListDTO,
} from '@modules/movie-detail/dto/movie-detail.dto';

export const movieApi = {
  /**
   * GET /api/v1/movies?category=...&status=...&featured=...
   * Lấy danh sách phim với filter và phân trang.
   */
  getMovies: (params: {
    category?: string;
    status?: string;
    featured?: boolean | string;
    limit?: number;
    page?: number;
    search?: string;
  }): Promise<ApiResponse<MovieListResponseDTO>> =>
    axiosClient.get('/movies', { params }),

  /**
   * GET /api/v1/movies/:idOrSlug
   * Unified endpoint: nhận cả numeric id hoặc slug.
   * Trả về MovieDTO (lightweight) — dùng cho list/card contexts.
   */
  getDetail: (idOrSlug: number | string): Promise<ApiResponse<MovieDTO>> =>
    axiosClient.get(`/movies/${idOrSlug}`),

  /**
   * GET /api/v1/movies/:idOrSlug
   * Unified endpoint: nhận cả numeric id hoặc slug.
   * Trả về MovieDetailDTO (full-detail) — dùng cho movie detail page.
   * Gộp từ movieDetailApi.getDetail (trước đây gọi /movies/detail/:slug).
   */
  getMovieDetail: (idOrSlug: number | string): Promise<ApiResponse<MovieDetailDTO>> =>
    axiosClient.get(`/movies/${idOrSlug}`),

  /**
   * GET /api/v1/movies/:id/credits
   * Diễn viên và đoàn phim.
   * Gộp từ movieDetailApi.getCredits.
   */
  getCredits: (id: number): Promise<ApiResponse<CreditsDTO>> =>
    axiosClient.get(`/movies/${id}/credits`),

  /**
   * GET /api/v1/movies/:id/videos
   * Trailer, Teaser, Clip.
   * Gộp từ movieDetailApi.getVideos.
   */
  getVideos: (id: number): Promise<ApiResponse<VideoListDTO>> =>
    axiosClient.get(`/movies/${id}/videos`),

  /**
   * GET /api/v1/movies/:id/similar
   * Phim tương tự.
   * Gộp từ movieDetailApi.getSimilar.
   */
  getSimilar: (id: number, page = 1): Promise<ApiResponse<MovieListResponseDTO>> =>
    axiosClient.get(`/movies/${id}/similar`, { params: { page } }),
};
