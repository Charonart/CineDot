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
  paymentConfirmed?: boolean;
  paidAt?: string;
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

/**
 * Cancel pending booking and release held seats in Redis and clear session
 */
export async function cancelBookingAndReleaseSeats(showtimeId: string): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const session = getBookingSession(showtimeId);
    const bookingTarget = session?.bookingId || session?.bookingCode;

    // 1. Call POST /api/bookings/{id}/cancel
    if (bookingTarget) {
      try {
        const { apiClient } = await import('@/shared/lib/apiClient');
        const { ENDPOINTS } = await import('@/shared/constants/endpoints');
        await apiClient.post(ENDPOINTS.BOOKINGS.CANCEL(bookingTarget));
      } catch (err) {
        console.warn('⚠️ Cancel booking API error:', err);
      }
    }

    // 2. Release temporary held seats in Redis if seat IDs exist
    if (session?.showtimeSeatIds && session.showtimeSeatIds.length > 0) {
      try {
        const { seatBookingService } = await import('./seat-booking.service');
        await seatBookingService.releaseSeats(showtimeId, session.showtimeSeatIds);
      } catch (err) {
        console.warn('⚠️ Release seats error:', err);
      }
    }

    // 3. Clear holding timer & session state
    const { resetBookingTimer } = await import('./bookingTimerService');
    resetBookingTimer(showtimeId);
    clearBookingSession(showtimeId);
  } catch (err) {
    console.warn('⚠️ cancelBookingAndReleaseSeats error:', err);
  }
}
