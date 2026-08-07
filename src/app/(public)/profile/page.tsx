import React from 'react';
import { ProfileTicketsClientPage } from '@/modules/profile/components/ProfileTicketsClientPage';

export const metadata = {
  title: 'Vé Của Tôi - Quản Lý Trang Cá Nhân CineDot Star',
  description: 'Quản lý vé xem phim điện tử QR Code, lịch sử giao dịch và điểm thưởng hội viên tại rạp CineDot.',
};

export default function ProfilePage() {
  return <ProfileTicketsClientPage />;
}
