import { apiClient } from '@/shared/lib/apiClient';
import { ApiResponse } from '@/shared/types/api.types';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import {
  AdminCinemaItemDTO,
  AdminCinemaListResponseDTO,
  AdminRoomItemDTO,
  CreateCinemaRequestDTO,
  UpdateCinemaRequestDTO,
  CreateRoomRequestDTO,
  UpdateRoomRequestDTO,
  ProvinceItemDTO,
  ProvinceListResponseDTO,
} from '../dto/adminCinema.dto';
import {
  AdminCinemaItem,
  AdminRoomItem,
  ProvinceOption,
  AdminCinemaPagination,
} from '../types/adminCinema.types';
import { adminCinemaMapper } from '../mappers/adminCinema.mapper';

export interface GetAdminCinemasParams {
  search?: string;
  province_id?: number;
  page?: number;
  per_page?: number;
  limit?: number;
}

export const adminCinemaService = {
  /**
   * Lấy danh mục Tỉnh / Thành phố
   */
  async getProvinces(): Promise<ProvinceOption[]> {
    try {
      const res = await apiClient.get<ApiResponse<ProvinceListResponseDTO | ProvinceItemDTO[]>>(
        ENDPOINTS.MASTER.PROVINCES
      );
      const data = res.data?.data;
      let rawList: ProvinceItemDTO[] = [];

      if (Array.isArray(data)) {
        rawList = data;
      } else if (data && Array.isArray((data as ProvinceListResponseDTO).results)) {
        rawList = (data as ProvinceListResponseDTO).results!;
      } else if (data && Array.isArray((data as ProvinceListResponseDTO).data)) {
        rawList = (data as ProvinceListResponseDTO).data!;
      }

      return rawList.map((p) => adminCinemaMapper.provinceToDomain(p));
    } catch {
      return [];
    }
  },

  /**
   * Lấy danh sách cụm rạp (GET /api/v1/admin/cinemas)
   */
  async getCinemas(
    params?: GetAdminCinemasParams & { sort_by?: string; sort_dir?: 'asc' | 'desc'; filters?: Record<string, any>; [key: string]: any },
    provincesMap?: Record<number, string>
  ): Promise<{
    items: AdminCinemaItem[];
    pagination: AdminCinemaPagination;
  }> {
    const res = await apiClient.get<any>(ENDPOINTS.ADMIN.CINEMAS, { params });
    const data = res.data?.data;
    const meta = res.data?.meta;

    let rawList: AdminCinemaItemDTO[] = [];
    if (Array.isArray(data)) {
      rawList = data;
    } else if (data && Array.isArray(data.data)) {
      rawList = data.data;
    } else if (data && Array.isArray(data.results)) {
      rawList = data.results;
    }

    const items = rawList.map((dto) => adminCinemaMapper.cinemaToDomain(dto, provincesMap));
    const pagination: AdminCinemaPagination = {
      currentPage: meta?.current_page || data?.current_page || data?.page || 1,
      totalPages: meta?.last_page || data?.last_page || data?.totalPages || 1,
      totalResults: meta?.total || data?.total || data?.totalResults || items.length,
    };

    return { items, pagination };
  },

  async updateCell(id: number | string, field: string, value: any): Promise<AdminCinemaItem> {
    const res = await apiClient.patch<ApiResponse<AdminCinemaItemDTO>>(
      `/api/v1/admin/cinemas/${id}/cell`,
      { field, value }
    );
    return adminCinemaMapper.cinemaToDomain(res.data.data);
  },

  async toggleCinemaStatus(id: number | string): Promise<AdminCinemaItem> {
    const res = await apiClient.patch<ApiResponse<AdminCinemaItemDTO>>(
      `/api/v1/admin/cinemas/${id}/toggle-status`
    );
    return adminCinemaMapper.cinemaToDomain(res.data.data);
  },

  async bulkAction(
    action: 'delete' | 'set_active' | 'set_inactive',
    ids: (string | number)[],
    payload?: any
  ): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.post<{ success: boolean; message: string }>(
      '/api/v1/admin/cinemas/bulk',
      { action, ids, payload }
    );
    return res.data;
  },

  /**
   * Lấy chi tiết 1 cụm rạp kèm danh sách phòng (GET /api/v1/admin/cinemas/{id})
   */
  async getCinemaDetail(id: number | string, provincesMap?: Record<number, string>): Promise<AdminCinemaItem> {
    const url = `${ENDPOINTS.ADMIN.CINEMAS}/${id}`;
    const res = await apiClient.get<ApiResponse<AdminCinemaItemDTO>>(url);
    const data = res.data?.data;
    if (!data) {
      throw new Error('Không tìm thấy thông tin cụm rạp');
    }
    return adminCinemaMapper.cinemaToDomain(data, provincesMap);
  },

  /**
   * Tạo cụm rạp mới (POST /api/v1/admin/cinemas)
   */
  async createCinema(payload: CreateCinemaRequestDTO): Promise<AdminCinemaItem> {
    const res = await apiClient.post<ApiResponse<AdminCinemaItemDTO>>(ENDPOINTS.ADMIN.CINEMAS, payload);
    const data = res.data?.data;
    if (!data) {
      throw new Error(res.data?.message || 'Không thể tạo cụm rạp mới');
    }
    return adminCinemaMapper.cinemaToDomain(data);
  },

  /**
   * Cập nhật cụm rạp (PUT /api/v1/admin/cinemas/{id})
   */
  async updateCinema(id: number | string, payload: UpdateCinemaRequestDTO): Promise<AdminCinemaItem> {
    const url = `${ENDPOINTS.ADMIN.CINEMAS}/${id}`;
    const res = await apiClient.put<ApiResponse<AdminCinemaItemDTO>>(url, payload);
    const data = res.data?.data;
    if (!data) {
      throw new Error(res.data?.message || 'Không thể cập nhật cụm rạp');
    }
    return adminCinemaMapper.cinemaToDomain(data);
  },

  /**
   * Xóa cụm rạp (DELETE /api/v1/admin/cinemas/{id})
   */
  async deleteCinema(id: number | string): Promise<boolean> {
    const url = `${ENDPOINTS.ADMIN.CINEMAS}/${id}`;
    await apiClient.delete(url);
    return true;
  },

  /**
   * Lấy danh sách phòng chiếu của cụm rạp (GET /api/v1/admin/cinemas/{cinemaId}/rooms)
   */
  async getCinemaRooms(cinemaId: number | string): Promise<AdminRoomItem[]> {
    const url = `${ENDPOINTS.ADMIN.CINEMAS}/${cinemaId}/rooms`;
    const res = await apiClient.get<ApiResponse<AdminRoomItemDTO[]>>(url);
    const rawRooms: AdminRoomItemDTO[] = Array.isArray(res.data?.data) ? res.data.data : [];
    return rawRooms.map((r: AdminRoomItemDTO) => adminCinemaMapper.roomToDomain(r, Number(cinemaId)));
  },

  /**
   * Tạo phòng chiếu mới (POST /api/v1/admin/cinemas/{cinemaId}/rooms)
   */
  async createRoom(cinemaId: number | string, payload: CreateRoomRequestDTO): Promise<AdminRoomItem> {
    const url = `${ENDPOINTS.ADMIN.CINEMAS}/${cinemaId}/rooms`;
    const res = await apiClient.post<ApiResponse<AdminRoomItemDTO>>(url, payload);
    const data = res.data?.data;
    if (!data) {
      throw new Error(res.data?.message || 'Không thể tạo phòng chiếu mới');
    }
    return adminCinemaMapper.roomToDomain(data, Number(cinemaId));
  },

  /**
   * Cập nhật phòng chiếu & sơ đồ ghế (PUT /api/v1/admin/rooms/{roomId})
   */
  async updateRoom(roomId: number | string, payload: UpdateRoomRequestDTO): Promise<AdminRoomItem> {
    const url = `/admin/rooms/${roomId}`;
    const res = await apiClient.put<ApiResponse<AdminRoomItemDTO>>(url, payload);
    const data = res.data?.data;
    if (!data) {
      throw new Error(res.data?.message || 'Không thể cập nhật phòng chiếu');
    }
    return adminCinemaMapper.roomToDomain(data);
  },

  /**
   * Xóa phòng chiếu (DELETE /api/v1/admin/rooms/{roomId})
   */
  async deleteRoom(roomId: number | string): Promise<boolean> {
    const url = `/admin/rooms/${roomId}`;
    await apiClient.delete(url);
    return true;
  },
};
