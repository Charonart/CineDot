import { z } from 'zod';

export const productSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  category: z.enum(['movie-verse', 'fan-wibu', 'inner-child']),
  price: z.number(),
  originalPrice: z.number().nullable(),
  imageUrl: z.string(),
  badge: z.string().nullable(),
  description: z.string(),
  stock: z.number(),
  tags: z.array(z.string()),
});

export const productListResponseSchema = z.object({
  page: z.number(),
  totalPages: z.number(),
  totalResults: z.number(),
  results: z.array(productSchema),
});

export type ProductSchema = z.infer<typeof productSchema>;
export type ProductListResponseSchema = z.infer<typeof productListResponseSchema>;
