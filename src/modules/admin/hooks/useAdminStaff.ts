import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminStaffService } from '../services/adminStaff.service';
import {
  AdminStaffListRequestDTO,
  CreateStaffRequestDTO,
  UpdateStaffRequestDTO,
  UpdateStaffRoleRequestDTO,
} from '../dto/adminStaff.dto';

export const adminStaffKeys = {
  all: ['admin-staff'] as const,
  lists: () => [...adminStaffKeys.all, 'list'] as const,
  list: (params?: AdminStaffListRequestDTO) => [...adminStaffKeys.lists(), params] as const,
  details: () => [...adminStaffKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...adminStaffKeys.details(), id] as const,
  roles: () => [...adminStaffKeys.all, 'roles'] as const,
  cinemas: () => [...adminStaffKeys.all, 'cinemas'] as const,
};

export const useAdminStaff = (params?: AdminStaffListRequestDTO) => {
  const queryClient = useQueryClient();

  /**
   * Query danh sách nhân sự (Server-side pagination & filter)
   */
  const staffListQuery = useQuery({
    queryKey: adminStaffKeys.list(params),
    queryFn: () => adminStaffService.getStaffList(params),
    placeholderData: (previousData) => previousData,
    staleTime: 60 * 1000,
  });

  /**
   * Query danh sách các vai trò hệ thống
   */
  const rolesQuery = useQuery({
    queryKey: adminStaffKeys.roles(),
    queryFn: () => adminStaffService.getRoles(),
    staleTime: 5 * 60 * 1000,
  });

  /**
   * Query danh sách cụm rạp
   */
  const cinemasQuery = useQuery({
    queryKey: adminStaffKeys.cinemas(),
    queryFn: () => adminStaffService.getCinemas(),
    staleTime: 5 * 60 * 1000,
  });

  /**
   * Mutation: Tạo mới tài khoản nhân sự
   */
  const createStaffMutation = useMutation({
    mutationFn: (payload: CreateStaffRequestDTO) => adminStaffService.createStaff(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminStaffKeys.lists() });
    },
  });

  /**
   * Mutation: Cập nhật thông tin nhân sự
   */
  const updateStaffMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: UpdateStaffRequestDTO }) =>
      adminStaffService.updateStaff(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminStaffKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminStaffKeys.detail(variables.id) });
    },
  });

  /**
   * Mutation: Cập nhật vai trò & quyền hạn
   */
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: UpdateStaffRoleRequestDTO }) =>
      adminStaffService.updateStaffRole(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminStaffKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminStaffKeys.detail(variables.id) });
    },
  });

  /**
   * Mutation: Khóa / Kích hoạt tài khoản
   */
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string | number; status: 'ACTIVE' | 'DISABLED' }) =>
      adminStaffService.toggleStaffStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminStaffKeys.lists() });
    },
  });

  /**
   * Mutation: Xóa tài khoản nhân sự
   */
  const deleteStaffMutation = useMutation({
    mutationFn: (id: string | number) => adminStaffService.deleteStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminStaffKeys.lists() });
    },
  });

  return {
    staffList: staffListQuery.data?.items || [],
    pagination: {
      currentPage: staffListQuery.data?.currentPage || 1,
      lastPage: staffListQuery.data?.lastPage || 1,
      perPage: staffListQuery.data?.perPage || 10,
      total: staffListQuery.data?.total || 0,
    },
    isLoading: staffListQuery.isLoading,
    isFetching: staffListQuery.isFetching,
    error: staffListQuery.error,
    refetchStaff: staffListQuery.refetch,

    roles: rolesQuery.data || [],
    cinemas: cinemasQuery.data || [],

    createStaff: createStaffMutation.mutateAsync,
    isCreating: createStaffMutation.isPending,

    updateStaff: updateStaffMutation.mutateAsync,
    isUpdating: updateStaffMutation.isPending,

    updateStaffRole: updateRoleMutation.mutateAsync,
    isUpdatingRole: updateRoleMutation.isPending,

    toggleStaffStatus: toggleStatusMutation.mutateAsync,
    isTogglingStatus: toggleStatusMutation.isPending,

    deleteStaff: deleteStaffMutation.mutateAsync,
    isDeleting: deleteStaffMutation.isPending,
  };
};
