import { axiosClient } from '@lib/axios/axiosClient';
import { ApiResponse } from '@shared/types/api.type';
import { UserProfileDTO, ProfileUpdateRequestDTO } from '../dto/profile.dto';
import { TicketHistoryDTO } from '../dto/ticket-history.dto';
import { TicketStatusDTO } from '../dto/ticket-history.dto';

export interface TicketHistoryQueryParams {
  status?: TicketStatusDTO;
  page?: number;
  signal?: AbortSignal;
}

export const profileApi = {
  /**
   * GET /api/v1/users/profile
   * Returns the authenticated user's enriched profile (membership, points).
   */
  getProfile: (): Promise<ApiResponse<UserProfileDTO>> =>
    axiosClient.get('/api/v1/users/profile'),

  /**
   * PUT /api/v1/users/profile
   * Updates name, phone and dob.
   */
  updateProfile: (data: ProfileUpdateRequestDTO): Promise<ApiResponse<UserProfileDTO>> =>
    axiosClient.put('/api/v1/users/profile', data),

  /**
   * GET /api/v1/profile/tickets
   * Returns the authenticated user's ticket history, optionally filtered by status.
   * Accepts an AbortSignal for query cancellation (e.g. TanStack Query tab switch).
   */
  getTicketHistory: ({ signal, ...params }: TicketHistoryQueryParams = {}): Promise<ApiResponse<TicketHistoryDTO[]>> =>
    axiosClient.get('/profile/tickets', { params, signal }),
};
