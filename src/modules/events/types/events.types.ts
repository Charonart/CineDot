export type EventCategory =
  | 'ALL'
  | 'TICKET_PROMO'
  | 'FOOD_COMBO'
  | 'MEMBER_ONLY'
  | 'PARTNER_BANK';

export interface CineDotEvent {
  id: string;
  slug: string;
  title: string;
  category: EventCategory;
  categoryName: string;
  summary: string;
  description?: string;
  imageUrl: string;
  badgeText?: string;
  badgeType?: 'HOT' | 'LIMITED' | 'EXCLUSIVE';
  couponCode?: string;
  discountValue?: string;
  startDate: string;
  endDate: string;
  countdownSeconds?: number;
  applicableCinemas: string[];
  termsAndConditions: string[];
  stepsToRedeem: string[];
  isFeatured?: boolean;
}
