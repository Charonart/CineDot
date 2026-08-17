import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import {
  SeatItem,
  SeatRowGroup,
  ShowtimeBookingInfo,
  HoldSeatsPayload,
  HoldSeatsResult,
  SeatType,
  SeatStatus,
} from '../types/seat-booking.types';
import { imageHelper } from '@/shared/utils/imageHelper';

export function formatShowDate(dateStr?: string): string {
  if (!dateStr) return 'Hôm nay';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

export const seatBookingService = {
  /**
   * Tải toàn bộ thông tin Suất chiếu và Sơ đồ ghế thực tế từ Backend
   */
  async fetchShowtimeBookingData(showtimeId: string | number): Promise<{
    showtimeInfo: ShowtimeBookingInfo;
    seats: SeatItem[];
    seatRowGroups: SeatRowGroup[];
  }> {
    const cleanId = String(showtimeId).replace('showtime-', '');

    try {
      // 1. Call GET /showtimes/:id and GET /showtimes/:id/seats in parallel
      const [showtimeRes, seatsRes] = await Promise.all([
        apiClient.get(ENDPOINTS.SHOWTIMES.DETAIL(cleanId)).catch(() => null),
        apiClient.get(ENDPOINTS.SHOWTIMES.SEATS(cleanId)).catch(() => null),
      ]);

      const stData = showtimeRes?.data?.data || {};
      const seatPayload = seatsRes?.data?.data || {};
      const rawSeats = Array.isArray(seatPayload.seats) ? seatPayload.seats : [];
      const showtimeMeta = seatPayload.showtime || stData || {};

      // 2. Parse Showtime metadata
      const movie = stData.movie || {};
      const cinema = stData.cinema || {};

      const showtimeInfo: ShowtimeBookingInfo = {
        showtimeId: String(stData.id || showtimeMeta.showtime_id || cleanId),
        movieSlug: movie.slug || 'movie-detail',
        movieTitle: movie.title || showtimeMeta.movie_title || 'Tên Phim',
        movieFormat: stData.format || movie.formatBadge || 'IMAX Laser',
        posterUrl: imageHelper.getPosterUrl(movie.posterUrl || movie.poster_url),
        backdropUrl: imageHelper.getBackdropUrl(movie.backdropUrl || movie.backdrop_url),
        ageRating: movie.ageRating || 'P',
        duration: movie.duration || '120 phút',
        cinemaName: cinema.name || showtimeMeta.cinema_name || 'CineDot Cinema',
        cinemaAddress: cinema.address,
        roomName: stData.screen || showtimeMeta.room_name || 'Phòng 01 (IMAX)',
        showTime: stData.startTime || '19:30',
        endTime: stData.endTime,
        showDate: stData.showDate || 'Hôm nay',
        basePrice: Number(stData.price || showtimeMeta.base_price || 90000),
        countdownSeconds: 600, // 10 minutes default
      };

      // 3. Parse Seat items
      let mappedSeats: SeatItem[] = [];

      if (rawSeats.length > 0) {
        mappedSeats = rawSeats.map((s: any) => {
          const rawType = (s.seat_type || 'standard').toLowerCase();
          const type: SeatType = rawType.includes('vip')
            ? 'VIP'
            : rawType.includes('couple') || rawType.includes('sweet')
            ? 'SWEETBOX'
            : 'STANDARD';

          const rawStatus = (s.status || 'AVAILABLE').toUpperCase();
          const status: SeatStatus =
            rawStatus === 'BOOKED'
              ? 'BOOKED'
              : rawStatus === 'HOLDING'
              ? 'HOLDING'
              : rawStatus === 'BLOCKED'
              ? 'BLOCKED'
              : 'AVAILABLE';

          return {
            id: s.seat_code || `${s.row_name}${s.seat_number}`,
            showtime_seat_id: Number(s.showtime_seat_id || s.id),
            row: s.row_name || 'A',
            number: Number(s.seat_number || 1),
            type,
            status,
            price: Number(s.final_price || showtimeInfo.basePrice + (s.surcharge || 0)),
            surcharge: Number(s.surcharge || 0),
            canvas: s.canvas,
          };
        });
      }

      // 4. Group seats by Row (A, B, C, D, E, F, G)
      const rowMap: Record<string, SeatItem[]> = {};
      for (const seat of mappedSeats) {
        if (!rowMap[seat.row]) {
          rowMap[seat.row] = [];
        }
        rowMap[seat.row].push(seat);
      }

      // Sort rows alphabetically & seats numerically
      const seatRowGroups: SeatRowGroup[] = Object.keys(rowMap)
        .sort()
        .map((rowName) => ({
          rowName,
          seats: rowMap[rowName].sort((a, b) => a.number - b.number),
        }));

      return {
        showtimeInfo,
        seats: mappedSeats,
        seatRowGroups,
      };
    } catch (err) {
      console.warn('fetchShowtimeBookingData error:', err);
      throw err;
    }
  },

  /**
   * Lấy danh sách các suất chiếu thực tế cùng rạp & cùng phim trong ngày để chuyển đổi nhanh
   */
  async fetchSiblingShowtimes(
    movieSlugOrId: string | number,
    dateStr?: string,
    cinemaNameOrId?: string
  ): Promise<Array<{ id: string; time: string; format?: string }>> {
    try {
      const params: Record<string, any> = { movie_id: movieSlugOrId };
      if (dateStr) params.date = dateStr;

      const res = await apiClient.get(ENDPOINTS.SHOWTIMES.LIST, { params });
      if (res.data?.success && res.data?.data) {
        const payload = res.data.data;
        const results = Array.isArray(payload) ? payload : (payload.results || []);
        const targetGroup = results[0] || payload;
        const rawCinemas = targetGroup?.cinemas || [];

        const targetCinema = rawCinemas.find((cg: any) => {
          const c = cg.cinema || cg;
          const cName = c.cinema_name || c.name || '';
          const cId = String(c.cinema_id || c.id || '');
          if (cinemaNameOrId) {
            return (
              cName.toLowerCase().includes(cinemaNameOrId.toLowerCase()) ||
              cinemaNameOrId.toLowerCase().includes(cName.toLowerCase()) ||
              cId === String(cinemaNameOrId)
            );
          }
          return true;
        }) || rawCinemas[0];

        if (targetCinema && Array.isArray(targetCinema.times)) {
          return targetCinema.times.map((t: any) => ({
            id: String(t.id || t.showtime_id),
            time:
              t.startTime ||
              (t.showtime_start
                ? new Date(t.showtime_start).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '19:30'),
            format: t.format || t.screen_type,
          }));
        }
      }
      return [];
    } catch {
      return [];
    }
  },

  /**
   * Giữ ghế tạm thời trong 10 phút trên Redis
   */
  async holdSeats(payload: HoldSeatsPayload): Promise<HoldSeatsResult> {
    try {
      const res = await apiClient.post(ENDPOINTS.BOOKINGS.HOLD_SEATS, payload);
      if (res.data?.success) {
        return {
          success: true,
          message: res.data.message || 'Giữ ghế thành công',
          booking_id: res.data.data?.booking_id,
          booking_code: res.data.data?.booking_code,
          expires_in_seconds: res.data.data?.expires_in_seconds || 600,
          expires_at: res.data.data?.expires_at,
        };
      }
      return {
        success: false,
        message: res.data?.message || 'Không thể giữ ghế. Ghế có thể đã có người chọn.',
      };
    } catch (err: any) {
      if (err?.response?.status === 401) {
        return {
          success: false,
          message: 'Vui lòng đăng nhập để đặt vé.',
          needsAuth: true,
        } as any;
      }
      return {
        success: false,
        message: err?.response?.data?.message || err?.message || 'Lỗi khi gửi yêu cầu giữ ghế.',
      };
    }
  },

  /**
   * Hủy giữ ghế khi người dùng hủy bỏ hoặc thoát trang
   */
  async releaseSeats(showtimeId: number | string, seatIds: number[]): Promise<boolean> {
    try {
      await apiClient.post(ENDPOINTS.BOOKINGS.RELEASE_SEATS, {
        showtime_id: Number(showtimeId),
        showtime_seat_ids: seatIds,
      });
      return true;
    } catch {
      return false;
    }
  },
};
