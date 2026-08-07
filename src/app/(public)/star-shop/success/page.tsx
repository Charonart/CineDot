import React from 'react';
import { StarShopSuccessClientPage, PurchasedItem } from '@/modules/star-shop/components/StarShopSuccessClientPage';

interface StarShopSuccessPageProps {
  searchParams: Promise<{
    order_id?: string;
    total?: string;
    cinema?: string;
    items?: string;
  }>;
}

export const metadata = {
  title: 'Đặt Đơn Hàng Star Shop Thành Công - CineDot Rạp Phim IMAX',
  description: 'Xác nhận đơn hàng vật phẩm điện ảnh Star Shop thành công. Lấy mã QR Code quét nhận quà trực tiếp tại quầy rạp CineDot.',
};

export default async function StarShopSuccessPage({ searchParams }: StarShopSuccessPageProps) {
  const { order_id, total, cinema, items } = await searchParams;

  let parsedItems: PurchasedItem[] | undefined = undefined;
  if (items) {
    try {
      parsedItems = JSON.parse(decodeURIComponent(items));
    } catch {
      parsedItems = undefined;
    }
  }

  return (
    <StarShopSuccessClientPage
      orderId={order_id || 'ST-892104'}
      totalAmount={total ? parseInt(total, 10) : 4790000}
      cinemaName={cinema ? decodeURIComponent(cinema) : 'Galaxy CineX Hanoi Centre'}
      purchasedItems={parsedItems}
    />
  );
}
