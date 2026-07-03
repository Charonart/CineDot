import React from 'react';
import { Metadata } from 'next';
import { CartPage } from '@/modules/star-shop/components/CartPage';

export const metadata: Metadata = {
  title: 'Giỏ hàng | CineDot',
  description: 'Quản lý giỏ hàng và tiến hành thanh toán các sản phẩm Star Shop độc quyền từ CineDot.',
};

export default function Page() {
  return <CartPage />;
}
