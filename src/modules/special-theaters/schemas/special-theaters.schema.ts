import { z } from 'zod';

const theaterTypeSchema = z.enum(['imax', '4dx', 'dolby-atmos', 'kids']);

export const theaterFeatureSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

export const cinemaRefSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  slug: z.string(),
});

export const movieRefSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  posterUrl: z.string(),
  rating: z.number(),
});

export const theaterTypeDataSchema = z.object({
  type: theaterTypeSchema,
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  heroImageUrl: z.string(),
  features: z.array(theaterFeatureSchema),
  technology: z.string(),
  supportedCinemas: z.array(cinemaRefSchema),
  nowShowingMovies: z.array(movieRefSchema),
});

export type TheaterTypeDataSchema = z.infer<typeof theaterTypeDataSchema>;
