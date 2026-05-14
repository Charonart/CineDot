import { z } from 'zod';

export const genreSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const movieSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string(),
  posterUrl: z.string(),
  backdropUrl: z.string(),
  releaseDate: z.string(),
  rating: z.number(),
  voteCount: z.number(),
  genres: z.array(genreSchema).default([]),
  runtime: z.number().optional(),
});

export const movieListResponseSchema = z.object({
  page: z.number(),
  results: z.array(movieSchema),
  totalPages: z.number(),
  totalResults: z.number(),
});
