export interface GenreDTO {
  id: number | string;
  name: string;
}

export interface MovieDTO {
  id: number | string;
  slug?: string;
  title: string;
  originalTitle?: string;
  overview: string;
  posterUrl: string;
  backdropUrl?: string | null;
  releaseDate?: string | null;
  rating: number;
  voteCount: number;
  genres: GenreDTO[];
  runtime?: number | null;
  formatTags?: string[];
  status?: 'now-showing' | 'coming-soon';
  ageRating?: string;
  subtitle?: string;
  trailerUrl?: string;
  featured?: boolean;
  categories?: string[];
}

export interface MovieListResponseDTO {
  page: number;
  results: MovieDTO[];
  totalPages: number;
  totalResults: number;
}

export interface HeroSlideDTO {
  id: number | string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  backdropUrl: string;
  posterUrl: string;
  runtime: number;
  rating: number;
  ageRating: string;
  formatTags: string[];
  trailerUrl: string;
  status: string;
}

// ─── Review DTOs ─────────────────────────────────────────────────────────────

/** Một bình luận / đánh giá phim từ GET /api/v1/movies/{id}/reviews */
export interface ReviewDTO {
  id: number;
  userId: number;
  username: string;
  avatar?: string | null;
  rating: number;        // 1-10
  comment: string;
  createdAt: string;     // ISO 8601
}

/** Paginated response từ GET /api/v1/movies/{id}/reviews */
export interface ReviewListResponseDTO {
  page: number;
  perPage: number;
  totalPages: number;
  totalResults: number;
  results: ReviewDTO[];
}

/** Payload gửi lên POST /api/v1/movies/{id}/reviews */
export interface AddReviewRequestDTO {
  rating: number;    // 1-10
  comment: string;
}

/** Response trả về từ POST /api/v1/movies/{id}/reviews */
export interface AddReviewResponseDTO {
  success: boolean;
  data: ReviewDTO;
  message?: string;
}
