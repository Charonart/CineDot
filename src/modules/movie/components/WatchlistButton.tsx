'use client';

import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { useToggleWatchlist, useWatchlistStatus } from '../hooks/useMovieActions';

interface WatchlistButtonProps {
  movieId: number | string;
  showLabel?: boolean;
  className?: string;
}

/**
 * WatchlistButton
 *
 * Nút "Thêm vào / Xóa khỏi Watchlist" với Optimistic Update.
 * - Dùng đúng CSS class của dự án (.btn-ghost, .btn-watchlist-active).
 * - Bị vô hiệu hóa khi mutation đang xử lý (isPending).
 * - Không tự gọi API; tất cả logic nằm trong useToggleWatchlist.
 */
export function WatchlistButton({
  movieId,
  showLabel = true,
  className = '',
}: WatchlistButtonProps) {
  const { data: watchlistState, isLoading: isStatusLoading } =
    useWatchlistStatus(movieId);

  const { mutate: toggleWatchlist, isPending } = useToggleWatchlist(movieId);

  const isInWatchlist = watchlistState?.isInWatchlist ?? false;
  const isDisabled = isPending || isStatusLoading;

  const handleClick = () => {
    if (isDisabled) return;
    toggleWatchlist({
      movieId,
      targetState: !isInWatchlist,
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={
        isInWatchlist ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'
      }
      aria-pressed={isInWatchlist}
      className={[
        'btn-ghost btn-large btn-watchlist',
        isInWatchlist ? 'btn-watchlist--active' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isPending ? (
        <Loader2 className="btn-icon btn-icon--spin" aria-hidden />
      ) : isInWatchlist ? (
        <BookmarkCheck className="btn-icon btn-icon--filled" aria-hidden />
      ) : (
        <Bookmark className="btn-icon" aria-hidden />
      )}

      {showLabel && (
        <span>
          {isPending
            ? 'Đang xử lý...'
            : isInWatchlist
              ? 'Đã lưu'
              : 'Yêu thích'}
        </span>
      )}
    </button>
  );
}
