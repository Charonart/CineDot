import { apiClient } from '@/shared/lib/apiClient';
import { ApiResponse } from '@/shared/types/api.types';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import {
  ScanTicketRequestDTO,
  ScanTicketResponseDTO,
  ClaimFnbRequestDTO,
  RecentScanItemDTO,
} from '../dto/adminTicketScanner.dto';
import { ScannedTicketDetail, RecentScanItem } from '../types/adminTicketScanner.types';
import { adminTicketScannerMapper } from '../mappers/adminTicketScanner.mapper';

export const adminTicketScannerService = {
  /**
   * 1. Tra cứu thông tin vé qua QR hoặc mã vé (Chưa cập nhật checked_in_at)
   */
  async lookupTicket(codeOrQr: string): Promise<ScannedTicketDetail> {
    const payload: ScanTicketRequestDTO = {
      qr_data: codeOrQr,
      code: codeOrQr,
      booking_code: codeOrQr,
    };

    const res = await apiClient.post<ApiResponse<ScanTicketResponseDTO>>(
      ENDPOINTS.ADMIN.TICKETS_LOOKUP,
      payload
    );

    if (!res.data?.data) {
      throw new Error(res.data?.message || 'Không tìm thấy thông tin vé.');
    }

    return adminTicketScannerMapper.toDomain(res.data.data);
  },

  /**
   * 2. Xác nhận khách đã vào phòng chiếu (Cập nhật checked_in_at = now())
   */
  async checkInTicket(codeOrQr: string): Promise<ScannedTicketDetail> {
    const payload: ScanTicketRequestDTO = {
      qr_data: codeOrQr,
      code: codeOrQr,
      booking_code: codeOrQr,
    };

    const res = await apiClient.post<ApiResponse<ScanTicketResponseDTO>>(
      ENDPOINTS.ADMIN.TICKETS_CHECK_IN,
      payload
    );

    if (!res.data?.data) {
      throw new Error(res.data?.message || 'Không thể xác nhận soát vé.');
    }

    return adminTicketScannerMapper.toDomain(res.data.data);
  },

  /**
   * Quét mã QR hoặc mã đơn vé để soát vé trực tiếp (tương thích backward)
   */
  async scanTicket(codeOrQr: string): Promise<ScannedTicketDetail> {
    return this.checkInTicket(codeOrQr);
  },

  /**
   * Xác nhận trả Combo Bắp Nước cho khách hàng (is_claimed = true)
   */
  async claimFnb(bookingComboId: number): Promise<{ message: string }> {
    const payload: ClaimFnbRequestDTO = {
      booking_combo_id: bookingComboId,
    };

    const res = await apiClient.post<ApiResponse<null>>(
      ENDPOINTS.ADMIN.TICKETS_CLAIM_FNB,
      payload
    );

    return {
      message: res.data?.message || 'Đã xác nhận trả Combo bắp nước thành công.',
    };
  },

  /**
   * Lấy danh sách các vé vừa được soát thành công gần nhất
   */
  async getRecentScans(limit = 15): Promise<RecentScanItem[]> {
    try {
      const res = await apiClient.get<ApiResponse<RecentScanItemDTO[]>>(
        `${ENDPOINTS.ADMIN.TICKETS_RECENT_SCANS}?limit=${limit}`
      );

      const list = res.data?.data || [];
      return list.map((item: RecentScanItemDTO) => adminTicketScannerMapper.recentScanToDomain(item));
    } catch {
      return [];
    }
  },
};
