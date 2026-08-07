export type ProfileDashboardTab =
  | 'TICKETS'
  | 'ORDERS'
  | 'ACCOUNT'
  | 'TRANSACTIONS'
  | 'SECURITY'
  | 'REWARDS';

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

export interface TransactionItem {
  id: string;
  transactionCode: string;
  date: string;
  description: string;
  paymentMethod: string;
  amount: number;
  status: 'SUCCESS' | 'REFUNDED' | 'FAILED';
}

export interface RewardVoucherItem {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  code: string;
  expiryDate: string;
  category: 'TICKET' | 'FOOD' | 'GIFT';
}
