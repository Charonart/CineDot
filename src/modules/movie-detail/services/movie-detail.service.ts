import { movieDetailApi } from '../api/movie-detail.api';
import { movieDetailMapper } from '../mappers/movie-detail.mapper';
import { MovieDetail, Credits, Video } from '../types/movie-detail.type';
import { movieDetailSchema, creditsSchema, videoListSchema } from '../schemas/movie-detail.schema';
import { movieListResponseSchema } from '@modules/movie/schemas/movie.schema';
import { movieMapper } from '@modules/movie/mappers/movie.mapper';
import { MovieList } from '@modules/movie/types/movie.type';
import { logger } from '@lib/logger/logger';

export const movieDetailService = {
  getMovieDetail: async (id: number): Promise<MovieDetail> => {
    try {
      const response = await movieDetailApi.getDetail(id);
      const validated = movieDetailSchema.parse(response.data);
      return movieDetailMapper.toMovieDetail(validated);
    } catch (error) {
      logger.error('[MovieDetailService] getMovieDetail failed:', error);
      throw new Error('FAILED_TO_LOAD_MOVIE_DETAIL');
    }
  },

  getCredits: async (id: number): Promise<Credits> => {
    try {
      const response = await movieDetailApi.getCredits(id);
      const validated = creditsSchema.parse(response.data);
      return movieDetailMapper.toCredits(validated);
    } catch (error) {
      logger.error('[MovieDetailService] getCredits failed:', error);
      throw new Error('FAILED_TO_LOAD_CREDITS');
    }
  },

  getVideos: async (id: number): Promise<Video[]> => {
    try {
      const response = await movieDetailApi.getVideos(id);
      const validated = videoListSchema.parse(response.data);
      return validated.results.map(movieDetailMapper.toVideo);
    } catch (error) {
      logger.error('[MovieDetailService] getVideos failed:', error);
      throw new Error('FAILED_TO_LOAD_VIDEOS');
    }
  },

  getSimilar: async (id: number, page = 1): Promise<MovieList> => {
    try {
      const response = await movieDetailApi.getSimilar(id, page);
      const validated = movieListResponseSchema.parse(response.data);
      return movieMapper.toMovieListModel(validated);
    } catch (error) {
      logger.error('[MovieDetailService] getSimilar failed:', error);
      throw new Error('FAILED_TO_LOAD_SIMILAR');
    }
  },
};
