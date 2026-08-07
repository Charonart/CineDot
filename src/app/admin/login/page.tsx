import React from 'react';
import { AdminLoginForm } from '@/modules/admin/components/AdminLoginForm';

export const metadata = {
  title: 'Đăng Nhập Quản Trị Hệ Thống - CineDot Admin Portal',
  description: 'Cổng đăng nhập hệ thống quản trị rạp chiếu phim CineDot.',
};

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
