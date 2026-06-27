import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminMovieService } from '../services/admin-movie.service';

export const adminMovieKeys = {
  all: ['admin-movies'] as const,
  lists: () => [...adminMovieKeys.all, 'list'] as const,
  listParams: (params: Record<string, any>) => [...adminMovieKeys.lists(), params] as const,
  details: () => [...adminMovieKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...adminMovieKeys.details(), id] as const,
  credits: (id: number | string) => [...adminMovieKeys.all, 'credits', id] as const,
};

export const useAdminMovies = (params: { page?: number; status?: string; search?: string } = {}) => {
  return useQuery({
    queryKey: adminMovieKeys.listParams(params),
    queryFn: () => adminMovieService.getMovies(params),
    staleTime: 0, // Admin data should be fresh
  });
};

export const useAdminMovieDetail = (id: number | string) => {
  return useQuery({
    queryKey: adminMovieKeys.detail(id),
    queryFn: () => adminMovieService.getMovieDetail(id),
    enabled: !!id,
  });
};

export const useMovieCredits = (movieId: number | string) => {
  return useQuery({
    queryKey: adminMovieKeys.credits(movieId),
    queryFn: () => adminMovieService.getCredits(movieId),
    enabled: !!movieId,
  });
};

export const useCreateAdminMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => adminMovieService.createMovie(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminMovieKeys.lists() });
    },
  });
};

export const useUpdateAdminMovie = (id: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => adminMovieService.updateMovie(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminMovieKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminMovieKeys.detail(id) });
    },
  });
};

export const useDeleteAdminMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => adminMovieService.deleteMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminMovieKeys.lists() });
    },
  });
};

export const useAddMovieCredit = (movieId: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => adminMovieService.addCredit(movieId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminMovieKeys.credits(movieId) });
    },
  });
};

export const useDeleteMovieCredit = (movieId: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ creditId, type }: { creditId: number | string; type: 'cast' | 'crew' }) =>
      adminMovieService.deleteCredit(movieId, creditId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminMovieKeys.credits(movieId) });
    },
  });
};
