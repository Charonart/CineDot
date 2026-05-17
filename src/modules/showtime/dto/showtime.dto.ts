/**
 * Showtime DTOs
 * Khớp 100% với response chuẩn từ Laravel backend.
 * Backend chuẩn hóa từ DB, frontend không xử lý raw field.
 */

export interface ShowtimeDTO {
  showtimeId: number;
  movieId: number;
  movieTitle: string;
  cinemaId: number;
  cinemaName: string;
  roomId: number;
  roomName: string;
  startTime: string; // ISO 8601: "2026-05-18T10:30:00"
  endTime: string;   // ISO 8601: "2026-05-18T12:30:00"
  price: number;
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
}

export interface ShowtimeListDTO {
  results: ShowtimeDTO[];
}

// ─── Seat ───────────────────────────────────────────────────────────────────

export type SeatStatus = 'available' | 'booked' | 'holding';

export interface ShowtimeSeatDTO {
  seatId: number;
  label: string;  // e.g. "A1"
  row: string;    // e.g. "A"
  number: number; // e.g. 1
  status: SeatStatus;
}

export interface ShowtimeSeatListDTO {
  showtimeId: number;
  seats: ShowtimeSeatDTO[];
}

// ─── Query Params ────────────────────────────────────────────────────────────

export interface ShowtimeQueryParamsDTO {
  date: string;       // YYYY-MM-DD, required
  movieId?: number;   // optional filter
  cinemaId?: number;  // optional filter
}
