import { StarShopProduct, StarShopCategory } from '../types/star-shop.types';
import { MOCK_STAR_SHOP_PRODUCTS } from '../mocks/mockStarShopData';
import { APP_CONFIG } from '@/shared/constants/config';

export async function fetchStarShopProducts(category: StarShopCategory = 'ALL'): Promise<StarShopProduct[]> {
  await new Promise((res) => setTimeout(res, 150));
  if (!APP_CONFIG.USE_MOCK_DATA) return [];
  if (category === 'ALL') return MOCK_STAR_SHOP_PRODUCTS;
  return MOCK_STAR_SHOP_PRODUCTS.filter((p) => p.category === category);
}

export async function fetchProductBySlug(slug: string): Promise<StarShopProduct | null> {
  await new Promise((res) => setTimeout(res, 100));
  if (!APP_CONFIG.USE_MOCK_DATA) return null;
  return MOCK_STAR_SHOP_PRODUCTS.find((p) => p.slug === slug) || null;
}
