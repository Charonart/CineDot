import React, { Suspense } from 'react';
import { ProfileTicketsClientPage } from '@/modules/profile/components/ProfileTicketsClientPage';

export const metadata = {
  title: 'Vé Của Tôi - Quản Lý Trang Cá Nhân CineDot Star',
  description: 'Quản lý vé xem phim điện tử QR Code, lịch sử giao dịch và điểm thưởng hội viên tại rạp CineDot.',
};

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-[#FAFAFB] pt-28 pb-20 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#7C6FE8] border-t-transparent animate-spin" />
        </div>
      }
    >
      <ProfileTicketsClientPage />
    </Suspense>
  );
}
