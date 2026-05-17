import { ShowtimeDTO, ShowtimeSeatDTO, ShowtimeSeatListDTO } from '../dto/showtime.dto';
import {
  Showtime,
  ShowtimeList,
  ShowtimeSeat,
  ShowtimeSeatMap,
  ShowtimeQueryParams,
} from '../types/showtime.type';

/**
 * Showtime Mapper
 * Chuyển đổi DTO → Domain Model.
 * Tất cả derive logic (isSoldOut, formattedTime, formattedPrice) được
 * tính tại đây — UI không chứa bất kỳ transform nào.
 */

const formatTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return isoString;
  }
};

const formatPrice = (amount: number): string =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);

export const showtimeMapper = {
  toShowtime: (dto: ShowtimeDTO): Showtime => ({
    showtimeId:     dto.showtimeId,
    movieId:        dto.movieId,
    movieTitle:     dto.movieTitle,
    cinemaId:       dto.cinemaId,
    cinemaName:     dto.cinemaName,
    roomId:         dto.roomId,
    roomName:       dto.roomName,
    startTime:      dto.startTime,
    endTime:        dto.endTime,
    price:          dto.price,
    totalSeats:     dto.totalSeats,
    bookedSeats:    dto.bookedSeats,
    availableSeats: dto.availableSeats,
    // Derived
    isSoldOut:      dto.availableSeats === 0,
    formattedTime:  formatTime(dto.startTime),
    formattedPrice: formatPrice(dto.price),
  }),

  toShowtimeList: (dtos: ShowtimeDTO[], date: string): ShowtimeList => {
    const items = dtos.map(showtimeMapper.toShowtime);
    return {
      items,
      date,
      isEmpty: items.length === 0,
    };
  },

  toSeat: (dto: ShowtimeSeatDTO): ShowtimeSeat => ({
    seatId: dto.seatId,
    label:  dto.label,
    row:    dto.row,
    number: dto.number,
    status: dto.status,
  }),

  toSeatMap: (dto: ShowtimeSeatListDTO): ShowtimeSeatMap => ({
    showtimeId: dto.showtimeId,
    seats:      dto.seats.map(showtimeMapper.toSeat),
  }),
};

// ─── Date Utility (dùng trong Hook để build danh sách ngày) ─────────────────

/**
 * Tạo danh sách ngày từ hôm nay đến N ngày tiếp theo.
 * Format: YYYY-MM-DD (timezone local của user).
 */
export const buildDateRange = (daysAhead = 7): string[] => {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 0; i <= daysAhead; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    // Format local YYYY-MM-DD (không dùng toISOString vì bị UTC offset)
    const yyyy = d.getFullYear();
    const mm   = String(d.getMonth() + 1).padStart(2, '0');
    const dd   = String(d.getDate()).padStart(2, '0');
    dates.push(`${yyyy}-${mm}-${dd}`);
  }

  return dates;
};

/**
 * Format ngày hiển thị dạng "CN 17/05" hoặc "T2 18/05"
 */
export const formatDateLabel = (dateStr: string): { dayName: string; dayDate: string } => {
  const date = new Date(dateStr + 'T00:00:00'); // Avoid UTC parse
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return {
    dayName: dayNames[date.getDay()],
    dayDate: `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`,
  };
};

/**
 * Tính query params date range cho backend:
 * startTime >= date 00:00:00 AND startTime < nextDay 00:00:00
 * Không dùng DATE() function để tránh làm chậm query.
 */
export const buildShowtimeDateParams = (date: string): ShowtimeQueryParams & { _dateStart: string; _dateEnd: string } => {
  const nextDay = new Date(date + 'T00:00:00');
  nextDay.setDate(nextDay.getDate() + 1);
  const yyyy = nextDay.getFullYear();
  const mm   = String(nextDay.getMonth() + 1).padStart(2, '0');
  const dd   = String(nextDay.getDate()).padStart(2, '0');

  return {
    date,
    _dateStart: `${date} 00:00:00`,
    _dateEnd:   `${yyyy}-${mm}-${dd} 00:00:00`,
  };
};
