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
  subtitle: z.string().optional(),
  trailerUrl: z.string().optional(),
  featured: z.boolean().optional(),
  categories: z.array(z.string()).optional(),
});

export const movieListResponseSchema = z.object({
  page: z.number(),
  results: z.array(movieSchema),
  totalPages: z.number(),
  totalResults: z.number(),
});

export const heroSlideSchema = z.object({
  id: z.union([z.number(), z.string()]),
  slug: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string(),
  backdropUrl: z.string(),
  posterUrl: z.string(),
  runtime: z.number(),
  rating: z.number(),
  ageRating: z.string(),
  formatTags: z.array(z.string()),
  trailerUrl: z.string(),
  status: z.string(),
});

export const heroSlideListSchema = z.array(heroSlideSchema);