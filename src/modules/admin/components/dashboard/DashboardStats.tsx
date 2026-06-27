import React from 'react';
import { TrendingUp, Users, Ticket, Film, CircleDollarSign } from 'lucide-react';

const STATS = [
  {
    title: 'Tổng doanh thu',
    value: '1.240.000.000đ',
    trend: '+15%',
    isPositive: true,
    icon: CircleDollarSign,
  },
  {
    title: 'Vé đã bán',
    value: '12,450',
    trend: '+8%',
    isPositive: true,
    icon: Ticket,
  },
  {
    title: 'Khách hàng mới',
    value: '342',
    trend: '-2%',
    isPositive: false,
    icon: Users,
  },
  {
    title: 'Phim đang chiếu',
    value: '18',
    trend: 'Cập nhật hôm nay',
    isPositive: true,
    icon: Film,
  },
];

export const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {STATS.map((stat) => {
        const Icon = stat.icon;
        return (
          <div 
            key={stat.title} 
            className="bg-[var(--color-admin-surface)] p-6 rounded-2xl shadow-sm border border-[var(--color-admin-border)] hover:border-[var(--color-admin-brand-hover)] transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[var(--color-admin-brand-light)] rounded-xl text-[var(--color-admin-brand)] group-hover:scale-110 transition-transform">
                <Icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                stat.isPositive ? 'text-green-600' : 'text-red-500'
              }`}>
                {stat.trend.includes('%') && (
                  <TrendingUp size={16} className={!stat.isPositive ? 'rotate-180' : ''} />
                )}
                {stat.trend}
              </div>
            </div>
            
            <h3 className="text-[var(--color-admin-text-secondary)] text-sm font-medium mb-1">
              {stat.title}
            </h3>
            <p className="text-3xl font-bold text-[var(--color-admin-text-primary)]">
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
};
