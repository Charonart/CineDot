/**
 * Admin Cinema Domain Models & UI State Types
 */

export type SeatType = 'REGULAR' | 'VIP' | 'SWEETBOX' | 'MAINTENANCE';

export interface AdminSeatItem {
  id: string; // e.g. "A01"
  row: string; // "A"
  number: number; // 1
  type: SeatType;
  cx: number;
  cy: number;
  angle: number;
}

export interface AdminRoomItem {
  id: number;
  cinemaId: number;
  name: string;
  format: string; // "IMAX 3D Laser" | "4DX Motion" | "VIP Gold Class" | "2D Standard"
  roomType: string; // "IMAX" | "4DX" | "GOLD_CLASS" | "2D" | "3D"
  status: 'ACTIVE' | 'MAINTENANCE';
  totalSeats: number;
  seats: AdminSeatItem[];
}

export interface AdminCinemaItem {
  id: number;
  name: string;
  slug: string;
  address: string;
  provinceId?: number;
  city: string;
  phone: string;
  email: string;
  description: string;
  image?: string;
  isActive: boolean;
  totalScreens: number;
  rooms: AdminRoomItem[];
}

export interface ProvinceOption {
  id: number;
  name: string;
  slug: string;
}

export interface AdminCinemaPagination {
  currentPage: number;
  totalPages: number;
  totalResults: number;
}
