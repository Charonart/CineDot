/**
 * Showtime Domain Types
 * Contract mà UI sử dụng. Tách biệt hoàn toàn với DTO.
 */

// ─── Seat ─────────────────────────────────────────────────────────────────────

export type SeatStatus = 'available' | 'booked' | 'holding' | 'blocked';
export type SeatType   = 'standard' | 'vip' | 'couple';

export interface ShowtimeSeat {
  showtimeSeatId: number;
  seatId: number;
  seatCode: string;   // "A1"
  row: string;        // "A"
  seatType: SeatType;
  price: number;
  formattedPrice: string;
  status: SeatStatus;
}

export interface ShowtimeSeatRow {
  rowLabel: string;
  rowType: SeatType;
  seats: ShowtimeSeat[];
}

export interface SeatTypePrice {
  seatType: SeatType;
  label: string;          // "Ghế thường"
  unitPrice: number;
  formattedPrice: string; // "70.000đ"
  capacity: number;
}

export interface ShowtimeSeatMap {
  showtimeId: number;
  cinemaName: string;
  roomName: string;
  screenType: string;
  startTime: string;
  formattedTime: string;
  seatTypePrices: SeatTypePrice[];
  rows: ShowtimeSeatRow[];
  summary: {
    totalSeats: number;
    availableSeats: number;
    holdingSeats: number;
    soldSeats: number;
  };
  bookingRules: {
    maxSeatsPerBooking: number;
    holdDurationMinutes: number;
    allowSingleSeatGap: boolean;
    coupleSeatMustBookTogether: boolean;
  };
}

// ─── Showtime ─────────────────────────────────────────────────────────────────

export interface Showtime {
  showtimeId: number;
  movieId: number | string;
  movieTitle: string;
  cinemaId: number;
  cinemaName: string;
  city: string;
  roomId: number;
  roomName: string;
  screenType: string;
  format: string;          // displayLabel, e.g. "IMAX 2D Phụ Đề Việt"
  language: string;
  subtitle: string | null;
  startTime: string;       // ISO 8601
  endTime: string;
  basePrice: number;
  totalSeats: number;
  soldSeats: number;
  availableSeats: number;
  occupancy: number;       // 0-100
  status: 'available' | 'sold_out' | 'cancelled';

  // Derived — tính trong Mapper
  isSoldOut: boolean;
  formattedTime: string;   // "10:00"
  formattedEndTime: string;
  formattedPrice: string;  // "90.000đ"
  occupancyColor: 'green' | 'orange' | 'red';
}

export interface ShowtimeList {
  items: Showtime[];
  date: string;
  isEmpty: boolean;
}

// ─── Grouped by Cinema ────────────────────────────────────────────────────────

export interface ShowtimeFormatGroup {
  format: string;          // displayLabel
  showtimes: Showtime[];
}

export interface ShowtimeCinemaGroup {
  cinemaId: number;
  cinemaName: string;
  city: string;
  formatGroups: ShowtimeFormatGroup[];
  totalAvailable: number;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface ShowtimeQueryParams {
  date: string;       // YYYY-MM-DD
  movieId?: number | string;
  cinemaId?: number;
}
