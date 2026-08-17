import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().default('/backend-api'),
  NEXT_PUBLIC_IMAGE_BASE_URL: z.string().default('https://image.tmdb.org/t/p'),
  NEXT_PUBLIC_USE_MOCK: z.string().optional().transform((val) => val === 'true'),
  NEXT_PUBLIC_BACKEND_ORIGIN: z.string().default('https://cinedot_be.test'),
});

const _env = envSchema.safeParse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '/backend-api',
  NEXT_PUBLIC_IMAGE_BASE_URL: process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p',
  NEXT_PUBLIC_USE_MOCK: process.env.NEXT_PUBLIC_USE_MOCK || 'false',
  NEXT_PUBLIC_BACKEND_ORIGIN: process.env.NEXT_PUBLIC_BACKEND_ORIGIN || 'https://cinedot_be.test',
});

export const env = _env.success
  ? _env.data
  : {
      NEXT_PUBLIC_API_BASE_URL: '/backend-api',
      NEXT_PUBLIC_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
      NEXT_PUBLIC_USE_MOCK: false,
      NEXT_PUBLIC_BACKEND_ORIGIN: 'https://cinedot_be.test',
    };
