export type SeatTypeDTO = 'standard' | 'vip' | 'couple';
export type SeatStatusDTO = 'available' | 'sold' | 'held' | 'unavailable';
export type BookingShowtimeStatusDTO = 'open' | 'closed' | 'cancelled';
export type BookingSalesStatusDTO = 'on-sale' | 'not-on-sale' | 'sold-out';

export interface BookingMovieDTO {
  id: string;
  title: string;
  slug: string;
  posterUrl: string;
  runtime: number;
  ageRating: string;
}

export interface BookingCinemaDTO {
  id: string;
  name: string;
  address: string;
}

export interface BookingRoomDTO {
  id: string;
  name: string;
  screenType: string;
}

export interface BookingShowtimeDTO {
  id: string;
  movie: BookingMovieDTO;
  cinema: BookingCinemaDTO;
  room: BookingRoomDTO;
  showDate: string;
  showTime: string;
  startsAt: string;
  endsAt: string;
  status: BookingShowtimeStatusDTO;
  salesStatus: BookingSalesStatusDTO;
}

export interface SeatSelectionRulesDTO {
  maxSeatsPerBooking: number;
  allowMixedSeatTypes: boolean;
  requireContiguousSeats: boolean;
  preventSingleGap: boolean;
}

export interface SeatPricingDTO {
  seatType: SeatTypeDTO;
  label: string;
  price: number;
}

export interface SeatMapLayoutDTO {
  rowOrder: string[];
  aislesAfterSeatNumbers: number[];
  screenLabel: string;
}

export interface SeatDTO {
  id: string;
  row: string;
  number: number;
  label: string;
  type: SeatTypeDTO;
  status: SeatStatusDTO;
  price: number;
}

export interface SeatMapDTO {
  showtimeId: string;
  currency: string;
  selectionRules: SeatSelectionRulesDTO;
  pricing: SeatPricingDTO[];
  layout: SeatMapLayoutDTO;
  seats: SeatDTO[];
  serverTime: string;
}

export interface SeatHoldRequestDTO {
  showtimeId: string;
  seatIds: string[];
}

export interface SeatHoldDTO {
  holdId: string;
  /** booking_id của đơn hàng pending — BE trả về cùng với hold-seats response */
  booking_id: number;
  showtimeId: string;
  seatIds: string[];
  expiresAt: string;
  serverTime: string;
}

// ─── BƯỚC 1: POST /api/v1/bookings/hold-seats ───────────────────────────────

export interface ComboPayloadDTO {
  combo_id: number;
  quantity: number;
}

/** Payload gửi lên POST /api/v1/bookings/hold-seats */
export interface HoldSeatsRequestDTO {
  /** schedule_id tương ứng với showtimeId trong store */
  schedule_id: number;
  /** Danh sách schedule_seat_id đã chọn */
  schedule_seat_ids: number[];
  /** Danh sách combo bắp nước kèm số lượng */
  combos: ComboPayloadDTO[];
}

/** Response trả về từ POST /api/v1/bookings/hold-seats */
export interface HoldSeatsResponseDTO {
  booking_id: number;
  expires_at?: string;
  message?: string;
}

// ─── BƯỚC 2: POST /api/v1/bookings/{id}/apply-voucher ────────────────────────

/** Payload gửi lên POST /api/v1/bookings/{id}/apply-voucher */
export interface ApplyVoucherRequestDTO {
  voucher_code: string;
}

/** Response trả về từ POST /api/v1/bookings/{id}/apply-voucher */
export interface ApplyVoucherResponseDTO {
  success: boolean;
  discount_amount?: number;
  message?: string;
}

// ─── BƯỚC 3: POST /api/v1/payments ────────────────────────────────────────────

/** Payload gửi lên POST /api/v1/payments */
export interface ProcessPaymentRequestDTO {
  booking_id: number;
  /** Phương thức thanh toán: 'momo' | 'zalopay' | 'onepay' | 'qr' | ... */
  payment_method: string;
}

/** Response trả về từ POST /api/v1/payments */
export interface ProcessPaymentResponseDTO {
  success: boolean;
  /** Link redirect đến cổng thanh toán (nếu có) */
  payment_url?: string;
  /** Xác nhận thanh toán thành công ngay (mock/cash) */
  transaction_id?: string;
  message?: string;
}
