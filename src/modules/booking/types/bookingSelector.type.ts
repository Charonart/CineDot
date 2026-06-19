import { z } from 'zod';
import {
  bookingSelectorMovieSchema,
  bookingSelectorCinemaSchema,
  bookingSelectorShowtimeSchema,
} from '../schemas/bookingSelector.schema';

export type BookingSelectorMovie = z.infer<typeof bookingSelectorMovieSchema>;
export type BookingSelectorCinema = z.infer<typeof bookingSelectorCinemaSchema>;
export type BookingSelectorShowtime = z.infer<typeof bookingSelectorShowtimeSchema>;
