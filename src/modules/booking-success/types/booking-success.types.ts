export interface DigitalTicketInfo {
  bookingId: string;
  bookingCode?: string;
  movieTitle: string;
  movieSlug: string;
  posterUrl: string;
  backdropUrl?: string;
  movieFormat: string;
  ageRating: string;
  audioFormat?: string;
  durationMinutes?: number;
  cinemaName: string;
  cinemaAddress?: string;
  roomName: string;
  showTime: string;
  showDate: string;
  seatLabels: string;
  qrCodeUrl: string;
  barcodeValue?: string;
  totalPaid: number;
  paidAt: string;
  paymentMethodName: string;
  transactionNo?: string;
  status: string;
  combos?: {
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
}
