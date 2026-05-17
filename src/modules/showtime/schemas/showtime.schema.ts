import { z } from 'zod';

// ─── Showtime Schema ─────────────────────────────────────────────────────────

export const showtimeSchema = z.object({
  showtimeId:      z.number().int().positive(),
  movieId:         z.number().int().positive(),
  movieTitle:      z.string().min(1),
  cinemaId:        z.number().int().positive(),
  cinemaName:      z.string().min(1),
  roomId:          z.number().int().positive(),
  roomName:        z.string().min(1),
  startTime:       z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)),
  endTime:         z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)),
  price:           z.number().nonnegative(),
  totalSeats:      z.number().int().nonnegative(),
  bookedSeats:     z.number().int().nonnegative(),
  availableSeats:  z.number().int().nonnegative(),
});

export const showtimeListSchema = z.object({
  results: z.array(showtimeSchema),
});

// ─── Seat Schema ─────────────────────────────────────────────────────────────

export const seatStatusSchema = z.enum(['available', 'booked', 'holding']);

export const showtimeSeatSchema = z.object({
  seatId:  z.number().int().positive(),
  label:   z.string().min(1),
  row:     z.string().min(1),
  number:  z.number().int().positive(),
  status:  seatStatusSchema,
});

export const showtimeSeatListSchema = z.object({
  showtimeId: z.number().int().positive(),
  seats:      z.array(showtimeSeatSchema),
});

// ─── Inferred types từ schema (dùng nội bộ trong service) ─────────────────

export type ShowtimeSchemaType     = z.infer<typeof showtimeSchema>;
export type ShowtimeListSchemaType = z.infer<typeof showtimeListSchema>;
export type ShowtimeSeatSchemaType = z.infer<typeof showtimeSeatSchema>;
