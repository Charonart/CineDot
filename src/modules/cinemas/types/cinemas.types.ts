export interface CinemaRoomItem {
  id: string | number;
  roomId: string | number;
  name: string;
  roomName: string;
  roomType: string;
  totalSeats: number;
  screenType?: string;
  soundTechnology?: string;
  screenConfig?: {
    shape?: string;
    aspect_ratio?: string;
    width?: number;
    curve_depth?: number;
    label?: string;
    side_walls?: boolean;
  };
  features?: string[];
  isActive?: boolean;
}

export interface RoomLayoutSeat {
  seat_id: string;
  type: string;
  cx: number;
  cy: number;
  angle?: number;
}

export interface RoomScreenConfig {
  label: string;
  shape: 'curved' | 'flat' | 'led_wall' | string;
  width: number;
  curve_depth?: number;
  aspect_ratio?: string;
  side_walls?: boolean;
}

export interface RoomLayoutData {
  room_id: number | string;
  room_name: string;
  screen: RoomScreenConfig;
  total_seats: number;
  seats: RoomLayoutSeat[];
}

export interface CinemaItem {
  id: string;
  slug: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  status: 'OPEN' | 'MAINTENANCE';
  isOpen: boolean;
  bannerUrl: string;
  mapUrl: string;
  googleMapsEmbedUrl?: string;
  description: string;
  rooms?: CinemaRoomItem[];
}

export type PricingFormatTab = '2d' | '3d' | 'imax';

export interface TicketPriceCategory {
  dayType: string;
  timeSlot: string;
  standardPrice: number;
  vipPrice: number;
  sweetboxPrice: number;
}

export interface CinemaPricingFormat {
  formatName: string;
  formatBadge: string;
  categories: TicketPriceCategory[];
}

export interface CinemaShowtimeSlot {
  id: string | number;
  showtimeId: string | number;
  time: string;
  format: string;
  roomName: string;
  price?: string | number;
  screenType?: string;
}

export interface CinemaMovieShowtime {
  movieId: string | number;
  title: string;
  slug: string;
  posterUrl: string;
  ageRating: string;
  duration: string;
  genres: string;
  slots: CinemaShowtimeSlot[];
}
