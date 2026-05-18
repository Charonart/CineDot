import { z } from 'zod';

// ─── Genre / Language / Country ───────────────────────────────────────────────

export const genreItemSchema = z.object({
  genreId: z.number(),
  name: z.string(),
});

export const languageItemSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export const countryItemSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export const productionCompanySchema = z.object({
  companyId: z.number(),
  name: z.string(),
  logoUrl: z.string().url().nullable(),
  countryCode: z.string(),
});

export const ratingSchema = z.object({
  average: z.number(),
  count: z.number(),
});

export const collectionSchema = z.object({
  collectionId: z.number(),
  name: z.string(),
  posterUrl: z.string().url().nullable(),
  backdropUrl: z.string().url().nullable(),
});

// ─── Movie Detail Schema ──────────────────────────────────────────────────────

export const movieDetailSchema = z.object({
  movieId: z.number(),
  title: z.string(),
  originalTitle: z.string(),
  overview: z.string(),
  tagline: z.string().nullable().default(null),
  posterUrl: z.string().url(),
  backdropUrl: z.string().url(),
  tmdbPosterPath: z.string().nullable().default(null),
  tmdbBackdropPath: z.string().nullable().default(null),
  releaseDate: z.string(),
  runtime: z.number().nullable().default(null),
  status: z.string().default('Released'),
  rating: ratingSchema,
  genres: z.array(genreItemSchema).default([]),
  languages: z.array(languageItemSchema).default([]),
  countries: z.array(countryItemSchema).default([]),
  productionCompanies: z.array(productionCompanySchema).default([]),
  collection: collectionSchema.nullable().default(null),
});

// ─── Credits Schema ───────────────────────────────────────────────────────────

export const castMemberSchema = z.object({
  personId: z.number(),
  name: z.string(),
  originalName: z.string().optional().default(''),
  role: z.string(),
  avatarUrl: z.string().url().nullable(),
  tmdbProfilePath: z.string().nullable().optional(),
  sortOrder: z.number(),
});

export const crewMemberSchema = z.object({
  personId: z.number(),
  name: z.string(),
  originalName: z.string().optional().default(''),
  job: z.string(),
  department: z.string(),
  avatarUrl: z.string().url().nullable(),
  tmdbProfilePath: z.string().nullable().optional(),
});

export const creditsSchema = z.object({
  cast: z.array(castMemberSchema),
  crew: z.array(crewMemberSchema),
});

// ─── Video Schema ─────────────────────────────────────────────────────────────

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

// ─── Inferred types ───────────────────────────────────────────────────────────

export type MovieDetailSchemaType = z.infer<typeof movieDetailSchema>;
export type CreditsSchemaType     = z.infer<typeof creditsSchema>;
export type VideoSchemaType       = z.infer<typeof videoSchema>;
