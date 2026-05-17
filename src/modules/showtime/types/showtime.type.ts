/**
 * Showtime Domain Types
 * Đây là contract mà UI sử dụng. Tách biệt hoàn toàn với DTO.
 * Mọi transform logic nằm trong Mapper, không trong UI.
 */

// ─── Seat ────────────────────────────────────────────────────────────────────

export type SeatStatus = 'available' | 'booked' | 'holding';

export interface ShowtimeSeat {
  seatId:  number;
  label:   string;  // "A1", "B3"
  row:     string;  // "A", "B"
  number:  number;  // 1, 3
  status:  SeatStatus;
}

export interface ShowtimeSeatMap {
  showtimeId: number;
  seats:      ShowtimeSeat[];
}

// ─── Showtime ─────────────────────────────────────────────────────────────────

export interface Showtime {
  showtimeId:      number;
  movieId:         number;
  movieTitle:      string;
  cinemaId:        number;
  cinemaName:      string;
  roomId:          number;
  roomName:        string;
  startTime:       string;  // ISO 8601 string, dùng để display
  endTime:         string;
  price:           number;
  totalSeats:      number;
  bookedSeats:     number;
  availableSeats:  number;

  // Derived fields — tính trong Mapper, không trong UI
  isSoldOut:       boolean; // availableSeats === 0
  formattedTime:   string;  // "10:30" — hiển thị trực tiếp
  formattedPrice:  string;  // "90.000đ"
}

export interface ShowtimeList {
  items:      Showtime[];
  date:       string;       // YYYY-MM-DD đang query
  isEmpty:    boolean;
}

// ─── Query Params (dùng trong Hook) ──────────────────────────────────────────

export interface ShowtimeQueryParams {
  date:       string;    // YYYY-MM-DD, required
  movieId?:   number;
  cinemaId?:  number;
}
