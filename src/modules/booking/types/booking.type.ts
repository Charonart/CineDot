export type SeatType = 'standard' | 'vip' | 'couple';
export type SeatStatus = 'available' | 'sold' | 'held' | 'unavailable';
export type BookingShowtimeStatus = 'open' | 'closed' | 'cancelled';
export type BookingSalesStatus = 'on-sale' | 'not-on-sale' | 'sold-out';

export interface BookingMovie {
  id: string;
  title: string;
  slug: string;
  posterUrl: string;
  runtime: number;
  ageRating: string;
}

export interface BookingCinema {
  id: string;
  name: string;
  address: string;
}

export interface BookingRoom {
  id: string;
  name: string;
  screenType: string;
}

export interface BookingShowtime {
  id: string;
  movie: BookingMovie;
  cinema: BookingCinema;
  room: BookingRoom;
  showDate: string;
  showTime: string;
  startsAt: string;
  endsAt: string;
  status: BookingShowtimeStatus;
  salesStatus: BookingSalesStatus;
  isOpenForSale: boolean;
}

export interface SeatSelectionRules {
  maxSeatsPerBooking: number;
  allowMixedSeatTypes: boolean;
  requireContiguousSeats: boolean;
  preventSingleGap: boolean;
}

export interface SeatPricing {
  seatType: SeatType;
  label: string;
  price: number;
}

export interface SeatMapLayout {
  rowOrder: string[];
  aislesAfterSeatNumbers: number[];
  screenLabel: string;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  label: string;
  type: SeatType;
  status: SeatStatus;
  price: number;
}

export type SeatItem = Seat;

export interface SeatMap {
  showtimeId: string;
  currency: string;
  selectionRules: SeatSelectionRules;
  pricing: SeatPricing[];
  layout: SeatMapLayout;
  seats: Seat[];
  serverTime: string;
}

export interface SeatHoldRequest {
  showtimeId: string;
  seatIds: string[];
}

export interface SeatHold {
  holdId: string;
  /** booking_id của đơn pending — dùng cho POST /payments */
  bookingId: number;
  showtimeId: string;
  seatIds: string[];
  expiresAt: string;
  serverTime: string;
}
