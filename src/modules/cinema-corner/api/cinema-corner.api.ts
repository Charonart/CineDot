import { axiosClient } from '@lib/axios/axiosClient';
import { ApiResponse } from '@shared/types/api.type';
import { ArticleListResponseDTO, ArticleDTO } from '../dto/cinema-corner.dto';

export const cinemaCornerApi = {
  getArticles: (params?: { category?: string; page?: number }): Promise<ApiResponse<ArticleListResponseDTO>> =>
    axiosClient.get('/cinema-corner/articles', { params }),

  getArticle: (slug: string): Promise<ApiResponse<ArticleDTO>> =>
    axiosClient.get(`/cinema-corner/articles/${slug}`),
};
