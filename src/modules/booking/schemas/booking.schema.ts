import { z } from 'zod';

export const seatTypeSchema = z.enum(['standard', 'vip', 'couple']);
export const seatStatusSchema = z.enum(['available', 'sold', 'held', 'unavailable']);

export const bookingMovieSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  posterUrl: z.string(),
  runtime: z.number().int().positive(),
  ageRating: z.string(),
});

export const bookingCinemaSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
});

export const bookingRoomSchema = z.object({
  id: z.string(),
  name: z.string(),
  screenType: z.string(),
});

export const bookingShowtimeSchema = z.object({
  id: z.string(),
  movie: bookingMovieSchema,
  cinema: bookingCinemaSchema,
  room: bookingRoomSchema,
  showDate: z.string(),
  showTime: z.string(),
  startsAt: z.string(),
  endsAt: z.string(),
  status: z.enum(['open', 'closed', 'cancelled']),
  salesStatus: z.enum(['on-sale', 'not-on-sale', 'sold-out']),
});

export const seatSelectionRulesSchema = z.object({
  maxSeatsPerBooking: z.number().int().positive(),
  allowMixedSeatTypes: z.boolean(),
  requireContiguousSeats: z.boolean(),
  preventSingleGap: z.boolean(),
});

export const seatPricingSchema = z.object({
  seatType: seatTypeSchema,
  label: z.string(),
  price: z.number().nonnegative(),
});

export const seatMapLayoutSchema = z.object({
  rowOrder: z.array(z.string()),
  aislesAfterSeatNumbers: z.array(z.number().int().positive()).default([]),
  screenLabel: z.string(),
});

export const seatSchema = z.object({
  id: z.string(),
  row: z.string(),
  number: z.number().int().positive(),
  label: z.string(),
  type: seatTypeSchema,
  status: seatStatusSchema,
  price: z.number().nonnegative(),
});

export const seatMapSchema = z.object({
  showtimeId: z.string(),
  currency: z.string(),
  selectionRules: seatSelectionRulesSchema,
  pricing: z.array(seatPricingSchema),
  layout: seatMapLayoutSchema,
  seats: z.array(seatSchema),
  serverTime: z.string(),
});

export const seatHoldSchema = z.object({
  holdId: z.string(),
  showtimeId: z.string(),
  seatIds: z.array(z.string()),
  expiresAt: z.string(),
  serverTime: z.string(),
});
