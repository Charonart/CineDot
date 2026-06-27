import { useQuery } from '@tanstack/react-query';
import { movieDetailService } from '../services/movie-detail.service';

/**
 * Query Key Factory cho Movie Detail Module
 */
export const movieDetailKeys = {
  all: ['movie-detail'] as const,
  detail: (id: number | string) => [...movieDetailKeys.all, id] as const,
  credits: (id: number | string) => [...movieDetailKeys.all, id, 'credits'] as const,
  videos: (id: number | string) => [...movieDetailKeys.all, id, 'videos'] as const,
  similar: (id: number | string, page: number) => [...movieDetailKeys.all, id, 'similar', { page }] as const,
};

const DEFAULT_STALE_TIME = 5 * 60 * 1000;   // 5 phút
const DEFAULT_GC_TIME   = 30 * 60 * 1000;   // 30 phút

export const useMovieDetail = (id: number | string) => {
  return useQuery({
    queryKey: movieDetailKeys.detail(id),
    queryFn: () => movieDetailService.getMovieDetail(id),
    enabled: !!id,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

export const useMovieCredits = (id: number | string) => {
  return useQuery({
    queryKey: movieDetailKeys.credits(id),
    queryFn: () => movieDetailService.getCredits(id),
    enabled: !!id,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

export const useMovieVideos = (id: number | string) => {
  return useQuery({
    queryKey: movieDetailKeys.videos(id),
    queryFn: () => movieDetailService.getVideos(id),
    enabled: !!id,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

export const useMovieSimilar = (id: number | string, page = 1) => {
  return useQuery({
    queryKey: movieDetailKeys.similar(id, page),
    queryFn: () => movieDetailService.getSimilar(id, page),
    enabled: !!id,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};
