/**
 * Movie Status Constants & Helpers
 * Standardized across Database, Backend API, and Frontend:
 * - 'now_showing': Phim đang chiếu
 * - 'upcoming': Phim sắp chiếu
 * - 'ended': Phim đã ngừng chiếu
 */

export type MovieStatus = 'now_showing' | 'upcoming' | 'ended';

/**
 * Normalizes any status input to the canonical MovieStatus
 */
export function normalizeMovieStatus(status?: string | null): MovieStatus {
  if (!status) return 'now_showing';
  const s = status.toLowerCase().trim();
  if (s === 'upcoming' || s.includes('coming') || s.includes('sap')) return 'upcoming';
  if (s === 'ended' || s === 'stopped' || s.includes('ngung')) return 'ended';
  return 'now_showing';
}

/**
 * Check if status is now showing
 */
export function isNowShowing(status?: string | null): boolean {
  return normalizeMovieStatus(status) === 'now_showing';
}

/**
 * Check if status is upcoming
 */
export function isUpcoming(status?: string | null): boolean {
  return normalizeMovieStatus(status) === 'upcoming';
}

/**
 * Check if status is ended
 */
export function isEnded(status?: string | null): boolean {
  return normalizeMovieStatus(status) === 'ended';
}

/**
 * Returns human-readable Vietnamese label
 */
export function getMovieStatusLabel(status?: string | null): string {
  const norm = normalizeMovieStatus(status);
  switch (norm) {
    case 'upcoming':
      return 'Sắp chiếu';
    case 'ended':
      return 'Ngừng chiếu';
    case 'now_showing':
    default:
      return 'Đang chiếu';
  }
}
