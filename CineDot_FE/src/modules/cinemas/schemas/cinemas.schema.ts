import { z } from 'zod';

export const screenSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  capacity: z.number(),
});

export const cinemaSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  district: z.string(),
  phone: z.string(),
  email: z.string().optional(),
  imageUrl: z.string(),
  formats: z.array(z.string()),
  amenities: z.array(z.string()),
  totalScreens: z.number(),
  totalSeats: z.number(),
  openingHours: z.string(),
  mapUrl: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  screens: z.array(screenSchema).optional(),
});

export const cinemaListResponseSchema = z.object({
  page: z.number(),
  totalPages: z.number(),
  totalResults: z.number(),
  results: z.array(cinemaSchema),
});

export const pricingRowSchema = z.object({
  label: z.string(),
  type: z.string(),
  weekday: z.number(),
  weekend: z.number(),
  surcharge: z.number().nullable(),
  description: z.string(),
});

export const pricingSchema = z.object({
  updatedAt: z.string(),
  note: z.string(),
  categories: z.array(pricingRowSchema),
});

export type CinemaSchema = z.infer<typeof cinemaSchema>;
export type PricingSchema = z.infer<typeof pricingSchema>;
