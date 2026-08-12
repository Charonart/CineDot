import React from 'react';
import { StarShopPaymentClientPage } from '@/modules/star-shop/components/StarShopPaymentClientPage';

export const metadata = {
  title: 'Thanh Toán Đơn Hàng Star Shop - CineDot Rạp Phim IMAX',
  description: 'Xác nhận thông tin nhận hàng tại rạp, chọn phương thức thanh toán MoMo, ZaloPay, VietQR và hoàn tất mua vật phẩm điện ảnh tại CineDot Star Shop.',
};

export default function StarShopPaymentPage() {
  return <StarShopPaymentClientPage />;
}
