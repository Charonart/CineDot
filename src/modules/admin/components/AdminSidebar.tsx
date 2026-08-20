'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
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
  Shield,
  Target,
  ChevronDown,
  Tag,
  ListFilter,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { useAdminUiStore } from '../store/useAdminUiStore';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { adminUser, hasPermission } = useAdminAuthStore();
  const { isSidebarCollapsed, toggleSidebar } = useAdminUiStore();
  const [moviesMenuOpen, setMoviesMenuOpen] = useState(pathname.startsWith('/admin/movies'));
  const [staffMenuOpen, setStaffMenuOpen] = useState(pathname.startsWith('/admin/users-staff'));

  useEffect(() => {
    if (pathname.startsWith('/admin/movies')) {
      setMoviesMenuOpen(true);
    }
    if (pathname.startsWith('/admin/users-staff')) {
      setStaffMenuOpen(true);
    }
  }, [pathname]);

  const isMoviesActive = pathname.startsWith('/admin/movies');
  const isStaffActive = pathname.startsWith('/admin/users-staff');

  // Permissions check for menu items
  const canViewMovies = hasPermission('movies.view');
  const canViewGenres = hasPermission('movies.genres.manage') || adminUser?.role === 'SUPER_ADMIN';
  const canViewCinemas = hasPermission('cinemas.view');
  const canViewShowtimes = hasPermission('showtimes.view');
  const canViewTickets = hasPermission('bookings.view');
  const canViewConcessions = hasPermission('concessions.view');
  const canViewScanner = hasPermission('tickets.scan');
  const canViewStaff = hasPermission('staff.manage') || adminUser?.role === 'SUPER_ADMIN';
  const canViewMarketing = hasPermission('vouchers.manage') || adminUser?.role === 'SUPER_ADMIN';
  const canViewSettings = hasPermission('settings.manage') || adminUser?.role === 'SUPER_ADMIN';

  return (
    <aside
      className={`${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      } bg-white border-r border-slate-200/80 text-slate-700 flex flex-col justify-between shrink-0 min-h-screen sticky top-0 font-sans z-20 shadow-xs transition-all duration-300 ease-in-out select-none`}
    >
      <div className={`flex flex-col gap-6 ${isSidebarCollapsed ? 'p-3' : 'p-5'}`}>
        {/* Brand Header & Toggle Button */}
        <div className="flex items-center justify-between">
          <Link
            href={adminUser?.role === 'TICKET_STAFF' ? '/admin/ticket-scanner' : '/admin/movies'}
            className="flex items-center gap-2.5 overflow-hidden"
            title="CineDot Admin"
          >
            <div className="w-9 h-9 rounded-xl bg-[#7C6FE8] text-white flex items-center justify-center font-black text-sm shadow-md shadow-[#7C6FE8]/25 shrink-0">
              C
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-extrabold text-base text-slate-900 tracking-tight leading-none truncate">
                  Cine<span className="text-[#7C6FE8]">Dot</span>
                </span>
                <span className="text-[10px] font-extrabold text-[#7C6FE8] tracking-widest uppercase mt-1 truncate">
                  ADMIN PORTAL
                </span>
              </div>
            )}
          </Link>

          {!isSidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              title="Thu gọn sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Collapsed Expand Quick Button */}
        {isSidebarCollapsed && (
          <div className="flex justify-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl bg-purple-50 text-[#7C6FE8] hover:bg-purple-100 transition-all cursor-pointer shadow-2xs"
              title="Mở rộng sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1">
          {/* 1. Quản Lý Phim (Collapsible Submenu) */}
          {canViewMovies && (
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => setMoviesMenuOpen(!moviesMenuOpen)}
                title={isSidebarCollapsed ? 'Quản Lý Phim' : undefined}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-3.5 py-3'
                } rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isMoviesActive
                    ? 'bg-purple-50 text-[#7C6FE8] border border-purple-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Film className={`w-4 h-4 shrink-0 ${isMoviesActive ? 'text-[#7C6FE8]' : ''}`} />
                  {!isSidebarCollapsed && <span>Quản Lý Phim</span>}
                </div>
                {!isSidebarCollapsed && (
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      moviesMenuOpen ? 'rotate-180 text-[#7C6FE8]' : 'text-slate-400'
                    }`}
                  />
                )}
              </button>

              <AnimatePresence initial={false}>
                {moviesMenuOpen && !isSidebarCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden flex flex-col pl-4 pr-1 gap-1 pt-1"
                  >
                    <Link
                      href="/admin/movies"
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        pathname === '/admin/movies'
                          ? 'bg-[#7C6FE8] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <ListFilter className="w-3.5 h-3.5 shrink-0" />
                      <span>Danh Sách Phim</span>
                    </Link>

                    {canViewGenres && (
                      <Link
                        href="/admin/movies/genres"
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                          pathname === '/admin/movies/genres'
                            ? 'bg-[#7C6FE8] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <Tag className="w-3.5 h-3.5 shrink-0" />
                        <span>Thể Loại Phim</span>
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* 2. Quản Lý Rạp & Phòng */}
          {canViewCinemas && (
            <Link
              href="/admin/cinemas"
              title={isSidebarCollapsed ? 'Quản Lý Rạp & Phòng' : undefined}
              className={`flex items-center ${
                isSidebarCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3.5 py-3'
              } rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                pathname === '/admin/cinemas'
                  ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Building2 className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span className="truncate">Quản Lý Rạp & Phòng</span>}
            </Link>
          )}

          {/* 3. Quản Lý Suất Chiếu */}
          {canViewShowtimes && (
            <Link
              href="/admin/showtimes"
              title={isSidebarCollapsed ? 'Quản Lý Suất Chiếu' : undefined}
              className={`flex items-center ${
                isSidebarCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3.5 py-3'
              } rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                pathname === '/admin/showtimes'
                  ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span className="truncate">Quản Lý Suất Chiếu</span>}
            </Link>
          )}

          {/* 4. Đơn Đặt Vé (Bookings) */}
          {canViewTickets && (
            <Link
              href="/admin/booking"
              title={isSidebarCollapsed ? 'Đơn Đặt Vé (Bookings)' : undefined}
              className={`flex items-center ${
                isSidebarCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3.5 py-3'
              } rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                pathname === '/admin/booking' || pathname === '/admin/tickets'
                  ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Ticket className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span className="truncate">Đơn Đặt Vé (Bookings)</span>}
            </Link>
          )}

          {/* 5. Quản Lý Star Shop */}
          {canViewConcessions && (
            <Link
              href="/admin/concessions"
              title={isSidebarCollapsed ? 'Quản Lý Star Shop' : undefined}
              className={`flex items-center ${
                isSidebarCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3.5 py-3'
              } rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                pathname === '/admin/concessions'
                  ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span className="truncate">Quản Lý Star Shop</span>}
            </Link>
          )}

          {/* 6. Cổng Soát Vé Scanner */}
          {canViewScanner && (
            <Link
              href="/admin/ticket-scanner"
              title={isSidebarCollapsed ? 'Cổng Soát Vé Scanner' : undefined}
              className={`flex items-center ${
                isSidebarCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3.5 py-3'
              } rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                pathname === '/admin/ticket-scanner'
                  ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <QrCode className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span className="truncate">Cổng Soát Vé Scanner</span>}
            </Link>
          )}

          {/* 7. Nhân Sự & Phân Quyền (Collapsible Submenu) */}
          {canViewStaff && (
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => setStaffMenuOpen(!staffMenuOpen)}
                title={isSidebarCollapsed ? 'Nhân Sự & Phân Quyền' : undefined}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-3.5 py-3'
                } rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isStaffActive
                    ? 'bg-purple-50 text-[#7C6FE8] border border-purple-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className={`w-4 h-4 shrink-0 ${isStaffActive ? 'text-[#7C6FE8]' : ''}`} />
                  {!isSidebarCollapsed && <span>Nhân Sự & Phân Quyền</span>}
                </div>
                {!isSidebarCollapsed && (
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      staffMenuOpen ? 'rotate-180 text-[#7C6FE8]' : 'text-slate-400'
                    }`}
                  />
                )}
              </button>

              <AnimatePresence initial={false}>
                {staffMenuOpen && !isSidebarCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden flex flex-col pl-4 pr-1 gap-1 pt-1"
                  >
                    <Link
                      href="/admin/users-staff"
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        pathname === '/admin/users-staff'
                          ? 'bg-[#7C6FE8] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 shrink-0" />
                      <span>Đội Ngũ Nhân Sự</span>
                    </Link>

                    <Link
                      href="/admin/users-staff/customers"
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        pathname === '/admin/users-staff/customers'
                          ? 'bg-[#7C6FE8] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>Khách Hàng & Hội Viên</span>
                    </Link>

                    <Link
                      href="/admin/users-staff/roles"
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        pathname === '/admin/users-staff/roles'
                          ? 'bg-[#7C6FE8] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>Phân Quyền RBAC</span>
                    </Link>

                    <Link
                      href="/admin/users-staff/tiers"
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        pathname === '/admin/users-staff/tiers'
                          ? 'bg-[#7C6FE8] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5 shrink-0" />
                      <span>Hạng Thành Viên</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* 8. Chiến Dịch & Marketing */}
          {canViewMarketing && (
            <Link
              href="/admin/campaign"
              title={isSidebarCollapsed ? 'Chiến Dịch & Marketing' : undefined}
              className={`flex items-center ${
                isSidebarCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3.5 py-3'
              } rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                pathname.startsWith('/admin/campaign') || pathname === '/admin/vouchers'
                  ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Target className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span className="truncate">Chiến Dịch & Marketing</span>}
            </Link>
          )}
        </nav>
      </div>

      {/* Bottom-Left Settings (Gear Icon) & User Profile Footer */}
      {!isSidebarCollapsed ? (
        <div className="p-3 m-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 shadow-2xs">
          {/* User Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#7C6FE8] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
              {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-black text-slate-900 truncate leading-tight">
                {adminUser?.name || 'Admin'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium truncate">
                {adminUser?.roleName || 'Quản trị viên'}
              </span>
            </div>
          </div>

          {/* Settings Button: Gear icon ⚙ only */}
          <Link
            href="/admin/settings"
            className={`p-2 rounded-xl transition-all cursor-pointer shrink-0 ${
              pathname === '/admin/settings'
                ? 'bg-[#7C6FE8] text-white shadow-xs'
                : 'text-slate-400 hover:text-[#7C6FE8] hover:bg-purple-50'
            }`}
            title="Cài Đặt Hệ Thống"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="p-3 flex flex-col items-center gap-2 border-t border-slate-100">
          <Link
            href="/admin/settings"
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              pathname === '/admin/settings'
                ? 'bg-[#7C6FE8] text-white shadow-xs'
                : 'text-slate-400 hover:text-[#7C6FE8] hover:bg-purple-50'
            }`}
            title="Cài Đặt Hệ Thống"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      )}
    </aside>
  );
};
