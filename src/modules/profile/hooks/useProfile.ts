import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profile.service';
import { ProfileUpdateRequestDTO } from '../dto/profile.dto';
import { TicketStatusDTO } from '../dto/ticket-history.dto';

/**
 * Query Key Factory for Profile Module.
 * All keys are centralized for consistent cache invalidation.
 */
export const profileKeys = {
  all: ['profile'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
  tickets: (params?: { status?: TicketStatusDTO; page?: number }) =>
    [...profileKeys.all, 'tickets', params] as const,
};

/**
 * useProfile — fetches the authenticated user's enriched profile data.
 * (Separate from /auth/me — includes membershipTier, totalPoints)
 */
export const useProfile = () => {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: () => profileService.getProfile(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

/**
 * useUpdateProfile — mutation for updating name/phone.
 * On success, invalidates the profile cache to refetch fresh data.
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfileUpdateRequestDTO) => profileService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() });
    },
  });
};
