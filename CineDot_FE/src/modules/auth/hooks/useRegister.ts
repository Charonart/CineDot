import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';
import { RegisterRequestDTO } from '../dto/auth.dto';
import { authKeys } from './useCurrentUser';

export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterRequestDTO) => authService.register(payload),
    onSuccess: (session) => {
      if (session && session.user) {
        queryClient.setQueryData(authKeys.me(), session);
        void queryClient.invalidateQueries({ queryKey: authKeys.all });
      }
      
      // Check verification state or default to verify-email route
      if (session && session.user && session.user.emailVerifiedAt) {
        router.push('/');
      } else {
        router.push('/verify-email');
      }
    },
  });
};
