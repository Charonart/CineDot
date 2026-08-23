export type RealtimeConnectionStatus = 'connecting' | 'connected' | 'disconnected';

export type TimeFilterKey = 'today' | '7d' | '30d' | 'this_month' | 'last_month' | 'custom';

export interface RevenueKpis {
  totalRevenue: number;
  totalTickets: number;
  todayRevenue: number;
  checkInRate: number;
  revenueGrowthPercent: number;
  ticketsGrowthPercent: number;
  isPositiveGrowth: boolean;
  totalBookings: number;
  totalCheckedIn: number;
}

export interface RevenueChartItem {
  date: string;
  rawDate: string;
  revenue: number;
  ticketsSold: number;
  formattedRevenue: string;
}

export interface ChannelStatItem {
  id: string;
  label: string;
  percentage: number;
  tickets: number;
  color: string;
}

export interface LiveActivityItem {
  id: string;
  bookingCode: string;
  action: string;
  actionType: 'payment_completed' | 'refund_completed' | 'booking_cancelled' | 'check_in' | 'general';
  amount?: number;
  time: string;
  timestamp: number;
  customerName?: string;
  cinemaName?: string;
}

export interface RevenueReportData {
  kpis: RevenueKpis;
  chartData: RevenueChartItem[];
  channels: ChannelStatItem[];
}

export interface DashboardFiltersState {
  timeFilter: TimeFilterKey;
  startDate: string;
  endDate: string;
  cinemaId: string;
  movieId: string;
}
