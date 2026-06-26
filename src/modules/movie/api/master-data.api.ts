import { axiosClient } from '@lib/axios/axiosClient';
import { ApiResponse } from '@shared/types/api.type';
import {
  ProvinceListDTO,
  PersonDTO,
  ComboListDTO,
} from '../dto/master-data.dto';

/**
 * masterDataApi — Master Data endpoints (Provinces, Persons, Combos)
 * Khớp 100% với Postman spec (Master Data group).
 */
export const masterDataApi = {
  /**
   * GET /api/v1/provinces
   * Lấy danh sách tỉnh/thành phố (dùng cho bộ lọc rạp chiếu).
   */
  getProvinces: (): Promise<ApiResponse<ProvinceListDTO>> =>
    axiosClient.get('/api/v1/provinces'),

  /**
   * GET /api/v1/persons/:id
   * Lấy thông tin chi tiết của một diễn viên / đạo diễn.
   */
  getPerson: (id: number): Promise<ApiResponse<PersonDTO>> =>
    axiosClient.get(`/api/v1/persons/${id}`),

  /**
   * GET /api/v1/combos
   * Lấy danh sách combo bắp nước (dùng cho bước chọn F&B trong booking flow).
   */
  getCombos: (): Promise<ApiResponse<ComboListDTO>> =>
    axiosClient.get('/api/v1/combos'),
};
