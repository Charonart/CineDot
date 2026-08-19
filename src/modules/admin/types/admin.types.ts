import { AdminRole, PermissionSlug } from './rbac.types';

export * from './rbac.types';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  role: AdminRole;
  roleName: string;
  cinemaId?: string | number | null;
  cinemaName?: string;
  permissions: PermissionSlug[] | string[];
  createdAt: string;
  status: 'ACTIVE' | 'DISABLED';
}

export interface AdminStaffItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: AdminRole;
  roleName: string;
  cinemaId?: string | number | null;
  cinemaName?: string;
  status: 'ACTIVE' | 'DISABLED';
  createdAt: string;
  permissions?: PermissionSlug[] | string[];
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
