import { Metadata } from 'next';
import { ProfilePageClient } from '@/modules/profile/components/ProfilePageClient';

export const metadata: Metadata = {
  title: 'Tài Khoản Của Tôi | CineDot',
  description: 'Quản lý thông tin tài khoản, xem lịch sử vé và điểm thưởng CineDot của bạn.',
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}
