import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminAuthService } from '../services/adminAuth.service';
import { AdminLoginRequestDTO } from '../dto/adminAuth.dto';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { ApiError } from '@/shared/types/api.types';

export const adminAuthKeys = {
  all: ['admin-auth'] as const,
  me: () => [...adminAuthKeys.all, 'me'] as const,
};

export const useAdminAuth = () => {
  const queryClient = useQueryClient();
  const { setSession, clearSession, token, adminUser, isInitialized } = useAdminAuthStore();

  /**
   * Hook lấy thông tin phiên làm việc hiện tại từ API /auth/me
   */
  const meQuery = useQuery({
    queryKey: adminAuthKeys.me(),
    queryFn: async () => {
      try {
        const res = await adminAuthService.me();
        if (res.adminUser) {
          setSession(res.adminUser, res.permissions, token || '');
        }
        return res;
      } catch (err: any) {
        // Chỉ xóa phiên đăng nhập khi backend trả về 401 Unauthenticated
        if (err?.status === 401 || err?.response?.status === 401) {
          clearSession();
        }
        throw err;
      }
    },
    enabled: Boolean(token && isInitialized),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  /**
   * Mutation Đăng nhập Admin qua API thật
   */
  const loginMutation = useMutation({
    mutationFn: async (payload: AdminLoginRequestDTO) => {
      const result = await adminAuthService.login(payload);
      return result;
    },
    onSuccess: (data) => {
      setSession(data.adminUser, data.permissions, data.token);
      queryClient.setQueryData(adminAuthKeys.me(), {
        adminUser: data.adminUser,
        permissions: data.permissions,
      });
    },
  });

  /**
   * Mutation Đăng xuất Admin qua API thật
   */
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await adminAuthService.logout();
    },
    onSettled: () => {
      clearSession();
      queryClient.clear();
    },
  });

  return {
    adminUser,
    isAuthenticated: Boolean(token && adminUser),
    isLoadingSession: meQuery.isLoading,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error as ApiError | null,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    refetchMe: meQuery.refetch,
  };
};
