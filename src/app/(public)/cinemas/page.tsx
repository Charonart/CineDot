import React, { Suspense } from 'react';
import { CinemasClientPage } from '@/modules/cinemas/components/CinemasClientPage';
import { Skeleton } from '@/shared/ui/Skeleton';

export const metadata = {
  title: 'Hệ Thống Rạp & Bảng Giá Vé - CineDot Rạp Phim Đẳng Cấp',
  description: 'Tra cứu danh sách rạp chiếu phim CineDot toàn quốc, xem địa chỉ, chỉ đường bản đồ và bảng giá vé 2D/3D/IMAX quy định.',
};

export default function CinemasPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen pt-32 pb-20 px-8 max-w-[1240px] mx-auto flex flex-col gap-6">
          <Skeleton variant="text" className="w-64 h-10" />
          <Skeleton variant="card" className="w-full h-[400px] rounded-3xl" />
        </div>
      }
    >
      <CinemasClientPage />
    </Suspense>
  );
}
