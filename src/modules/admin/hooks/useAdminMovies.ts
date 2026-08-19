import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminMovieService } from '../services/adminMovie.service';
import {
  AdminMovieListRequestDTO,
  CreateMovieRequestDTO,
  UpdateMovieRequestDTO,
} from '../dto/adminMovie.dto';
import { CreateMovieCreditDTO } from '../dto/adminCredit.dto';

export const adminMovieKeys = {
  all: ['admin-movies'] as const,
  genres: () => [...adminMovieKeys.all, 'genres'] as const,
  lists: () => [...adminMovieKeys.all, 'list'] as const,
  list: (params?: AdminMovieListRequestDTO) => [...adminMovieKeys.lists(), params] as const,
  details: () => [...adminMovieKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...adminMovieKeys.details(), id] as const,
  credits: (movieId: string | number) => [...adminMovieKeys.detail(movieId), 'credits'] as const,
};

export const useAdminMovies = (params?: AdminMovieListRequestDTO) => {
  const queryClient = useQueryClient();

  /**
   * Query danh sách thể loại phim
   */
  const genresQuery = useQuery({
    queryKey: adminMovieKeys.genres(),
    queryFn: () => adminMovieService.getGenres(),
    staleTime: 10 * 60 * 1000,
  });

  /**
   * Query danh sách phim (Server-side Pagination & Filter)
   */
  const moviesListQuery = useQuery({
    queryKey: adminMovieKeys.list(params),
    queryFn: () => adminMovieService.getMovies(params),
    placeholderData: (previousData) => previousData,
    staleTime: 60 * 1000,
  });

  /**
   * Mutation: Tạo mới bộ phim
   */
  const createMovieMutation = useMutation({
    mutationFn: (payload: CreateMovieRequestDTO) => adminMovieService.createMovie(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminMovieKeys.lists() });
    },
  });

  /**
   * Mutation: Cập nhật thông tin phim
   */
  const updateMovieMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: UpdateMovieRequestDTO }) =>
      adminMovieService.updateMovie(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminMovieKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminMovieKeys.detail(variables.id) });
    },
  });

  /**
   * Mutation: Xóa vĩnh viễn phim
   */
  const deleteMovieMutation = useMutation({
    mutationFn: (id: string | number) => adminMovieService.deleteMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminMovieKeys.lists() });
    },
  });

  /**
   * Mutation: Tìm kiếm & Đồng bộ TMDB
   */
  const tmdbSyncMutation = useMutation({
    mutationFn: (query: string) => adminMovieService.syncMoviesFromTmdb(query),
  });

  return {
    moviesList: moviesListQuery.data?.items || [],
    genres: genresQuery.data || [],
    isLoadingGenres: genresQuery.isLoading,
    pagination: {
      currentPage: moviesListQuery.data?.currentPage || 1,
      lastPage: moviesListQuery.data?.lastPage || 1,
      perPage: moviesListQuery.data?.perPage || 6,
      total: moviesListQuery.data?.total || 0,
    },
    isLoading: moviesListQuery.isLoading,
    isFetching: moviesListQuery.isFetching,
    error: moviesListQuery.error,
    refetchMovies: moviesListQuery.refetch,

    createMovie: createMovieMutation.mutateAsync,
    isCreating: createMovieMutation.isPending,

    updateMovie: updateMovieMutation.mutateAsync,
    isUpdating: updateMovieMutation.isPending,

    deleteMovie: deleteMovieMutation.mutateAsync,
    isDeleting: deleteMovieMutation.isPending,

    syncFromTmdb: tmdbSyncMutation.mutateAsync,
    isSyncingTmdb: tmdbSyncMutation.isPending,
  };
};

export const useAdminMovieCredits = (movieId: string | number | null) => {
  const queryClient = useQueryClient();

  const creditsQuery = useQuery({
    queryKey: adminMovieKeys.credits(movieId || ''),
    queryFn: () => (movieId ? adminMovieService.getMovieCredits(movieId) : Promise.resolve([])),
    enabled: Boolean(movieId),
    staleTime: 5 * 60 * 1000,
  });

  const addCreditMutation = useMutation({
    mutationFn: (payload: CreateMovieCreditDTO) =>
      movieId ? adminMovieService.addMovieCredit(movieId, payload) : Promise.reject(),
    onSuccess: () => {
      if (movieId) {
        queryClient.invalidateQueries({ queryKey: adminMovieKeys.credits(movieId) });
      }
    },
  });

  const deleteCreditMutation = useMutation({
    mutationFn: (creditId: string | number) =>
      movieId ? adminMovieService.deleteMovieCredit(movieId, creditId) : Promise.reject(),
    onSuccess: () => {
      if (movieId) {
        queryClient.invalidateQueries({ queryKey: adminMovieKeys.credits(movieId) });
      }
    },
  });

  return {
    credits: creditsQuery.data || [],
    isLoadingCredits: creditsQuery.isLoading,
    addCredit: addCreditMutation.mutateAsync,
    isAddingCredit: addCreditMutation.isPending,
    deleteCredit: deleteCreditMutation.mutateAsync,
    isDeletingCredit: deleteCreditMutation.isPending,
  };
};
