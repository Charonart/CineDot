import { z } from 'zod';

const eventCategorySchema = z.enum(['now', 'promotions', 'news']);

export const eventSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  content: z.string().optional(),
  category: eventCategorySchema,
  imageUrl: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  condition: z.string().nullable(),
  ctaLabel: z.string(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  badge: z.string().nullable(),
  location: z.string().optional(),
  organizer: z.string().optional(),
  highlights: z.array(z.string()).optional(),
});

export const eventListResponseSchema = z.object({
  page: z.number(),
  totalPages: z.number(),
  totalResults: z.number(),
  results: z.array(eventSchema),
});

export type EventSchema = z.infer<typeof eventSchema>;
