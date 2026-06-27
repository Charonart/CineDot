import { axiosClient } from '@lib/axios/axiosClient';
import { ApiResponse } from '@shared/types/api.type';
import {
  WatchlistRequestDTO,
  RatingRequestDTO,
  RemoveRatingRequestDTO,
  WatchlistResponseDTO,
  RatingResponseDTO,
} from '../dto/movie-action.dto';

export const movieActionApi = {
  /**
   * POST /api/v1/movies/watchlist
   * Toggle watchlist cho một bộ phim (thêm hoặc xóa).
   * Yêu cầu user đã đăng nhập (Bearer token qua cookie session).
   */
  toggleWatchlist: (
    payload: WatchlistRequestDTO,
  ): Promise<ApiResponse<WatchlistResponseDTO>> =>
    axiosClient.post('/movies/watchlist', payload),

  /**
   * GET /api/v1/movies/:movieId/watchlist
   * Lấy trạng thái watchlist hiện tại của user với bộ phim cụ thể.
   */
  getWatchlistStatus: (
    movieId: number,
  ): Promise<ApiResponse<WatchlistResponseDTO>> =>
    axiosClient.get(`/movies/${movieId}/watchlist`),

  /**
   * POST /api/v1/movies/:movieId/ratings
   * Thêm hoặc cập nhật điểm đánh giá của user.
   */
  rateMovie: (
    payload: RatingRequestDTO,
  ): Promise<ApiResponse<RatingResponseDTO>> =>
    axiosClient.post(`/movies/${payload.movieId}/ratings`, {
      score: payload.score,
    }),

  /**
   * DELETE /api/v1/movies/:movieId/ratings
   * Xóa điểm đánh giá của user với bộ phim.
   */
  removeRating: (
    payload: RemoveRatingRequestDTO,
  ): Promise<ApiResponse<RatingResponseDTO>> =>
    axiosClient.delete(`/movies/${payload.movieId}/ratings`),

  /**
   * GET /api/v1/movies/:movieId/ratings/me
   * Lấy điểm đánh giá hiện tại của user với bộ phim.
   */
  getMyRating: (
    movieId: number,
  ): Promise<ApiResponse<RatingResponseDTO>> =>
    axiosClient.get(`/movies/${movieId}/ratings/me`),
};
