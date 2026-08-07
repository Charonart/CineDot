import React from 'react';
import { AdminLayout } from '@/modules/admin/components/AdminLayout';

export const metadata = {
  title: 'Bảng Điều Hành Quản Trị - CineDot Admin Portal',
  description: 'Hệ thống quản lý suất chiếu, bán vé phim và vận hành rạp CineDot.',
};

export default function RootAdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
