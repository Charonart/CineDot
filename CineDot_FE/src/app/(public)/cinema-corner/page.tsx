import type { Metadata } from 'next';
import { CinemaCornerPage } from '@/modules/cinema-corner/components/CinemaCornerPage';

export const metadata: Metadata = {
  title: 'Góc Điện Ảnh — CineDot | Bình Luận, Blog & Hậu Trường',
  description: 'Khám phá bình luận phim chuyên sâu, blog điện ảnh và hậu trường độc quyền từ đội ngũ CineDot.',
};

export default function CinemaCornerRootPage() {
  return <CinemaCornerPage />;
}
