'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { movieActionService } from '../services/movie-action.service';
import { movieActionMapper } from '../mappers/movie-action.mapper';
import {
  WatchlistState,
  RatingState,
  ToggleWatchlistPayload,
  RateMoviePayload,
  RemoveRatingPayload,
} from '../types/movie-action.type';
import { movieKeys } from './useMovies';
import { movieDetailKeys } from '@modules/movie-detail/hooks/useMovieDetail';
import { logger } from '@lib/logger/logger';

// ─── Query Key Factory ────────────────────────────────────────────────────────

export const movieActionKeys = {
  all: ['movie-actions'] as const,
  watchlist: (movieId: number | string) =>
    [...movieActionKeys.all, 'watchlist', movieId] as const,
  rating: (movieId: number | string) =>
    [...movieActionKeys.all, 'rating', movieId] as const,
};

// ─── Watchlist Status Query ───────────────────────────────────────────────────

export const useWatchlistStatus = (movieId: number | string) => {
  const numericId = Number(movieId);
  // Dùng id số nếu parse được, ngược lại dùng -1 để service vẫn nhận slug
  const serviceId = Number.isNaN(numericId) ? 0 : numericId;
  return useQuery({
    queryKey: movieActionKeys.watchlist(movieId),
    queryFn: () => movieActionService.getWatchlistStatus(serviceId || 1), // fallback id=1 cho mock
    enabled: !!movieId,
    staleTime: 2 * 60 * 1000,  // 2 phút
    gcTime: 10 * 60 * 1000,    // 10 phút
  });
};

// ─── My Rating Query ──────────────────────────────────────────────────────────

