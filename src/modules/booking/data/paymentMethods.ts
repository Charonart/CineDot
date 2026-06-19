import { PaymentMethod } from '../types';

export type PaymentMethodItem = {
  id: PaymentMethod;
  label: string;
  description: string;
};

export const PAYMENT_METHODS: PaymentMethodItem[] = [
  {
    id: 'onepay',
    label: 'OnePay',
    description: 'Visa, Master, JCB, ATM, QR Ngân hàng, Apple Pay',
  },
  {
    id: 'momo',
    label: 'Ví MoMo',
    description: 'Thanh toán nhanh qua ví điện tử MoMo',
  },
  {
    id: 'zalopay',
    label: 'ZaloPay',
    description: 'Thanh toán qua ví ZaloPay',
  },
  {
    id: 'shopeepay',
    label: 'ShopeePay',
    description: 'Ví ShopeePay - ưu đãi theo chiến dịch',
  },
  {
    id: 'atm',
    label: 'Thẻ ATM / Tài khoản ngân hàng',
    description: 'Thanh toán qua tài khoản ngân hàng nội địa',
  },
  {
    id: 'qr',
    label: 'QR ngân hàng',
    description: 'Quét mã QR bằng ứng dụng ngân hàng',
  },
];
