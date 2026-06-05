import { specialTheatersApi } from '../api/special-theaters.api';
import { specialTheatersMapper } from '../mappers/special-theaters.mapper';
import { TheaterTypeData } from '../types/special-theaters.type';
import { theaterTypeDataSchema } from '../schemas/special-theaters.schema';
import { TheaterType } from '../dto/special-theaters.dto';
import { logger } from '@lib/logger/logger';

export const specialTheatersService = {
  getTheaterType: async (type: TheaterType): Promise<TheaterTypeData> => {
    try {
      const response = await specialTheatersApi.getTheaterType(type);
      const validatedData = theaterTypeDataSchema.parse(response.data);
      return specialTheatersMapper.toTheaterTypeModel(validatedData);
    } catch (error) {
      logger.error('[SpecialTheatersService] getTheaterType failed:', error);
      throw new Error('FAILED_TO_LOAD_THEATER_TYPE');
    }
  },
};
