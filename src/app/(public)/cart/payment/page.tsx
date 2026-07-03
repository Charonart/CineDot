import React from 'react';
import { Metadata } from 'next';
import { ProductPaymentPage } from '@/modules/star-shop/components/ProductPaymentPage';

export const metadata: Metadata = {
  title: 'Thanh toán đơn hàng | CineDot',
  description: 'Thanh toán và chọn rạp nhận sản phẩm Star Shop từ CineDot.',
};

export default function Page() {
  return <ProductPaymentPage />;
}
