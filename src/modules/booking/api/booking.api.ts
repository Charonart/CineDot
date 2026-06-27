import { axiosClient } from '@lib/axios/axiosClient';
import { ApiResponse } from '@shared/types/api.type';
import {
  ApplyVoucherRequestDTO,
  ApplyVoucherResponseDTO,
  BookingShowtimeDTO,
  HoldSeatsRequestDTO,
  HoldSeatsResponseDTO,
  ProcessPaymentRequestDTO,
  ProcessPaymentResponseDTO,
  RemoveVoucherResponseDTO,
  SeatHoldDTO,
  SeatHoldRequestDTO,
  SeatMapDTO,
} from '../dto/booking.dto';

const encodePathSegment = (value: string) => encodeURIComponent(value);

export const bookingApi = {
  // ─── QUERY APIs ──────────────────────────────────────────────────────────────

  getShowtimeDetail: (showtimeId: string, signal?: AbortSignal): Promise<ApiResponse<BookingShowtimeDTO>> =>
    axiosClient.get(`/showtimes/${encodePathSegment(showtimeId)}`, { signal }),

  getSeatMap: (showtimeId: string, signal?: AbortSignal): Promise<ApiResponse<SeatMapDTO>> =>
    axiosClient.get(`/showtimes/${encodePathSegment(showtimeId)}/seats`, { signal }),

  /** @deprecated Dùng holdSeatsAndCreateOrder thay thế */
  createSeatHold: (payload: SeatHoldRequestDTO): Promise<ApiResponse<SeatHoldDTO>> =>
    axiosClient.post('/seat-holds', payload),

  // ─── BƯỚC 1: POST /api/v1/bookings/hold-seats ────────────────────────────────
  /**
   * Tạo đơn hàng, giữ ghế và lưu bắp nước.
   * Trả về `booking_id` để dùng cho các bước tiếp theo.
   */
  holdSeatsAndCreateOrder: (payload: HoldSeatsRequestDTO): Promise<ApiResponse<HoldSeatsResponseDTO>> =>
    axiosClient.post('/bookings/hold-seats', payload),

  // ─── BƯỚC 2: POST /api/v1/bookings/{id}/apply-voucher ───────────────────────
  /**
   * Áp dụng voucher vào đơn hàng đã tạo.
   * Chỉ gọi nếu người dùng có nhập voucher code.
   */
  applyVoucher: (
    bookingId: number,
    payload: ApplyVoucherRequestDTO,
  ): Promise<ApiResponse<ApplyVoucherResponseDTO>> =>
    axiosClient.post(`/bookings/${bookingId}/apply-voucher`, payload),

  // ─── BƯỚC 2.5: POST /api/v1/bookings/{id}/remove-voucher ────────────────────
  /**
   * Hủy áp dụng voucher khỏi đơn hàng.
   */
  removeVoucher: (bookingId: number): Promise<ApiResponse<RemoveVoucherResponseDTO>> =>
    axiosClient.post(`/bookings/${bookingId}/remove-voucher`),

  // ─── BƯỚC 3: POST /api/v1/payments ───────────────────────────────────────────
  /**
   * Khởi tạo giao dịch thanh toán.
   * Trả về payment_url (redirect) hoặc xác nhận thành công ngay.
   */
    processPayment: (payload: ProcessPaymentRequestDTO): Promise<ApiResponse<ProcessPaymentResponseDTO>> => {
    return axiosClient.post('/payments', payload).then((res: any) => res.data ?? res);
  },
};

