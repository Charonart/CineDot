import React from 'react';
import { TrendingUp, Ticket, Clock, CheckCircle2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { RevenueKpis } from '../../types/adminReport.types';
import { Skeleton } from '@/shared/ui/Skeleton';

interface DashboardKpiCardsProps {
  kpis: RevenueKpis;
  isLoading: boolean;
}

export const DashboardKpiCards: React.FC<DashboardKpiCardsProps> = ({ kpis, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Skeleton className="w-24 h-4 rounded-md" />
              <Skeleton className="w-8 h-8 rounded-xl" />
            </div>
            <Skeleton className="w-36 h-7 rounded-lg" />
            <Skeleton className="w-20 h-3 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      id: 'total-revenue',
      title: 'Tổng Doanh Thu',
      value: `${kpis.totalRevenue.toLocaleString('vi-VN')} ₫`,
      subtitle: 'so với kỳ trước',
      growth: `${kpis.revenueGrowthPercent >= 0 ? '+' : ''}${kpis.revenueGrowthPercent.toFixed(1)}%`,
      isPositive: kpis.revenueGrowthPercent >= 0,
      icon: TrendingUp,
      iconBg: 'bg-purple-50 text-[#7C6FE8]',
    },
    {
      id: 'total-tickets',
      title: 'Tổng Vé Đã Bán',
      value: `${kpis.totalTickets.toLocaleString('vi-VN')} Vé`,
      subtitle: 'so với kỳ trước',
      growth: `${kpis.ticketsGrowthPercent >= 0 ? '+' : ''}${kpis.ticketsGrowthPercent.toFixed(1)}%`,
      isPositive: kpis.ticketsGrowthPercent >= 0,
      icon: Ticket,
      iconBg: 'bg-indigo-50 text-indigo-600',
    },
    {
      id: 'today-revenue',
      title: 'Doanh Thu Hôm Nay',
      value: `${kpis.todayRevenue.toLocaleString('vi-VN')} ₫`,
      subtitle: 'phát sinh trong ngày',
      growth: null,
      isPositive: true,
      icon: Clock,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'checkin-rate',
      title: 'Tỷ Lệ Check-In',
      value: `${kpis.checkInRate.toFixed(1)}%`,
      subtitle: `${kpis.totalCheckedIn.toLocaleString('vi-VN')} / ${kpis.totalBookings.toLocaleString('vi-VN')} vé đã đến rạp`,
      growth: null,
      isPositive: true,
      icon: CheckCircle2,
      iconBg: 'bg-sky-50 text-sky-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => {
        const IconComp = card.icon;
        return (
          <div
            key={card.id}
            className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-200 transition-all duration-200 flex flex-col justify-between gap-3"
          >
            {/* Top Row: Label & Icon */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">{card.title}</span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${card.iconBg}`}>
                <IconComp className="w-4 h-4" />
              </div>
            </div>

            {/* Middle Row: Primary Value */}
            <div className="flex flex-col gap-0.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono">
                {card.value}
              </span>
            </div>

            {/* Bottom Row: Comparison badge or subtext */}
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
              <span>{card.subtitle}</span>

              {card.growth && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-0.5 ${
                    card.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {card.isPositive ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  <span>{card.growth}</span>
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
