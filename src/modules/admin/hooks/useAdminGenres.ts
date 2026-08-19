import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminGenreService, GetAdminGenresParams } from '../services/adminGenre.service';
import { CreateGenreRequestDTO, UpdateGenreRequestDTO } from '../dto/adminGenre.dto';
import { AdminGenreItem, AdminGenrePagination } from '../types/adminGenre.types';

export const adminGenreKeys = {
  all: ['admin', 'genres'] as const,
  lists: () => [...adminGenreKeys.all, 'list'] as const,
  list: (params?: GetAdminGenresParams) => [...adminGenreKeys.lists(), params] as const,
  movies: (genreId: number | string) => [...adminGenreKeys.all, 'movies', genreId] as const,
};

export function useAdminGenres(params?: GetAdminGenresParams) {
  const queryClient = useQueryClient();

  const genresQuery = useQuery({
    queryKey: adminGenreKeys.list(params),
    queryFn: () => adminGenreService.getGenres(params),
    staleTime: 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateGenreRequestDTO) => adminGenreService.createGenre(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminGenreKeys.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdateGenreRequestDTO }) =>
      adminGenreService.updateGenre(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminGenreKeys.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => adminGenreService.deleteGenre(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminGenreKeys.all });
    },
  });

  const genresList: AdminGenreItem[] = genresQuery.data?.items || [];
  const pagination: AdminGenrePagination = genresQuery.data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
  };

  return {
    genresList,
    pagination,
    isLoading: genresQuery.isLoading,
    isFetching: genresQuery.isFetching,
    refetch: genresQuery.refetch,

    createGenre: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateGenre: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteGenre: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export function useGenreMovies(genreId: number | string | null) {
  return useQuery({
    queryKey: adminGenreKeys.movies(genreId || 0),
    queryFn: () => adminGenreService.getGenreMovies(genreId!),
    enabled: Boolean(genreId),
    staleTime: 60 * 1000,
  });
}
