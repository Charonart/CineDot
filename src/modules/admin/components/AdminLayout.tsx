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
import { Menu, Settings } from 'lucide-react';

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

  // Hook 1: Initialize Admin Store from Cookies/Storage
  useEffect(() => {
    initAdminStore();
  }, [initAdminStore]);

  // Hook 2: Auth Redirect Enforcement
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
  const hasValidAdminRole = Boolean(adminUser && VALID_ADMIN_ROLES.includes(adminUser.role));

  if (!isAuthenticated || !hasValidAdminRole) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <Skeleton variant="card" className="w-96 h-64 rounded-3xl" />
      </div>
    );
  }

  // Main Admin Layout with Responsive Structure
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col lg:flex-row font-sans selection:bg-[#7C6FE8] selection:text-white">
      {/* Left Navigation Sidebar (Desktop permanent + Mobile slide-over drawer) */}
      <AdminSidebar />

      {/* Mobile/Tablet Apple-Style Top Navigation Bar (Hidden on Desktop) */}
      <header className="lg:hidden sticky top-0 z-30 w-full px-4 py-2.5 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 flex items-center justify-between shadow-2xs select-none">
        <button
          onClick={openMobileMenu}
          className="p-2 rounded-2xl bg-slate-100/90 active:scale-95 text-slate-700 hover:text-[#7C6FE8] hover:bg-purple-50 transition-all cursor-pointer shadow-2xs border border-slate-200/50"
          title="Mở menu điều hướng"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Pill */}
        <Link
          href={adminUser?.role === 'TICKET_STAFF' ? '/admin/ticket-scanner' : '/admin'}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/60 active:scale-95 transition-transform"
        >
          <div className="w-5 h-5 rounded-lg bg-[#7C6FE8] text-white flex items-center justify-center font-black text-[10px] shadow-2xs">
            C
          </div>
          <span className="font-extrabold text-xs text-slate-900 tracking-tight">
            Cine<span className="text-[#7C6FE8]">Dot</span> Admin
          </span>
        </Link>

        {/* Settings Button */}
        <Link
          href="/admin/settings"
          className="p-2 rounded-2xl bg-slate-100/90 active:scale-95 text-slate-600 hover:text-[#7C6FE8] hover:bg-purple-50 transition-all cursor-pointer shadow-2xs border border-slate-200/50"
          title="Cài Đặt Hệ Thống"
        >
          <Settings className="w-5 h-5" />
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <AdminRouteGuard>{children}</AdminRouteGuard>
      </main>
    </div>
  );
}
