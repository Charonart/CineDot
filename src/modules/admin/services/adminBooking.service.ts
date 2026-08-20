import { apiClient } from '@/shared/lib/apiClient';
import { ApiResponse } from '@/shared/types/api.types';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import {
  GetAdminBookingsParams,
  AdminBookingListResponseDTO,
  AdminBookingItemDTO,
  AdminBookingStatsDTO,
  RefundBookingRequestDTO,
} from '../dto/adminBooking.dto';
import {
  AdminBookingItem,
  AdminBookingStats,
  AdminBookingPagination,
} from '../types/adminBooking.types';
import { adminBookingMapper } from '../mappers/adminBooking.mapper';

export const adminBookingService = {
  /**
   * Lấy danh sách đơn đặt vé phân trang & tìm kiếm & lọc
   */
  async getBookings(
    params?: GetAdminBookingsParams
  ): Promise<{ items: AdminBookingItem[]; pagination: AdminBookingPagination }> {
    const queryParams: Record<string, any> = {};
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.per_page) queryParams.limit = params.per_page;
    if (params?.status && params.status !== 'ALL') queryParams.status = params.status;
    if (params?.search) queryParams.search = params.search;
    if (params?.cinema_id) queryParams.cinema_id = params.cinema_id;

    const res = await apiClient.get<ApiResponse<AdminBookingListResponseDTO>>(
      ENDPOINTS.ADMIN.BOOKINGS,
      { params: queryParams }
    );

    const rawData = res.data?.data;
    const rawList = Array.isArray(rawData?.data) ? rawData.data : [];

    const items = rawList.map((dto: AdminBookingItemDTO) => adminBookingMapper.toDomain(dto));
    const pagination: AdminBookingPagination = {
      currentPage: Number(rawData?.current_page || 1),
      totalPages: Number(rawData?.last_page || 1),
      totalResults: Number(rawData?.total || items.length),
      perPage: Number(rawData?.per_page || 15),
    };

    return { items, pagination };
  },

  /**
   * Lấy chi tiết đơn đặt vé theo ID
   */
  async getBookingDetail(id: number | string): Promise<AdminBookingItem> {
    const res = await apiClient.get<ApiResponse<AdminBookingItemDTO>>(
      ENDPOINTS.ADMIN.BOOKING_DETAIL(id)
    );

    if (!res.data?.data) {
      throw new Error(res.data?.message || 'Không tìm thấy đơn đặt vé.');
    }

    return adminBookingMapper.toDomain(res.data.data);
  },

  /**
   * Thống kê tổng hợp số liệu đơn đặt vé
   */
  async getBookingStats(): Promise<AdminBookingStats> {
    try {
      const res = await apiClient.get<ApiResponse<AdminBookingStatsDTO>>(
        ENDPOINTS.ADMIN.BOOKINGS_STATS
      );

      if (res.data?.data) {
        return adminBookingMapper.statsToDomain(res.data.data);
      }
    } catch {
      // fallback
    }

    return {
      totalBookings: 0,
      totalRevenue: 0,
      todayRevenue: 0,
      totalCheckedIn: 0,
      totalRefunded: 0,
      checkInRate: 0,
    };
  },

  /**
   * Xử lý hoàn tiền sự cố (Admin Refund)
   */
  async refundBooking(id: number | string, reason: string): Promise<{ message: string }> {
    const payload: RefundBookingRequestDTO = { reason };
    const res = await apiClient.post<ApiResponse<null>>(
      ENDPOINTS.ADMIN.BOOKING_REFUND(id),
      payload
    );

    return {
      message: res.data?.message || 'Xử lý hoàn tiền sự cố thành công.',
    };
  },
};
