'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Target, Ticket, Image as ImageIcon, Sparkles } from 'lucide-react';

interface TabItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const TABS: TabItem[] = [
  {
    name: 'Chiến Dịch Tiếp Thị (Campaigns)',
    href: '/admin/campaign',
    icon: Target,
    description: 'Ngân sách & Hiệu quả ROI',
  },
  {
    name: 'Mã Giảm Giá (Vouchers)',
    href: '/admin/campaign/voucher',
    icon: Ticket,
    description: 'Kho Coupon & Hạn mức',
  },
  {
    name: 'Banner Quảng Cáo (Banners)',
    href: '/admin/campaign/banner',
    icon: ImageIcon,
    description: 'Slider & Poster sự kiện',
  },
];

export const MarketingSubNavTabs: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="w-full bg-white/90 backdrop-blur-md rounded-3xl p-2 border border-purple-100/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
      {/* Tab Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
        {TABS.map((tab) => {
          const isActive =
            tab.href === '/admin/campaign'
              ? pathname === '/admin/campaign'
              : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#7C6FE8] text-white shadow-md shadow-[#7C6FE8]/25 scale-[1.01]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-purple-50/60'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? 'scale-110' : 'text-slate-400'
                }`}
              />
              <div className="flex flex-col text-left">
                <span className="leading-tight">{tab.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Mini badge */}
      <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-[11px] font-extrabold text-[#7C6FE8] tracking-wider uppercase">
        <Sparkles className="w-3.5 h-3.5" />
        <span>CineDot Marketing Suite</span>
      </div>
    </div>
  );
};
