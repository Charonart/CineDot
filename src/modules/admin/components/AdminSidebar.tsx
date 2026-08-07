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
  Gift,
  Settings,
  Shield,
  ChevronDown,
  Tag,
  Star,
  ListFilter,
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const [moviesMenuOpen, setMoviesMenuOpen] = useState(pathname.startsWith('/admin/movies'));

  useEffect(() => {
    if (pathname.startsWith('/admin/movies')) {
      setMoviesMenuOpen(true);
    }
  }, [pathname]);

  const isMoviesActive = pathname.startsWith('/admin/movies');

  return (
    <aside className="w-64 bg-white border-r border-gray-200/80 text-slate-700 flex flex-col justify-between shrink-0 min-h-screen sticky top-0 font-sans z-20 shadow-xs">
      <div className="flex flex-col gap-6 p-5">
        {/* Brand Header */}
        <Link href="/admin" className="flex items-center gap-2.5 px-2">
          <div className="w-9 h-9 rounded-xl bg-[#7C6FE8] text-white flex items-center justify-center font-black text-sm shadow-md">
            C
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-slate-900 tracking-tight leading-none">
              Cine<span className="text-[#7C6FE8]">Dot</span>
            </span>
            <span className="text-[10px] font-extrabold text-[#7C6FE8] tracking-widest uppercase mt-1">
              ADMIN PORTAL
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1">
          {/* Dashboard */}
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              pathname === '/admin'
                ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Dashboard Thống Kê</span>
          </Link>

          {/* Quản Lý Phim (Collapsible Submenu) */}
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => setMoviesMenuOpen(!moviesMenuOpen)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                isMoviesActive
                  ? 'bg-purple-50 text-[#7C6FE8] border border-purple-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Film className={`w-4 h-4 shrink-0 ${isMoviesActive ? 'text-[#7C6FE8]' : ''}`} />
                <span>Quản Lý Phim</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  moviesMenuOpen ? 'rotate-180 text-[#7C6FE8]' : 'text-slate-400'
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {moviesMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden flex flex-col pl-4 pr-1 gap-1 pt-1"
                >
                  <Link
                    href="/admin/movies"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                      pathname === '/admin/movies'
                        ? 'bg-[#7C6FE8] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <ListFilter className="w-3.5 h-3.5 shrink-0" />
                    <span>Danh Sách Phim</span>
                  </Link>

                  <Link
                    href="/admin/movies/genres"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                      pathname === '/admin/movies/genres'
                        ? 'bg-[#7C6FE8] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Tag className="w-3.5 h-3.5 shrink-0" />
                    <span>Thể Loại Phim & Thị Phần</span>
                  </Link>

                  <Link
                    href="/admin/movies/reviews"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                      pathname === '/admin/movies/reviews'
                        ? 'bg-[#7C6FE8] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 shrink-0" />
                    <span>Đánh Giá & Review</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quản Lý Rạp & Phòng */}
          <Link
            href="/admin/cinemas"
            className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              pathname === '/admin/cinemas'
                ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span>Quản Lý Rạp & Phòng</span>
          </Link>

          {/* Quản Lý Suất Chiếu */}
          <Link
            href="/admin/showtimes"
            className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              pathname === '/admin/showtimes'
                ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>Quản Lý Suất Chiếu</span>
          </Link>

          {/* Quản Lý Đơn Vé Phim */}
          <Link
            href="/admin/tickets"
            className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              pathname === '/admin/tickets'
                ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <Ticket className="w-4 h-4 shrink-0" />
            <span>Quản Lý Đơn Vé Phim</span>
          </Link>

          {/* Quản Lý Star Shop */}
          <Link
            href="/admin/concessions"
            className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              pathname === '/admin/concessions'
                ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Quản Lý Star Shop</span>
          </Link>

          {/* Cổng Soát Vé Scanner */}
          <Link
            href="/admin/ticket-scanner"
            className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              pathname === '/admin/ticket-scanner'
                ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <QrCode className="w-4 h-4 shrink-0" />
            <span>Cổng Soát Vé Scanner</span>
          </Link>

          {/* Nhân Sự & Phân Quyền */}
          <Link
            href="/admin/users-staff"
            className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              pathname === '/admin/users-staff'
                ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Nhân Sự & Phân Quyền</span>
          </Link>

          {/* Quản Lý Ưu Đãi Voucher */}
          <Link
            href="/admin/vouchers"
            className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              pathname === '/admin/vouchers'
                ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <Gift className="w-4 h-4 shrink-0" />
            <span>Quản Lý Ưu Đãi Voucher</span>
          </Link>

          {/* Cấu Hình Hệ Thống */}
          <Link
            href="/admin/settings"
            className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              pathname === '/admin/settings'
                ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Cấu Hình Hệ Thống</span>
          </Link>
        </nav>
      </div>

      {/* System Security Footer */}
      <div className="p-3.5 border-t border-gray-100 m-3 rounded-2xl bg-slate-50 border border-gray-200/60 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
        <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Bảo Mật 256-bit</span>
      </div>
    </aside>
  );
};
