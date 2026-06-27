import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { appRoutes } from '@/shared/routes/appRoutes';

export const metadata: Metadata = {
  title: 'Rạp Đặc Biệt — CineDot | IMAX, 4DX, Dolby Atmos',
  description: 'Trải nghiệm điện ảnh đỉnh cao tại các phòng chiếu đặc biệt CineDot: IMAX, 4DX, Dolby Atmos và Cine de Kids.',
};

export default function SpecialTheatersRootPage() {
  // Redirect to IMAX as the flagship/default special theater
  redirect(appRoutes.specialTheaterType('imax'));
}
