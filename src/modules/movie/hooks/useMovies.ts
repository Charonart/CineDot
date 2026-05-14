import { useQuery } from '@tanstack/react-query';
import { movieService } from '../services/movie.service';

/**
 * Query Key Factory for Movie Module
 * Ensures cache consistency and easy invalidation
 */
export const movieKeys = {
  all: ['movies'] as const,
  lists: () => [...movieKeys.all, 'list'] as const,
  trending: (page: number) => [...movieKeys.lists(), 'trending', { page }] as const,
  popular: (page: number) => [...movieKeys.lists(), 'popular', { page }] as const,
  details: () => [...movieKeys.all, 'detail'] as const,
  detail: (id: number) => [...movieKeys.details(), id] as const,
  search: (query: string, page: number) => [...movieKeys.lists(), 'search', { query, page }] as const,
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

export const useMovieDetail = (id: number) => {
  return useQuery({
    queryKey: movieKeys.detail(id),
    queryFn: () => movieService.getMovieDetail(id),
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
