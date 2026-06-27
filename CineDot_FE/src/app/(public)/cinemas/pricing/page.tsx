import type { Metadata } from 'next';
import { CinemaPricingPage } from '@/modules/cinemas/components/CinemaPricingPage';

export const metadata: Metadata = {
  title: 'Bảng Giá Vé — CineDot | Giá Vé Phim Mới Nhất',
  description: 'Xem bảng giá vé CineDot mới nhất: ghế thường, VIP, IMAX, 4DX, Dolby Atmos. Đặt vé online nhận ưu đãi tốt nhất.',
};

export default function CinemaPricingRoutePage() {
  return <CinemaPricingPage />;
}
