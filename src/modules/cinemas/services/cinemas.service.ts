import { cinemasApi } from '../api/cinemas.api';
import { cinemasMapper } from '../mappers/cinemas.mapper';
import { Cinema, CinemaList, Pricing } from '../types/cinemas.type';
import { cinemaListResponseSchema, cinemaSchema, pricingSchema } from '../schemas/cinemas.schema';
import { logger } from '@lib/logger/logger';

export const cinemasService = {
  getCinemas: async (params?: { city?: string; page?: number }): Promise<CinemaList> => {
    try {
      const response = await cinemasApi.getCinemas(params);
      const validatedData = cinemaListResponseSchema.parse(response.data);
      return cinemasMapper.toCinemaListModel(validatedData);
    } catch (error) {
      logger.error('[CinemasService] getCinemas failed:', error);
      throw new Error('FAILED_TO_LOAD_CINEMAS');
    }
  },

  getCinema: async (slug: string): Promise<Cinema> => {
    try {
      const response = await cinemasApi.getCinema(slug);
      const validatedData = cinemaSchema.parse(response.data);
      return cinemasMapper.toCinemaModel(validatedData);
    } catch (error) {
      logger.error('[CinemasService] getCinema failed:', error);
      throw new Error('FAILED_TO_LOAD_CINEMA');
    }
  },

  getPricing: async (): Promise<Pricing> => {
    try {
      const response = await cinemasApi.getPricing();
      const validatedData = pricingSchema.parse(response.data);
      return cinemasMapper.toPricingModel(validatedData);
    } catch (error) {
      logger.error('[CinemasService] getPricing failed:', error);
      throw new Error('FAILED_TO_LOAD_PRICING');
    }
  },
};
