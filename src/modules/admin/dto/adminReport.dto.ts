export interface GetRevenueReportParamsDTO {
  start_date?: string;
  end_date?: string;
  group_by?: 'day' | 'week' | 'month';
  cinema_id?: number | string;
  movie_id?: number | string;
}

export interface RevenueChartPointDTO {
  date: string;
  revenue: number | string;
  tickets_sold?: number | string;
  tickets?: number | string;
  bookings_count?: number | string;
}

export interface RevenueSummaryDTO {
  total_revenue?: number | string;
  total_tickets?: number | string;
  total_tickets_sold?: number | string;
  today_revenue?: number | string;
  checkin_rate?: number | string;
  total_bookings?: number | string;
  total_checked_in?: number | string;
  growth_rate?: number | string;
  previous_period_revenue?: number | string;
}

export interface ChannelBreakdownDTO {
  channel: string;
  label?: string;
  percentage: number;
  tickets_count: number;
  revenue?: number;
}

export interface AdminRevenueReportResponseDTO {
  summary?: RevenueSummaryDTO;
  chart?: RevenueChartPointDTO[];
  daily_revenue?: RevenueChartPointDTO[];
  items?: RevenueChartPointDTO[];
  channels?: ChannelBreakdownDTO[];
  // Flexible backend payload
  [key: string]: unknown;
}
