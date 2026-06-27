import { z } from 'zod';

export const bookingSelectorCinemaSchema = z.object({
  cinemaId: z.number(),
  name: z.string(),
  city: z.string(),
});

export const bookingSelectorShowtimeSchema = z.object({
  showtimeId: z.number(),
  movie: z.object({
    movieId: z.union([z.number(), z.string()]),
    title: z.string(),
  }),
  cinema: bookingSelectorCinemaSchema,
  room: z.object({
    roomId: z.number(),
    name: z.string(),
    screenType: z.string(),
  }),
  format: z.object({
    language: z.string(),
    subtitle: z.string().nullable(),
    displayLabel: z.string(),
  }),
  time: z.object({
    startTime: z.string(),
    endTime: z.string(),
  }),
  pricing: z.object({
    currency: z.string(),
    basePrice: z.number(),
  }),
  seatSummary: z.object({
    totalSeats: z.number(),
    soldSeats: z.number(),
    holdingSeats: z.number(),
    availableSeats: z.number(),
    occupancy: z.number(),
  }),
  status: z.string(),
});
