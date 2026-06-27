import { z } from 'zod';
import {
  bookingSelectorCinemaSchema,
  bookingSelectorShowtimeSchema,
} from '../schemas/bookingSelector.schema';

export type BookingSelectorCinema = z.infer<typeof bookingSelectorCinemaSchema>;
export type BookingSelectorShowtime = z.infer<typeof bookingSelectorShowtimeSchema>;
