export interface DigitalTicketInfo {
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
  qrCodeUrl: string;
  totalPaid: number;
  paidAt: string;
  paymentMethodName: string;
}
