import { DigitalTicketInfo } from '../types/booking-success.types';

export const MOCK_DIGITAL_TICKET: DigitalTicketInfo = {
  bookingId: 'CD-849201',
  movieTitle: 'Người Nhện: Khởi Đầu Mới',
  movieSlug: 'spiderman-new-beginning',
  posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80',
  movieFormat: '2D Phụ Đề',
  ageRating: 'T13',
  cinemaName: 'Galaxy CineX Hanoi Centre',
  roomName: 'Phòng chiếu 01 (IMAX Laser)',
  showTime: '18:00',
  showDate: 'Thứ Sáu, 31/07/2026',
  seatLabels: 'D09, D10',
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CINE-CD-849201-SPIDERMAN-D09D10',
  totalPaid: 220000,
  paidAt: '21:15 - 30/07/2026',
  paymentMethodName: 'Ví MoMo',
};
