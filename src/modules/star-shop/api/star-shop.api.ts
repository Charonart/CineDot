import { axiosClient } from '@lib/axios/axiosClient';
import { ApiResponse } from '@shared/types/api.type';
import { ProductListResponseDTO, ProductDTO } from '../dto/star-shop.dto';

export const starShopApi = {
  getProducts: (params?: { category?: string; page?: number }): Promise<ApiResponse<ProductListResponseDTO>> =>
    axiosClient.get('/star-shop/products', { params }),
  getProduct: (id: string): Promise<ApiResponse<ProductDTO>> =>
    axiosClient.get(`/star-shop/products/${id}`),
};
