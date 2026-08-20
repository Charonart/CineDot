/**
 * Admin Seat Type Domain Models & Options
 */

export interface AdminSeatTypeItem {
  key: string; // e.g. 'standard', 'vip', 'couple', 'sweetbox', 'deluxe', 'bed'
  name: string; // e.g. 'Ghế Tiêu Chuẩn', 'Ghế VIP Prime'
  surcharge: number; // e.g. 0, 20000, 40000
  color: string; // e.g. '#64748B', '#7C6FE8', '#EC4899'
  icon: string; // e.g. 'seat', 'star', 'heart', 'crown', 'bed'
  description?: string;
  isActive: boolean;
  sortOrder: number;
}
