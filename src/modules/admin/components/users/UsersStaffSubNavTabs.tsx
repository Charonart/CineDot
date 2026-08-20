'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, UserCheck, ShieldCheck, Award } from 'lucide-react';

interface TabItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  exact?: boolean;
}

export function UsersStaffSubNavTabs() {
  const pathname = usePathname();

  const tabs: TabItem[] = [
    {
      name: 'Đội Ngũ Nhân Sự',
      href: '/admin/users-staff',
      icon: Users,
      exact: true,
    },
    {
      name: 'Khách Hàng & Hội Viên',
      href: '/admin/users-staff/customers',
      icon: UserCheck,
    },
    {
      name: 'Phân Quyền RBAC',
      href: '/admin/users-staff/roles',
      icon: ShieldCheck,
    },
    {
      name: 'Hạng Thành Viên',
      href: '/admin/users-staff/tiers',
      icon: Award,
    },
  ];

  const isTabActive = (tab: TabItem) => {
    if (tab.exact) {
      return pathname === tab.href;
    }
    return pathname.startsWith(tab.href);
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl p-1.5 border border-purple-100/80 shadow-xs mb-2">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const active = isTabActive(tab);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                active
                  ? 'bg-gradient-to-r from-[#7C6FE8] to-[#9165E0] text-white shadow-sm shadow-[#7C6FE8]/30 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-purple-50/50'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-[#7C6FE8]'}`} />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
