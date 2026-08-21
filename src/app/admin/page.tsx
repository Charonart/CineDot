import React from 'react';
import { AdminMoviesView } from '@/modules/admin/components/AdminMoviesView';

export const metadata = {
  title: 'Bảng Điều Hành Quản Trị - CineDot Admin Portal',
};

export default function AdminDashboardPage() {
  return <AdminMoviesView />;
}

