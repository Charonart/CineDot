export type PaymentMethodId = 'VNPAY' | 'MOMO' | 'ZALOPAY' | 'SHOPEEPAY' | 'ATM' | 'VISA' | 'VIETQR';

export interface PaymentMethodItem {
  id: PaymentMethodId;
  name: string;
  subtitle: string;
  iconUrl?: string;
  badgeText?: string;
  category: 'wallet' | 'bank' | 'card';
}

export interface VoucherInfo {
  code: string;
  discountAmount: number;
  discountType: 'fixed' | 'percentage';
  description: string;
  minSpend?: number;
}

export interface PaymentSummaryInfo {
  showtimeId: string;
  movieSlug: string;
  movieTitle: string;
  movieFormat: string;
  posterUrl: string;
  ageRating: string;
  cinemaName: string;
  roomName: string;
  showTime: string;
  showDate: string;
  seatsSummaryText: string;
  ticketPrice: number;
  foodSummaryList: { name: string; quantity: number; price: number }[];
  totalFoodPrice: number;
}
