import { z } from 'zod';

const articleCategorySchema = z.enum(['reviews', 'blog', 'backstage']);

export const relatedArticleSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  imageUrl: z.string(),
  category: articleCategorySchema,
});

export const articleSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  content: z.string().optional(),
  category: articleCategorySchema,
  author: z.string(),
  authorAvatar: z.string(),
  authorBio: z.string().optional(),
  publishedAt: z.string(),
  imageUrl: z.string(),
  readTime: z.number(),
  isFeatured: z.boolean(),
  tags: z.array(z.string()),
  rating: z.number().optional(),
  relatedArticles: z.array(relatedArticleSchema).optional(),
});

export const articleListResponseSchema = z.object({
  page: z.number(),
  totalPages: z.number(),
  totalResults: z.number(),
  results: z.array(articleSchema),
});

export type ArticleSchema = z.infer<typeof articleSchema>;
export type ArticleListResponseSchema = z.infer<typeof articleListResponseSchema>;
