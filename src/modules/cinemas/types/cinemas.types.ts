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
