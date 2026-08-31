'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useAdminUiStore } from '../store/useAdminUiStore';
import { AdminSidebar } from './AdminSidebar';
import { AdminRouteGuard } from './guards/AdminRouteGuard';
import { Skeleton } from '@/shared/ui/Skeleton';
import { Menu } from 'lucide-react';
import { CineToastProvider } from '@/shared/components/toast/CineToastProvider';
import { CineConfirmProvider } from '@/shared/components/modal/CineConfirmModal';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const VALID_ADMIN_ROLES = [
  'SUPER_ADMIN',
  'CINEMA_MANAGER',
  'TICKET_STAFF',
  'FNB_STAFF',
  'MARKETING',
  'ACCOUNTANT',
  'STAFF',
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized, initAdminStore, adminUser, token } = useAdminAuthStore();
  const { isLoadingSession } = useAdminAuth();
  const { openMobileMenu } = useAdminUiStore();

  // Initialize Admin Store
  useEffect(() => {
    initAdminStore();
  }, [initAdminStore]);

  // Auth Redirect Enforcement
  useEffect(() => {
    if (!isInitialized) return;

    const hasValidAdminRole = Boolean(adminUser && VALID_ADMIN_ROLES.includes(adminUser.role));

    if ((!isAuthenticated || !hasValidAdminRole) && pathname !== '/admin/login') {
      router.replace('/admin/login');
    } else if (isAuthenticated && hasValidAdminRole) {
      if (pathname === '/admin/login') {
        if (adminUser?.role === 'TICKET_STAFF') {
          router.replace('/admin/ticket-scanner');
        } else {
          router.replace('/admin');
        }
      }
    }
  }, [isInitialized, isAuthenticated, pathname, router, adminUser]);

  // Loading state during auth validation
  if (!isInitialized || (token && !adminUser && isLoadingSession)) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#7C6FE8] text-white flex items-center justify-center font-bold text-sm shadow-2xs">
            C
          </div>
          <Skeleton variant="text" className="w-40 h-3 rounded-full" />
        </div>
      </div>
    );
  }

  // If on login page, render login form cleanly without shell
  if (pathname === '/admin/login') {
    return (
      <CineToastProvider>
        <CineConfirmProvider>{children}</CineConfirmProvider>
      </CineToastProvider>
    );
  }

  const hasValidAdminRole = Boolean(adminUser && VALID_ADMIN_ROLES.includes(adminUser.role));

  if (!isAuthenticated || !hasValidAdminRole) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <Skeleton variant="card" className="w-96 h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <CineToastProvider>
      <CineConfirmProvider>
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-sans selection:bg-[#7C6FE8] selection:text-white">
          {/* Left ERP Navigation Sidebar */}
          <AdminSidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Mobile-only Top Header Bar (Hidden on desktop) */}
            <header className="lg:hidden sticky top-0 z-30 w-full px-4 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between shadow-2xs select-none">
              <button
                onClick={openMobileMenu}
                className="p-1.5 rounded-md bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                title="Mở menu điều hướng"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Brand */}
              <Link
                href={adminUser?.role === 'TICKET_STAFF' ? '/admin/ticket-scanner' : '/admin'}
                className="flex items-center gap-1.5 font-bold text-xs text-slate-900"
              >
                <div className="w-5 h-5 rounded-md bg-[#7C6FE8] text-white flex items-center justify-center font-bold text-[10px]">
                  C
                </div>
                <span>CineDot ERP</span>
              </Link>

              <div className="w-8" />
            </header>

            {/* Main Canvas */}
            <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-7 overflow-y-auto">
              <AdminRouteGuard>{children}</AdminRouteGuard>
            </main>
          </div>
        </div>
      </CineConfirmProvider>
    </CineToastProvider>
  );
}
