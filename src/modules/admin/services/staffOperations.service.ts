import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { ApiResponse } from '@/shared/types/api.types';

export interface CheckInResult {
  success: boolean;
  message: string;
  data?: {
    booking_code: string;
    movie_title: string;
    show_time: string;
    cinema_name: string;
    room_name: string;
    seats: string[];
    customer_name: string;
    checked_in_at: string;
  };
}

export interface ClaimFnbResult {
  success: boolean;
  message: string;
  data?: {
    booking_code: string;
    claimed_combos: { name: string; quantity: number }[];
    claimed_at: string;
  };
}

export const staffOperationsService = {
  /**
   * Quét mã QR Soát vé (Check-in QR)
   */
  async checkInByQr(qrData: string): Promise<CheckInResult> {
    try {
      const res = await apiClient.post<ApiResponse<any>>(ENDPOINTS.STAFF.CHECKIN_QR, {
        qr_data: qrData,
      });
      return {
        success: res.data?.success ?? true,
        message: res.data?.message || 'Soát vé thành công',
        data: res.data?.data,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Mã QR không hợp lệ hoặc vé đã được sử dụng trước đó.',
      };
    }
  },

  /**
   * Soát vé theo Mã Booking Code (Nhập tay)
   */
  async checkInByCode(bookingCode: string): Promise<CheckInResult> {
    try {
      const res = await apiClient.post<ApiResponse<any>>(
        ENDPOINTS.STAFF.CHECKIN_CODE(bookingCode.trim())
      );
      return {
        success: res.data?.success ?? true,
        message: res.data?.message || 'Soát vé thành công',
        data: res.data?.data,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Mã đặt vé không tồn tại hoặc đã được check-in.',
      };
    }
  },

  /**
   * Xác nhận Giao Combo Bắp Nước (Claim F&B)
   */
  async claimFnb(bookingCode: string, comboId?: number | string): Promise<ClaimFnbResult> {
    try {
      const res = await apiClient.post<ApiResponse<any>>(ENDPOINTS.STAFF.CLAIM_FNB, {
        booking_code: bookingCode.trim(),
        combo_id: comboId,
      });
      return {
        success: res.data?.success ?? true,
        message: res.data?.message || 'Xác nhận giao F&B thành công',
        data: res.data?.data,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Không thể xác nhận giao F&B',
      };
    }
  },

  /**
   * Bán vé & Combo Trực tiếp tại Quầy POS
   */
  async createPosOrder(payload: {
    showtime_id: number | string;
    seat_ids: (number | string)[];
    combos?: { combo_id: number | string; quantity: number }[];
    payment_method?: string;
  }): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const res = await apiClient.post<ApiResponse<any>>(ENDPOINTS.STAFF.POS_CREATE_ORDER, payload);
      return {
        success: res.data?.success ?? true,
        message: res.data?.message || 'Tạo đơn POS thành công',
        data: res.data?.data,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Không thể tạo đơn hàng tại quầy POS',
      };
    }
  },
};
