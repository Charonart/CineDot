import type { Metadata } from 'next';
import { StarShopPage } from '@/modules/star-shop/components/StarShopPage';

export const metadata: Metadata = {
  title: 'Star Shop — CineDot | Merchandise & Quà Tặng Điện Ảnh',
  description: 'Khám phá bộ sưu tập merchandise, quà tặng điện ảnh cao cấp tại Star Shop CineDot. Từ mô hình, poster đến merchandise anime chính hãng.',
};

export default function StarShopRootPage() {
  return <StarShopPage />;
}
