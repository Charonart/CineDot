import { profileApi, TicketHistoryQueryParams } from '../api/profile.api';
import { profileMapper } from '../mappers/profile.mapper';
import { UserProfile, TicketHistory } from '../types/profile.type';
import { userProfileSchema, ticketHistoryListSchema } from '../schemas/profile.schema';
import { ProfileUpdateRequestDTO } from '../dto/profile.dto';
import { logger } from '@lib/logger/logger';

export const profileService = {
  /**
   * Fetches the authenticated user's enriched profile.
   * Validates the response with Zod before mapping to domain model.
   */
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await profileApi.getProfile();
      const validatedData = userProfileSchema.parse(response.data);
      return profileMapper.toUserProfile(validatedData);
    } catch (error) {
      logger.error('[ProfileService] getProfile failed:', error);
      throw new Error('FAILED_TO_LOAD_PROFILE');
    }
  },

  /**
   * Updates the user profile (name, phone).
   * Returns the updated domain model.
   */
  updateProfile: async (data: ProfileUpdateRequestDTO): Promise<UserProfile> => {
    try {
      const response = await profileApi.updateProfile(data);
      const validatedData = userProfileSchema.parse(response.data);
      return profileMapper.toUserProfile(validatedData);
    } catch (error) {
      logger.error('[ProfileService] updateProfile failed:', error);
      throw new Error('FAILED_TO_UPDATE_PROFILE');
    }
  },

  /**
   * Fetches the user's ticket history.
   * Validates the array response and maps each item to a TicketHistory model.
   */
  getTicketHistory: async (params?: TicketHistoryQueryParams): Promise<TicketHistory[]> => {
    try {
      const response = await profileApi.getTicketHistory(params);
      const validatedData = ticketHistoryListSchema.parse(response.data);
      return profileMapper.toTicketHistoryList(validatedData);
    } catch (error) {
      logger.error('[ProfileService] getTicketHistory failed:', error);
      throw new Error('FAILED_TO_LOAD_TICKET_HISTORY');
    }
  },
};
