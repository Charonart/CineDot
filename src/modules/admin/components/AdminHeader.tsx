'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useAdminUiStore } from '../store/useAdminUiStore';
import {
  LogOut,
  Bell,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
} from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/admin/movies': 'Quản Lý Phim',
  '/admin/movies/genres': 'Thể Loại Phim',
  '/admin/cinemas': 'Quản Lý Rạp & Phòng',
  '/admin/showtimes': 'Quản Lý Suất Chiếu',
  '/admin/booking': 'Đơn Đặt Vé (Bookings)',
  '/admin/tickets': 'Đơn Đặt Vé (Bookings)',
  '/admin/concessions': 'Quản Lý Star Shop',
  '/admin/ticket-scanner': 'Cổng Soát Vé Scanner',
  '/admin/users-staff': 'Nhân Sự & Phân Quyền',
  '/admin/users-staff/customers': 'Khách Hàng & Hội Viên',
  '/admin/users-staff/roles': 'Phân Quyền RBAC',
  '/admin/users-staff/tiers': 'Hạng Thành Viên',
  '/admin/campaign': 'Chiến Dịch & Marketing',
  '/admin/campaign/voucher': 'Mã Giảm Giá (Vouchers)',
  '/admin/campaign/banner': 'Banner Quảng Cáo',
  '/admin/settings': 'Cấu Hình Hệ Thống',
};

export const AdminHeader: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { adminUser } = useAdminAuthStore();
  const { isSidebarCollapsed, toggleSidebar } = useAdminUiStore();
  const { logout, isLoggingOut } = useAdminAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.push('/admin/login');
    }
  };

  // Determine current page title
  const currentTitle =
    PAGE_TITLES[pathname] ||
    (pathname.startsWith('/admin/movies')
      ? 'Quản Lý Phim'
      : pathname.startsWith('/admin/users-staff')
      ? 'Nhân Sự & Phân Quyền'
      : pathname.startsWith('/admin/campaign')
      ? 'Chiến Dịch & Marketing'
      : 'CineDot Portal');

  return (
    <header className="w-full bg-white border-b border-slate-200/80 text-slate-900 px-5 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs select-none">
      {/* Left: Sidebar Toggle + Current Page Name */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl bg-slate-100/90 hover:bg-purple-50 text-slate-500 hover:text-[#7C6FE8] transition-colors cursor-pointer"
          title={isSidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>

        <div className="h-4 w-px bg-slate-200" />

        <div className="flex items-center gap-2">
          <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            {currentTitle}
          </h1>
          {adminUser?.cinemaName && (
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full hidden md:inline-block border border-slate-200/60">
              {adminUser.cinemaName}
            </span>
          )}
        </div>
      </div>

      {/* Right: Settings Icon, Notifications, User Capsule, Logout Icon */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Settings Gear Button (Icon only with tooltip) */}
        <Link
          href="/admin/settings"
          className="p-2 rounded-xl bg-slate-100/80 hover:bg-purple-50 text-slate-600 hover:text-[#7C6FE8] transition-colors cursor-pointer border border-transparent hover:border-purple-100"
          title="Cài Đặt Hệ Thống"
        >
          <Settings className="w-4 h-4" />
        </Link>

        {/* Notifications Icon Button */}
        <button
          className="p-2 rounded-xl bg-slate-100/80 hover:bg-purple-50 text-slate-600 hover:text-[#7C6FE8] transition-colors relative cursor-pointer border border-transparent hover:border-purple-100"
          title="Thông Báo Hệ Thống"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-[#7C6FE8] absolute top-1.5 right-1.5 ring-2 ring-white" />
        </button>

        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        {/* User Capsule */}
        <div className="flex items-center gap-2.5 bg-slate-100/90 pl-1.5 pr-3 py-1 rounded-full border border-slate-200/80">
          <div className="w-7 h-7 rounded-full bg-[#7C6FE8] text-white flex items-center justify-center font-black text-xs shadow-xs">
            {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-black text-slate-900 leading-tight max-w-[120px] truncate">
              {adminUser?.name || 'Admin'}
            </span>
            <span className="text-[10px] font-semibold text-[#7C6FE8] leading-none truncate">
              {adminUser?.roleName || 'Quản trị viên'}
            </span>
          </div>
        </div>

        {/* Logout Button (Icon only with tooltip) */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="p-2 rounded-xl bg-slate-100/80 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-all cursor-pointer disabled:opacity-50 border border-transparent hover:border-rose-100"
          title="Đăng Xuất Khỏi Hệ Thống"
        >
          {isLoggingOut ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#7C6FE8]" />
          ) : (
            <LogOut className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
};
