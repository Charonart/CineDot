import React from 'react';
import { CartClientPage } from '@/modules/star-shop/components/CartClientPage';

export const metadata = {
  title: 'Giỏ Hàng Star Shop - CineDot Rạp Phim IMAX',
  description: 'Quản lý giỏ hàng vật phẩm điện ảnh, nhập mã voucher ưu đãi và tiến hành thanh toán an toàn tại CineDot Star Shop.',
};

export default function StarShopCartPage() {
  return <CartClientPage />;
}
