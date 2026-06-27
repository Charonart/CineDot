import { movieActionApi } from '../api/movie-action.api';
import {
  watchlistRequestSchema,
  ratingRequestSchema,
  removeRatingRequestSchema,
  watchlistResponseSchema,
  ratingResponseSchema,
} from '../schemas/movie-action.schema';
import { movieActionMapper } from '../mappers/movie-action.mapper';
import {
  WatchlistState,
  RatingState,
  ToggleWatchlistPayload,
  RateMoviePayload,
  RemoveRatingPayload,
} from '../types/movie-action.type';
import { logger } from '@lib/logger/logger';

/**
 * movieActionService
 *
 * Lớp service điều phối luồng:
 *   payload → safeParse (Zod) → API call → Mapper → Domain Type
 *
 * Tuân thủ nguyên tắc: validate TRƯỚC, gọi API SAU, trả Domain Type.
 */
export const movieActionService = {
  /**
   * Toggle watchlist (thêm hoặc xóa) một bộ phim.
   * @throws Error nếu payload không hợp lệ hoặc API thất bại.
   */
  toggleWatchlist: async (
    payload: ToggleWatchlistPayload,
  ): Promise<WatchlistState> => {
    const dto = {
      movieId: payload.movieId,
      action: payload.targetState ? ('add' as const) : ('remove' as const),
    };

    // Bước 1: Validate payload trước khi gọi API
    const parseResult = watchlistRequestSchema.safeParse(dto);
    if (!parseResult.success) {
      const message = parseResult.error.errors
        .map((e) => e.message)
        .join('; ');
      logger.error('[movieActionService] toggleWatchlist validation failed:', parseResult.error);
      throw new Error(`VALIDATION_ERROR: ${message}`);
    }

    // Bước 2: Gọi API với validated payload
    const response = await movieActionApi.toggleWatchlist(parseResult.data);

    if (response && response.success === false) {
      logger.error('[movieActionService] toggleWatchlist API error:', response);
      throw new Error(response.message ?? 'TOGGLE_WATCHLIST_FAILED');
    }

    // Bước 3: Validate response
    const responseParseResult = watchlistResponseSchema.safeParse(response.data);
    if (!responseParseResult.success) {
      logger.warn(
        '[movieActionService] toggleWatchlist response schema mismatch (using raw data):',
        responseParseResult.error,
      );
      // Fallback: sử dụng data raw nếu response shape thay đổi nhẹ
      return movieActionMapper.toWatchlistState(response.data);
    }

    // Bước 4: Map response DTO → Domain Type
    return movieActionMapper.toWatchlistState(responseParseResult.data);
  },

  /**
   * Đánh giá một bộ phim với điểm score.
   * @throws Error nếu payload không hợp lệ hoặc API thất bại.
   */
  rateMovie: async (payload: RateMoviePayload): Promise<RatingState> => {
    // Bước 1: Validate payload
    const parseResult = ratingRequestSchema.safeParse(payload);
    if (!parseResult.success) {
      const message = parseResult.error.errors
        .map((e) => e.message)
        .join('; ');
      logger.error('[movieActionService] rateMovie validation failed:', parseResult.error);
      throw new Error(`VALIDATION_ERROR: ${message}`);
    }

    // Bước 2: Gọi API
    const response = await movieActionApi.rateMovie(parseResult.data);

    if (response && response.success === false) {
      logger.error('[movieActionService] rateMovie API error:', response);
      throw new Error(response.message ?? 'RATE_MOVIE_FAILED');
    }

    // Bước 3: Validate response
    const responseParseResult = ratingResponseSchema.safeParse(response.data);
    if (!responseParseResult.success) {
      logger.warn('[movieActionService] rateMovie response schema mismatch:', responseParseResult.error);
      return movieActionMapper.toRatingState(response.data);
    }

    // Bước 4: Map → Domain Type
    return movieActionMapper.toRatingState(responseParseResult.data);
  },

  /**
   * Xóa đánh giá của user với một bộ phim.
   * @throws Error nếu payload không hợp lệ hoặc API thất bại.
   */
  removeRating: async (payload: RemoveRatingPayload): Promise<RatingState> => {
    // Bước 1: Validate
    const parseResult = removeRatingRequestSchema.safeParse(payload);
    if (!parseResult.success) {
      const message = parseResult.error.errors
        .map((e) => e.message)
        .join('; ');
      logger.error('[movieActionService] removeRating validation failed:', parseResult.error);
      throw new Error(`VALIDATION_ERROR: ${message}`);
    }

    // Bước 2: Gọi API
    const response = await movieActionApi.removeRating(parseResult.data);

    if (response && response.success === false) {
      logger.error('[movieActionService] removeRating API error:', response);
      throw new Error(response.message ?? 'REMOVE_RATING_FAILED');
    }

    // Bước 3: Validate response
    const responseParseResult = ratingResponseSchema.safeParse(response.data);
    if (!responseParseResult.success) {
      logger.warn('[movieActionService] removeRating response schema mismatch:', responseParseResult.error);
      return movieActionMapper.toRatingState(response.data);
    }

    // Bước 4: Map → Domain Type
    return movieActionMapper.toRatingState(responseParseResult.data);
  },

  /**
   * Lấy trạng thái watchlist hiện tại của user.
   */
  getWatchlistStatus: async (movieId: number): Promise<WatchlistState> => {
    const response = await movieActionApi.getWatchlistStatus(movieId);
    if (response && response.success === false) {
      throw new Error(response.message ?? 'GET_WATCHLIST_STATUS_FAILED');
    }
    return movieActionMapper.toWatchlistState(response.data);
  },

  /**
   * Lấy điểm đánh giá hiện tại của user với bộ phim.
   */
  getMyRating: async (movieId: number): Promise<RatingState> => {
    const response = await movieActionApi.getMyRating(movieId);
    if (response && response.success === false) {
      throw new Error(response.message ?? 'GET_MY_RATING_FAILED');
    }
    return movieActionMapper.toRatingState(response.data);
  },
};
