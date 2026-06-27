import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { ForgotPasswordRequestDTO } from '../dto/auth.dto';

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (payload: ForgotPasswordRequestDTO) => authService.forgotPassword(payload),
  });
};
