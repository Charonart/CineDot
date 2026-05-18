import { useQuery } from '@tanstack/react-query';
import { showtimeService } from '../services/showtime.service';
import { ShowtimeQueryParams } from '../types/showtime.type';

// ─── Query Key Factory ────────────────────────────────────────────────────────

export const showtimeKeys = {
  all:      ['showtimes'] as const,
  lists:    () => [...showtimeKeys.all, 'list'] as const,
  list:     (movieId: number, params: ShowtimeQueryParams) =>
              [...showtimeKeys.lists(), movieId, params] as const,
  seatMaps: () => [...showtimeKeys.all, 'seats'] as const,
  seatMap:  (showtimeId: number) => [...showtimeKeys.seatMaps(), showtimeId] as const,
};

// ─── Config ───────────────────────────────────────────────────────────────────

const STALE_TIME = 5  * 60 * 1000;  // 5 phút
const GC_TIME    = 30 * 60 * 1000;  // 30 phút

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Lấy danh sách suất chiếu theo ngày.
 * enabled: chỉ fetch khi có date hợp lệ (YYYY-MM-DD) và movieId > 0.
 */
export const useShowtimes = (movieId: number, params: ShowtimeQueryParams) => {
  const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(params.date);

  return useQuery({
    queryKey:  showtimeKeys.list(movieId, params),
    queryFn:   () => showtimeService.getShowtimes(movieId, params),
    enabled:   isValidDate && movieId > 0,
    staleTime: STALE_TIME,
    gcTime:    GC_TIME,
  });
};

/**
 * Lấy sơ đồ ghế của một suất chiếu.
 * staleTime ngắn — ghế thay đổi liên tục.
 */
export const useShowtimeSeats = (showtimeId: number | null) => {
  return useQuery({
    queryKey:  showtimeKeys.seatMap(showtimeId ?? 0),
    queryFn:   () => showtimeService.getSeats(showtimeId!),
    enabled:   showtimeId !== null && showtimeId > 0,
    staleTime: 60 * 1000,  // 1 phút
    gcTime:    GC_TIME,
  });
};
