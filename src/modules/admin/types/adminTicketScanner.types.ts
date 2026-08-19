export interface ScannedTicketSeat {
  id?: number;
  seatCode: string;
  price?: number;
}

export interface ScannedTicketCombo {
  id: number;
  name: string;
  quantity: number;
  isClaimed: boolean;
}

export interface ScannedTicketDetail {
  bookingId: number;
  bookingCode: string;
  status: string;
  isCheckedIn: boolean;
  checkedInAt: string;
  movieTitle: string;
  moviePoster: string;
  ageRating: string;
  durationMinutes: number;
  cinemaName: string;
  roomName: string;
  roomType: string;
  showDate: string;
  startTime: string;
  endTime: string;
  showtimeFormatted: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  finalAmount: number;
  seats: ScannedTicketSeat[];
  seatsFormatted: string;
  combos: ScannedTicketCombo[];
}

export interface RecentScanItem {
  bookingId: number;
  bookingCode: string;
  checkedInAtFormatted: string;
  movieTitle: string;
  moviePoster: string;
  cinemaName: string;
  roomName: string;
  showtime: string;
  customerName: string;
  seats: string;
  combosCount: number;
}
