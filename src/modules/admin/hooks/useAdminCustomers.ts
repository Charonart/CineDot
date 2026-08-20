import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUserManagementService } from '../services/adminUserManagement.service';
import { CustomerFilterParams } from '../types/adminUserManagement.types';
import { CreateUserPayload, UpdateUserPayload, AdjustPointsPayload } from '../dto/adminUserManagement.dto';

export const ADMIN_CUSTOMER_KEYS = {
  all: ['admin-customers'] as const,
  list: (params?: CustomerFilterParams) => [...ADMIN_CUSTOMER_KEYS.all, 'list', params] as const,
  stats: () => [...ADMIN_CUSTOMER_KEYS.all, 'stats'] as const,
  detail: (id: number | string) => [...ADMIN_CUSTOMER_KEYS.all, 'detail', id] as const,
};

export function useAdminCustomers(initialParams?: CustomerFilterParams) {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<CustomerFilterParams>({
    page: 1,
    per_page: 15,
    role: 'customer',
    ...initialParams,
  });

  // Query: Users / Customers List
  const {
    data: paginatedData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ADMIN_CUSTOMER_KEYS.list(filters),
    queryFn: () => adminUserManagementService.getUsers(filters),
    placeholderData: (prev) => prev,
  });

  // Query: User Stats
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ADMIN_CUSTOMER_KEYS.stats(),
    queryFn: () => adminUserManagementService.getUserStats(),
    staleTime: 60 * 1000,
  });

  // Mutation: Create User
  const createMutation = useMutation({
    mutationFn: (payload: CreateUserPayload) => adminUserManagementService.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CUSTOMER_KEYS.all });
    },
  });

  // Mutation: Update User
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdateUserPayload }) =>
      adminUserManagementService.updateUser(id, payload),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CUSTOMER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ADMIN_CUSTOMER_KEYS.detail(vars.id) });
    },
  });

  // Mutation: Toggle Status (Lock/Unlock)
  const toggleStatusMutation = useMutation({
    mutationFn: (id: number | string) => adminUserManagementService.toggleUserStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CUSTOMER_KEYS.all });
    },
  });

  // Mutation: Adjust Points
  const adjustPointsMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: AdjustPointsPayload }) =>
      adminUserManagementService.adjustUserPoints(id, payload),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CUSTOMER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ADMIN_CUSTOMER_KEYS.detail(vars.id) });
    },
  });

  // Mutation: Delete User
  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => adminUserManagementService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CUSTOMER_KEYS.all });
    },
  });

  // Mutation: Update Single Cell (Inline Edit)
  const updateCellMutation = useMutation({
    mutationFn: ({ id, field, value }: { id: number | string; field: string; value: any }) =>
      adminUserManagementService.updateCell(id, field, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CUSTOMER_KEYS.all });
    },
  });

  // Mutation: Bulk Action
  const bulkActionMutation = useMutation({
    mutationFn: ({
      action,
      ids,
      payload,
    }: {
      action: 'delete' | 'toggle_active' | 'set_active' | 'set_inactive' | 'adjust_points';
      ids: (string | number)[];
      payload?: any;
    }) => adminUserManagementService.bulkAction(action, ids, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CUSTOMER_KEYS.all });
    },
  });

  return {
    users: paginatedData?.data || [],
    pagination: paginatedData?.meta || {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
    },
    stats: statsData,
    filters,
    setFilters,
    isLoading,
    isFetching,
    isStatsLoading,
    isError,
    error,
    refetch,
    createUser: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateUser: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    toggleUserStatus: toggleStatusMutation.mutateAsync,
    isToggling: toggleStatusMutation.isPending,
    adjustPoints: adjustPointsMutation.mutateAsync,
    isAdjustingPoints: adjustPointsMutation.isPending,
    deleteUser: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    updateCell: updateCellMutation.mutateAsync,
    isUpdatingCell: updateCellMutation.isPending,
    bulkAction: bulkActionMutation.mutateAsync,
    isBulkActionPending: bulkActionMutation.isPending,
  };
}
