import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { SeatTypeDTO, CreateSeatTypePayload, UpdateSeatTypePayload } from '../dto/adminSeatType.dto';
import { AdminSeatTypeItem } from '../types/adminSeatType.types';

export const adminSeatTypeService = {
  /**
   * Fetch all seat types for Admin management
   */
  async fetchAdminSeatTypes(): Promise<AdminSeatTypeItem[]> {
    const res = await apiClient.get<{ success: boolean; data: SeatTypeDTO[] }>(
      ENDPOINTS.ADMIN.SEAT_TYPES
    );
    const rawList = res.data?.data || [];

    return rawList.map((dto) => ({
      key: dto.seat_type,
      name: dto.type_name,
      surcharge: Number(dto.surcharge_amount) || 0,
      color: dto.color_code || '#64748B',
      icon: dto.icon_name || 'seat',
      description: dto.description || undefined,
      isActive: Boolean(dto.is_active),
      sortOrder: Number(dto.sort_order) || 0,
    }));
  },

  /**
   * Fetch public active seat types
   */
  async fetchPublicSeatTypes(): Promise<AdminSeatTypeItem[]> {
    const res = await apiClient.get<{ success: boolean; data: SeatTypeDTO[] }>(
      ENDPOINTS.CINEMAS.SEAT_TYPES
    );
    const rawList = res.data?.data || [];

    return rawList.map((dto) => ({
      key: dto.seat_type,
      name: dto.type_name,
      surcharge: Number(dto.surcharge_amount) || 0,
      color: dto.color_code || '#64748B',
      icon: dto.icon_name || 'seat',
      description: dto.description || undefined,
      isActive: Boolean(dto.is_active),
      sortOrder: Number(dto.sort_order) || 0,
    }));
  },

  /**
   * Create a new seat type
   */
  async createSeatType(payload: CreateSeatTypePayload): Promise<AdminSeatTypeItem> {
    const res = await apiClient.post<{ success: boolean; data: SeatTypeDTO; message?: string }>(
      ENDPOINTS.ADMIN.SEAT_TYPES,
      payload
    );
    const dto = res.data.data;
    return {
      key: dto.seat_type,
      name: dto.type_name,
      surcharge: Number(dto.surcharge_amount) || 0,
      color: dto.color_code || '#64748B',
      icon: dto.icon_name || 'seat',
      description: dto.description || undefined,
      isActive: Boolean(dto.is_active),
      sortOrder: Number(dto.sort_order) || 0,
    };
  },

  /**
   * Update an existing seat type
   */
  async updateSeatType(seatTypeKey: string, payload: UpdateSeatTypePayload): Promise<AdminSeatTypeItem> {
    const res = await apiClient.put<{ success: boolean; data: SeatTypeDTO; message?: string }>(
      ENDPOINTS.ADMIN.SEAT_TYPE_DETAIL(seatTypeKey),
      payload
    );
    const dto = res.data.data;
    return {
      key: dto.seat_type,
      name: dto.type_name,
      surcharge: Number(dto.surcharge_amount) || 0,
      color: dto.color_code || '#64748B',
      icon: dto.icon_name || 'seat',
      description: dto.description || undefined,
      isActive: Boolean(dto.is_active),
      sortOrder: Number(dto.sort_order) || 0,
    };
  },

  /**
   * Delete a seat type
   */
  async deleteSeatType(seatTypeKey: string): Promise<{ success: boolean; message?: string }> {
    const res = await apiClient.delete<{ success: boolean; message?: string }>(
      ENDPOINTS.ADMIN.SEAT_TYPE_DETAIL(seatTypeKey)
    );
    return res.data;
  },
};
