import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { VoucherInfo } from '../types/payment.types';
import { MOCK_VOUCHERS } from '../mocks/mockPaymentData';
import { APP_CONFIG } from '@/shared/constants/config';
import { resetBookingTimer } from '@/modules/booking/services/bookingTimerService';
import { ApiResponse } from '@/shared/types/api.types';

export interface CalculateSummaryPayload {
  showtime_id: number | string;
  showtime_seat_ids?: number[];
  seats?: string;
  seat_codes?: string[];
  combos?: { combo_id: number; quantity: number }[];
  voucher_code?: string;
}

export interface CalculateSummaryResult {
  booking_summary: {
    booking_code: string;
    showtime_id: number;
    user_id: number;
  };
  items: {
    tickets: Array<{
      showtime_seat_id: number;
      seat_number: string;
      seat_type: string;
      base_price: number;
      surcharge: number;
      applied_rule?: {
        rule_id: number;
        name: string;
        modifier_type: string;
        modifier_value: number;
      };
      final_seat_price: number;
    }>;
    combos: Array<{
      combo_id: number;
      name: string;
      unit_price: number;
      quantity: number;
      total_combo_price: number;
    }>;
  };
  financial_breakdown: {
    subtotal_tickets: number;
    subtotal_combos: number;
    total_subtotal: number;
    tier_discount_amount?: number;
    voucher_discount_amount?: number;
    vat_breakdown?: {
      ticket_vat_rate: number;
      ticket_vat_amount: number;
      combo_vat_rate: number;
      combo_vat_amount: number;
      total_vat_amount: number;
      is_included_in_price: boolean;
    };
    discounts?: {
      tier_discount?: {
        tier_name: string;
        discount_percent: number;
        deducted_amount: number;
      };
      voucher_discount?: {
        voucher_code: string;
        discount_type?: string;
        deducted_amount: number;
      };
    };
    total_discount_amount: number;
    final_amount_to_pay: number;
  };
}

export async function calculateBookingSummary(
  payload: CalculateSummaryPayload
): Promise<CalculateSummaryResult | null> {
  try {
    const res = await apiClient.post(ENDPOINTS.BOOKINGS.CALCULATE_SUMMARY, payload);
    const data = res.data;
    if (data?.success && data?.data?.financial_breakdown) {
      return data.data;
    }
    if (data?.data && data?.data?.financial_breakdown) {
      return data.data;
    }
    if (data?.financial_breakdown) {
      return data;
    }
  } catch (err) {
    console.warn('calculateBookingSummary error:', err);
  }
  return null;
}

export async function validateVoucherCode(
  code: string,
  orderValue: number = 200000
): Promise<VoucherInfo | null> {
  try {
    const res = await apiClient.post<ApiResponse<any>>(ENDPOINTS.VOUCHERS.APPLY_STANDALONE, {
      code: code.trim().toUpperCase(),
      order_amount: orderValue,
    });

    if (res.data?.success && res.data?.data) {
      const d = res.data.data;
      const v = d.voucher || {};
      return {
        code: v.code || code.trim().toUpperCase(),
        discountAmount: Number(d.discount_amount || v.discount_value || 30000),
        discountType: v.discount_type === 'percentage' ? 'percentage' : 'fixed',
        description:
          v.description ||
          `Giảm ${Number(d.discount_amount || 30000).toLocaleString('vi-VN')}đ cho đơn đặt vé`,
        minSpend: v.min_order_value ? Number(v.min_order_value) : undefined,
      };
    }
    throw new Error(res.data?.message || 'Voucher không hợp lệ.');
  } catch (err: any) {
    const msg = err?.response?.data?.data?.message || err?.response?.data?.message || err.message || 'Lỗi kiểm tra voucher.';
    throw new Error(msg);
  }
}

export async function createPaymentGatewayUrl(
  bookingId: number | string,
  gateway: string = 'vnpay',
  combos?: { combo_id: number; quantity: number }[],
  voucherCode?: string
): Promise<string | null> {
  try {
    const res = await apiClient.post(ENDPOINTS.PAYMENTS.CREATE_URL, {
      booking_id: bookingId,
      payment_method: gateway.toUpperCase(),
      combos,
      voucher_code: voucherCode,
    });

    const rd = res.data as any;
    if (rd?.success && (rd?.payment_url || rd?.data?.payment_url)) {
      return rd.payment_url || rd.data.payment_url;
    }
  } catch {
    // Fallback
  }
  return null;
}

export async function processBookingPayment(payload: {
  showtimeId: string;
  movieSlug: string;
  seats: string;
  paymentMethod: string;
  totalAmount: number;
  bookingId?: string | number;
  bookingCode?: string;
  combos?: { combo_id: number; quantity: number }[];
  voucherCode?: string;
}): Promise<{ success: boolean; bookingId: string; paymentUrl?: string }> {
  try {
    // If we have a bookingId, call create payment URL
    if (payload.bookingId) {
      const paymentUrl = await createPaymentGatewayUrl(
        payload.bookingId,
        payload.paymentMethod.toLowerCase(),
        payload.combos,
        payload.voucherCode
      );
      if (paymentUrl) {
        return {
          success: true,
          bookingId: String(payload.bookingId),
          paymentUrl,
        };
      }
    }

    const res = await apiClient.post(ENDPOINTS.PAYMENTS.PROCESS, {
      booking_id: payload.bookingId,
      booking_code: payload.bookingCode,
      showtime_id: payload.showtimeId,
      payment_method: payload.paymentMethod,
      amount: payload.totalAmount,
      combos: payload.combos,
      voucher_code: payload.voucherCode,
    });

    const rd = res.data as any;
    if (rd?.success) {
      const bId = rd.order_id || rd.data?.booking_code || rd.data?.booking_id || payload.bookingId || 'CD-' + Date.now();
      resetBookingTimer(payload.showtimeId);
      return {
        success: true,
        bookingId: String(bId),
        paymentUrl: rd.payment_url || rd.data?.payment_url,
      };
    }
    return { success: false, bookingId: String(payload.bookingId || '') };
  } catch (err: any) {
    console.error('Process booking payment error', err);
    return { success: false, bookingId: String(payload.bookingId || '') };
  }
}
