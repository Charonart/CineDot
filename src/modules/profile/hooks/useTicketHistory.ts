import { useQuery } from '@tanstack/react-query';
import { profileService } from '../services/profile.service';
import { profileKeys } from './useProfile';
import { TicketStatusDTO } from '../dto/ticket-history.dto';

interface UseTicketHistoryParams {
  status?: TicketStatusDTO;
  page?: number;
}

/**
 * useTicketHistory — fetches the user's ticket purchase history.
 * Supports filtering by status (UPCOMING, COMPLETED, CANCELLED).
 * Uses query cancellation via AbortSignal.
 */
export const useTicketHistory = (params?: UseTicketHistoryParams) => {
  return useQuery({
    queryKey: profileKeys.tickets(params),
    queryFn: ({ signal: _signal }) => profileService.getTicketHistory(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
