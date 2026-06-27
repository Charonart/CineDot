import { movieApi } from '../api/movie.api';
import { movieMapper, heroSlideMapper } from '../mappers/movie.mapper';
import { Movie, MovieList, HeroSlide } from '../types/movie.type';
import { movieListResponseSchema, movieSchema, heroSlideListSchema } from '../schemas/movie.schema';
import { logger } from '@lib/logger/logger';

export const movieService = {
  getTrendingMovies: async (page = 1): Promise<MovieList> => {
    try {
      const response = await movieApi.getTrending(page);
      const validatedData = movieListResponseSchema.parse(response.data);
      return movieMapper.toMovieListModel(validatedData);
    } catch (error) {
      logger.error('[MovieService] getTrendingMovies failed:', error);
      throw new Error('FAILED_TO_LOAD_TRENDING_MOVIES');
    }
  },

  getPopularMovies: async (page = 1): Promise<MovieList> => {
    try {
      const response = await movieApi.getPopular(page);
      const validatedData = movieListResponseSchema.parse(response.data);
      return movieMapper.toMovieListModel(validatedData);
    } catch (error) {
      logger.error('[MovieService] getPopularMovies failed:', error);
      throw new Error('FAILED_TO_LOAD_POPULAR_MOVIES');
    }
  },

  getMovieDetail: async (id: number): Promise<Movie> => {
    try {
      const response = await movieApi.getDetail(id);
      const validatedData = movieSchema.parse(response.data);
      return movieMapper.toMovieModel(validatedData);
    } catch (error) {
      logger.error('[MovieService] getMovieDetail failed:', error);
      throw new Error('FAILED_TO_LOAD_MOVIE_DETAIL');
    }
  },

  searchMovies: async (query: string, page = 1): Promise<MovieList> => {
    try {
      const response = await movieApi.searchMovies(query, page);
      const validatedData = movieListResponseSchema.parse(response.data);
      return movieMapper.toMovieListModel(validatedData);
    } catch (error) {
      logger.error('[MovieService] searchMovies failed:', error);
      throw new Error('FAILED_TO_SEARCH_MOVIES');
    }
  },

  getMovies: async (params: { category?: string; limit?: number; page?: number }): Promise<MovieList> => {
    try {
      const response = await movieApi.getMovies(params);
      const validatedData = movieListResponseSchema.parse(response.data);
      return movieMapper.toMovieListModel(validatedData);
    } catch (error) {
      logger.error('[MovieService] getMovies failed:', error);
      throw new Error('FAILED_TO_LOAD_MOVIES');
    }
  },

  getNavbarMovies: async (): Promise<MovieList> => {
    try {
      const response = await movieApi.getNavbarMovies();
      const validatedData = movieListResponseSchema.parse(response.data);
      return movieMapper.toMovieListModel(validatedData);
    } catch (error) {
      logger.error('[MovieService] getNavbarMovies failed:', error);
      throw new Error('FAILED_TO_LOAD_NAVBAR_MOVIES');
    }
  },

  getHeroSlides: async (): Promise<HeroSlide[]> => {
    try {
      const response = await movieApi.getHeroSlides();
      const validatedData = heroSlideListSchema.parse(response.data);
      return heroSlideMapper.toHeroSlideListModel(validatedData);
    } catch (error) {
      logger.error('[MovieService] getHeroSlides failed:', error);
      throw new Error('FAILED_TO_LOAD_HERO_SLIDES');
    }
  },
};
