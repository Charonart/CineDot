import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';
import { ResetPasswordRequestDTO } from '../dto/auth.dto';

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ResetPasswordRequestDTO) => authService.resetPassword(payload),
    onSuccess: () => {
      // Go to login page on password reset success
      router.push('/login');
    },
  });
};
