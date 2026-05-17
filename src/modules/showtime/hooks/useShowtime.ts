import { useQuery } from '@tanstack/react-query';
import { showtimeService } from '../services/showtime.service';
import { ShowtimeQueryParams } from '../types/showtime.type';

// ─── Query Key Factory ────────────────────────────────────────────────────────

/**
 * Centralized query keys để đảm bảo cache consistency.
 * Structure: ['showtimes', scope, ...params]
 * Dễ invalidate theo scope: showtimeKeys.all để clear toàn bộ.
 */
export const showtimeKeys = {
  all:       ['showtimes'] as const,
  lists:     () => [...showtimeKeys.all, 'list'] as const,
  list:      (params: ShowtimeQueryParams) => [...showtimeKeys.lists(), params] as const,
  seatMaps:  () => [...showtimeKeys.all, 'seats'] as const,
  seatMap:   (showtimeId: number) => [...showtimeKeys.seatMaps(), showtimeId] as const,
};

// ─── Config ───────────────────────────────────────────────────────────────────

const STALE_TIME = 5  * 60 * 1000;  // 5 phút — chuẩn của project
const GC_TIME    = 30 * 60 * 1000;  // 30 phút

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Lấy danh sách suất chiếu theo ngày.
 * enabled: chỉ fetch khi có date hợp lệ (YYYY-MM-DD).
 * staleTime ngắn hơn vì dữ liệu thay đổi liên tục (người mua vé).
 */
export const useShowtimes = (params: ShowtimeQueryParams) => {
  const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(params.date);

  return useQuery({
    queryKey:  showtimeKeys.list(params),
    queryFn:   ({ signal: _signal }) => showtimeService.getShowtimes(params),
    enabled:   isValidDate,
    staleTime: STALE_TIME,
    gcTime:    GC_TIME,
  });
};

/**
 * Lấy sơ đồ ghế của một suất chiếu.
 * staleTime ngắn hơn mức mặc định — ghế có thể bị book bất cứ lúc nào.
 * Extensible: thêm refetchInterval khi triển khai realtime.
 */
export const useShowtimeSeats = (showtimeId: number | null) => {
  return useQuery({
    queryKey:  showtimeKeys.seatMap(showtimeId ?? 0),
    queryFn:   () => showtimeService.getSeats(showtimeId!),
    enabled:   showtimeId !== null && showtimeId > 0,
    staleTime: 60 * 1000,  // 1 phút — ghế thay đổi nhanh
    gcTime:    GC_TIME,
  });
};
