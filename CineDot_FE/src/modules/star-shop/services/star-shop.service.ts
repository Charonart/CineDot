import { starShopApi } from '../api/star-shop.api';
import { productMapper } from '../mappers/star-shop.mapper';
import { ProductList } from '../types/star-shop.type';
import { productListResponseSchema } from '../schemas/star-shop.schema';
import { logger } from '@lib/logger/logger';

export const starShopService = {
  getProducts: async (params?: { category?: string; page?: number }): Promise<ProductList> => {
    try {
      const response = await starShopApi.getProducts(params);
      const validatedData = productListResponseSchema.parse(response.data);
      return productMapper.toProductListModel(validatedData);
    } catch (error) {
      logger.error('[StarShopService] getProducts failed:', error);
      throw new Error('FAILED_TO_LOAD_PRODUCTS');
    }
  },
};
