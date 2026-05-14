import { env } from '@lib/env/env';

export type ImageSize = 'sm' | 'md' | 'lg' | 'original';

const POSTER_SIZES: Record<ImageSize, string> = {
  sm: 'w185',
  md: 'w342',
  lg: 'w500',
  original: 'original',
};

const BACKDROP_SIZES: Record<ImageSize, string> = {
  sm: 'w300',
  md: 'w780',
  lg: 'w1280',
  original: 'original',
};

const PROFILE_SIZES: Record<ImageSize, string> = {
  sm: 'w45',
  md: 'w185',
  lg: 'h632',
  original: 'original',
};

export const imageHelper = {
  getPosterUrl: (path: string | null | undefined, size: ImageSize = 'md') => {
    if (!path) return '/placeholders/poster.png';
    return `${env.NEXT_PUBLIC_IMAGE_BASE_URL}/${POSTER_SIZES[size]}${path}`;
  },
  
  getBackdropUrl: (path: string | null | undefined, size: ImageSize = 'lg') => {
    if (!path) return '/placeholders/backdrop.png';
    return `${env.NEXT_PUBLIC_IMAGE_BASE_URL}/${BACKDROP_SIZES[size]}${path}`;
  },
  
  getProfileUrl: (path: string | null | undefined, size: ImageSize = 'md') => {
    if (!path) return '/placeholders/profile.png';
    return `${env.NEXT_PUBLIC_IMAGE_BASE_URL}/${PROFILE_SIZES[size]}${path}`;
  },
};
