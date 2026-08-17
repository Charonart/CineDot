'use client';

/**
 * BookingSessionService
 * Lưu trữ metadata của Suất chiếu (movie, cinema, room, format, price, v.v.)
 * vào sessionStorage để các bước Booking tiếp theo (Food, Payment, Success) có thể
 * truy xuất mà không cần gọi lại API.
 *
 * Key: `cinedot_booking_session_{showtimeId}`
 */

const SESSION_KEY_PREFIX = 'cinedot_booking_session_';

export interface BookingSessionSeatItem {
  id: string; // e.g. "B4"
  showtime_seat_id: number;
  row: string;
  number: number;
  type: string;
  price: number;
}

export interface BookingSessionComboItem {
  combo_id: number | string;
  name: string;
  quantity: number;
  unit_price: number;
  price: number;
  image_url?: string;
}

export interface BookingSessionData {
  showtimeId: string;
  movieSlug: string;
  movieTitle: string;
  movieFormat: string;
  posterUrl: string;
  backdropUrl?: string;
  ageRating: string;
  duration: string;
  cinemaName: string;
  cinemaAddress?: string;
  cinemaId?: string | number;
  roomName: string;
  showTime: string;
  endTime?: string;
  showDate: string;
  dateStr?: string;
  basePrice: number;
  /** booking_id returned from hold-seats */
  bookingId?: number | string;
  bookingCode?: string;
  showtimeSeatIds?: number[];
  selectedSeatCodes?: string[];
  selectedSeats?: BookingSessionSeatItem[];
  seatSummaryText?: string;
  ticketTotalPrice?: number;
  combos?: BookingSessionComboItem[];
  totalFoodPrice?: number;
  totalPaid?: number;
  paymentMethod?: string;
}

export function saveBookingSession(data: BookingSessionData): void {
  if (typeof window === 'undefined') return;
  const key = `${SESSION_KEY_PREFIX}${data.showtimeId}`;
  sessionStorage.setItem(key, JSON.stringify(data));
}

export function getBookingSession(showtimeId: string): BookingSessionData | null {
  if (typeof window === 'undefined') return null;
  const key = `${SESSION_KEY_PREFIX}${showtimeId}`;
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as BookingSessionData;
  } catch {
    return null;
  }
}

export function clearBookingSession(showtimeId: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(`${SESSION_KEY_PREFIX}${showtimeId}`);
}

export function updateBookingSession(
  showtimeId: string,
  patch: Partial<BookingSessionData>
): void {
  const current = getBookingSession(showtimeId);
  if (!current) return;
  saveBookingSession({ ...current, ...patch });
}
