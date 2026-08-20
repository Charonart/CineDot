/**
 * RBAC (Role-Based Access Control) Type Definitions
 */

export type AdminRole =
  | 'SUPER_ADMIN'
  | 'CINEMA_MANAGER'
  | 'TICKET_STAFF'
  | 'FNB_STAFF'
  | 'MARKETING'
  | 'ACCOUNTANT'
  | 'STAFF'
  | 'CUSTOMER';

export type PermissionSlug =
  | '*'
  | 'movies.*'
  | 'movies.view'
  | 'movies.create'
  | 'movies.edit'
  | 'movies.delete'
  | 'movies.genres.manage'
  | 'reviews.view'
  | 'reviews.delete'
  | 'cinemas.*'
  | 'cinemas.view'
  | 'cinemas.create'
  | 'cinemas.manage_rooms'
  | 'showtimes.*'
  | 'showtimes.view'
  | 'showtimes.create'
  | 'showtimes.edit'
  | 'showtimes.delete'
  | 'bookings.*'
  | 'bookings.view'
  | 'bookings.refund'
  | 'bookings.cancel'
  | 'tickets.*'
  | 'tickets.scan'
  | 'tickets.checkin'
  | 'fnb.claim'
  | 'concessions.*'
  | 'concessions.view'
  | 'concessions.manage'
  | 'staff.*'
  | 'staff.view'
  | 'staff.create'
  | 'staff.edit'
  | 'staff.manage'
  | 'staff.delete'
  | 'vouchers.*'
  | 'vouchers.view'
  | 'vouchers.manage'
  | 'reports.*'
  | 'reports.dashboard.view'
  | 'reports.revenue'
  | 'reports.tickets'
  | 'reports.occupancy'
  | 'settings.*'
  | 'settings.view'
  | 'settings.manage';

export interface RoleInfo {
  role: AdminRole;
  roleName: string;
  description: string;
  defaultPermissions: PermissionSlug[];
}

export const ROLE_DEFINITIONS: Record<AdminRole, RoleInfo> = {
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    roleName: 'Tổng Quản Trị Hệ Thống',
    description: 'Toàn quyền cấu hình hệ thống, quản lý tài khoản nhân sự và mọi cụm rạp.',
    defaultPermissions: ['*'],
  },
  CINEMA_MANAGER: {
    role: 'CINEMA_MANAGER',
    roleName: 'Quản Lý Cụm Rạp',
    description: 'Quản lý phòng chiếu, lịch chiếu, đơn vé và bắp nước tại cụm rạp được phân công.',
    defaultPermissions: [
      'reports.dashboard.view',
      'movies.view',
      'movies.create',
      'movies.edit',
      'reviews.view',
      'cinemas.view',
      'cinemas.manage_rooms',
      'showtimes.view',
      'showtimes.create',
      'showtimes.edit',
      'showtimes.delete',
      'bookings.view',
      'bookings.refund',
      'tickets.scan',
      'tickets.checkin',
      'fnb.claim',
      'concessions.view',
      'concessions.manage',
      'reports.revenue',
      'reports.tickets',
      'reports.occupancy',
    ],
  },
  TICKET_STAFF: {
    role: 'TICKET_STAFF',
    roleName: 'Nhân Viên Soát Vé',
    description: 'Thực hiện quét vé QR, đổi bắp nước (F&B Claim) tại cửa soát vé rạp.',
    defaultPermissions: [
      'tickets.scan',
      'tickets.checkin',
      'fnb.claim',
      'showtimes.view',
    ],
  },
  FNB_STAFF: {
    role: 'FNB_STAFF',
    roleName: 'Nhân Viên Quầy F&B',
    description: 'Quản lý quầy bắp nước, trả combo cho khách và kiểm kê tồn kho quầy.',
    defaultPermissions: ['fnb.claim', 'concessions.view', 'concessions.manage'],
  },
  MARKETING: {
    role: 'MARKETING',
    roleName: 'Chuyên Viên Marketing',
    description: 'Quản lý chiến dịch tiếp thị, tạo mã khuyến mãi, voucher và banner.',
    defaultPermissions: ['vouchers.*', 'reports.dashboard.view'],
  },
  ACCOUNTANT: {
    role: 'ACCOUNTANT',
    roleName: 'Kế Toán & Doanh Thu',
    description: 'Theo dõi báo cáo doanh thu vé, đối soát giao dịch và hoàn tiền đơn vé.',
    defaultPermissions: ['reports.revenue', 'reports.tickets', 'bookings.view', 'bookings.refund'],
  },
  STAFF: {
    role: 'STAFF',
    roleName: 'Nhân Viên Vận Hành',
    description: 'Nhân viên tổng hợp hỗ trợ bán vé và soát vé tại cụm rạp.',
    defaultPermissions: ['tickets.scan', 'tickets.checkin', 'fnb.claim'],
  },
  CUSTOMER: {
    role: 'CUSTOMER',
    roleName: 'Khách Hàng Hội Viên',
    description: 'Tài khoản khách hàng thành viên CineDot.',
    defaultPermissions: [],
  },
};

export const ROLE_NAME_MAP: Record<AdminRole, string> = {
  SUPER_ADMIN: 'Tổng Quản Trị Hệ Thống',
  CINEMA_MANAGER: 'Quản Lý Cụm Rạp',
  TICKET_STAFF: 'Nhân Viên Soát Vé',
  FNB_STAFF: 'Nhân Viên Quầy F&B',
  MARKETING: 'Chuyên Viên Marketing',
  ACCOUNTANT: 'Kế Toán & Doanh Thu',
  STAFF: 'Nhân Viên Vận Hành',
  CUSTOMER: 'Khách Hàng Hội Viên',
};
