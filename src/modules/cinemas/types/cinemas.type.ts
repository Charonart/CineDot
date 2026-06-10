// ─── Cinemas Domain Types ──────────────────────────────────────────────────

export interface Screen {
  id: string;
  name: string;
  type: string;
  capacity: number;
}

export interface Cinema {
  id: string;
  slug: string;
  name: string;
  address: string;
  city: string;
  district: string;
  phone: string;
  email?: string;
  imageUrl: string;
  formats: string[];
  amenities: string[];
  totalScreens: number;
  totalSeats: number;
  openingHours: string;
  mapUrl: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  isFeatured: boolean;
  screens?: Screen[];
  href: string;
  showtimesHref: string;
}

export interface CinemaList {
  items: Cinema[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
}

export interface PricingRow {
  label: string;
  type: string;
  weekday: number;
  weekend: number;
  surcharge: number | null;
  description: string;
}

export interface Pricing {
  updatedAt: string;
  note: string;
  categories: PricingRow[];
}
