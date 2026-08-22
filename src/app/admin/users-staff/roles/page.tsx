import React from 'react';
import { AdminRolesPermissionMatrixView } from '@/modules/admin/components/users/AdminRolesPermissionMatrixView';

export const metadata = {
  title: 'Ma Trận Phân Quyền RBAC | CineDot Admin Portal',
  description: 'Quản lý danh sách vai trò và ma trận phân quyền RBAC hệ thống rạp chiếu.',
};

export default function AdminRolesPage() {
  return <AdminRolesPermissionMatrixView />;
}
