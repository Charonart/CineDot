import { useQuery } from '@tanstack/react-query';
import { starShopService } from '../services/star-shop.service';
import { ProductCategory } from '../types/star-shop.type';

export const starShopKeys = {
  all: ['star-shop'] as const,
  products: () => [...starShopKeys.all, 'products'] as const,
  productsByCategory: (category?: ProductCategory) => [...starShopKeys.products(), { category }] as const,
};

export const useProducts = (category?: ProductCategory) => {
  return useQuery({
    queryKey: starShopKeys.productsByCategory(category),
    queryFn: () => starShopService.getProducts({ category }),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
