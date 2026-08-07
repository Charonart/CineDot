import { apiClient } from '@/shared/lib/apiClient';
import { PromoBanner, MovieCardItem, ArticleItem, PromotionItem } from '../types/home.types';
import {
  MOCK_PROMO_BANNERS,
  MOCK_MOVIES,
  MOCK_COMING_SOON_MOVIES,
  MOCK_EARLY_TICKET_MOVIES,
  MOCK_ARTICLES,
  MOCK_PROMOTIONS,
} from '../mocks/mockHomeData';

export async function fetchPromoBanners(): Promise<PromoBanner[]> {
  try {
    const res = await apiClient.get('/api/v1/home/banners');
    return res.data?.data || MOCK_PROMO_BANNERS;
  } catch {
    return MOCK_PROMO_BANNERS;
  }
}

export async function fetchHomeMovies(): Promise<MovieCardItem[]> {
  try {
    const res = await apiClient.get('/api/v1/movies');
    return res.data?.data || [...MOCK_MOVIES, ...MOCK_COMING_SOON_MOVIES, ...MOCK_EARLY_TICKET_MOVIES];
  } catch {
    return [...MOCK_MOVIES, ...MOCK_COMING_SOON_MOVIES, ...MOCK_EARLY_TICKET_MOVIES];
  }
}

export async function fetchHomeArticles(): Promise<ArticleItem[]> {
  try {
    const res = await apiClient.get('/api/v1/articles');
    return res.data?.data || MOCK_ARTICLES;
  } catch {
    return MOCK_ARTICLES;
  }
}

export async function fetchHomePromotions(): Promise<PromotionItem[]> {
  try {
    const res = await apiClient.get('/api/v1/promotions');
    return res.data?.data || MOCK_PROMOTIONS;
  } catch {
    return MOCK_PROMOTIONS;
  }
}
