import { useQuery } from '@tanstack/react-query';
import { movieService } from '../services/movie.service';

/**
 * Query Key Factory for Movie Module
 * Ensures cache consistency and easy invalidation
 */
export const movieKeys = {
  all: ['movies'] as const,
  lists: () => [...movieKeys.all, 'list'] as const,
  listParams: (params: Record<string, any>) => [...movieKeys.lists(), params] as const,
  trending: (page: number) => [...movieKeys.lists(), 'trending', { page }] as const,
  popular: (page: number) => [...movieKeys.lists(), 'popular', { page }] as const,
  details: () => [...movieKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...movieKeys.details(), id] as const,
  search: (query: string, page: number) => [...movieKeys.lists(), 'search', { query, page }] as const,
  navbar: () => [...movieKeys.all, 'navbar'] as const,
};

export const useTrendingMovies = (page = 1) => {
  return useQuery({
    queryKey: movieKeys.trending(page),
    queryFn: () => movieService.getTrendingMovies(page),
  });
};

export const usePopularMovies = (page = 1) => {
  return useQuery({
    queryKey: movieKeys.popular(page),
    queryFn: () => movieService.getPopularMovies(page),
  });
};

export const useMovieDetail = (id: number | string) => {
  return useQuery({
    queryKey: movieKeys.detail(id),
    queryFn: () => movieService.getMovieDetail(Number(id)),
    enabled: !!id,
  });
};

export const useSearchMovies = (query: string, page = 1) => {
  return useQuery({
    queryKey: movieKeys.search(query, page),
    queryFn: ({ signal }) => movieService.searchMovies(query, page),
    enabled: query.length >= 2,
  });
};

export const useMoviesList = (params: { category?: string; limit?: number; page?: number }) => {
  return useQuery({
    queryKey: movieKeys.listParams(params),
    queryFn: () => movieService.getMovies(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useNavbarMovies = () => {
  return useQuery({
    queryKey: movieKeys.navbar(),
    queryFn: () => movieService.getNavbarMovies(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
