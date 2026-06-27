"use client";

import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Settings, HelpCircle, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth, useLogout } from '@/modules/auth';

interface AdminUserDropdownProps {
  isExpanded: boolean;
}

export const AdminUserDropdown = ({ isExpanded }: AdminUserDropdownProps) => {
  const { user } = useAuth();
  const { mutate: logout } = useLogout();

  const userName = user?.name || 'Admin User';
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'AD';

  const role = user?.roles?.[0] || 'admin';
  const roleName = role === 'admin' ? 'Quản trị viên' : role === 'staff' ? 'Nhân viên' : 'Khách hàng';

  return (
    <div className={`px-4 pt-4 pb-2 shrink-0 transition-all duration-300`}>
      <Menu>
        <MenuButton 
          className={`flex items-center ${isExpanded ? 'justify-between px-3 py-2 w-full' : 'justify-center p-2 w-[48px]'} bg-white border border-[var(--color-admin-border)] hover:border-[var(--color-admin-brand)] rounded-2xl transition-all shadow-sm group outline-none mx-auto`}
        >
          <div className="flex items-center justify-center shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--color-admin-brand)] to-purple-400 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-white">{initials}</span>
              )}
            </div>
            
            <div className={`flex flex-col items-start whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100 max-w-[120px] ml-3' : 'opacity-0 max-w-0 ml-0'}`}>
              <span className="text-[14px] font-semibold text-[var(--color-admin-text-primary)] leading-tight">
                {userName}
              </span>
              <span className="text-[12px] text-[var(--color-admin-text-secondary)] font-medium mt-0.5">
                {roleName}
              </span>
            </div>
          </div>
          
          {isExpanded && (
            <ChevronDown className="w-4 h-4 text-[var(--color-admin-text-secondary)] group-hover:text-[var(--color-admin-text-primary)] shrink-0 ml-2" />
          )}
        </MenuButton>

        <MenuItems
          transition
          anchor={isExpanded ? "bottom start" : "bottom end"}
          className="w-64 mt-2 origin-top rounded-2xl bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] ring-1 ring-black/5 focus:outline-none transition duration-150 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 p-1.5 z-50"
        >
          <MenuItem>
            <button className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium text-[var(--color-admin-text-secondary)] hover:bg-[var(--color-admin-brand-light)] hover:text-[var(--color-admin-brand)] transition-colors data-[focus]:bg-[var(--color-admin-brand-light)] data-[focus]:text-[var(--color-admin-brand)]">
              <User className="h-[18px] w-[18px]" />
              Hồ sơ
            </button>
          </MenuItem>

          <MenuItem>
            <button className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-[var(--color-admin-text-secondary)] hover:bg-[var(--color-admin-brand-light)] hover:text-[var(--color-admin-brand)] transition-colors data-[focus]:bg-[var(--color-admin-brand-light)] data-[focus]:text-[var(--color-admin-brand)]">
              <Settings className="h-[18px] w-[18px]" />
              Cài đặt
            </button>
          </MenuItem>

          <MenuItem>
            <button className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-[var(--color-admin-text-secondary)] hover:bg-[var(--color-admin-brand-light)] hover:text-[var(--color-admin-brand)] transition-colors data-[focus]:bg-[var(--color-admin-brand-light)] data-[focus]:text-[var(--color-admin-brand)]">
              <HelpCircle className="h-[18px] w-[18px]" />
              Trợ giúp & Hỗ trợ
            </button>
          </MenuItem>

          <div className="my-1.5 h-px bg-[var(--color-admin-border)]" />

          <MenuItem>
            <button 
              onClick={() => logout()}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors data-[focus]:bg-red-50 data-[focus]:text-red-600 w-full text-left"
            >
              <LogOut className="h-[18px] w-[18px]" />
              Đăng xuất
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
};
