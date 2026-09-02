'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useAdminUiStore } from '../store/useAdminUiStore';
import {
  LogOut,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Building2,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { AdminNotificationCenter } from './notifications/AdminNotificationCenter';

const PAGE_TITLES: Record<string, { group: string; title: string }> = {
  '/admin': { group: 'Tổng Quan', title: 'Bảng Điều Hành' },
  '/admin/movies': { group: 'Phim & Sản Phẩm', title: 'Kho Phim Chiếu' },
  '/admin/movies/genres': { group: 'Phim & Sản Phẩm', title: 'Thể Loại Phim' },
  '/admin/persons': { group: 'Phim & Sản Phẩm', title: 'Đạo Diễn & Diễn Viên' },
  '/admin/cinemas': { group: 'Vận Hành', title: 'Quản Lý Rạp & Phòng Chiếu' },
  '/admin/showtimes': { group: 'Vận Hành', title: 'Quản Lý Suất Chiếu' },
  '/admin/booking': { group: 'Vận Hành', title: 'Đơn Đặt Vé' },
  '/admin/tickets': { group: 'Vận Hành', title: 'Danh Sách Vé' },
  '/admin/concessions': { group: 'Phim & Sản Phẩm', title: 'Quản Lý Star Shop' },
  '/admin/ticket-scanner': { group: 'Vận Hành', title: 'Cổng Soát Vé Scanner' },
  '/admin/users-staff': { group: 'Nhân Sự & Khách Hàng', title: 'Nhân Sự & Phân Quyền' },
  '/admin/users-staff/customers': { group: 'Nhân Sự & Khách Hàng', title: 'Khách Hàng & Hội Viên' },
  '/admin/users-staff/roles': { group: 'Nhân Sự & Khách Hàng', title: 'Phân Quyền RBAC' },
  '/admin/users-staff/tiers': { group: 'Nhân Sự & Khách Hàng', title: 'Hạng Thành Viên' },
  '/admin/campaign': { group: 'Marketing', title: 'Chiến Dịch & Khuyến Mãi' },
  '/admin/campaign/voucher': { group: 'Marketing', title: 'Mã Giảm Giá (Vouchers)' },
  '/admin/campaign/banner': { group: 'Marketing', title: 'Banner Quảng Cáo' },
  '/admin/pricing-rules': { group: 'Marketing', title: 'Bảng Giá Vé' },
  '/admin/settings': { group: 'Cấu Hình', title: 'Cài Đặt Hệ Thống' },
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

  // Determine current page title and breadcrumb group
  const pageMeta =
    PAGE_TITLES[pathname] || {
      group: 'Admin',
      title: pathname.replace('/admin/', '').replace(/-/g, ' ').toUpperCase(),
    };

  return (
    <header className="w-full bg-white/95 backdrop-blur-xl border-b border-slate-200/80 text-slate-900 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs select-none">
      {/* Left: Sidebar Toggle + Breadcrumb Title Hierarchy */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl bg-slate-100/90 hover:bg-purple-50 text-slate-600 hover:text-[#7C6FE8] transition-colors cursor-pointer border border-transparent hover:border-purple-100"
          title={isSidebarCollapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>

        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        {/* Breadcrumb path */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium hidden md:inline-block">
            {pageMeta.group}
          </span>
          <ChevronRight className="w-3 h-3 text-slate-300 hidden md:inline-block" />
          <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
            {pageMeta.title}
          </h1>

          {adminUser?.cinemaName && (
            <span className="ml-2 text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg hidden lg:inline-flex items-center gap-1 border border-slate-200/60">
              <Building2 className="w-3 h-3 text-[#7C6FE8]" />
              <span>{adminUser.cinemaName}</span>
            </span>
          )}
        </div>
      </div>

      {/* Right: System Status, Notifications, User Capsule, Logout */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* System Online Status Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200/50">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Hệ thống trực tuyến</span>
        </div>

        {/* Settings Button */}
        <Link
          href="/admin/settings"
          className="p-2 rounded-xl bg-slate-100/80 hover:bg-purple-50 text-slate-600 hover:text-[#7C6FE8] transition-colors cursor-pointer border border-transparent hover:border-purple-100"
          title="Cài Đặt Hệ Thống"
        >
          <Settings className="w-4 h-4" />
        </Link>

        {/* Notifications Center */}
        <AdminNotificationCenter />

        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        {/* User Profile Capsule */}
        <div className="flex items-center gap-2 bg-slate-100/90 pl-1.5 pr-3 py-1 rounded-full border border-slate-200/80">
          <div className="w-6 h-6 rounded-full bg-[#7C6FE8] text-white flex items-center justify-center font-black text-[11px] shadow-2xs">
            {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 leading-tight max-w-[110px] truncate">
              {adminUser?.name || 'Admin'}
            </span>
            <span className="text-[9px] font-bold text-[#7C6FE8] leading-none truncate flex items-center gap-0.5">
              <Shield className="w-2.5 h-2.5" />
              <span>{adminUser?.roleName || adminUser?.role || 'Quản trị viên'}</span>
            </span>
          </div>
        </div>

        {/* Logout Action */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="p-2 rounded-xl bg-slate-100/80 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-all cursor-pointer disabled:opacity-50 border border-transparent hover:border-rose-100"
          title="Đăng Xuất"
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
