import { z } from 'zod';

// ─── Legacy Sub-types ────────────────────────────────────────────────────────

export const genreItemSchema = z.object({
  genreId: z.number().optional(),
  id: z.union([z.number(), z.string()]).optional(),
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
  logoUrl: z.string().url().nullable().optional(),
  countryCode: z.string(),
});

export const ratingSchema = z.object({
  average: z.number(),
  count: z.number(),
});

export const collectionSchema = z.object({
  collectionId: z.number(),
  name: z.string(),
  posterUrl: z.string().url().nullable().optional(),
  backdropUrl: z.string().url().nullable().optional(),
});

// ─── Cinematic Sub-types ──────────────────────────────────────────────────────

export const movieRecommendationSchema = z.object({
  id: z.string(),
  title: z.string(),
  poster: z.string(),
  rating: z.number(),
  ageRating: z.string(),
});

export const showtimeItemSchema = z.object({
  time: z.string(),
  status: z.enum(['past', 'available', 'almost-full', 'locked', 'sold-out']),
  scheduleId: z.string(),
});

export const formatItemSchema = z.object({
  name: z.string(),
  times: z.array(showtimeItemSchema),
});

export const cinemaScheduleSchema = z.object({
  name: z.string(),
  formats: z.array(formatItemSchema),
});

// ─── Movie Detail Schema ──────────────────────────────────────────────────────

export const movieDetailSchema = z.object({
  movieId: z.number().optional(), // legacy
  id: z.union([z.number(), z.string()]).optional(), // cinematic
  slug: z.string().optional(),
  title: z.string(),
  originalTitle: z.string().optional(),
  overview: z.string().optional().default(''),
  tagline: z.string().nullable().default(null).optional(),
  posterUrl: z.string(),
  backdropUrl: z.string().optional().default(''),
  tmdbPosterPath: z.string().nullable().default(null).optional(),
  tmdbBackdropPath: z.string().nullable().default(null).optional(),
  releaseDate: z.string(),
  runtime: z.number().nullable().default(null).optional(),
  status: z.string().default('Released'),
  rating: z.union([ratingSchema, z.number()]), // lenient rating (object or number)
  voteCount: z.number().optional(),
  genres: z.array(z.union([genreItemSchema, z.string()])).default([]),
  languages: z.array(languageItemSchema).default([]).optional(),
  countries: z.array(countryItemSchema).default([]).optional(),
  productionCompanies: z.array(productionCompanySchema).default([]).optional(),
  collection: collectionSchema.nullable().default(null).optional(),

  // Cinematic Specifics
  country: z.string().optional(),
  producer: z.string().optional(),
  director: z.string().optional(),
  cast: z.array(z.string()).optional(),
  trailerUrl: z.string().optional(),
  recommendations: z.array(movieRecommendationSchema).default([]).optional(),
  cinemas: z.array(cinemaScheduleSchema).default([]).optional(),
});

// ─── Cast & Crew Schema ───────────────────────────────────────────────────────

export const castMemberSchema = z.object({
  personId: z.number(),
  name: z.string(),
  originalName: z.string().optional().default(''),
  role: z.string(),
  avatarUrl: z.string().url().nullable().optional(),
  tmdbProfilePath: z.string().nullable().optional(),
  sortOrder: z.number(),
});

export const crewMemberSchema = z.object({
  personId: z.number(),
  name: z.string(),
  originalName: z.string().optional().default(''),
  job: z.string(),
  department: z.string(),
  avatarUrl: z.string().url().nullable().optional(),
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

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type MovieDetailSchemaType = z.infer<typeof movieDetailSchema>;
export type CreditsSchemaType     = z.infer<typeof creditsSchema>;
export type VideoSchemaType       = z.infer<typeof videoSchema>;
