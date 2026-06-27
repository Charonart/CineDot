import React from 'react';
import { AdminSidebar } from '@/modules/admin/components/layout/AdminSidebar';
import { AuthGuard } from '@/modules/auth/components/AuthGuard';
import '@/styles/admin.css'; // Import specific admin CSS

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRoles={['admin', 'staff']}>
      <div className="flex h-screen bg-[var(--color-admin-bg)] text-[var(--color-admin-text-primary)] font-sans overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
