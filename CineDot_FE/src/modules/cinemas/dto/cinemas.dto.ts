// ─── Cinemas DTOs ──────────────────────────────────────────────────────────

export interface ScreenDTO {
  id: string;
  name: string;
  type: string;
  capacity: number;
}

export interface CinemaDTO {
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
  screens?: ScreenDTO[];
}

export interface CinemaListResponseDTO {
  page: number;
  totalPages: number;
  totalResults: number;
  results: CinemaDTO[];
}

export interface PricingRowDTO {
  label: string;
  type: string;
  weekday: number;
  weekend: number;
  surcharge: number | null;
  description: string;
}

export interface PricingDTO {
  updatedAt: string;
  note: string;
  categories: PricingRowDTO[];
}
