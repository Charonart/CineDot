import { cinemaCornerApi } from '../api/cinema-corner.api';
import { cinemaCornerMapper } from '../mappers/cinema-corner.mapper';
import { Article, ArticleList } from '../types/cinema-corner.type';
import { articleListResponseSchema, articleSchema } from '../schemas/cinema-corner.schema';
import { logger } from '@lib/logger/logger';

export const cinemaCornerService = {
  getArticles: async (params?: { category?: string; page?: number }): Promise<ArticleList> => {
    try {
      const response = await cinemaCornerApi.getArticles(params);
      const validatedData = articleListResponseSchema.parse(response.data);
      return cinemaCornerMapper.toArticleListModel(validatedData);
    } catch (error) {
      logger.error('[CinemaCornerService] getArticles failed:', error);
      throw new Error('FAILED_TO_LOAD_ARTICLES');
    }
  },

  getArticle: async (slug: string): Promise<Article> => {
    try {
      const response = await cinemaCornerApi.getArticle(slug);
      const validatedData = articleSchema.parse(response.data);
      return cinemaCornerMapper.toArticleModel(validatedData);
    } catch (error) {
      logger.error('[CinemaCornerService] getArticle failed:', error);
      throw new Error('FAILED_TO_LOAD_ARTICLE');
    }
  },
};
