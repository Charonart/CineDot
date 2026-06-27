"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard,
  Calendar,
  Ticket,
  Film,
  Cookie,
  Tag,
  Building2,
  Monitor,
  Users,
  PanelLeftClose,
  PanelRightClose
} from 'lucide-react';
import { AdminUserDropdown } from './AdminUserDropdown';

const MENU_GROUPS = [
  {
    title: 'Tổng quan',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard }
    ]
  },
  {
    title: 'Vận hành',
    items: [
      { name: 'Lịch chiếu', href: '/admin/showtimes', icon: Calendar },
      { name: 'Đơn đặt vé', href: '/admin/orders', icon: Ticket }
    ]
  },
  {
    title: 'Nội dung',
    items: [
      { name: 'Quản lý phim', href: '/admin/movies', icon: Film },
      { name: 'Bắp nước F&B', href: '/admin/combos', icon: Cookie },
      { name: 'Khuyến mãi', href: '/admin/vouchers', icon: Tag }
    ]
  },
  {
    title: 'Hạ tầng',
    items: [
      { name: 'Cụm rạp', href: '/admin/cinemas', icon: Building2 },
      { name: 'Phòng & Ghế', href: '/admin/rooms', icon: Monitor }
    ]
  },
  {
    title: 'Hệ thống',
    items: [
      { name: 'Khách hàng', href: '/admin/users', icon: Users }
    ]
  }
];

export const AdminSidebar = () => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside 
      className={`${isExpanded ? 'w-[280px]' : 'w-[80px]'} bg-white border-r-2 border-[#E9E9F8] flex flex-col h-screen overflow-hidden text-sm transition-all duration-300 ease-in-out relative`}
    >
      {/* Top Profile Dropdown replacing Logo */}
      <AdminUserDropdown isExpanded={isExpanded} />

      {/* Main Navigation */}
      <nav className={`flex-1 overflow-y-auto ${isExpanded ? 'px-4' : 'px-3'} space-y-4 mt-4 transition-all duration-300`}>
        {MENU_GROUPS.map((group) => (
          <div key={group.title} className="space-y-1">
            {/* Group Label */}
            <div className={`text-[10px] font-bold text-[#8B949E] uppercase tracking-wider px-4 transition-all duration-300 whitespace-nowrap overflow-hidden ${isExpanded ? 'opacity-100 h-5 mt-1' : 'opacity-0 h-0 mt-0 pointer-events-none'}`}>
              {group.title}
            </div>

            {group.items.map((item) => {
              const isActive = pathname === item.href || (pathname === '/admin' && item.href === '/admin');
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center ${isExpanded ? 'px-4 py-2.5' : 'justify-center p-2.5'} rounded-2xl transition-all font-semibold text-[13.5px] group relative ${
                    isActive 
                      ? 'bg-[#F4F4FF] text-[#4F46E5]' // Brand active color
                      : 'text-[#1C1D22] hover:bg-gray-50'
                  }`}
                  title={!isExpanded ? item.name : undefined}
                >
                  <div className="relative shrink-0 flex items-center justify-center">
                    <Icon className={`w-[18px] h-[18px] ${isActive ? 'fill-current' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  
                  <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'w-36 opacity-100 ml-3' : 'w-0 opacity-0 ml-0'}`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Collapse Button */}
      <div className={`p-4 mt-auto border-t border-[#E9E9F8] flex ${isExpanded ? 'justify-end' : 'justify-center'} shrink-0`}>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-gray-50 rounded-xl text-[#8B949E] hover:text-[#1C1D22] transition-colors"
          title={isExpanded ? "Thu gọn" : "Mở rộng"}
        >
          {isExpanded ? <PanelLeftClose className="w-[22px] h-[22px]" /> : <PanelRightClose className="w-[22px] h-[22px]" />}
        </button>
      </div>
    </aside>
  );
};
