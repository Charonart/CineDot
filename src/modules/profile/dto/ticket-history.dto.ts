/**
 * TicketHistoryDTO
 * Normalized data contract from backend `/profile/tickets` endpoint.
 * Represents a single purchased booking ticket.
 */

export type TicketStatusDTO = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

export interface TicketHistoryDTO {
  id: string;
  bookingId: string;
  movieTitle: string;
  posterPath: string;
  cinemaName: string;
  roomName: string;
  seatLabels: string[];
  showtimeStart: string; // ISO 8601 e.g. "2026-06-25T19:30:00+07:00"
  totalAmount: number;   // in VND (e.g. 175000)
  status: TicketStatusDTO;
  qrCodeString: string;  // booking reference for QR generation
}
