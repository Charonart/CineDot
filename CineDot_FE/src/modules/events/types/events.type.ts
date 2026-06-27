// ─── Events Domain Types ───────────────────────────────────────────────────

export type EventCategory = 'now' | 'promotions' | 'news';

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  now: 'Đang diễn ra',
  promotions: 'Ưu đãi đặc biệt',
  news: 'Tin tức',
};

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  content?: string;
  category: EventCategory;
  categoryLabel: string;
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
  href: string;
}

export interface EventList {
  items: Event[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
}
