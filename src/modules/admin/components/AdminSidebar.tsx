'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Film,
  Building2,
  Calendar,
  Ticket,
  ShoppingBag,
  QrCode,
  Users,
  UserCheck,
  ShieldCheck,
  Award,
  Settings,
  Tag,
  ImageIcon,
  LogOut,
  FolderTree,
  Sliders,
  UserSquare2,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  MessageSquare,
  X,
} from 'lucide-react';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { useAdminUiStore } from '../store/useAdminUiStore';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { AdminNotificationCenter } from './notifications/AdminNotificationCenter';

interface SubmenuItem {
  name: string;
  href: string;
  permission?: string;
}

interface DropdownSectionConfig {
  id: string;
  name: string;
  icon: React.ElementType;
  primaryHref: string;
  permission?: string;
  subitems: SubmenuItem[];
}

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { adminUser, hasPermission } = useAdminAuthStore();
  const { logout } = useAdminAuth();
  const {
    isSidebarCollapsed,
    toggleSidebar,
    isMobileMenuOpen,
    closeMobileMenu,
  } = useAdminUiStore();

  // Dropdown accordions open/close state
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    cinemas: pathname.startsWith('/admin/cinemas') || pathname.startsWith('/admin/showtimes') || pathname.startsWith('/admin/booking') || pathname.startsWith('/admin/ticket-scanner'),
    movies: pathname.startsWith('/admin/movies') || pathname.startsWith('/admin/persons'),
    staff: pathname.startsWith('/admin/users-staff'),
    marketing: pathname.startsWith('/admin/campaign') || pathname.startsWith('/admin/pricing-rules') || pathname === '/admin/vouchers',
  });

  // Auto-expand active dropdown when navigating
  useEffect(() => {
    if (pathname.startsWith('/admin/cinemas') || pathname.startsWith('/admin/showtimes') || pathname.startsWith('/admin/booking') || pathname.startsWith('/admin/ticket-scanner')) {
      setOpenDropdowns((prev) => ({ ...prev, cinemas: true }));
    }
    if (pathname.startsWith('/admin/movies') || pathname.startsWith('/admin/persons')) {
      setOpenDropdowns((prev) => ({ ...prev, movies: true }));
    }
    if (pathname.startsWith('/admin/users-staff')) {
      setOpenDropdowns((prev) => ({ ...prev, staff: true }));
    }
    if (pathname.startsWith('/admin/campaign') || pathname.startsWith('/admin/pricing-rules') || pathname === '/admin/vouchers') {
      setOpenDropdowns((prev) => ({ ...prev, marketing: true }));
    }
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  const toggleDropdown = (id: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Permissions helper
  const canAccess = (perm?: string) => {
    if (!perm) return true;
    if (adminUser?.role === 'SUPER_ADMIN') return true;
    return hasPermission(perm);
  };

  // Dropdown Configuration
  const dropdownSections: DropdownSectionConfig[] = [
    {
      id: 'cinemas',
      name: 'Rạp & Suất Chiếu',
      icon: Building2,
      primaryHref: '/admin/showtimes',
      permission: 'showtimes.view',
      subitems: [
        { name: 'Lịch & Suất Chiếu', href: '/admin/showtimes', permission: 'showtimes.view' },
        { name: 'Cụm Rạp & Phòng', href: '/admin/cinemas', permission: 'cinemas.view' },
        { name: 'Đơn Đặt Vé (Bookings)', href: '/admin/booking', permission: 'bookings.view' },
        { name: 'Cổng Soát Vé Scanner', href: '/admin/ticket-scanner', permission: 'tickets.scan' },
      ],
    },
    {
      id: 'movies',
      name: 'Quản Lý Phim',
      icon: Film,
      primaryHref: '/admin/movies',
      permission: 'movies.view',
      subitems: [
        { name: 'Kho Phim Chiếu', href: '/admin/movies', permission: 'movies.view' },
        { name: 'Thể Loại Phim', href: '/admin/movies/genres', permission: 'movies.genres.manage' },
        { name: 'Đạo Diễn & Diễn Viên', href: '/admin/persons', permission: 'movies.view' },
        { name: 'Đánh Giá & Review', href: '/admin/movies/reviews', permission: 'reviews.view' },
      ],
    },
    {
      id: 'staff',
      name: 'Nhân Sự & Khách Hàng',
      icon: Users,
      primaryHref: '/admin/users-staff',
      permission: 'staff.manage',
      subitems: [
        { name: 'Danh Sách Nhân Viên', href: '/admin/users-staff', permission: 'staff.manage' },
        { name: 'Phân Quyền RBAC', href: '/admin/users-staff/roles', permission: 'staff.manage' },
        { name: 'Khách Hàng & Hội Viên', href: '/admin/users-staff/customers', permission: 'staff.manage' },
        { name: 'Hạng Thành Viên', href: '/admin/users-staff/tiers', permission: 'staff.manage' },
      ],
    },
    {
      id: 'marketing',
      name: 'Marketing & Bảng Giá',
      icon: Tag,
      primaryHref: '/admin/campaign/voucher',
      permission: 'vouchers.manage',
      subitems: [
        { name: 'Mã Giảm Giá (Vouchers)', href: '/admin/campaign/voucher', permission: 'vouchers.manage' },
        { name: 'Banner Quảng Cáo', href: '/admin/campaign/banner', permission: 'vouchers.manage' },
        { name: 'Bảng Giá Vé & Phụ Thu', href: '/admin/pricing-rules', permission: 'vouchers.manage' },
      ],
    },
  ];

  const isDropdownActive = (section: DropdownSectionConfig) => {
    return section.subitems.some((item) => pathname === item.href || (item.href === '/admin/booking' && pathname.startsWith('/admin/tickets')));
  };

  const renderNav = (isMobile = false) => (
    <nav className="flex flex-col gap-1 text-slate-700 text-[13px] select-none font-medium">
      {/* 1. Dashboard (Single item) */}
      <Link
        href="/admin"
        onClick={closeMobileMenu}
        title={isSidebarCollapsed && !isMobile ? 'Bảng Điều Hành' : undefined}
        className={`flex items-center ${
          isSidebarCollapsed && !isMobile ? 'justify-center p-2' : 'gap-2.5 px-2.5 py-2'
        } rounded-md transition-colors ${
          pathname === '/admin'
            ? 'bg-[#7C6FE8] text-white font-semibold shadow-2xs'
            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        <LayoutDashboard className="w-4 h-4 shrink-0" />
        {(!isSidebarCollapsed || isMobile) && <span>Bảng Điều Hành</span>}
      </Link>

      {/* 2. Dropdown Sections */}
      {dropdownSections.map((section) => {
        if (!canAccess(section.permission)) return null;

        const visibleSubitems = section.subitems.filter((sub) => canAccess(sub.permission));
        if (visibleSubitems.length === 0) return null;

        const Icon = section.icon;
        const active = isDropdownActive(section);
        const isOpen = openDropdowns[section.id];

        if (isSidebarCollapsed && !isMobile) {
          // Collapsed mode: direct link to primary section
          return (
            <Link
              key={section.id}
              href={section.primaryHref}
              title={section.name}
              className={`flex items-center justify-center p-2 rounded-md transition-colors ${
                active
                  ? 'bg-purple-100 text-[#7C6FE8] font-semibold'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
            </Link>
          );
        }

        return (
          <div key={section.id} className="flex flex-col">
            <button
              onClick={() => toggleDropdown(section.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md transition-colors cursor-pointer ${
                active
                  ? 'text-[#7C6FE8] bg-purple-50/70 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#7C6FE8]' : 'text-slate-500'}`} />
                <span>{section.name}</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  isOpen ? 'rotate-180 text-[#7C6FE8]' : 'text-slate-400'
                }`}
              />
            </button>

            {/* Submenu Items */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.16 }}
                  className="overflow-hidden flex flex-col ml-4 pl-3 border-l border-slate-200 gap-0.5 my-0.5 text-xs"
                >
                  {visibleSubitems.map((sub) => {
                    const isSubActive =
                      pathname === sub.href ||
                      (sub.href === '/admin/booking' && pathname.startsWith('/admin/tickets'));

                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={closeMobileMenu}
                        className={`px-2 py-1.5 rounded transition-colors ${
                          isSubActive
                            ? 'text-[#7C6FE8] font-bold bg-purple-50'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        {sub.name}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* 3. Star Shop & F&B (Single item) */}
      {canAccess('concessions.view') && (
        <Link
          href="/admin/concessions"
          onClick={closeMobileMenu}
          title={isSidebarCollapsed && !isMobile ? 'Star Shop & F&B' : undefined}
          className={`flex items-center ${
            isSidebarCollapsed && !isMobile ? 'justify-center p-2' : 'gap-2.5 px-2.5 py-2'
          } rounded-md transition-colors ${
            pathname === '/admin/concessions'
              ? 'bg-[#7C6FE8] text-white font-semibold shadow-2xs'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4 shrink-0" />
          {(!isSidebarCollapsed || isMobile) && <span>Star Shop & F&B</span>}
        </Link>
      )}
    </nav>
  );

  return (
    <>
      {/* Desktop ERP Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isSidebarCollapsed ? 64 : 240,
        }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex flex-col justify-between bg-white border-r border-slate-200 select-none z-40 sticky top-0 h-screen overflow-hidden shrink-0"
      >
        {/* Top: Header & Workspace info */}
        <div className="flex flex-col gap-3 pt-3.5 px-3">
          {/* Header Row */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 min-h-[40px]">
            <Link
              href="/admin"
              className="flex items-center gap-2 min-w-0"
              title="CineDot ERP Dashboard"
            >
              <img
                src="/assets/images/cinedot-icon.png"
                alt="CineDot"
                className="w-7 h-7 object-contain rounded-md shrink-0 shadow-2xs"
              />
              {!isSidebarCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-sm tracking-tight text-slate-900 leading-tight truncate">
                    CineDot <span className="text-[#7C6FE8]">ERP</span>
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 truncate">
                    {adminUser?.cinemaName || 'Trụ sở chính'}
                  </span>
                </div>
              )}
            </Link>

            {!isSidebarCollapsed && (
              <div className="flex items-center gap-1 shrink-0">
                <AdminNotificationCenter />
              </div>
            )}
          </div>

          {/* Navigation Items with Accordion Dropdowns */}
          <div className="overflow-y-auto max-h-[calc(100vh-170px)] pr-1 scrollbar-thin scrollbar-thumb-slate-200">
            {renderNav(false)}
          </div>
        </div>

        {/* Bottom User Bar & Collapse Toggle at the bottom */}
        <div className="p-2.5 border-t border-slate-100 bg-slate-50/60 flex flex-col gap-1.5">
          {/* User Profile Row with Settings & Logout buttons to save place */}
          <div
            className={`flex items-center ${
              isSidebarCollapsed ? 'justify-center' : 'justify-between'
            } min-w-0 px-1 py-1`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-7 h-7 rounded-md bg-[#7C6FE8] text-white flex items-center justify-center font-bold text-xs shrink-0"
                title={adminUser?.name || 'Admin'}
              >
                {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {adminUser?.name || 'Admin'}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    {adminUser?.roleName || adminUser?.role || 'Quản trị viên'}
                  </span>
                </div>
              )}
            </div>

            {!isSidebarCollapsed && (
              <div className="flex items-center gap-0.5">
                <Link
                  href="/admin/settings"
                  className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                  title="Cài Đặt Hệ Thống"
                >
                  <Settings className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => logout()}
                  className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Bottom Sidebar Collapse/Expand Toggle Button */}
          <button
            onClick={toggleSidebar}
            className={`w-full flex items-center ${
              isSidebarCollapsed ? 'justify-center p-2' : 'justify-between px-2.5 py-1.5'
            } rounded-md text-xs text-slate-500 hover:bg-slate-200/70 hover:text-slate-900 transition-colors cursor-pointer`}
            title={isSidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          >
            {!isSidebarCollapsed && <span>Thu gọn sidebar</span>}
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-50"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden fixed inset-y-0 left-0 w-[270px] bg-white z-50 p-4 flex flex-col justify-between shadow-2xl border-r border-slate-200"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-[#7C6FE8] text-white flex items-center justify-center font-bold text-xs">
                      C
                    </div>
                    <span className="font-bold text-sm text-slate-900">CineDot ERP</span>
                  </div>

                  <button
                    onClick={closeMobileMenu}
                    className="p-1.5 rounded-md bg-slate-100 text-slate-500 hover:text-slate-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(100vh-160px)] pr-1">
                  {renderNav(true)}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-[#7C6FE8] text-white flex items-center justify-center font-bold text-xs">
                    {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">{adminUser?.name}</span>
                    <span className="text-[10px] text-slate-400">{adminUser?.roleName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Link
                    href="/admin/settings"
                    onClick={closeMobileMenu}
                    className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    title="Cài Đặt"
                  >
                    <Settings className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
