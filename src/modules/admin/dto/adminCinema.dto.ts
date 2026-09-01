/**
 * Admin Cinema & Room DTOs
 * API Contracts with CineDot Backend
 */

export interface SeatMatrixItemDTO {
  seat_id: string;
  row_name?: string;
  row?: string;
  seat_number?: number;
  number?: number;
  type?: string; // "STANDARD" | "VIP" | "SWEETBOX" | "COUPLE" | "MAINTENANCE"
  seat_type?: string;
  cx?: number;
  cy?: number;
  angle?: number;
}

export interface AdminRoomItemDTO {
  room_id: number;
  id?: number;
  cinema_id?: number;
  room_name: string;
  room_type?: string; // "IMAX", "2D", "3D", "4DX", "GOLD_CLASS", "SCREENX", "DOLBY_CINEMA", "ONYX_LED"
  screen_type?: string;
  sound_technology?: string;
  screen_config?: any;
  features?: string[];
  template_key?: string;
  seat_matrix?: SeatMatrixItemDTO[] | null;
  total_seats?: number;
  is_active?: boolean;
}

export interface AdminCinemaItemDTO {
  cinema_id: number;
  id?: number;
  cinema_name: string;
  name?: string;
  slug?: string;
  cinema_address?: string;
  address?: string;
  province_id?: number;
  province?: string;
  phone?: string;
  email?: string;
  description?: string;
  is_active?: boolean;
  rooms?: AdminRoomItemDTO[];
}

export interface AdminCinemaListResponseDTO {
  current_page?: number;
  page?: number;
  data?: AdminCinemaItemDTO[];
  results?: AdminCinemaItemDTO[];
  total?: number;
  totalResults?: number;
  last_page?: number;
  totalPages?: number;
  per_page?: number;
}

export interface CreateCinemaRequestDTO {
  cinema_name: string;
  slug?: string;
  cinema_address?: string;
  province_id?: number;
  phone?: string;
  email?: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateCinemaRequestDTO {
  cinema_name?: string;
  slug?: string;
  cinema_address?: string;
  province_id?: number;
  phone?: string;
  email?: string;
  description?: string;
  is_active?: boolean;
}

export interface CreateRoomRequestDTO {
  room_name: string;
  room_type?: string;
  screen_type?: string;
  sound_technology?: string;
  screen_config?: any;
  features?: string[];
  template_key?: string;
  total_seats?: number;
  seat_matrix?: SeatMatrixItemDTO[];
  is_active?: boolean;
}

export interface UpdateRoomRequestDTO {
  room_name?: string;
  room_type?: string;
  screen_type?: string;
  sound_technology?: string;
  screen_config?: any;
  features?: string[];
  template_key?: string;
  total_seats?: number;
  seat_matrix?: SeatMatrixItemDTO[];
  is_active?: boolean;
}

export interface ProvinceItemDTO {
  province_id: number;
  province_name: string;
  slug?: string;
}

export interface ProvinceListResponseDTO {
  results?: ProvinceItemDTO[];
  data?: ProvinceItemDTO[];
}
