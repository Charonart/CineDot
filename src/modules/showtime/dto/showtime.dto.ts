/**
 * Showtime DTOs
 * Khớp 100% với response từ mock `showtimes-by-movie.json` và `showtime-seats.json`.
 */

// ─── Showtime List ────────────────────────────────────────────────────────────

export interface ShowtimeMovieRefDTO {
  movieId: number;
  title: string;
}

export interface ShowtimeCinemaDTO {
  cinemaId: number;
  name: string;
  city: string;
}

export interface ShowtimeRoomDTO {
  roomId: number;
  name: string;
  screenType: string; // "IMAX" | "2D" | "3D" | "4DX" | ...
}

export interface ShowtimeFormatDTO {
  language: string;        // "VI" | "EN"
  subtitle: string | null; // "VI" | null
  displayLabel: string;    // e.g. "IMAX 2D Phụ Đề Việt"
}

export interface ShowtimeTimeDTO {
  startTime: string; // ISO 8601: "2026-05-18T10:00:00"
  endTime: string;
}

export interface ShowtimePricingDTO {
  currency: string;
  basePrice: number;
}

export interface ShowtimeSeatSummaryDTO {
  totalSeats: number;
  soldSeats: number;
  holdingSeats: number;
  availableSeats: number;
  occupancy: number; // percentage 0-100
}

export interface ShowtimeItemDTO {
  showtimeId: number;
  movie: ShowtimeMovieRefDTO;
  cinema: ShowtimeCinemaDTO;
  room: ShowtimeRoomDTO;
  format: ShowtimeFormatDTO;
  time: ShowtimeTimeDTO;
  pricing: ShowtimePricingDTO;
  seatSummary: ShowtimeSeatSummaryDTO;
  status: 'available' | 'sold_out' | 'cancelled';
}

export interface ShowtimeListDTO {
  results: ShowtimeItemDTO[];
}

// ─── Seat Map ─────────────────────────────────────────────────────────────────

export type SeatStatus = 'available' | 'booked' | 'holding' | 'blocked';
export type SeatType   = 'standard' | 'vip' | 'couple';

export interface ShowtimeSeatDTO {
  showtimeSeatId: number;
  seatId: number;
  seatCode: string;    // e.g. "A1"
  seatType: SeatType;
  price: number;
  status: SeatStatus;
}

export interface ShowtimeSeatRowDTO {
  rowLabel: string;    // e.g. "A"
  rowType: SeatType;
  seats: ShowtimeSeatDTO[];
}

export interface SeatTypePriceDTO {
  seatType: SeatType;
  label: string;       // e.g. "Ghế thường"
  unitPrice: number;
  capacity?: number;
}

export interface ShowtimeSeatMapScreenDTO {
  label: string;
  position: 'front' | 'back';
}

export interface ShowtimeSeatMapSummaryDTO {
  totalSeats: number;
  availableSeats: number;
  holdingSeats: number;
  soldSeats: number;
  blockedSeats: number;
}

export interface ShowtimeRefInSeatDTO {
  showtimeId: number;
  movie: ShowtimeMovieRefDTO;
  cinema: { cinemaId: number; name: string };
  room: ShowtimeRoomDTO;
  format: ShowtimeFormatDTO;
  time: ShowtimeTimeDTO;
  status: string;
}

export interface BookingRulesDTO {
  maxSeatsPerBooking: number;
  holdDurationMinutes: number;
  allowSingleSeatGap: boolean;
  coupleSeatMustBookTogether: boolean;
}

export interface ShowtimeSeatListDTO {
  showtime: ShowtimeRefInSeatDTO;
  pricing: {
    currency: string;
    basePrice: number;
    seatTypePrices: SeatTypePriceDTO[];
  };
  seatMap: {
    screen: ShowtimeSeatMapScreenDTO;
    summary: ShowtimeSeatMapSummaryDTO;
    rows: ShowtimeSeatRowDTO[];
  };
  bookingRules: BookingRulesDTO;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface ShowtimeQueryParamsDTO {
  date: string;       // YYYY-MM-DD, required
  movieId?: number | string;
  cinemaId?: number | string;
}
