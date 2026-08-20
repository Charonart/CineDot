export interface GetAdminBookingsParams {
  page?: number;
  limit?: number;
  per_page?: number;
  status?: string;
  search?: string;
  cinema_id?: number;
}

export interface AdminBookingUserDTO {
  user_id: number;
  fullname?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface AdminBookingMovieDTO {
  movie_id: number;
  title: string;
  poster_url?: string;
  age_rating?: string;
  duration?: number;
}

export interface AdminBookingCinemaDTO {
  cinema_id: number;
  cinema_name: string;
  cinema_address?: string;
}

export interface AdminBookingRoomDTO {
  room_id: number;
  room_name: string;
  room_type?: string;
  cinema?: AdminBookingCinemaDTO;
}

export interface AdminBookingShowtimeDTO {
  showtime_id: number;
  showtime_start: string;
  showtime_end?: string;
  movie?: AdminBookingMovieDTO;
  room?: AdminBookingRoomDTO;
}

export interface AdminBookingSeatItemDTO {
  booking_seat_id: number;
  showtime_seat_id: number;
  ticket_type?: string;
  price: number | string;
  showtime_seat?: {
    showtime_seat_id: number;
    row_name: string;
    seat_number: number;
    seat_type?: string;
  };
}

export interface AdminBookingComboItemDTO {
  booking_combo_id: number;
  combo_id: number;
  quantity: number;
  is_claimed?: boolean;
  combo?: {
    combo_id: number;
    combo_name: string;
    price?: number | string;
  };
}

export interface AdminBookingItemDTO {
  booking_id: number;
  booking_code: string;
  user_id?: number;
  showtime_id?: number;
  voucher_id?: number | null;
  price_breakdown?: Record<string, any> | null;
  final_amount: number | string;
  discount_amount?: number | string;
  booking_status: string;
  checked_in_at?: string | null;
  created_at: string;
  updated_at?: string;
  user?: AdminBookingUserDTO;
  showtime?: AdminBookingShowtimeDTO;
  booking_seats?: AdminBookingSeatItemDTO[];
  bookingCombos?: AdminBookingComboItemDTO[];
  booking_combos?: AdminBookingComboItemDTO[];
}

export interface AdminBookingListResponseDTO {
  current_page: number;
  data: AdminBookingItemDTO[];
  first_page_url?: string;
  from?: number;
  last_page: number;
  last_page_url?: string;
  per_page: number;
  total: number;
}

export interface AdminBookingStatsDTO {
  totalBookings: number;
  totalRevenue: number;
  todayRevenue: number;
  totalCheckedIn: number;
  totalRefunded: number;
  checkInRate: number;
}

export interface RefundBookingRequestDTO {
  reason: string;
}
