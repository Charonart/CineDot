// ─── Events DTOs ───────────────────────────────────────────────────────────

export type EventCategory = 'now' | 'promotions' | 'news';

export interface EventDTO {
  id: string;
  slug: string;
  title: string;
  description: string;
  content?: string;
  category: EventCategory;
  imageUrl: string;
  startDate: string;
  endDate: string | null;
  condition: string | null;
  ctaLabel: string;
  isActive: boolean;
  isFeatured: boolean;
  badge: string | null;
  location?: string;
  organizer?: string;
  highlights?: string[];
}

export interface EventListResponseDTO {
  page: number;
  totalPages: number;
  totalResults: number;
  results: EventDTO[];
}
