export interface ScanTicketRequestDTO {
  qr_data?: string;
  qr_code?: string;
  booking_code?: string;
  code?: string;
}

export interface TicketSeatDTO {
  seatId?: number;
  seatCode: string;
  price?: number;
}

export interface TicketComboDTO {
  bookingComboId: number;
  comboName: string;
  quantity: number;
  isClaimed: boolean;
}

export interface ScanTicketResponseDTO {
  bookingId: number;
  bookingCode: string;
  bookingStatus: string;
  isCheckedIn?: boolean;
  checkedInAt?: string | null;
  movieTitle: string;
  moviePoster?: string;
  ageRating?: string;
  duration?: number;
  cinemaName: string;
  roomName: string;
  roomType?: string;
  showDate: string;
  startTime: string;
  endTime?: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  finalAmount?: number;
  seats: TicketSeatDTO[];
  combos: TicketComboDTO[];
}

export interface ClaimFnbRequestDTO {
  booking_combo_id: number;
}

export interface RecentScanItemDTO {
  bookingId: number;
  bookingCode: string;
  checkedInAt: string;
  movieTitle: string;
  moviePoster?: string;
  cinemaName: string;
  roomName: string;
  showtime: string;
  customerName: string;
  seats: string;
  combosCount: number;
}
