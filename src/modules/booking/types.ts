export type BookingStep =
  | 'schedule'
  | 'seats'
  | 'quick-combo'
  | 'foods'
  | 'payment'
  | 'confirm'
  | 'gateway'
  | 'success'
  | 'failed';

export type SeatType = 'standard' | 'vip' | 'couple';

export type BookingStatus =
  | 'draft'
  | 'holding'
  | 'pending-payment'
  | 'paid'
  | 'failed'
  | 'expired'
  | 'cancelled';

export type PaymentMethod =
  | 'onepay'
  | 'atm'
  | 'visa'
  | 'momo'
  | 'zalopay'
  | 'shopeepay'
  | 'payoo'
  | 'qr';

export type SelectedSeat = {
  id: string;
  row: string;
  number: string;
  label: string;
  type: SeatType;
  price: number;
};

export type ComboItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  category?: 'combo' | 'popcorn' | 'drink' | 'snack';
  featured?: boolean;
};

export type BookingMovieInfo = {
  slug: string;
  title: string;
  poster: string;
  format: string;
  duration: string;
};

export type BookingCinemaInfo = {
  id: string;
  name: string;
  hall: string;
};

export type BookingShowtimeInfo = {
  date: string;
  time: string;
};

export type BookingSession = {
  sessionId: string;
  currentStep: BookingStep;
  movie: BookingMovieInfo | null;
  cinema: BookingCinemaInfo | null;
  showtime: BookingShowtimeInfo | null;
  seats: SelectedSeat[];
  combos: ComboItem[];
  voucherCode?: string;
  discountAmount: number;
  paymentMethod?: PaymentMethod;
  quickComboHandled: boolean;
  seatHoldStartedAt?: number;
  seatHoldExpiresAt?: number;
  seatHoldDurationSeconds: number;
  ticketTotal: number;
  comboTotal: number;
  finalTotal: number;
  status: BookingStatus;
};

export type VoucherType = 'percent' | 'fixed';

export type VoucherItem = {
  code: string;
  label: string;
  description: string;
  type: VoucherType;
  value: number;
  maxDiscount?: number;
  minOrderValue?: number;
};

export type TicketHistoryItem = {
  ticketId: string;
  bookingCode: string;
  movieTitle: string;
  moviePoster: string;
  cinemaName: string;
  hall: string;
  date: string;
  time: string;
  seats: string[];
  combos: ComboItem[];
  ticketTotal: number;
  comboTotal: number;
  discountAmount: number;
  finalTotal: number;
  paymentMethod: PaymentMethod;
  paidAt: string;
  qrCodeValue: string;
  status: 'paid' | 'used' | 'cancelled' | 'failed';
};
