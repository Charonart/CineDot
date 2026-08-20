import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSeatTypeService } from '../services/adminSeatType.service';
import { CreateSeatTypePayload, UpdateSeatTypePayload } from '../dto/adminSeatType.dto';

export const ADMIN_SEAT_TYPES_QUERY_KEY = ['admin', 'seat-types'] as const;

export function useAdminSeatTypes() {
  const queryClient = useQueryClient();

  const {
    data: seatTypes = [],
    isLoading: isLoadingSeatTypes,
    isFetching: isFetchingSeatTypes,
    error: seatTypesError,
    refetch: refetchSeatTypes,
  } = useQuery({
    queryKey: ADMIN_SEAT_TYPES_QUERY_KEY,
    queryFn: () => adminSeatTypeService.fetchAdminSeatTypes(),
    staleTime: 60 * 1000,
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (payload: CreateSeatTypePayload) => adminSeatTypeService.createSeatType(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SEAT_TYPES_QUERY_KEY });
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ key, payload }: { key: string; payload: UpdateSeatTypePayload }) =>
      adminSeatTypeService.updateSeatType(key, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SEAT_TYPES_QUERY_KEY });
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (key: string) => adminSeatTypeService.deleteSeatType(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SEAT_TYPES_QUERY_KEY });
    },
  });

  return {
    seatTypes,
    isLoadingSeatTypes,
    isFetchingSeatTypes,
    seatTypesError,
    refetchSeatTypes,
    createSeatType: createMutation.mutateAsync,
    isCreatingSeatType: createMutation.isPending,
    updateSeatType: updateMutation.mutateAsync,
    isUpdatingSeatType: updateMutation.isPending,
    deleteSeatType: deleteMutation.mutateAsync,
    isDeletingSeatType: deleteMutation.isPending,
  };
}
