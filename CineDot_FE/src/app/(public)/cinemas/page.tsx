import type { Metadata } from 'next';
import { CinemasPage } from '@/modules/cinemas/components/CinemasPage';

export const metadata: Metadata = {
  title: 'Hệ Thống Rạp CineDot — Danh Sách Rạp Toàn Quốc',
  description: 'Khám phá hệ thống 14+ rạp chiếu phim CineDot toàn quốc với công nghệ IMAX, 4DX, Dolby Atmos hiện đại.',
};

export default function CinemasRootPage() {
  return <CinemasPage />;
}
