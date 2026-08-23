'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { DashboardFiltersState } from '../types/adminReport.types';
import { adminReportService } from '../services/adminReport.service';
import { useAdminRevenueReport } from '../hooks/useAdminRevenueReport';
import { useDashboardRealtime } from '../hooks/useDashboardRealtime';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardFilters } from './dashboard/DashboardFilters';
import { DashboardKpiCards } from './dashboard/DashboardKpiCards';
import { RevenueChart } from './dashboard/RevenueChart';
import { QuickStats } from './dashboard/QuickStats';
import { LiveActivity } from './dashboard/LiveActivity';
import { ErrorState } from '@/shared/ui/ErrorState';

export function AdminDashboardView() {
  // 1. Filter States
  const [filters, setFilters] = useState<DashboardFiltersState>(() => {
    const today = new Date();
    const past = new Date(today);
    past.setDate(past.getDate() - 29);

    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return {
      timeFilter: '30d',
      startDate: formatDate(past),
      endDate: formatDate(today),
      cinemaId: 'ALL',
      movieId: 'ALL',
    };
  });

  const handleFilterChange = (updated: Partial<DashboardFiltersState>) => {
    setFilters((prev) => {
      const next = { ...prev, ...updated };
      if (updated.timeFilter && updated.timeFilter !== 'custom') {
        const { startDate, endDate } = adminReportService.calculateDateRange(updated.timeFilter);
        next.startDate = startDate;
        next.endDate = endDate;
      }
      return next;
    });
  };

  // 2. Computed API Query Parameters
  const queryParams = useMemo(() => {
    const params: {
      start_date?: string;
      end_date?: string;
      group_by?: 'day' | 'week' | 'month';
      cinema_id?: number | string;
      movie_id?: number | string;
    } = {
      start_date: filters.startDate,
      end_date: filters.endDate,
      group_by: 'day',
    };

    if (filters.cinemaId && filters.cinemaId !== 'ALL') {
      params.cinema_id = filters.cinemaId;
    }
    if (filters.movieId && filters.movieId !== 'ALL') {
      params.movie_id = filters.movieId;
    }

    return params;
  }, [filters]);

  // 3. React Query for Revenue Data
  const { data, isLoading, isFetching, isError, error, refetch } = useAdminRevenueReport(queryParams);

  // 4. Realtime WebSocket Listener (Pusher / Laravel Echo)
  const handleRevenueUpdated = useCallback(() => {
    refetch();
  }, [refetch]);

  const { connectionStatus, recentActivities, activeToast, dismissToast } = useDashboardRealtime({
    onRevenueUpdated: handleRevenueUpdated,
    cinemaId: filters.cinemaId,
  });

  const timeFilterLabels: Record<string, string> = {
    today: 'Hôm nay',
    '7d': '7 ngày gần nhất',
    '30d': '30 ngày gần nhất',
    this_month: 'Tháng này',
    last_month: 'Tháng trước',
    custom: `Từ ${filters.startDate} đến ${filters.endDate}`,
  };

  return (
    <div className="flex flex-col gap-6 font-sans select-none">
      {/* Realtime Toast Notification */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md text-xs font-bold ${
              activeToast.type === 'success'
                ? 'bg-emerald-900/90 text-emerald-100 border-emerald-700'
                : activeToast.type === 'warning'
                ? 'bg-amber-900/90 text-amber-100 border-amber-700'
                : 'bg-slate-900/90 text-slate-100 border-slate-700'
            }`}
          >
            {activeToast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : activeToast.type === 'warning' ? (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-purple-400 shrink-0" />
            )}

            <span>{activeToast.message}</span>

            <button
              onClick={dismissToast}
              className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Page Header */}
      <DashboardHeader
        connectionStatus={connectionStatus}
        isFetching={isFetching}
        onRefresh={() => refetch()}
      />

      {/* 2. Filter Bar */}
      <DashboardFilters filters={filters} onChange={handleFilterChange} />

      {/* Error State if API fails */}
      {isError ? (
        <div className="p-8 rounded-3xl bg-white border border-rose-200 shadow-xs flex flex-col items-center justify-center gap-4">
          <ErrorState
            title="Không thể tải dữ liệu báo cáo"
            message={(error as Error)?.message || 'Đã xảy ra lỗi khi kết nối tới máy chủ CineDot.'}
            onRetry={() => refetch()}
          />
        </div>
      ) : (
        <>
          {/* 3. KPI Cards */}
          <DashboardKpiCards kpis={data.kpis} isLoading={isLoading} />

          {/* 4. Main Charts & Breakdown Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Revenue / Tickets SVG Chart (8/12) */}
            <div className="lg:col-span-8">
              <RevenueChart
                data={data.chartData}
                isLoading={isLoading}
                timeFilterLabel={timeFilterLabels[filters.timeFilter]}
              />
            </div>

            {/* Distribution Channels Breakdown (4/12) */}
            <div className="lg:col-span-4">
              <QuickStats channels={data.channels} />
            </div>
          </div>

          {/* 5. Live Activity Feed */}
          <LiveActivity activities={recentActivities} />
        </>
      )}
    </div>
  );
}
