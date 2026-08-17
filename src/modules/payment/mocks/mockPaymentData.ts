import { PaymentMethodItem, VoucherInfo } from '../types/payment.types';

export const MOCK_PAYMENT_METHODS: PaymentMethodItem[] = [
  {
    id: 'VNPAY',
    name: 'Cổng Thanh Toán VNPAY',
    subtitle: 'Thanh toán an toàn, quét mã QR qua VNPAY-QR',
    badgeText: 'Khuyên Dùng',
    category: 'wallet',
  },
  {
    id: 'MOMO',
    name: 'Ví Điện Tử MoMo',
    subtitle: 'Thanh toán siêu tốc, nhận ưu đãi hoàn tiền 20% mỗi tuần',
    badgeText: 'Khuyên Dùng',
    category: 'wallet',
  },
  {
    id: 'ZALOPAY',
    name: 'Ví ZaloPay',
    subtitle: 'Giảm ngay 10K cho đơn từ 100K qua ứng dụng Zalo',
    badgeText: 'Ưu Đãi 10K',
    category: 'wallet',
  },
  {
    id: 'SHOPEEPAY',
    name: 'Ví ShopeePay',
    subtitle: 'Nhập mã SPPCINE giảm ngay 15% tổng đơn hàng',
    category: 'wallet',
  },
  {
    id: 'VIETQR',
    name: 'Chuyển Khoản Ngân Hàng VietQR',
    subtitle: 'Quét mã QR Code nhanh chóng từ 40+ ngân hàng Việt Nam',
    badgeText: 'Không Tốn Phí',
    category: 'bank',
  },
  {
    id: 'ATM',
    name: 'Thẻ ATM Nội Địa / Internet Banking',
    subtitle: 'Hỗ trợ tất cả ngân hàng NAPAS tại Việt Nam',
    category: 'bank',
  },
  {
    id: 'VISA',
    name: 'Thẻ Quốc Tế Visa / Mastercard / JCB',
    subtitle: 'Thanh toán bằng thẻ ghi nợ hoặc thẻ tín dụng quốc tế',
    category: 'card',
  },
];

export const MOCK_VOUCHERS: Record<string, VoucherInfo> = {
  'CINEDOT50K': {
    code: 'CINEDOT50K',
    discountAmount: 50000,
    discountType: 'fixed',
    description: 'Giảm ngay 50.000đ cho đơn hàng xem phim bom tấn',
  },
  'MOMODAY': {
    code: 'MOMODAY',
    discountAmount: 20000,
    discountType: 'fixed',
    description: 'Ưu đãi MoMo Day giảm 20.000đ trực tiếp',
  },
  'WELCOME10': {
    code: 'WELCOME10',
    discountAmount: 30000,
    discountType: 'fixed',
    description: 'Mã chào mừng hội viên mới CineDot Star',
  },
};
