/**
 * Movie Action DTOs
 * Raw data shapes sent to/received from the backend proxy.
 * Do NOT use these directly in UI components — use Domain Types instead.
 */

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface WatchlistRequestDTO {
  movieId: number | string;
  /** 'add' để thêm vào watchlist, 'remove' để xóa khỏi watchlist */
  action: 'add' | 'remove';
}

export interface RatingRequestDTO {
  movieId: number | string;
  /** Điểm đánh giá: số thực từ 0.5 đến 10, bước nhảy 0.5 */
  score: number;
}

export interface RemoveRatingRequestDTO {
  movieId: number | string;
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface WatchlistResponseDTO {
  movieId: number | string;
  isInWatchlist: boolean;
  updatedAt: string;
}

export interface RatingResponseDTO {
  movieId: number | string;
  userScore: number;
  averageScore: number;
  voteCount: number;
  updatedAt: string;
}
