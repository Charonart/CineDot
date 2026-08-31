/* Hallmark · component: ProfileSidebar · genre: modern-minimal · theme: White Minimal / Iris Cinema
 * states: default · hover · focus · active · disabled · loading · error · success
 * contrast: pass (46–50)
 */
'use client';

import React, { useState } from 'react';
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
  Award,
  Zap,
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
  ticketCount = 0,
  orderCount = 0,
  voucherCount = 0,
}) => {
  const { logout } = useAuthStore();
  const [imageError, setImageError] = useState(false);

  const tierName = profile?.tierName || 'Bronze';
  const tierLower = tierName.toLowerCase();
  const currentPoints = profile?.cinePoints || 0;
  const nextMinPoints = profile?.tierInfo?.nextTierMinPoints || profile?.nextTierPoints || 500;
  const pointsPercent = Math.min(
    100,
    Math.max(8, Math.round((currentPoints / nextMinPoints) * 100))
  );
  const nextTierName = profile?.tierInfo?.nextTier || (tierLower.includes('bronze') ? 'Silver' : tierLower.includes('silver') ? 'Gold' : 'Diamond');
  const pointsNeeded = profile?.tierInfo?.pointsNeeded ?? Math.max(0, nextMinPoints - currentPoints);

  // Dynamic Tier Metallic Color Mapping
  const getTierTheme = () => {
    if (tierLower.includes('diamond')) {
      return {
        badgeBg: 'bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-indigo-500/15 text-cyan-600 border-cyan-300/40',
        progressGrad: 'from-cyan-500 to-blue-600',
        icon: '💎',
        name: 'DIAMOND',
      };
    }
    if (tierLower.includes('gold')) {
      return {
        badgeBg: 'bg-gradient-to-r from-amber-500/15 via-yellow-500/15 to-amber-600/15 text-amber-700 border-amber-300/50',
        progressGrad: 'from-amber-400 to-amber-600',
        icon: '👑',
        name: 'GOLD',
      };
    }
    if (tierLower.includes('silver')) {
      return {
        badgeBg: 'bg-slate-100 text-slate-700 border-slate-300',
        progressGrad: 'from-slate-400 to-slate-600',
        icon: '✨',
        name: 'SILVER',
      };
    }
    return {
      badgeBg: 'bg-amber-900/10 text-amber-800 border-amber-700/20',
      progressGrad: 'from-[#7C6FE8] to-indigo-600',
      icon: '🥉',
      name: 'BRONZE',
    };
  };

  const tierTheme = getTierTheme();
  const initials = (profile?.fullName || 'User')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const navItems: {
    id: ProfileDashboardTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    {
      id: 'TICKETS',
      label: 'Vé Của Tôi',
      icon: Ticket,
      badge: ticketCount > 0 ? ticketCount : undefined,
    },
    {
      id: 'ORDERS',
      label: 'Đơn Hàng StarShop',
      icon: ShoppingBag,
      badge: orderCount > 0 ? orderCount : undefined,
    },
    {
      id: 'REWARDS',
      label: 'Kho Voucher & Ưu Đãi',
      icon: Gift,
      badge: voucherCount > 0 ? voucherCount : undefined,
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
    <aside className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_10px_30px_rgba(15,23,42,0.04)] flex flex-col gap-5">
      {/* 1. Member Profile Header Card */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
        {/* Avatar Circle */}
        <div className="relative shrink-0">
          {!imageError && profile?.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.fullName || 'User avatar'}
              onError={() => setImageError(true)}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#7C6FE8]/20 shadow-xs"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C6FE8] via-indigo-600 to-purple-800 text-white flex items-center justify-center font-black text-lg shadow-sm shadow-[#7C6FE8]/25 ring-2 ring-white">
              {initials || 'CD'}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] ring-2 ring-white font-bold shadow-xs">
            ✓
          </div>
        </div>

        {/* Member Details */}
        <div className="flex flex-col min-w-0 flex-1">
          <h3 className="font-black text-base text-slate-900 truncate leading-tight tracking-tight">
            {profile?.fullName || 'Khách Hàng CineDot'}
          </h3>
          <span className="text-xs text-slate-400 truncate font-medium mt-0.5">
            {profile?.email || 'user@cinedot.vn'}
          </span>
          <div className="flex items-center gap-1 mt-1.5">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-2xs ${tierTheme.badgeBg}`}
            >
              <span>{tierTheme.icon}</span>
              <span>{tierTheme.name}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. CinePoints & Progress Track */}
      <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-slate-600 font-bold flex items-center gap-1.5 text-xs">
            <Sparkles className="w-4 h-4 text-[#7C6FE8]" />
            <span>Điểm CinePoints:</span>
          </span>
          <span className="font-mono font-black text-[#7C6FE8] text-sm">
            {currentPoints.toLocaleString()} <span className="text-[11px] font-sans font-extrabold text-slate-400">CP</span>
          </span>
        </div>

        {/* Custom Glowing Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-200/90 overflow-hidden p-0.5">
          <div
            className={`h-full bg-gradient-to-r ${tierTheme.progressGrad} rounded-full transition-all duration-700 ease-out shadow-xs`}
            style={{ width: `${pointsPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>
            {pointsNeeded > 0 ? (
              <>Cần thêm <strong className="text-slate-900 font-bold">{pointsNeeded.toLocaleString()} CP</strong> lên {nextTierName}</>
            ) : (
              'Hạng thành viên tối cao'
            )}
          </span>
          <span className="font-bold text-[#7C6FE8]">{pointsPercent}%</span>
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
              className={`w-full px-4 py-3 rounded-2xl flex items-center justify-between transition-all duration-200 cursor-pointer text-xs font-bold group ${
                isActive
                  ? 'bg-gradient-to-r from-[#7C6FE8] to-indigo-600 text-white shadow-md shadow-[#7C6FE8]/25 font-black scale-[1.01]'
                  : 'text-slate-700 hover:bg-slate-50/90 hover:text-[#7C6FE8]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#7C6FE8]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black leading-none ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-purple-100 text-[#7C6FE8] group-hover:bg-[#7C6FE8] group-hover:text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isActive
                      ? 'text-white translate-x-0.5'
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
          className="w-full px-4 py-3 rounded-2xl text-slate-500 hover:text-rose-600 hover:bg-rose-50/80 flex items-center justify-between transition-all duration-200 text-xs font-bold cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
            <span>Đăng Xuất Tài Khoản</span>
          </div>
          <span className="text-[10px] text-slate-400 group-hover:text-rose-400 font-semibold">Thoát</span>
        </button>
      </nav>
    </aside>
  );
};
