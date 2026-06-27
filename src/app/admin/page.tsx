import React from 'react';
import { DashboardStats } from '@/modules/admin/components/dashboard/DashboardStats';

export const metadata = {
  title: 'Admin Dashboard | CineDot',
};

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-admin-text-primary)]">
            Tổng quan
          </h1>
          <p className="text-[var(--color-admin-text-secondary)] mt-1">
            Chào mừng trở lại! Dưới đây là tình hình hoạt động của CineDot.
          </p>
        </div>
        
        <button className="px-4 py-2 bg-[var(--color-admin-accent)] text-white rounded-lg hover:bg-[var(--color-admin-accent-hover)] transition-colors font-medium shadow-sm">
          Báo cáo chi tiết
        </button>
      </div>

      <DashboardStats />

      {/* Placeholder for Recent Activity and Charts to demonstrate layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--color-admin-surface)] rounded-2xl p-6 shadow-sm border border-[var(--color-admin-border)] min-h-[400px] flex items-center justify-center">
          <p className="text-[var(--color-admin-text-secondary)]">Khu vực biểu đồ doanh thu</p>
        </div>
        <div className="bg-[var(--color-admin-surface)] rounded-2xl p-6 shadow-sm border border-[var(--color-admin-border)] min-h-[400px] flex items-center justify-center">
          <p className="text-[var(--color-admin-text-secondary)]">Khu vực hoạt động gần đây</p>
        </div>
      </div>
    </div>
  );
}
