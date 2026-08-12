export type AdminRole = 'SUPER_ADMIN' | 'CINEMA_MANAGER' | 'TICKET_STAFF';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  roleName: string;
  cinemaName?: string;
  phone?: string;
  createdAt: string;
  status: 'ACTIVE' | 'DISABLED';
}

export interface AdminDashboardMetrics {
  totalRevenue: number;
  totalTicketsSold: number;
  activeMoviesCount: number;
  totalUsersCount: number;
  revenueGrowthPercent: number;
  ticketsGrowthPercent: number;
}

export interface AdminRecentTransaction {
  id: string;
  bookingCode: string;
  customerName: string;
  movieTitle: string;
  cinemaName: string;
  showtime: string;
  seatCount: number;
  totalAmount: number;
  paymentMethod: string;
  status: 'SUCCESS' | 'CHECKED_IN' | 'CANCELLED';
  createdAt: string;
}
