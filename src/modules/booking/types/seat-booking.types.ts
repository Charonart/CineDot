export type SeatType = 'STANDARD' | 'VIP' | 'SWEETBOX' | 'COUPLE' | 'DELUXE' | 'BED' | string;

export type SeatStatus = 'AVAILABLE' | 'SELECTED' | 'BOOKED' | 'HOLDING' | 'BLOCKED';

export interface SeatCanvas {
  cx: number;
  cy: number;
  angle: number;
}

export interface SeatTypeInfo {
  key: string;
  name: string;
  surcharge: number;
  color: string;
  icon?: string;
  description?: string;
  price?: number;
}

export interface SeatItem {
  id: string; // e.g. "A1", "E05", "F1"
  showtime_seat_id: number; // Unique DB ID for API requests
  row: string; // e.g. "A", "B", "E", "F"
  number: number; // e.g. 1, 2, 5, 12
  type: SeatType;
  status: SeatStatus;
  price: number;
  surcharge?: number;
  pairId?: string; // Optional for Sweetbox / Couple double seats
  canvas?: SeatCanvas;
  color?: string;
  icon?: string;
  typeName?: string;
}

export interface SeatRowGroup {
  rowName: string;
  seats: SeatItem[];
}

export interface ShowtimeBookingInfo {
  showtimeId: string | number;
  movieSlug: string;
  movieTitle: string;
  movieFormat: string;
  posterUrl: string;
  backdropUrl?: string;
  ageRating: string;
  duration?: string;
  cinemaName: string;
  cinemaAddress?: string;
  roomName: string;
  showTime: string;
  endTime?: string;
  showDate: string;
  basePrice: number;
  countdownSeconds: number;
}

export interface HoldSeatsPayload {
  showtime_id: number | string;
  showtime_seat_ids: number[];
  combos?: { combo_id: number; quantity: number }[];
  voucher_code?: string;
}

export interface HoldSeatsResult {
  success: boolean;
  message?: string;
  booking_id?: number;
  booking_code?: string;
  expires_in_seconds?: number;
  expires_at?: string;
}
