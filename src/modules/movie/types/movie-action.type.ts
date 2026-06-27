/**
 * Movie Action Domain Types
 * UI-friendly types consumed by components — never raw DTOs.
 */

// ─── Watchlist ─────────────────────────────────────────────────────────────────

export interface WatchlistState {
  movieId: number | string;
  /** Trạng thái hiện tại: phim có trong watchlist không? */
  isInWatchlist: boolean;
  /** ISO timestamp lần cuối cập nhật */
  updatedAt: string;
}

// ─── Rating ────────────────────────────────────────────────────────────────────

export interface RatingState {
  movieId: number | string;
  /** Điểm user đặt (0 = chưa đánh giá) */
  userScore: number;
  /** Điểm trung bình toàn hệ thống */
  averageScore: number;
  /** Tổng số lượt đánh giá */
  voteCount: number;
  /** Formatted vote count, e.g. "1,234" */
  voteCountFormatted: string;
  /** ISO timestamp lần cuối cập nhật */
  updatedAt: string;
}

// ─── Combined State ────────────────────────────────────────────────────────────

/**
 * Trạng thái tổng hợp cho một bộ phim, dùng trong Optimistic Update context.
 */
export interface MovieActionState {
  watchlist: WatchlistState;
  rating: RatingState;
}

// ─── Payload types ─────────────────────────────────────────────────────────────

export interface ToggleWatchlistPayload {
  movieId: number | string;
  /** Nếu true → thêm vào, false → xóa khỏi watchlist */
  targetState: boolean;
}

export interface RateMoviePayload {
  movieId: number | string;
  score: number;
}

export interface RemoveRatingPayload {
  movieId: number | string;
}
