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
  showtimeId: string;
  seatIds: string[];
  expiresAt: string;
  serverTime: string;
}
