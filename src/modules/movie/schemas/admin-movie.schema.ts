import { z } from 'zod';
import { genreSchema } from './movie.schema';

export const adminMovieSchema = z.object({
  id: z.union([z.number(), z.string()]),
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  original_title: z.string().optional().nullable(),
  status: z.enum(['now_showing', 'coming_soon', 'stopped']),
  release_date: z.string().min(1, 'Ngày phát hành là bắt buộc'),
  rating: z.number().default(0),
  runtime: z.number().min(1, 'Thời lượng phim phải lớn hơn 0'),
  age_rating: z.string().default('P'),
  poster_url: z.string().url('Poster URL không hợp lệ'),
  backdrop_url: z.string().optional().nullable(),
  trailer_url: z.string().optional().nullable(),
  overview: z.string().optional().default(''),
  genres: z.array(genreSchema).default([]),
});

export const adminMovieListResponseSchema = z.object({
  page: z.number(),
  results: z.array(adminMovieSchema),
  total_pages: z.number(),
  total_results: z.number(),
});
