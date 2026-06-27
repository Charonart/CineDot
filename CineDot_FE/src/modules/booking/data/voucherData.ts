import { VoucherItem } from '../types';

export const VOUCHER_ITEMS: VoucherItem[] = [
  {
    code: 'CINE10',
    label: 'Giảm 10%',
    description: 'Giảm 10% tổng giá trị đơn hàng.',
    type: 'percent',
    value: 10,
    maxDiscount: 50000,
    minOrderValue: 100000,
  },
  {
    code: 'CINE50K',
    label: 'Giảm 50.000đ',
    description: 'Giảm trực tiếp 50.000đ cho đơn từ 200.000đ.',
    type: 'fixed',
    value: 50000,
    minOrderValue: 200000,
  },
  {
    code: 'MEMBER15',
    label: 'Ưu đãi thành viên',
    description: 'Giảm 15% cho thành viên CINE.',
    type: 'percent',
    value: 15,
    maxDiscount: 70000,
    minOrderValue: 150000,
  },
];

/**
 * Finds a voucher by its code. Case-insensitive and trims input whitespace.
 */
export function findVoucherByCode(code: string): VoucherItem | undefined {
  if (!code) return undefined;
  const cleanCode = code.trim().toUpperCase();
  return VOUCHER_ITEMS.find((v) => v.code === cleanCode);
}
