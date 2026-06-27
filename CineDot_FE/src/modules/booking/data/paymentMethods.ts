import { PaymentMethod } from '../types';

export type PaymentMethodItem = {
  id: PaymentMethod;
  label: string;
  description: string;
  logoUrl?: string;
};

export const PAYMENT_METHODS: PaymentMethodItem[] = [
  {
    id: 'zalopay',
    label: 'ZaloPay',
    description: 'Thanh toán qua ví ZaloPay',
    logoUrl: 'https://static.wikia.nocookie.net/logos/images/3/30/ZaloPay_logo.png/revision/latest?cb=20211231001517&path-prefix=vi',
  },
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
