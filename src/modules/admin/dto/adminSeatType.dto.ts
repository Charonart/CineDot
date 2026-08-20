/**
 * Admin Seat Type DTOs (Data Transfer Objects)
 */

export interface SeatTypeDTO {
  seat_type: string;
  type_name: string;
  surcharge_amount: number | string;
  color_code: string;
  icon_name: string;
  description?: string | null;
  is_active: boolean | number;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSeatTypePayload {
  seat_type: string;
  type_name: string;
  surcharge_amount: number;
  color_code?: string;
  icon_name?: string;
  description?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface UpdateSeatTypePayload {
  type_name?: string;
  surcharge_amount?: number;
  color_code?: string;
  icon_name?: string;
  description?: string;
  is_active?: boolean;
  sort_order?: number;
}
