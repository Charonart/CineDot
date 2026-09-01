/**
 * Admin Cinema Domain Models & UI State Types
 */

export type SeatType = 'REGULAR' | 'STANDARD' | 'VIP' | 'COUPLE' | 'SWEETBOX' | 'DELUXE' | 'BED' | 'MAINTENANCE' | string;

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
  format: string; // "IMAX 3D Laser" | "ScreenX 270°" | "Dolby Cinema" | "Samsung Onyx Cinema LED" | "VIP Gold Class" | "2D Standard"
  roomType: string; // "IMAX" | "SCREENX" | "DOLBY_CINEMA" | "ONYX_LED" | "GOLD_CLASS" | "2D" | "3D"
  screen_type?: string;
  sound_technology?: string;
  screen_config?: any;
  features?: string[];
  template_key?: string;
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
