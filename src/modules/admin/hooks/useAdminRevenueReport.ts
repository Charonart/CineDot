import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminReportService } from '../services/adminReport.service';
import { GetRevenueReportParamsDTO } from '../dto/adminReport.dto';
import { RevenueReportData } from '../types/adminReport.types';

export const adminReportKeys = {
  all: ['admin', 'reports'] as const,
  revenue: (params?: GetRevenueReportParamsDTO) => [...adminReportKeys.all, 'revenue', params] as const,
};

export function useAdminRevenueReport(params: GetRevenueReportParamsDTO) {
  const queryClient = useQueryClient();

  const query = useQuery<RevenueReportData>({
    queryKey: adminReportKeys.revenue(params),
    queryFn: () => adminReportService.getRevenueReport(params),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const invalidateRevenue = () => {
    queryClient.invalidateQueries({ queryKey: adminReportKeys.all });
  };

  const fallbackData: RevenueReportData = {
    kpis: {
      totalRevenue: 0,
      totalTickets: 0,
      todayRevenue: 0,
      checkInRate: 0,
      revenueGrowthPercent: 0,
      ticketsGrowthPercent: 0,
      isPositiveGrowth: true,
      totalBookings: 0,
      totalCheckedIn: 0,
    },
    chartData: [],
    channels: [
      { id: 'APP', label: 'Mobile App (iOS / Android)', percentage: 62, tickets: 0, color: '#7C6FE8' },
      { id: 'WEB', label: 'Website (CineDot.vn)', percentage: 24, tickets: 0, color: '#6366F1' },
      { id: 'COUNTER', label: 'Tại Quầy Rạp', percentage: 14, tickets: 0, color: '#A78BFA' },
    ],
  };

  return {
    data: query.data || fallbackData,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    invalidateRevenue,
  };
}
