export interface DigitalTicketInfo {
  bookingId: string;
  bookingCode?: string;
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
  qrCodeUrl: string;
  barcodeValue?: string;
  totalPaid: number;
  paidAt: string;
  paymentMethodName: string;
  status: string;
  combos?: {
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
}

