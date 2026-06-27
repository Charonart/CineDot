import { axiosClient } from '@lib/axios/axiosClient';
import { ApiResponse } from '@shared/types/api.type';
import { MovieDetailDTO, CreditsDTO, VideoListDTO } from '../dto/movie-detail.dto';
import { MovieListResponseDTO } from '@modules/movie/dto/movie.dto';

export const movieDetailApi = {
  /**
   * GET /api/v1/movies/detail/:slug
   * Thông tin chi tiết phim
   */
  getDetail: (slug: string | number): Promise<ApiResponse<MovieDetailDTO>> =>
    axiosClient.get(`/movies/detail/${slug}`),

  /**
   * GET /api/v1/movies/:id/credits
   * Diễn viên và đoàn phim
   */
  getCredits: (id: number): Promise<ApiResponse<CreditsDTO>> =>
    axiosClient.get(`/movies/${id}/credits`),

  /**
   * GET /api/v1/movies/:id/videos
   * Trailer, Teaser, Clip
   */
  getVideos: (id: number): Promise<ApiResponse<VideoListDTO>> =>
    axiosClient.get(`/movies/${id}/videos`),

  /**
   * GET /api/v1/movies/:id/similar
   * Phim tương tự
   */
  getSimilar: (id: number, page = 1): Promise<ApiResponse<MovieListResponseDTO>> =>
    axiosClient.get(`/movies/${id}/similar`, { params: { page } }),
};
