import { z } from 'zod';

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const showtimeMovieRefSchema = z.object({
  movieId: z.union([z.number(), z.string()]),
  title: z.string(),
});

const showtimeCinemaSchema = z.object({
  cinemaId: z.number(),
  name: z.string(),
  city: z.string(),
});

const showtimeRoomSchema = z.object({
  roomId: z.number(),
  name: z.string(),
  screenType: z.string(),
});

const showtimeFormatSchema = z.object({
  language: z.string(),
  subtitle: z.string().nullable(),
  displayLabel: z.string(),
});

const showtimeTimeSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
});

const showtimePricingSchema = z.object({
  currency: z.string(),
  basePrice: z.number().nonnegative(),
});

const showtimeSeatSummarySchema = z.object({
  totalSeats: z.number().int().nonnegative(),
  soldSeats: z.number().int().nonnegative(),
  holdingSeats: z.number().int().nonnegative(),
  availableSeats: z.number().int().nonnegative(),
  occupancy: z.number().min(0).max(100),
});

// ─── Showtime List Schema ─────────────────────────────────────────────────────

export const showtimeItemSchema = z.object({
  showtimeId: z.number().int().positive(),
  movie: showtimeMovieRefSchema,
  cinema: showtimeCinemaSchema,
  room: showtimeRoomSchema,
  format: showtimeFormatSchema,
  time: showtimeTimeSchema,
  pricing: showtimePricingSchema,
  seatSummary: showtimeSeatSummarySchema,
  status: z.enum(['available', 'sold_out', 'cancelled']),
});

export const showtimeListSchema = z.object({
  results: z.array(showtimeItemSchema),
});

// ─── Seat Map Schema ──────────────────────────────────────────────────────────

export const seatStatusSchema = z.enum(['available', 'booked', 'holding', 'blocked']);
export const seatTypeSchema   = z.enum(['standard', 'vip', 'couple']);

export const showtimeSeatSchema = z.object({
  showtimeSeatId: z.number().int().positive(),
  seatId: z.number().int().positive(),
  seatCode: z.string().min(1),
  seatType: seatTypeSchema,
  price: z.number().nonnegative(),
  status: seatStatusSchema,
});

export const showtimeSeatRowSchema = z.object({
  rowLabel: z.string().min(1),
  rowType: seatTypeSchema,
  seats: z.array(showtimeSeatSchema),
});

export const seatTypePriceSchema = z.object({
  seatType: seatTypeSchema,
  label: z.string(),
  unitPrice: z.number().nonnegative(),
  capacity: z.number().optional().default(1),
});

const showtimeRefInSeatSchema = z.object({
  showtimeId: z.number(),
  movie: showtimeMovieRefSchema,
  cinema: z.object({ cinemaId: z.number(), name: z.string() }),
  room: showtimeRoomSchema,
  format: showtimeFormatSchema,
  time: showtimeTimeSchema,
  status: z.string(),
});

const bookingRulesSchema = z.object({
  maxSeatsPerBooking: z.number().int().positive(),
  holdDurationMinutes: z.number().int().positive(),
  allowSingleSeatGap: z.boolean(),
  coupleSeatMustBookTogether: z.boolean(),
});

export const showtimeSeatListSchema = z.object({
  showtime: showtimeRefInSeatSchema,
  pricing: z.object({
    currency: z.string(),
    basePrice: z.number().nonnegative(),
    seatTypePrices: z.array(seatTypePriceSchema),
  }),
  seatMap: z.object({
    screen: z.object({
      label: z.string(),
      position: z.enum(['front', 'back']),
    }),
    summary: z.object({
      totalSeats: z.number().int().nonnegative(),
      availableSeats: z.number().int().nonnegative(),
      holdingSeats: z.number().int().nonnegative(),
      soldSeats: z.number().int().nonnegative(),
      blockedSeats: z.number().int().nonnegative(),
    }),
    rows: z.array(showtimeSeatRowSchema),
  }),
  bookingRules: bookingRulesSchema,
});

// ─── Inferred types ───────────────────────────────────────────────────────────

export type ShowtimeItemSchemaType    = z.infer<typeof showtimeItemSchema>;
export type ShowtimeListSchemaType    = z.infer<typeof showtimeListSchema>;
export type ShowtimeSeatSchemaType    = z.infer<typeof showtimeSeatSchema>;
export type ShowtimeSeatListSchemaType = z.infer<typeof showtimeSeatListSchema>;
