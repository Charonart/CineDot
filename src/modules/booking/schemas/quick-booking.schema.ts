import { z } from 'zod';

export const quickBookingMovieStatusSchema = z.enum(['now-showing', 'coming-soon']);

export const quickBookingMovieSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: quickBookingMovieStatusSchema,
});

export const quickBookingCinemaSchema = z.object({
  id: z.string(),
  name: z.string(),
  movieIds: z.array(z.string()).default([]),
});

export const quickBookingDateSchema = z.object({
  id: z.string(),
  label: z.string(),
  movieId: z.string(),
  cinemaId: z.string(),
});

export const quickBookingShowtimeSchema = z.object({
  id: z.string(),
  movieId: z.string(),
  cinemaId: z.string(),
  date: z.string(),
  dateLabel: z.string(),
  time: z.string(),
  roomName: z.string(),
  screenType: z.string(),
  availableSeats: z.number().int().nonnegative(),
});

export const quickBookingMovieListSchema = z.array(quickBookingMovieSchema);
export const quickBookingCinemaListSchema = z.array(quickBookingCinemaSchema);
export const quickBookingDateListSchema = z.array(quickBookingDateSchema);
export const quickBookingShowtimeListSchema = z.array(quickBookingShowtimeSchema);
