import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUserManagementService } from '../services/adminUserManagement.service';
import { CreateUserTierPayload, UpdateUserTierPayload } from '../dto/adminUserManagement.dto';

export const ADMIN_TIER_KEYS = {
  all: ['admin-tiers'] as const,
  list: () => [...ADMIN_TIER_KEYS.all, 'list'] as const,
};

export function useAdminTiers() {
  const queryClient = useQueryClient();

  // Query: User Tiers List
  const {
    data: tiers = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ADMIN_TIER_KEYS.list(),
    queryFn: () => adminUserManagementService.getUserTiers(),
  });

  // Mutation: Create Tier
  const createMutation = useMutation({
    mutationFn: (payload: CreateUserTierPayload) => adminUserManagementService.createUserTier(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_TIER_KEYS.all });
    },
  });

  // Mutation: Update Tier
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdateUserTierPayload }) =>
      adminUserManagementService.updateUserTier(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_TIER_KEYS.all });
    },
  });

  // Mutation: Delete Tier
  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => adminUserManagementService.deleteUserTier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_TIER_KEYS.all });
    },
  });

  return {
    tiers,
    isLoading,
    isError,
    error,
    refetch,
    createTier: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateTier: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteTier: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
