import { z } from 'zod';

export const genreSchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string(),
});

export const movieSchema = z.object({
  id: z.union([z.number(), z.string()]),
  slug: z.string().optional(),
  title: z.string(),
  originalTitle: z.string().optional(),
  overview: z.string().optional().default(''),
  posterUrl: z.string(),
  backdropUrl: z.string().optional().nullable(),
  releaseDate: z.string().optional().nullable(),
  rating: z.number().optional().default(0),
  voteCount: z.number().optional().default(0),
  genres: z.array(genreSchema).optional().default([]),
  runtime: z.number().optional().nullable(),
  formatTags: z.array(z.string()).optional(),
  status: z.enum(['now-showing', 'coming-soon']).optional(),
  ageRating: z.string().optional(),
});

export const movieListResponseSchema = z.object({
  page: z.number(),
  results: z.array(movieSchema),
  totalPages: z.number(),
  totalResults: z.number(),
});