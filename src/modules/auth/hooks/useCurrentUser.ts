import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { AuthSession } from '../types/auth.type';

export const authKeys = {
  all: ['currentUser'] as const,
  me: () => ['currentUser'] as const,
};

export const useCurrentUser = () => {
  return useQuery<AuthSession, Error>({
    queryKey: authKeys.me(),
    queryFn: ({ signal }) => authService.getCurrentUser(signal),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000,  // 30 minutes
    retry: (failureCount, error: unknown) => {
      if (error && typeof error === 'object' && 'code' in error) {
        const code = (error as { code?: string }).code;
        if (code === 'UNAUTHENTICATED' || code === 'FAILED_TO_LOAD_CURRENT_USER') {
          return false;
        }
      }
      return failureCount < 1;
    },
    refetchOnWindowFocus: false,
  });
};
