'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { Skeleton } from '@/shared/ui/Skeleton';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized, initAdminStore, adminUser } = useAdminAuthStore();

  // Hook 1: Initialize Admin Store
  useEffect(() => {
    initAdminStore();
  }, [initAdminStore]);

  // Hook 2: Strict Auth redirect check
  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated && pathname !== '/admin/login') {
      router.replace('/admin/login');
    } else if (isAuthenticated && pathname === '/admin/login') {
      router.replace('/admin');
    }
  }, [isInitialized, isAuthenticated, pathname, router]);

  // If store is not initialized yet, show clean loading state
  if (!isInitialized) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <Skeleton variant="card" className="w-96 h-64 rounded-3xl" />
      </div>
    );
  }

  // Conditional Return 1: If on login page, render login page content
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Conditional Return 2: If not authenticated yet on protected routes, prevent rendering admin dashboard
  if (!isAuthenticated || !adminUser) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <Skeleton variant="card" className="w-96 h-64 rounded-3xl" />
      </div>
    );
  }

  // Main Admin Layout with Sidebar and Header
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-sans selection:bg-[#7C6FE8] selection:text-white">
      {/* Left Navigation Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="p-6 sm:p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
