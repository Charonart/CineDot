export type SeatType = 'STANDARD' | 'VIP' | 'SWEETBOX';

export type SeatStatus = 'AVAILABLE' | 'SELECTED' | 'BOOKED' | 'HOLDING';

export interface SeatItem {
  id: string; // e.g. "A1", "E05", "J01-J02"
  row: string; // e.g. "A", "B", "E", "J"
  number: number; // e.g. 1, 2, 5, 12
  type: SeatType;
  status: SeatStatus;
  price: number;
  pairId?: string; // Optional for Sweetbox double seats
}

export interface ShowtimeBookingInfo {
  showtimeId: string;
  movieSlug: string;
  movieTitle: string;
  movieFormat: string;
  posterUrl: string;
  ageRating: string;
  cinemaName: string;
  roomName: string;
  showTime: string;
  showDate: string;
  countdownSeconds: number;
}
