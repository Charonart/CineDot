import { adminMovieApi } from '../api/admin-movie.api';
import { adminMovieMapper } from '../mappers/admin-movie.mapper';
import { AdminMovieModel, AdminMovieListModel } from '../types/admin-movie.type';
import { adminMovieListResponseSchema, adminMovieSchema } from '../schemas/admin-movie.schema';
import { logger } from '@lib/logger/logger';

export const adminMovieService = {
  getMovies: async (params?: {
    page?: number;
    status?: string;
    search?: string;
  }): Promise<AdminMovieListModel> => {
    try {
      const response = await adminMovieApi.getMovies(params);
      const validatedData = adminMovieListResponseSchema.parse(response.data);
      return adminMovieMapper.toModelList(validatedData);
    } catch (error) {
      logger.error('[AdminMovieService] getMovies failed:', error);
      throw new Error('FAILED_TO_LOAD_ADMIN_MOVIES');
    }
  },

  getMovieDetail: async (id: number | string): Promise<AdminMovieModel> => {
    try {
      const response = await adminMovieApi.getDetail(id);
      const validatedData = adminMovieSchema.parse(response.data);
      return adminMovieMapper.toModel(validatedData);
    } catch (error) {
      logger.error('[AdminMovieService] getMovieDetail failed:', error);
      throw new Error('FAILED_TO_LOAD_ADMIN_MOVIE_DETAIL');
    }
  },

  createMovie: async (data: any): Promise<AdminMovieModel> => {
    try {
      const response = await adminMovieApi.createMovie(data);
      const validatedData = adminMovieSchema.parse(response.data);
      return adminMovieMapper.toModel(validatedData);
    } catch (error) {
      logger.error('[AdminMovieService] createMovie failed:', error);
      throw new Error('FAILED_TO_CREATE_MOVIE');
    }
  },

  updateMovie: async (id: number | string, data: any): Promise<AdminMovieModel> => {
    try {
      const response = await adminMovieApi.updateMovie(id, data);
      const validatedData = adminMovieSchema.parse(response.data);
      return adminMovieMapper.toModel(validatedData);
    } catch (error) {
      logger.error('[AdminMovieService] updateMovie failed:', error);
      throw new Error('FAILED_TO_UPDATE_MOVIE');
    }
  },

  deleteMovie: async (id: number | string): Promise<void> => {
    try {
      await adminMovieApi.deleteMovie(id);
    } catch (error) {
      logger.error('[AdminMovieService] deleteMovie failed:', error);
      throw new Error('FAILED_TO_DELETE_MOVIE');
    }
  },

  getCredits: async (movieId: number | string): Promise<any> => {
    try {
      const response = await adminMovieApi.getCredits(movieId);
      return response.data?.data || { cast: [], crew: [] }; // The mock credits has data wrapping
    } catch (error) {
      logger.error('[AdminMovieService] getCredits failed:', error);
      throw new Error('FAILED_TO_LOAD_CREDITS');
    }
  },

  addCredit: async (movieId: number | string, data: any): Promise<any> => {
    try {
      const response = await adminMovieApi.addCredit(movieId, data);
      return response.data;
    } catch (error) {
      logger.error('[AdminMovieService] addCredit failed:', error);
      throw new Error('FAILED_TO_ADD_CREDIT');
    }
  },

  deleteCredit: async (movieId: number | string, creditId: number | string, type: 'cast' | 'crew'): Promise<void> => {
    try {
      await adminMovieApi.deleteCredit(movieId, creditId, type);
    } catch (error) {
      logger.error('[AdminMovieService] deleteCredit failed:', error);
      throw new Error('FAILED_TO_DELETE_CREDIT');
    }
  },
};
