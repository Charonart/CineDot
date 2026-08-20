export type BookingStatusType = 'completed' | 'paid' | 'pending' | 'cancelled' | 'refunded' | 'cancelling' | 'ALL';

export interface AdminBookingSeat {
  id: number;
  seatId: number;
  seatCode: string;
  ticketType: string;
  price: number;
}

export interface AdminBookingCombo {
  id: number;
  comboId: number;
  name: string;
  quantity: number;
  price: number;
  isClaimed: boolean;
}

export interface AdminBookingItem {
  id: number;
  bookingCode: string;
  userId?: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAvatar?: string;
  movieId?: number;
  movieTitle: string;
  moviePoster?: string;
  movieAgeRating: string;
  movieDuration: number;
  cinemaName: string;
  roomName: string;
  roomType: string;
  showtimeFormatted: string;
  showDate: string;
  startTime: string;
  endTime: string;
  seats: AdminBookingSeat[];
  seatsFormatted: string;
  seatCount: number;
  combos: AdminBookingCombo[];
  combosCount: number;
  finalAmount: number;
  discountAmount: number;
  status: BookingStatusType;
  statusLabel: string;
  isCheckedIn: boolean;
  checkedInAt?: string | null;
  checkedInAtFormatted?: string;
  createdAt: string;
  createdAtFormatted: string;
  priceBreakdown?: Record<string, any> | null;
}

export interface AdminBookingStats {
  totalBookings: number;
  totalRevenue: number;
  todayRevenue: number;
  totalCheckedIn: number;
  totalRefunded: number;
  checkInRate: number;
}

export interface AdminBookingPagination {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  perPage: number;
}
