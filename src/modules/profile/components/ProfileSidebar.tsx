/* Hallmark · component: ProfileSidebar · genre: modern-minimal · theme: White Minimal / Iris Cinema
 * states: default · hover · focus · active · disabled · loading · error · success
 * contrast: pass (46–50)
 */
'use client';

import React from 'react';
import {
  Ticket,
  ShoppingBag,
  User,
  History,
  Shield,
  Gift,
  LogOut,
  Sparkles,
  ChevronRight,
  Crown,
} from 'lucide-react';
import { UserProfile, ProfileDashboardTab } from '../types/profile.types';
import { useAuthStore } from '@/shared/store/useAuthStore';

interface ProfileSidebarProps {
  profile: UserProfile;
  activeTab: ProfileDashboardTab;
  onSelectTab: (tab: ProfileDashboardTab) => void;
  ticketCount?: number;
  orderCount?: number;
  voucherCount?: number;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  profile,
  activeTab,
  onSelectTab,
  ticketCount,
  orderCount,
  voucherCount,
}) => {
  const { logout } = useAuthStore();
  const tierInfo = profile?.tierInfo;
  const currentPoints = profile?.cinePoints || 0;
  const nextMinPoints = Math.max(1, tierInfo?.nextTierMinPoints || profile?.nextTierPoints || 3000);
  const pointsPercent = Math.min(
    100,
    Math.max(6, Math.round((currentPoints / nextMinPoints) * 100))
  );
  const nextTierName = tierInfo?.nextTier || 'Diamond';
  const pointsNeeded = tierInfo?.pointsNeeded ?? Math.max(0, nextMinPoints - currentPoints);

  const navItems: {
    id: ProfileDashboardTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
  }[] = [
    {
      id: 'TICKETS',
      label: 'Vé Của Tôi',
      icon: Ticket,
      badge: ticketCount && ticketCount > 0 ? ticketCount : undefined,
    },
    {
      id: 'ORDERS',
      label: 'Đơn Hàng StarShop',
      icon: ShoppingBag,
      badge: orderCount && orderCount > 0 ? orderCount : undefined,
    },
    {
      id: 'REWARDS',
      label: 'Kho Voucher & Ưu Đãi',
      icon: Gift,
      badge: voucherCount && voucherCount > 0 ? voucherCount : undefined,
    },
    {
      id: 'TRANSACTIONS',
      label: 'Lịch Sử Giao Dịch',
      icon: History,
    },
    {
      id: 'ACCOUNT',
      label: 'Thông Tin Cá Nhân',
      icon: User,
    },
    {
      id: 'SECURITY',
      label: 'Bảo Mật Tài Khoản',
      icon: Shield,
    },
  ];

  return (
    <aside className="w-full bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col gap-5">
      {/* 1. Compact Member Profile Header */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
        <div className="relative shrink-0">
          <img
            src={
              profile?.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
            }
            alt={profile?.fullName || 'User avatar'}
            className="w-13 h-13 rounded-2xl object-cover ring-2 ring-[#7C6FE8]/20 shadow-xs"
          />
          <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] ring-2 ring-white font-bold">
            ✓
          </div>
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-extrabold text-sm text-slate-900 truncate leading-tight">
              {profile?.fullName || 'Khách Hàng CineDot'}
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 truncate font-medium">
            {profile?.email || 'user@cinedot.vn'}
          </span>
          <div className="flex items-center gap-1 mt-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#7C6FE8]/10 text-[#7C6FE8] text-[10px] font-black uppercase tracking-wider border border-[#7C6FE8]/20">
              <Crown className="w-3 h-3 text-[#7C6FE8]" />
              <span>{profile?.tierName || 'Gold Member'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Sleek CinePoints & Tier Progress Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-600 flex items-center gap-1 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-[#7C6FE8]" />
            <span>CinePoints:</span>
          </span>
          <span className="font-mono font-black text-[#7C6FE8] text-xs">
            {currentPoints.toLocaleString()} CP
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#7C6FE8] to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${pointsPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
          <span>
            {pointsNeeded > 0
              ? `Cần thêm ${pointsNeeded.toLocaleString()} CP lên ${nextTierName}`
              : 'Đã đạt hạng cao nhất'}
          </span>
          <span className="font-bold text-slate-700">{pointsPercent}%</span>
        </div>
      </div>

      {/* 3. Navigation Vertical List */}
      <nav className="flex flex-col gap-1 pt-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`w-full px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer text-xs font-bold group ${
                isActive
                  ? 'bg-[#7C6FE8] text-white shadow-sm shadow-[#7C6FE8]/25 font-extrabold'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-[#7C6FE8]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#7C6FE8]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-purple-100 text-[#7C6FE8] group-hover:bg-[#7C6FE8] group-hover:text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    isActive
                      ? 'text-white/80 translate-x-0.5'
                      : 'text-slate-300 group-hover:text-[#7C6FE8] group-hover:translate-x-0.5'
                  }`}
                />
              </div>
            </button>
          );
        })}

        <div className="w-full border-t border-slate-100 my-2" />

        {/* Logout Action */}
        <button
          type="button"
          onClick={logout}
          className="w-full px-3.5 py-2.5 rounded-2xl text-slate-500 hover:text-rose-600 hover:bg-rose-50/60 flex items-center justify-between transition-colors text-xs font-bold cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
            <span>Đăng Xuất</span>
          </div>
          <span className="text-[10px] text-slate-400 group-hover:text-rose-400">Thoát</span>
        </button>
      </nav>
    </aside>
  );
};
