import React from 'react';
import { AdminCustomersView } from '@/modules/admin/components/users/AdminCustomersView';

export const metadata = {
  title: 'Khách Hàng & Hội Viên | CineDot Admin Portal',
  description: 'Quản lý danh sách khách hàng, điểm tích lũy và hồ sơ hội viên CineDot.',
};

export default function AdminCustomersPage() {
  return <AdminCustomersView />;
}
