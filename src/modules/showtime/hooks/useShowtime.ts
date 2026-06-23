import { useQuery } from '@tanstack/react-query';
import { showtimeService } from '../services/showtime.service';
import { ShowtimeQueryParams } from '../types/showtime.type';

// ─── Query Key Factory ────────────────────────────────────────────────────────

export const showtimeKeys = {
  all:      ['showtimes'] as const,
  lists:    () => [...showtimeKeys.all, 'list'] as const,
  list:     (movieId: number | string, params: ShowtimeQueryParams) =>
              [...showtimeKeys.lists(), movieId, params] as const,
  seatMaps: () => [...showtimeKeys.all, 'seats'] as const,
  seatMap:  (showtimeId: number | string) => [...showtimeKeys.seatMaps(), showtimeId] as const,
};

// ─── Config ───────────────────────────────────────────────────────────────────

const STALE_TIME = 5  * 60 * 1000;  // 5 phút
const GC_TIME    = 30 * 60 * 1000;  // 30 phút

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Lấy danh sách suất chiếu theo ngày.
 * enabled: chỉ fetch khi có date hợp lệ (YYYY-MM-DD) và movieId hợp lệ.
 */
export const useShowtimes = (movieId: number | string, params: ShowtimeQueryParams) => {
  const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(params.date);
  const hasMovieId = typeof movieId === 'string' ? !!movieId.trim() : movieId > 0;

  return useQuery({
    queryKey:  showtimeKeys.list(movieId, params),
    queryFn:   () => showtimeService.getShowtimes(movieId, params),
    enabled:   isValidDate && hasMovieId,
    staleTime: STALE_TIME,
    gcTime:    GC_TIME,
  });
};

/**
 * Lấy sơ đồ ghế của một suất chiếu.
 * staleTime ngắn — ghế thay đổi liên tục.
 */
export const useShowtimeSeats = (showtimeId: number | string | null) => {
  const hasShowtimeId = showtimeId !== null && (typeof showtimeId === 'string' ? !!showtimeId.trim() : showtimeId > 0);

  return useQuery({
    queryKey:  showtimeKeys.seatMap(showtimeId ?? ''),
    queryFn:   () => showtimeService.getSeats(showtimeId!),
    enabled:   hasShowtimeId,
    staleTime: 60 * 1000,  // 1 phút
    gcTime:    GC_TIME,
  });
};
