import { SelectedSeat, ComboItem, VoucherItem } from '../types';

export function calculateTicketTotal(seats: SelectedSeat[]): number {
  return seats.reduce((total, seat) => total + seat.price, 0);
}

export function calculateComboTotal(combos: ComboItem[]): number {
  return combos.reduce((total, combo) => total + combo.price * combo.quantity, 0);
}

export function calculateFinalTotal(
  ticketTotal: number,
  comboTotal: number,
  discountAmount: number
): number {
  return Math.max(ticketTotal + comboTotal - discountAmount, 0);
}

export type CalculateVoucherDiscountParams = {
  voucher: VoucherItem;
  subtotal: number;
};

export type VoucherDiscountResult = {
  isValid: boolean;
  discountAmount: number;
  message: string;
};

export function calculateVoucherDiscount({
  voucher,
  subtotal,
}: CalculateVoucherDiscountParams): VoucherDiscountResult {
  if (voucher.minOrderValue && subtotal < voucher.minOrderValue) {
    return {
      isValid: false,
      discountAmount: 0,
      message: `Đơn hàng tối thiểu để áp dụng mã này là ${formatCurrencyVND(voucher.minOrderValue)}.`,
    };
  }

  let discount = 0;
  if (voucher.type === 'percent') {
    discount = (subtotal * voucher.value) / 100;
    if (voucher.maxDiscount && discount > voucher.maxDiscount) {
      discount = voucher.maxDiscount;
    }
  } else if (voucher.type === 'fixed') {
    discount = voucher.value;
  }

  // Ensure discount doesn't exceed subtotal
  discount = Math.min(discount, subtotal);

  return {
    isValid: true,
    discountAmount: discount,
    message: 'Áp dụng mã giảm giá thành công.',
  };
}

export function formatCurrencyVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
}
