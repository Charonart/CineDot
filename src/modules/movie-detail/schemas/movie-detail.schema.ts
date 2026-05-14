import { z } from 'zod';
import { genreSchema, movieSchema } from '@modules/movie/schemas/movie.schema';

export const castMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string(),
  profileUrl: z.string().url().nullable(),
  order: z.number(),
});

export const crewMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  job: z.string(),
  department: z.string(),
  profileUrl: z.string().url().nullable(),
});

export const creditsSchema = z.object({
  cast: z.array(castMemberSchema),
  crew: z.array(crewMemberSchema),
});

export const videoSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  type: z.enum(['Trailer', 'Teaser', 'Clip', 'Featurette', 'Behind the Scenes', 'Bloopers']),
  site: z.enum(['YouTube', 'Vimeo']),
  official: z.boolean(),
});

export const videoListSchema = z.object({
  results: z.array(videoSchema),
});

export const movieDetailSchema = movieSchema.extend({
  tagline: z.string().nullable().default(null),
  status: z.string().default('Released'),
  originalLanguage: z.string().default('en'),
  budget: z.number().default(0),
  revenue: z.number().default(0),
  genres: z.array(genreSchema).default([]),
});
