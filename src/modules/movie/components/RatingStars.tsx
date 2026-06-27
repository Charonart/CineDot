'use client';

import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { useRateMovie, useRemoveRating, useMyRating } from '../hooks/useMovieActions';
import { RatingState } from '../types/movie-action.type';

interface RatingStarsProps {
  movieId: number | string;
  /** Hiển thị điểm trung bình cộng đồng và số lượt vote */
  showStats?: boolean;
  /** Class bổ sung */
  className?: string;
}

/**
 * RatingStars
 *
 * Component đánh giá phim theo hệ 10 sao (mỗi sao = 1 điểm).
 * - Dùng đúng CSS class của dự án (.rating-stars, .rating-star, v.v.)
 * - Hover preview: sao sáng lên khi hover.
 * - Optimistic Update: userScore thay đổi ngay khi click.
 * - Disabled khi mutation đang pending (isPending).
 */
export function RatingStars({
  movieId,
  showStats = true,
  className = '',
}: RatingStarsProps) {
  const [hoveredScore, setHoveredScore] = useState<number>(0);

  const { data: ratingState, isLoading: isRatingLoading } = useMyRating(movieId);
  const { mutate: rateMovie, isPending: isRating } = useRateMovie(movieId);
  const { mutate: removeRating, isPending: isRemoving } = useRemoveRating(movieId);

  const isPending = isRating || isRemoving;
  const userScore = ratingState?.userScore ?? 0;
  const hasRated = userScore > 0;
  const displayScore = hoveredScore > 0 ? hoveredScore : userScore;

  const handleStarClick = (score: number) => {
    if (isPending) return;
    if (score === userScore) {
      removeRating({ movieId });
    } else {
      rateMovie({ movieId, score });
    }
  };

  const handleStarHover = (score: number) => {
    if (!isPending) setHoveredScore(score);
  };

  const handleMouseLeave = () => setHoveredScore(0);

  return (
    <div className={`rating-widget ${className}`}>
      {/* Stars Row */}
      <div
        className="rating-stars"
        onMouseLeave={handleMouseLeave}
        role="group"
        aria-label={`Đánh giá phim: ${userScore > 0 ? `${userScore}/10` : 'Chưa đánh giá'}`}
      >
        {Array.from({ length: 10 }, (_, i) => {
          const starScore = i + 1;
          const isFilled = starScore <= displayScore;
          const isHovered = hoveredScore > 0 && starScore <= hoveredScore;

          return (
            <button
              key={starScore}
              type="button"
              onClick={() => handleStarClick(starScore)}
              onMouseEnter={() => handleStarHover(starScore)}
              disabled={isPending || isRatingLoading}
              aria-label={`Đánh giá ${starScore} điểm`}
              aria-pressed={starScore === userScore}
              className={[
                'rating-star',
                isFilled ? 'rating-star--filled' : '',
                isHovered && !isPending ? 'rating-star--hovered' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <Star aria-hidden />
            </button>
          );
        })}

        {/* Nút xóa đánh giá */}
        {hasRated && !isPending && (
          <button
            type="button"
            onClick={() => removeRating({ movieId })}
            aria-label="Xóa đánh giá của bạn"
            className="rating-remove-btn"
          >
            <X aria-hidden />
          </button>
        )}

        {/* Spinner khi đang xử lý */}
        {isPending && (
          <span
            className="rating-spinner"
            role="status"
            aria-label="Đang xử lý đánh giá..."
          />
        )}
      </div>

      {/* Score preview text */}
      <p className="rating-hint">
        {hoveredScore > 0 ? (
          <span className="rating-hint--preview">
            {hoveredScore === userScore
              ? `Bỏ chọn ${hoveredScore} điểm`
              : `Chọn ${hoveredScore} điểm`}
          </span>
        ) : hasRated ? (
          <span className="rating-hint--selected">
            Bạn đã chọn: <strong>{userScore}</strong>/10
          </span>
        ) : (
          <span className="rating-hint--idle">
            {isRatingLoading ? 'Đang tải...' : 'Chọn điểm đánh giá'}
          </span>
        )}
      </p>

      {/* Community stats */}
      {showStats && ratingState && (
        <RatingCommunityStats ratingState={ratingState} />
      )}
    </div>
  );
}

// ─── Community Stats Sub-component ───────────────────────────────────────────

interface RatingCommunityStatsProps {
  ratingState: RatingState;
}

function RatingCommunityStats({ ratingState }: RatingCommunityStatsProps) {
  return (
    <div
      className="rating-community"
      aria-label={`Điểm TB: ${ratingState.averageScore.toFixed(1)}/10, ${ratingState.voteCountFormatted} lượt`}
    >
      <Star className="rating-community__icon" aria-hidden />
      <span className="rating-community__score">
        {ratingState.averageScore.toFixed(1)}
      </span>
      <span className="rating-community__divider">/10</span>
      <span className="rating-community__count">
        ({ratingState.voteCountFormatted} lượt)
      </span>
    </div>
  );
}
