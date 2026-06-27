import {
  WatchlistResponseDTO,
  RatingResponseDTO,
} from '../dto/movie-action.dto';
import {
  WatchlistState,
  RatingState,
} from '../types/movie-action.type';

export const movieActionMapper = {
  /**
   * Chuyển đổi WatchlistResponseDTO (raw backend) → WatchlistState (UI-friendly).
   */
  toWatchlistState: (dto: WatchlistResponseDTO): WatchlistState => {
    return {
      movieId: dto.movieId,
      isInWatchlist: dto.isInWatchlist,
      updatedAt: dto.updatedAt,
    };
  },

  /**
   * Chuyển đổi RatingResponseDTO (raw backend) → RatingState (UI-friendly).
   * Tính thêm voteCountFormatted để component không cần xử lý thêm.
   */
  toRatingState: (dto: RatingResponseDTO): RatingState => {
    return {
      movieId: dto.movieId,
      userScore: dto.userScore,
      averageScore: dto.averageScore,
      voteCount: dto.voteCount,
      voteCountFormatted: dto.voteCount.toLocaleString('vi-VN'),
      updatedAt: dto.updatedAt,
    };
  },

  /**
   * Tạo WatchlistState "optimistic" cục bộ — dùng trong onMutate khi chưa có response từ server.
   */
  toOptimisticWatchlistState: (
    movieId: number | string,
    targetIsInWatchlist: boolean,
  ): WatchlistState => {
    return {
      movieId,
      isInWatchlist: targetIsInWatchlist,
      updatedAt: new Date().toISOString(),
    };
  },

  /**
   * Tạo RatingState "optimistic" cục bộ — dùng trong onMutate khi chưa có response từ server.
   * averageScore và voteCount giữ nguyên giá trị trước; chỉ userScore thay đổi tức thì.
   */
  toOptimisticRatingState: (
    previous: RatingState,
    newScore: number,
  ): RatingState => {
    return {
      ...previous,
      userScore: newScore,
      updatedAt: new Date().toISOString(),
    };
  },
};
