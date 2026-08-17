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

const DEFAULT_POSTER = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80';
const DEFAULT_BACKDROP = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80';
const DEFAULT_PROFILE = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';

export const imageHelper = {
  getPosterUrl: (path: string | null | undefined, size: ImageSize = 'md'): string => {
    if (!path || path === '') return DEFAULT_POSTER;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/posters/') || path.startsWith('/backdrops/')) {
      const backendOrigin = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || 'https://cinedot_be.test';
      return `${backendOrigin}${path}`;
    }
    const tmdbBase = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';
    const formattedPath = path.startsWith('/') ? path : `/${path}`;
    return `${tmdbBase}/${POSTER_SIZES[size]}${formattedPath}`;
  },

  getBackdropUrl: (path: string | null | undefined, size: ImageSize = 'lg'): string => {
    if (!path || path === '') return DEFAULT_BACKDROP;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/posters/') || path.startsWith('/backdrops/')) {
      const backendOrigin = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || 'https://cinedot_be.test';
      return `${backendOrigin}${path}`;
    }
    const tmdbBase = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';
    const formattedPath = path.startsWith('/') ? path : `/${path}`;
    return `${tmdbBase}/${BACKDROP_SIZES[size]}${formattedPath}`;
  },

  getProfileUrl: (path: string | null | undefined, size: ImageSize = 'md'): string => {
    if (!path || path === '') return DEFAULT_PROFILE;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const tmdbBase = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';
    const formattedPath = path.startsWith('/') ? path : `/${path}`;
    return `${tmdbBase}/${PROFILE_SIZES[size]}${formattedPath}`;
  },

  getComboUrl: (path: string | null | undefined): string => {
    if (!path || path === '') return 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=400&auto=format&fit=crop&q=80'; // fallback popcorn
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const backendOrigin = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || 'https://cinedot_be.test';
    const formattedPath = path.startsWith('/') ? path : `/${path}`;
    // Assuming backend serves these from storage
    if (formattedPath.startsWith('/storage')) return `${backendOrigin}${formattedPath}`;
    return `${backendOrigin}/storage${formattedPath}`;
  },

  getAvatarUrl: (path: string | null | undefined): string => {
    if (!path || path === '') return DEFAULT_PROFILE;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const backendOrigin = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || 'https://cinedot_be.test';
    const formattedPath = path.startsWith('/') ? path : `/${path}`;
    if (formattedPath.startsWith('/storage')) return `${backendOrigin}${formattedPath}`;
    return `${backendOrigin}/storage${formattedPath}`;
  },
};
