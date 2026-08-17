export type ProfileDashboardTab =
  | 'TICKETS'
  | 'ORDERS'
  | 'REWARDS'
  | 'TRANSACTIONS'
  | 'ACCOUNT'
  | 'SECURITY';

export interface TierProgressionInfo {
  currentTier: string;
  currentPoints: number;
  discountPercent: number;
  nextTier?: string;
  pointsNeeded: number;
  nextTierMinPoints: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  city: string;
  avatarUrl: string;
  tierName: string;
  tierBadge: string;
  cinePoints: number;
  nextTierPoints: number;
  tierInfo?: TierProgressionInfo;
}

export interface UserTicketItem {
  bookingId: string;
  movieTitle: string;
  movieSlug: string;
  posterUrl: string;
  movieFormat: string;
  ageRating: string;
  cinemaName: string;
  roomName: string;
  showTime: string;
  showDate: string;
  seatLabels: string;
  totalPaid: number;
  qrCodeUrl: string;
  status: 'UPCOMING' | 'PAST' | 'CANCELLED';
  canCancel?: boolean;
}

export interface StarShopOrderItem {
  orderId: string;
  orderDate: string;
  cinemaName: string;
  totalAmount: number;
  status: 'WAITING_PICKUP' | 'COMPLETED' | 'CANCELLED';
  qrCodeUrl: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
}

export interface RewardVoucherItem {
  id: number | string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  minOrderValue?: number;
  maxDiscountValue?: number;
  validUntil: string;
  isActive: boolean;
  category?: 'TICKET' | 'FNB' | 'ALL';
}

export interface TransactionItem {
  id: string;
  bookingId: number | string;
  transactionCode: string;
  description: string;
  cinemaName?: string;
  amount: number;
  paymentMethod: string;
  status: string;
  statusLabel: string;
  pointsEarned: number;
  date: string;
  type: 'PAYMENT' | 'REFUND';
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}


