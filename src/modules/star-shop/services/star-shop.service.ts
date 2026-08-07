import { StarShopProduct, StarShopCategory } from '../types/star-shop.types';
import { MOCK_STAR_SHOP_PRODUCTS } from '../mocks/mockStarShopData';

export async function fetchStarShopProducts(category: StarShopCategory = 'ALL'): Promise<StarShopProduct[]> {
  await new Promise((res) => setTimeout(res, 150));
  if (category === 'ALL') return MOCK_STAR_SHOP_PRODUCTS;
  return MOCK_STAR_SHOP_PRODUCTS.filter((p) => p.category === category);
}

export async function fetchProductBySlug(slug: string): Promise<StarShopProduct | null> {
  await new Promise((res) => setTimeout(res, 100));
  return MOCK_STAR_SHOP_PRODUCTS.find((p) => p.slug === slug) || null;
}
