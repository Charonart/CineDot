import { PaymentMethodItem, VoucherInfo } from '../types/payment.types';

export const MOCK_PAYMENT_METHODS: PaymentMethodItem[] = [
  {
    id: 'VNPAY',
    name: 'Cổng Thanh Toán VNPAY',
    subtitle: 'Thanh toán an toàn, quét mã QR qua VNPAY-QR / Thẻ / Tài khoản ngân hàng',
    badgeText: 'Khuyên Dùng',
    category: 'wallet',
  },
  {
    id: 'MOMO',
    name: 'Ví Điện Tử MoMo',
    subtitle: 'Thanh toán siêu tốc qua ứng dụng MoMo',
    category: 'wallet',
    isDisabled: true,
    disabledReason: 'Tạm ẩn / Đang bảo trì',
  },
  {
    id: 'ZALOPAY',
    name: 'Ví ZaloPay',
    subtitle: 'Thanh toán nhanh qua ví điện tử ZaloPay',
    category: 'wallet',
    isDisabled: true,
    disabledReason: 'Tạm ẩn / Đang bảo trì',
  },
  {
    id: 'SHOPEEPAY',
    name: 'Ví ShopeePay',
    subtitle: 'Thanh toán qua ứng dụng ShopeePay',
    category: 'wallet',
    isDisabled: true,
    disabledReason: 'Tạm ẩn / Đang bảo trì',
  },
  {
    id: 'VIETQR',
    name: 'Chuyển Khoản Ngân Hàng VietQR',
    subtitle: 'Quét mã QR Code nhanh chóng từ 40+ ngân hàng Việt Nam',
    category: 'bank',
    isDisabled: true,
    disabledReason: 'Tạm ẩn / Đang bảo trì',
  },
  {
    id: 'ATM',
    name: 'Thẻ ATM Nội Địa / Internet Banking',
    subtitle: 'Hỗ trợ tất cả ngân hàng NAPAS tại Việt Nam',
    category: 'bank',
    isDisabled: true,
    disabledReason: 'Tạm ẩn / Đang bảo trì',
  },
  {
    id: 'VISA',
    name: 'Thẻ Quốc Tế Visa / Mastercard / JCB',
    subtitle: 'Thanh toán bằng thẻ ghi nợ hoặc thẻ tín dụng quốc tế',
    category: 'card',
    isDisabled: true,
    disabledReason: 'Tạm ẩn / Đang bảo trì',
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
