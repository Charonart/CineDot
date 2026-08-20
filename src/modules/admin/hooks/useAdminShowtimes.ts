import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminShowtimeService } from '../services/adminShowtime.service';
import {
  CreateAdminShowtimeRequestDTO,
  UpdateAdminShowtimeRequestDTO,
  CloneDateShowtimesRequestDTO,
} from '../dto/adminShowtime.dto';

export const adminShowtimeKeys = {
  all: ['admin', 'showtimes'] as const,
  list: (cinemaId?: number | string, date?: string) =>
    [...adminShowtimeKeys.all, 'list', { cinemaId, date }] as const,
  detail: (id: number | string) => [...adminShowtimeKeys.all, 'detail', id] as const,
  cinemas: () => ['admin', 'showtimes', 'cinemas'] as const,
  rooms: (cinemaId: number | string) => ['admin', 'showtimes', 'rooms', cinemaId] as const,
  movies: () => ['admin', 'showtimes', 'movies'] as const,
};

export function useAdminShowtimes(selectedCinemaId?: number, selectedDate?: string) {
  const queryClient = useQueryClient();

  // 1. Fetch Cinemas List
  const cinemasQuery = useQuery({
    queryKey: adminShowtimeKeys.cinemas(),
    queryFn: () => adminShowtimeService.getCinemas(),
    staleTime: 5 * 60 * 1000,
  });

  // 2. Fetch Rooms for selected Cinema
  const roomsQuery = useQuery({
    queryKey: adminShowtimeKeys.rooms(selectedCinemaId || 0),
    queryFn: () => adminShowtimeService.getRoomsByCinema(selectedCinemaId!),
    enabled: Boolean(selectedCinemaId),
    staleTime: 5 * 60 * 1000,
  });

  // 3. Fetch Movies
  const moviesQuery = useQuery({
    queryKey: adminShowtimeKeys.movies(),
    queryFn: () => adminShowtimeService.getMovies(),
    staleTime: 5 * 60 * 1000,
  });

  // 4. Fetch Showtimes for current Cinema & Date
  const showtimesQuery = useQuery({
    queryKey: adminShowtimeKeys.list(selectedCinemaId, selectedDate),
    queryFn: () =>
      adminShowtimeService.getShowtimes({
        cinema_id: selectedCinemaId,
        date: selectedDate,
        limit: 200,
      }),
    enabled: Boolean(selectedCinemaId && selectedDate),
    staleTime: 30 * 1000,
  });

  // 5. Create Mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateAdminShowtimeRequestDTO) => adminShowtimeService.createShowtime(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminShowtimeKeys.all });
    },
  });

  // 6. Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateAdminShowtimeRequestDTO }) =>
      adminShowtimeService.updateShowtime(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminShowtimeKeys.all });
    },
  });

  // 7. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => adminShowtimeService.deleteShowtime(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminShowtimeKeys.all });
    },
  });

  // 8. Clone Date Mutation
  const cloneDateMutation = useMutation({
    mutationFn: (data: CloneDateShowtimesRequestDTO) => adminShowtimeService.cloneDateShowtimes(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminShowtimeKeys.all });
    },
  });

  return {
    cinemas: cinemasQuery.data || [],
    isLoadingCinemas: cinemasQuery.isLoading,

    rooms: roomsQuery.data || [],
    isLoadingRooms: roomsQuery.isLoading,

    movies: moviesQuery.data || [],
    isLoadingMovies: moviesQuery.isLoading,

    showtimes: showtimesQuery.data || [],
    isLoadingShowtimes: showtimesQuery.isLoading,
    isFetchingShowtimes: showtimesQuery.isFetching,
    refetchShowtimes: showtimesQuery.refetch,

    createShowtime: createMutation.mutateAsync,
    isCreatingShowtime: createMutation.isPending,

    updateShowtime: updateMutation.mutateAsync,
    isUpdatingShowtime: updateMutation.isPending,

    deleteShowtime: deleteMutation.mutateAsync,
    isDeletingShowtime: deleteMutation.isPending,

    cloneDateShowtimes: cloneDateMutation.mutateAsync,
    isCloningDate: cloneDateMutation.isPending,
  };
}
