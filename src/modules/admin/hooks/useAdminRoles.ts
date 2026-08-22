import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUserManagementService } from '../services/adminUserManagement.service';
import { CreateRolePayload, UpdateRolePayload } from '../dto/adminUserManagement.dto';

export const ADMIN_ROLE_KEYS = {
  all: ['admin-roles'] as const,
  list: () => [...ADMIN_ROLE_KEYS.all, 'list'] as const,
  detail: (id: number | string) => [...ADMIN_ROLE_KEYS.all, 'detail', id] as const,
  permissions: () => ['admin-permissions'] as const,
};

export function useAdminRoles() {
  const queryClient = useQueryClient();

  // Query: Roles List
  const {
    data: roles = [],
    isLoading: isRolesLoading,
    isError,
    error,
    refetch: refetchRoles,
  } = useQuery({
    queryKey: ADMIN_ROLE_KEYS.list(),
    queryFn: () => adminUserManagementService.getRoles(),
  });

  // Query: Permissions List (Grouped by Module)
  const {
    data: permissionsData,
    isLoading: isPermissionsLoading,
  } = useQuery({
    queryKey: ADMIN_ROLE_KEYS.permissions(),
    queryFn: () => adminUserManagementService.getPermissions(),
    staleTime: 5 * 60 * 1000,
  });

  // Mutation: Create Role
  const createMutation = useMutation({
    mutationFn: (payload: CreateRolePayload) => adminUserManagementService.createRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ROLE_KEYS.all });
    },
  });

  // Mutation: Update Role
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdateRolePayload }) =>
      adminUserManagementService.updateRole(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ROLE_KEYS.all });
    },
  });

  // Mutation: Sync Role Permissions
  const syncPermissionsMutation = useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: number | string; permissionIds: number[] }) =>
      adminUserManagementService.syncRolePermissions(roleId, permissionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ROLE_KEYS.all });
    },
  });

  // Mutation: Delete Role
  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => adminUserManagementService.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ROLE_KEYS.all });
    },
  });

  return {
    roles,
    permissionsList: permissionsData?.list || [],
    permissionsGrouped: permissionsData?.grouped || {},
    isLoading: isRolesLoading || isPermissionsLoading,
    isRolesLoading,
    isPermissionsLoading,
    isError,
    error,
    refetchRoles,
    createRole: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateRole: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    syncRolePermissions: syncPermissionsMutation.mutateAsync,
    isSyncingPermissions: syncPermissionsMutation.isPending,
    deleteRole: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
