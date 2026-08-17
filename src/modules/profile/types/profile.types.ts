export type ProfileDashboardTab =
  | 'TICKETS'
  | 'ORDERS'
  | 'ACCOUNT'
  | 'SECURITY';

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