export const useMyRating = (movieId: number | string) => {
  const numericId = Number(movieId);
  const serviceId = Number.isNaN(numericId) ? 0 : numericId;
  return useQuery({
    queryKey: movieActionKeys.rating(movieId),
    queryFn: () => movieActionService.getMyRating(serviceId || 1), // fallback id=1 cho mock
    enabled: !!movieId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// ─── Toggle Watchlist Mutation (Optimistic Update) ────────────────────────────

export const useToggleWatchlist = (movieId: number | string) => {
  const queryClient = useQueryClient();
  const queryKey = movieActionKeys.watchlist(movieId);

  return useMutation<
    WatchlistState,           // TData: giá trị trả về khi thành công
    Error,                    // TError
    ToggleWatchlistPayload,   // TVariables
    { previousState: WatchlistState | undefined } // TContext (snapshot)
  >({
    mutationFn: (payload) => movieActionService.toggleWatchlist(payload),

    /**
     * onMutate: Thực thi NGAY LẬP TỨC trước khi API call.
     * 1. Hủy các queries đang chạy (tránh race condition ghi đè optimistic data).
     * 2. Snapshot state cũ để dự phòng rollback.
     * 3. Optimistically cập nhật cache với state mới.
     */
    onMutate: async (payload) => {
      // 1. Cancel outstanding refetches
      await queryClient.cancelQueries({ queryKey });

      // 2. Snapshot trạng thái hiện tại
      const previousState = queryClient.getQueryData<WatchlistState>(queryKey);

      // 3. Optimistic update: cập nhật cache ngay lập tức
      const optimisticState = movieActionMapper.toOptimisticWatchlistState(
        payload.movieId,
        payload.targetState,
      );
      queryClient.setQueryData<WatchlistState>(queryKey, optimisticState);

      logger.info(
        `[useToggleWatchlist] Optimistic update: movieId=${payload.movieId}, targetState=${payload.targetState}`,
      );

      // 4. Trả về context chứa snapshot để dùng trong onError
      return { previousState };
    },

    /**
     * onError: API thất bại → rollback về trạng thái cũ từ snapshot.
     */
    onError: (error, _payload, context) => {
      logger.error('[useToggleWatchlist] API error, rolling back:', error);

      if (context?.previousState !== undefined) {
        queryClient.setQueryData<WatchlistState>(queryKey, context.previousState);
      } else {
        // Không có snapshot → invalidate để fetch lại từ server
        queryClient.invalidateQueries({ queryKey });
      }
    },

    /**
     * onSettled: Chạy sau cả success VÀ error.
     * Invalidate để đồng bộ hóa state thật từ backend,
     * kể cả khi optimistic update đã đúng.
     */
    onSettled: (_data, _error, payload) => {
      // Đồng bộ watchlist state
      queryClient.invalidateQueries({ queryKey });

      // Đồng bộ movie detail (rating/voteCount có thể thay đổi sau server)
      queryClient.invalidateQueries({
        queryKey: movieKeys.detail(payload.movieId),
      });
      queryClient.invalidateQueries({
        queryKey: movieDetailKeys.detail(payload.movieId),
      });

      logger.info(
        `[useToggleWatchlist] Settled. Invalidated queries for movieId=${payload.movieId}`,
      );
    },
  });
};

// ─── Rate Movie Mutation (Optimistic Update) ──────────────────────────────────

export const useRateMovie = (movieId: number | string) => {
  const queryClient = useQueryClient();
  const ratingQueryKey = movieActionKeys.rating(movieId);

  return useMutation<
    RatingState,          // TData
    Error,                // TError
    RateMoviePayload,     // TVariables
    { previousState: RatingState | undefined } // TContext
  >({
    mutationFn: (payload) => movieActionService.rateMovie(payload),

    /**
     * onMutate: Optimistically cập nhật userScore ngay tức thì.
     * averageScore và voteCount được giữ nguyên (server mới tính chính xác).
     */
    onMutate: async (payload) => {
      // 1. Cancel outstanding refetches
      await queryClient.cancelQueries({ queryKey: ratingQueryKey });

      // 2. Snapshot state cũ
      const previousState = queryClient.getQueryData<RatingState>(ratingQueryKey);

      // 3. Optimistic update: chỉ cập nhật userScore
      if (previousState) {
        const optimisticState = movieActionMapper.toOptimisticRatingState(
          previousState,
          payload.score,
        );
        queryClient.setQueryData<RatingState>(ratingQueryKey, optimisticState);
      } else {
        // Chưa có cache → tạo mới với giá trị tạm
        const fallbackState: RatingState = {
          movieId: payload.movieId,
          userScore: payload.score,
          averageScore: 0,
          voteCount: 0,
          voteCountFormatted: '0',
          updatedAt: new Date().toISOString(),
        };
        queryClient.setQueryData<RatingState>(ratingQueryKey, fallbackState);
      }

      logger.info(
        `[useRateMovie] Optimistic update: movieId=${payload.movieId}, score=${payload.score}`,
      );

      return { previousState };
    },

    /**
     * onError: Rollback về điểm cũ nếu API thất bại.
     */
    onError: (error, _payload, context) => {
      logger.error('[useRateMovie] API error, rolling back:', error);

      if (context?.previousState !== undefined) {
        queryClient.setQueryData<RatingState>(ratingQueryKey, context.previousState);
      } else {
        queryClient.invalidateQueries({ queryKey: ratingQueryKey });
      }
    },

    /**
     * onSettled: Đồng bộ hóa tuyệt đối với server sau khi mutation settle.
     */
    onSettled: (_data, _error, payload) => {
      // Fetch lại rating thật từ server
      queryClient.invalidateQueries({ queryKey: ratingQueryKey });

      // Cập nhật movie detail (averageScore + voteCount thay đổi)
      queryClient.invalidateQueries({
        queryKey: movieKeys.detail(payload.movieId),
      });
      queryClient.invalidateQueries({
        queryKey: movieDetailKeys.detail(payload.movieId),
      });

      logger.info(
        `[useRateMovie] Settled. Invalidated queries for movieId=${payload.movieId}`,
      );
    },
  });
};

// ─── Remove Rating Mutation (Optimistic Update) ───────────────────────────────

export const useRemoveRating = (movieId: number | string) => {
  const queryClient = useQueryClient();
  const ratingQueryKey = movieActionKeys.rating(movieId);

  return useMutation<
    RatingState,
    Error,
    RemoveRatingPayload,
    { previousState: RatingState | undefined }
  >({
    mutationFn: (payload) => movieActionService.removeRating(payload),

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ratingQueryKey });

      const previousState = queryClient.getQueryData<RatingState>(ratingQueryKey);

      // Optimistic: reset userScore về 0 (chưa đánh giá)
      if (previousState) {
        queryClient.setQueryData<RatingState>(ratingQueryKey, {
          ...previousState,
          userScore: 0,
          updatedAt: new Date().toISOString(),
        });
      }

      logger.info(
        `[useRemoveRating] Optimistic update: movieId=${payload.movieId}, userScore reset to 0`,
      );

      return { previousState };
    },

    onError: (error, _payload, context) => {
      logger.error('[useRemoveRating] API error, rolling back:', error);

      if (context?.previousState !== undefined) {
        queryClient.setQueryData<RatingState>(ratingQueryKey, context.previousState);
      } else {
        queryClient.invalidateQueries({ queryKey: ratingQueryKey });
      }
    },

    onSettled: (_data, _error, payload) => {
      queryClient.invalidateQueries({ queryKey: ratingQueryKey });
      queryClient.invalidateQueries({
        queryKey: movieKeys.detail(payload.movieId),
      });
      queryClient.invalidateQueries({
        queryKey: movieDetailKeys.detail(payload.movieId),
      });

      logger.info(
        `[useRemoveRating] Settled. Invalidated queries for movieId=${payload.movieId}`,
      );
    },
  });
};
