import { ShowtimeItemDTO, ShowtimeSeatListDTO, SeatTypePriceDTO } from '../dto/showtime.dto';
import {
  Showtime,
  ShowtimeList,
  ShowtimeSeatMap,
  ShowtimeSeatRow,
  ShowtimeSeat,
  SeatTypePrice,
  ShowtimeCinemaGroup,
  ShowtimeFormatGroup,
  ShowtimeQueryParams,
} from '../types/showtime.type';

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

const getOccupancyColor = (occupancy: number): 'green' | 'orange' | 'red' => {
  if (occupancy >= 90) return 'red';
  if (occupancy >= 60) return 'orange';
  return 'green';
};

// ─── Mapper ───────────────────────────────────────────────────────────────────

export const showtimeMapper = {
  toShowtime: (dto: ShowtimeItemDTO): Showtime => ({
    showtimeId:     dto.showtimeId,
    movieId:        dto.movie.movieId,
    movieTitle:     dto.movie.title,
    cinemaId:       dto.cinema.cinemaId,
    cinemaName:     dto.cinema.name,
    city:           dto.cinema.city,
    roomId:         dto.room.roomId,
    roomName:       dto.room.name,
    screenType:     dto.room.screenType,
    format:         dto.format.displayLabel,
    language:       dto.format.language,
    subtitle:       dto.format.subtitle,
    startTime:      dto.time.startTime,
    endTime:        dto.time.endTime,
    basePrice:      dto.pricing.basePrice,
    totalSeats:     dto.seatSummary.totalSeats,
    soldSeats:      dto.seatSummary.soldSeats,
    availableSeats: dto.seatSummary.availableSeats,
    occupancy:      dto.seatSummary.occupancy,
    status:         dto.status,
    // Derived
    isSoldOut:       dto.status === 'sold_out' || dto.seatSummary.availableSeats === 0,
    formattedTime:   formatTime(dto.time.startTime),
    formattedEndTime: formatTime(dto.time.endTime),
    formattedPrice:  formatPrice(dto.pricing.basePrice),
    occupancyColor:  getOccupancyColor(dto.seatSummary.occupancy),
  }),

  toShowtimeList: (dtos: ShowtimeItemDTO[], date: string): ShowtimeList => {
    const items = dtos.map(showtimeMapper.toShowtime);
    return { items, date, isEmpty: items.length === 0 };
  },

  /**
   * Group danh sách suất chiếu theo cinema → format
   * Dùng để render layout cinema-grouped + format-row trong UI
   */
  toCinemaGroups: (showtimes: Showtime[]): ShowtimeCinemaGroup[] => {
    const cinemaMap = new Map<number, ShowtimeCinemaGroup>();

    for (const st of showtimes) {
      if (!cinemaMap.has(st.cinemaId)) {
        cinemaMap.set(st.cinemaId, {
          cinemaId: st.cinemaId,
          cinemaName: st.cinemaName,
          city: st.city,
          formatGroups: [],
          totalAvailable: 0,
        });
      }
      const cinema = cinemaMap.get(st.cinemaId)!;

      // Find or create format group
      let fmtGroup = cinema.formatGroups.find((fg) => fg.format === st.format);
      if (!fmtGroup) {
        fmtGroup = { format: st.format, showtimes: [] };
        cinema.formatGroups.push(fmtGroup);
      }
      fmtGroup.showtimes.push(st);

      if (!st.isSoldOut) cinema.totalAvailable++;
    }

    // Sort showtimes within each format group by start time
    cinemaMap.forEach((cinema) => {
      cinema.formatGroups.forEach((fg) => {
        fg.showtimes.sort((a, b) => a.startTime.localeCompare(b.startTime));
      });
    });

    return [...cinemaMap.values()];
  },

  toSeat: (dto: { showtimeSeatId: number; seatId: number; seatCode: string; seatType: string; price: number; status: string }): ShowtimeSeat => ({
    showtimeSeatId: dto.showtimeSeatId,
    seatId:         dto.seatId,
    seatCode:       dto.seatCode,
    row:            dto.seatCode.replace(/\d+$/, ''),
    seatType:       dto.seatType as ShowtimeSeat['seatType'],
    price:          dto.price,
    formattedPrice: formatPrice(dto.price),
    status:         dto.status as ShowtimeSeat['status'],
  }),

  toSeatRow: (dto: { rowLabel: string; rowType: string; seats: unknown[] }): ShowtimeSeatRow => ({
    rowLabel: dto.rowLabel,
    rowType:  dto.rowType as ShowtimeSeatRow['rowType'],
    seats:    (dto.seats as Parameters<typeof showtimeMapper.toSeat>[0][]).map(showtimeMapper.toSeat),
  }),

  toSeatTypePrice: (dto: SeatTypePriceDTO): SeatTypePrice => ({
    seatType:       dto.seatType,
    label:          dto.label,
    unitPrice:      dto.unitPrice,
    formattedPrice: formatPrice(dto.unitPrice),
    capacity:       dto.capacity ?? 1,
  }),

  toSeatMap: (dto: ShowtimeSeatListDTO): ShowtimeSeatMap => ({
    showtimeId:    dto.showtime.showtimeId,
    cinemaName:    dto.showtime.cinema.name,
    roomName:      dto.showtime.room.name,
    screenType:    dto.showtime.room.screenType,
    startTime:     dto.showtime.time.startTime,
    formattedTime: formatTime(dto.showtime.time.startTime),
    seatTypePrices: dto.pricing.seatTypePrices.map(showtimeMapper.toSeatTypePrice),
    rows:          dto.seatMap.rows.map(showtimeMapper.toSeatRow),
    summary:       {
      totalSeats:     dto.seatMap.summary.totalSeats,
      availableSeats: dto.seatMap.summary.availableSeats,
      holdingSeats:   dto.seatMap.summary.holdingSeats,
      soldSeats:      dto.seatMap.summary.soldSeats,
    },
    bookingRules: dto.bookingRules,
  }),
};

// ─── Date Utilities ───────────────────────────────────────────────────────────

/** Tạo danh sách N ngày từ hôm nay (YYYY-MM-DD local) */
export const buildDateRange = (daysAhead = 7): string[] => {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i <= daysAhead; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const yyyy = d.getFullYear();
    const mm   = String(d.getMonth() + 1).padStart(2, '0');
    const dd   = String(d.getDate()).padStart(2, '0');
    dates.push(`${yyyy}-${mm}-${dd}`);
  }
  return dates;
};

/** Format ngày → { dayName: "T7", dayDate: "17/05" } */
export const formatDateLabel = (dateStr: string): { dayName: string; dayDate: string } => {
  const date = new Date(dateStr + 'T00:00:00');
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return {
    dayName: dayNames[date.getDay()],
    dayDate: `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`,
  };
};

/** Build query params (date range) để backend filter hiệu quả */
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
