'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Ticket, ShoppingBag, Crown, LogOut, ShieldCheck, ChevronRight, Sparkles, Settings } from 'lucide-react';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { PermissionGuard } from '@/shared/components/auth/PermissionGuard';

export const UserNavMenu: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const displayName = user.fullname || user.name || user.username || 'Khách hàng';
  const initial = displayName.charAt(0).toUpperCase();
  const tier = user.user_tier || 'Bronze';
  const points = user.total_points || 0;

  const tierColors: Record<string, { bg: string; text: string; border: string }> = {
    Diamond: { bg: 'bg-gradient-to-r from-cyan-500 to-blue-600', text: 'text-white', border: 'border-cyan-300' },
    Gold: { bg: 'bg-gradient-to-r from-amber-400 to-yellow-500', text: 'text-slate-900', border: 'border-amber-300' },
    Silver: { bg: 'bg-gradient-to-r from-slate-300 to-gray-400', text: 'text-slate-900', border: 'border-slate-200' },
    Bronze: { bg: 'bg-gradient-to-r from-amber-700 to-orange-800', text: 'text-white', border: 'border-amber-600' },
  };

  const currentTierStyle = tierColors[tier] || tierColors.Bronze;

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    router.push('/');
  };

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-gray-100/90 hover:bg-gray-100 border border-gray-200/80 transition-all cursor-pointer group shadow-2xs"
        aria-expanded={isOpen}
      >
        <div className="w-7 h-7 rounded-full bg-[#7C6FE8] text-white flex items-center justify-center font-black text-xs shadow-xs group-hover:scale-105 transition-transform">
          {user.avatar ? (
            <img src={user.avatar} alt={displayName} className="w-full h-full rounded-full object-cover" />
          ) : (
            initial
          )}
        </div>

        <div className="flex flex-col text-left">
          <span className="text-xs font-bold text-slate-800 max-w-[90px] truncate leading-tight group-hover:text-[#7C6FE8] transition-colors">
            {displayName}
          </span>
          <span className="text-[9px] font-extrabold text-[#7C6FE8] leading-tight flex items-center gap-0.5">
            <span>{points.toLocaleString()} pts</span>
          </span>
        </div>
      </button>

      {/* Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full right-0 mt-2.5 w-[280px] bg-white/98 backdrop-blur-2xl rounded-3xl p-3.5 shadow-[0_24px_60px_-12px_rgba(15,23,42,0.18),0_0_0_1px_rgba(229,231,235,0.8)] border border-white/60 z-[120] text-slate-900 selection:bg-[#7C6FE8] selection:text-white flex flex-col gap-2"
          >
            {/* User Profile Card Summary */}
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-50/80 to-indigo-50/50 border border-purple-100 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-[#7C6FE8] text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt={displayName} className="w-full h-full rounded-2xl object-cover" />
                    ) : (
                      initial
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-extrabold text-xs text-slate-900 truncate">{displayName}</span>
                    <span className="text-[11px] text-gray-500 truncate">{user.email || user.username}</span>
                  </div>
                </div>
              </div>

              {/* VIP Tier & Points Strip */}
              <div className="flex items-center justify-between pt-1 border-t border-purple-200/50 text-xs">
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${currentTierStyle.bg} ${currentTierStyle.text} flex items-center gap-1 shadow-2xs`}>
                  <Crown className="w-2.5 h-2.5" />
                  <span>{tier} VIP</span>
                </span>
                <Link
                  href="/profile?tab=rewards"
                  onClick={() => setIsOpen(false)}
                  className="font-extrabold text-[11px] text-[#7C6FE8] hover:text-[#685bc7] flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{points.toLocaleString()} StarPoint</span>
                </Link>
              </div>
            </div>

            {/* Menu Navigation Links */}
            <div className="flex flex-col gap-0.5 py-1">
              <Link
                href="/profile?tab=tickets"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-purple-50/80 hover:text-[#7C6FE8] transition-all group cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Ticket className="w-4 h-4 text-[#7C6FE8]" />
                  <span>Vé Của Tôi (My Tickets)</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#7C6FE8] group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/profile?tab=starshop"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-purple-50/80 hover:text-[#7C6FE8] transition-all group cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  <span>Đơn Hàng Star Shop</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#7C6FE8] group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/profile?tab=overview"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-purple-50/80 hover:text-[#7C6FE8] transition-all group cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Thông Tin Cá Nhân & Điểm</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#7C6FE8] group-hover:translate-x-0.5 transition-all" />
              </Link>

              {/* Admin / Staff Guarded Link */}
              <PermissionGuard permissions={['admin', 'manage:cinemas', 'manage:movies', 'view:reports']}>
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#7C6FE8] bg-purple-50 hover:bg-purple-100 transition-all group cursor-pointer mt-1"
                >
                  <span className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#7C6FE8]" />
                    <span>Quản Trị Hệ Thống</span>
                  </span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-[#7C6FE8] text-white">
                    Admin
                  </span>
                </Link>
              </PermissionGuard>
            </div>

            {/* Logout Action */}
            <div className="pt-1.5 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất tài khoản</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
