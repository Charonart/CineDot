import { axiosClient } from '@lib/axios/axiosClient';
import { ApiResponse } from '@shared/types/api.type';
import { ProductListResponseDTO } from '../dto/star-shop.dto';

export const starShopApi = {
  getProducts: (params?: { category?: string; page?: number }): Promise<ApiResponse<ProductListResponseDTO>> =>
    axiosClient.get('/star-shop/products', { params }),
};
