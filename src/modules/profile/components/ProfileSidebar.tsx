'use client';

import React from 'react';
import { Ticket, ShoppingBag, User, History, Shield, Gift, LogOut, Sparkles } from 'lucide-react';
import { UserProfile, ProfileDashboardTab } from '../types/profile.types';
import { useAuthStore } from '@/shared/store/useAuthStore';

interface ProfileSidebarProps {
  profile: UserProfile;
  activeTab: ProfileDashboardTab;
  onSelectTab: (tab: ProfileDashboardTab) => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  profile,
  activeTab,
  onSelectTab,
}) => {
  const { logout } = useAuthStore();
  const pointsPercent = Math.min(100, Math.round((profile.cinePoints / profile.nextTierPoints) * 100));

  const navItems = [
    { id: 'TICKETS' as ProfileDashboardTab, label: 'Vé Của Tôi', icon: Ticket },
    { id: 'ORDERS' as ProfileDashboardTab, label: 'Đơn hàng của bạn', icon: ShoppingBag },
    { id: 'ACCOUNT' as ProfileDashboardTab, label: 'Thông Tin Cá Nhân', icon: User },
    { id: 'SECURITY' as ProfileDashboardTab, label: 'Bảo Mật Tài Khoản', icon: Shield },
  ];

  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-[0_16px_50px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col gap-6 sticky top-28">
      {/* 1. User Info Header */}
      <div className="flex flex-col items-center text-center gap-3 border-b border-gray-100 pb-5">
        <div className="relative">
          <img
            src={profile.avatarUrl}
            alt={profile.fullName}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-[#7C6FE8]/20 shadow-md"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#7C6FE8] text-white flex items-center justify-center text-[10px] shadow-sm">
            ✓
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="font-extrabold text-base text-[#131413] leading-tight">
            {profile.fullName}
          </h3>
          <span className="text-xs text-slate-400 font-medium">{profile.email}</span>
        </div>

        {/* Platinum Member Tier Badge */}
        <div className="px-3.5 py-1 rounded-full bg-gradient-to-r from-[#7C6FE8] to-indigo-600 text-white text-[11px] font-extrabold shadow-sm flex items-center gap-1.5 mt-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{profile.tierName}</span>
        </div>
      </div>

      {/* 2. CinePoints Loyalty Progress Bar */}
      <div className="flex flex-col gap-2 bg-slate-50 p-4 rounded-2xl border border-gray-100">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-600">Điểm CinePoints:</span>
          <span className="text-[#7C6FE8] font-extrabold">{profile.cinePoints.toLocaleString()} CP</span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#7C6FE8] to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${pointsPercent}%` }}
          />
        </div>

        <span className="text-[10px] text-slate-500 font-semibold text-right">
          Cần thêm {(profile.nextTierPoints - profile.cinePoints).toLocaleString()} CP để nâng hạng Diamond
        </span>
      </div>

      {/* 3. Navigation Vertical Menu */}
      <div className="flex flex-col gap-1 text-xs font-bold pt-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full px-4 py-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/25 font-bold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="w-full border-t border-gray-100 my-2" />

        {/* Logout Action */}
        <button
          onClick={logout}
          className="w-full px-4 py-3 rounded-2xl text-rose-600 hover:bg-rose-50 flex items-center gap-3 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Đăng Xuất</span>
        </button>
      </div>
    </div>
  );
};
