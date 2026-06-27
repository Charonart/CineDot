import { z } from 'zod';

// ─── Request Schemas ──────────────────────────────────────────────────────────

export const watchlistRequestSchema = z.object({
  movieId: z.union([z.number(), z.string()]),
  action: z.enum(['add', 'remove'], {
    errorMap: () => ({ message: "action phải là 'add' hoặc 'remove'" }),
  }),
});

export const ratingRequestSchema = z.object({
  movieId: z.union([z.number(), z.string()]),
  score: z
    .number()
    .min(0.5, 'Điểm tối thiểu là 0.5')
    .max(10, 'Điểm tối đa là 10')
    .multipleOf(0.5, 'Điểm phải là bội số của 0.5'),
});

export const removeRatingRequestSchema = z.object({
  movieId: z.union([z.number(), z.string()]),
});

// ─── Response Schemas ─────────────────────────────────────────────────────────

export const watchlistResponseSchema = z.object({
  movieId: z.union([z.number(), z.string()]),
  isInWatchlist: z.boolean(),
  updatedAt: z.string(),
});

export const ratingResponseSchema = z.object({
  movieId: z.union([z.number(), z.string()]),
  userScore: z.number().min(0).max(10),
  averageScore: z.number().min(0).max(10),
  voteCount: z.number().int().nonnegative(),
  updatedAt: z.string(),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type WatchlistRequestInput  = z.infer<typeof watchlistRequestSchema>;
export type RatingRequestInput     = z.infer<typeof ratingRequestSchema>;
export type RemoveRatingRequestInput = z.infer<typeof removeRatingRequestSchema>;
export type WatchlistResponseInput = z.infer<typeof watchlistResponseSchema>;
export type RatingResponseInput    = z.infer<typeof ratingResponseSchema>;
