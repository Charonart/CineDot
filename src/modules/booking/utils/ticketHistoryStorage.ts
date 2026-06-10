import { BookingSession, TicketHistoryItem } from '../types';

const HISTORY_KEY = 'cine-ticket-history';

export function getTicketHistory(): TicketHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to parse ticket history', error);
    return [];
  }
}

export function saveTicketToHistory(ticket: TicketHistoryItem): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getTicketHistory();
    // Prevent duplicates
    if (history.some((t) => t.ticketId === ticket.ticketId)) return;
    history.unshift(ticket); // Newest first
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save ticket to history', error);
  }
}

export function clearTicketHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear ticket history', error);
  }
}

/**
 * Generates a mock alphanumeric booking code (e.g., CINE-AB12CD34)
 */
function generateBookingCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function createTicketFromBookingSession(session: BookingSession): TicketHistoryItem {
  const bookingCode = generateBookingCode();
  const ticketId = `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  return {
    ticketId,
    bookingCode,
    movieTitle: session.movie?.title || '',
    moviePoster: session.movie?.poster || '',
    cinemaName: session.cinema?.name || '',
    hall: session.cinema?.hall || '',
    date: session.showtime?.date || '',
    time: session.showtime?.time || '',
    seats: session.seats.map((s) => s.label),
    combos: session.combos.filter((c) => c.quantity > 0),
    ticketTotal: session.ticketTotal,
    comboTotal: session.comboTotal,
    discountAmount: session.discountAmount,
    finalTotal: session.finalTotal,
    paymentMethod: session.paymentMethod || 'onepay',
    paidAt: new Date().toISOString(),
    qrCodeValue: `CINE-TICKET-${bookingCode}`,
    status: 'paid',
  };
}
