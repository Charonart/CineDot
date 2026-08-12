import { VoucherInfo } from '../types/payment.types';
import { MOCK_VOUCHERS } from '../mocks/mockPaymentData';
import { resetBookingTimer } from '@/modules/booking/services/bookingTimerService';

export async function validateVoucherCode(code: string): Promise<VoucherInfo | null> {
  await new Promise((res) => setTimeout(res, 200));
  const normalized = code.trim().toUpperCase();
  return MOCK_VOUCHERS[normalized] || null;
}

export async function processBookingPayment(payload: {
  showtimeId: string;
  movieSlug: string;
  seats: string;
  paymentMethod: string;
  totalAmount: number;
}): Promise<{ success: boolean; bookingId: string }> {
  await new Promise((res) => setTimeout(res, 1200));
  const randomId = 'CD-' + Math.floor(100000 + Math.random() * 900000);

  // Clear booking timer on success
  resetBookingTimer(payload.showtimeId);

  return {
    success: true,
    bookingId: randomId,
  };
}
