import { movieApi } from '../api/movie.api';
import { movieMapper, heroSlideMapper } from '../mappers/movie.mapper';
import { Movie, MovieList, HeroSlide } from '../types/movie.type';
import { movieListResponseSchema, movieSchema } from '../schemas/movie.schema';
import { logger } from '@lib/logger/logger';
import { z } from 'zod';

export const movieService = {
  getTrendingMovies: async (page = 1): Promise<MovieList> => {
    try {
      const response = await movieApi.getMovies({ category: 'now_showing', page });
      const validatedData = movieListResponseSchema.parse(response.data);
      return movieMapper.toMovieListModel(validatedData);
    } catch (error) {
      logger.error('[MovieService] getTrendingMovies failed:', error);
      throw new Error('FAILED_TO_LOAD_TRENDING_MOVIES');
    }
  },

  getPopularMovies: async (page = 1): Promise<MovieList> => {
    try {
      const response = await movieApi.getMovies({ category: 'coming_soon', page });
      const validatedData = movieListResponseSchema.parse(response.data);
      return movieMapper.toMovieListModel(validatedData);
    } catch (error) {
      logger.error('[MovieService] getPopularMovies failed:', error);
      throw new Error('FAILED_TO_LOAD_POPULAR_MOVIES');
    }
  },

  getMovieDetail: async (id: number | string): Promise<Movie> => {
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
      const response = await movieApi.getMovies({ search: query, page });
      const validatedData = movieListResponseSchema.parse(response.data);
      return movieMapper.toMovieListModel(validatedData);
    } catch (error) {
      logger.error('[MovieService] searchMovies failed:', error);
      throw new Error('FAILED_TO_SEARCH_MOVIES');
    }
  },

  getMovies: async (params: {
    category?: string;
    status?: string;
    featured?: boolean | string;
    limit?: number;
    page?: number;
    search?: string;
  }): Promise<MovieList> => {
    try {
      const response = await movieApi.getMovies(params);
      const validatedData = movieListResponseSchema.parse(response.data);
      return movieMapper.toMovieListModel(validatedData);
    } catch (error) {
      logger.error('[MovieService] getMovies failed:', error);
      throw new Error('FAILED_TO_LOAD_MOVIES');
    }
  },

  // lấy dữ liệu hiển thị ở header
  getNavbarMovies: async (): Promise<MovieList> => {
    try {
      const response = await movieApi.getMovies({ status: 'now_showing,coming_soon', limit: 8 });
      const validatedData = movieListResponseSchema.parse(response.data);
      return movieMapper.toMovieListModel(validatedData);
    } catch (error) {
      logger.error('[MovieService] getNavbarMovies failed:', error);
      throw new Error('FAILED_TO_LOAD_NAVBAR_MOVIES');
    }
  },

  // lấy dữ liệu hiển thị trên carousel trang chủ
  getHeroSlides: async (): Promise<HeroSlide[]> => {
    try {
      const response = await movieApi.getMovies({ category: 'now_showing', featured: true, limit: 4 });
      // response.data is MovieListResponseDTO under the new contract, so we parse results
      const results = response.data?.results || [];
      const validatedData = z.array(movieSchema).parse(results);
      return heroSlideMapper.toHeroSlideListModel(validatedData);
    } catch (error) {
      logger.error('[MovieService] getHeroSlides failed:', error);
      throw new Error('FAILED_TO_LOAD_HERO_SLIDES');
    }
  },
};
