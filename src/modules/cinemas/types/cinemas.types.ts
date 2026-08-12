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
