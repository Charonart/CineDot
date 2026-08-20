import React from 'react';
import { AdminUserTiersView } from '@/modules/admin/components/users/AdminUserTiersView';

export const metadata = {
  title: 'Hạng Thành Viên & Điểm Thưởng | CineDot Admin Portal',
  description: 'Quản lý chính sách cấp bậc hội viên, ngưỡng điểm thăng hạng và chiết khấu ưu đãi.',
};

export default function AdminUserTiersPage() {
  return <AdminUserTiersView />;
}
