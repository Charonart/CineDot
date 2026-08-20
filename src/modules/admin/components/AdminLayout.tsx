'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminRouteGuard } from './guards/AdminRouteGuard';
import { Skeleton } from '@/shared/ui/Skeleton';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized, initAdminStore, adminUser, token } = useAdminAuthStore();
  const { isLoadingSession } = useAdminAuth();

  // Hook 1: Initialize Admin Store from Cookies/Storage
  useEffect(() => {
    initAdminStore();
  }, [initAdminStore]);

  // Hook 2: Auth Redirect Enforcement
  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated && pathname !== '/admin/login') {
      router.replace('/admin/login');
    } else if (isAuthenticated && (pathname === '/admin/login' || pathname === '/admin')) {
      if (adminUser?.role === 'TICKET_STAFF') {
        router.replace('/admin/ticket-scanner');
      } else {
        router.replace('/admin/movies');
      }
    }
  }, [isInitialized, isAuthenticated, pathname, router, adminUser]);

  // If store is not initialized yet or validating session token
  if (!isInitialized || (token && !adminUser && isLoadingSession)) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <Skeleton variant="card" className="w-96 h-64 rounded-3xl" />
      </div>
    );
  }

  // If on login page, render login form without sidebar/header
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // If unauthenticated on protected routes, show loading while redirecting
  if (!isAuthenticated || !adminUser) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <Skeleton variant="card" className="w-96 h-64 rounded-3xl" />
      </div>
    );
  }

  // Main Admin Layout with Sidebar only and Route Guard
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-sans selection:bg-[#7C6FE8] selection:text-white">
      {/* Left Navigation Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-6 sm:p-8 overflow-y-auto">
        <AdminRouteGuard>{children}</AdminRouteGuard>
      </main>
    </div>
  );
}
