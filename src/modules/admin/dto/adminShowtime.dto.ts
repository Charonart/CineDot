export interface GetAdminShowtimesParams {
  cinema_id?: number | string;
  room_id?: number | string;
  movie_id?: number | string;
  date?: string; // YYYY-MM-DD
  limit?: number;
  page?: number;
}

export interface AdminShowtimeMovieDTO {
  movie_id: number;
  title: string;
  poster_url?: string;
  poster_path?: string;
  poster?: string;
  backdrop_path?: string;
  backdrop_url?: string;
  banner_url?: string;
  banner?: string;
  age_rating?: string;
  duration?: number;
  genres?: Array<{ genre_id: number; name: string }>;
}

export interface AdminShowtimeRoomCinemaDTO {
  cinema_id: number;
  cinema_name: string;
  cinema_address?: string;
}

export interface AdminShowtimeRoomDTO {
  room_id: number;
  cinema_id: number;
  room_name: string;
  room_type?: string;
  seat_matrix?: any[];
  cinema?: AdminShowtimeRoomCinemaDTO;
}

export interface AdminShowtimeItemDTO {
  showtime_id: number;
  movie_id: number;
  room_id: number;
  showtime_start: string; // ISO datetime
  showtime_end: string;   // ISO datetime
  base_price: number | string;
  layout_snaps?: any;
  created_at?: string;
  updated_at?: string;
  movie?: AdminShowtimeMovieDTO;
  room?: AdminShowtimeRoomDTO;
  total_seats_count?: number;
  booked_seats_count?: number;
}

export interface AdminShowtimeListResponseDTO {
  current_page: number;
  data: AdminShowtimeItemDTO[];
  first_page_url?: string;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CreateAdminShowtimeRequestDTO {
  movie_id: number;
  room_id: number;
  showtime_start: string; // YYYY-MM-DD HH:mm:ss or ISO
  showtime_end?: string;
  base_price?: number;
  buffer_minutes?: number;
}

export interface UpdateAdminShowtimeRequestDTO {
  movie_id?: number;
  room_id?: number;
  showtime_start?: string;
  showtime_end?: string;
  base_price?: number;
  buffer_minutes?: number;
}

export interface CloneDateShowtimesRequestDTO {
  source_date: string; // YYYY-MM-DD
  target_date: string; // YYYY-MM-DD
  cinema_id?: number;
}
