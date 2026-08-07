import { DigitalTicketInfo } from '../types/booking-success.types';
import { MOCK_DIGITAL_TICKET } from '../mocks/mockTicketData';
import { formatShowDate } from '@/modules/booking/services/seat-booking.service';

const mockMovieDatabase: Record<string, { title: string; poster: string; format: string; age: string }> = {
  'spiderman-new-beginning': {
    title: 'Người Nhện: Khởi Đầu Mới',
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80',
    format: '2D Phụ Đề',
    age: 'T13',
  },
  'spider-man-across-the-spider-verse': {
    title: 'Người Nhện: Khởi Đầu Mới',
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80',
    format: '2D Phụ Đề',
    age: 'T13',
  },
  'mai': {
    title: 'Phim Điện Ảnh Mai',
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=80',
    format: '2D Lồng Tiếng',
    age: 'T18',
  },
  'inside-out-2': {
    title: 'Những Mảnh Mảnh Cảm Xúc 2',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    format: '3D Lồng Tiếng',
    age: 'P',
  },
};

export async function fetchDigitalTicket(
  bookingIdParam?: string,
  movieParam?: string,
  seatsParam?: string,
  dateParam?: string,
  timeParam?: string,
  cinemaParam?: string,
  totalParam?: string
): Promise<DigitalTicketInfo> {
  await new Promise((res) => setTimeout(res, 200));

  const bookingId = bookingIdParam || MOCK_DIGITAL_TICKET.bookingId;
  const slug = movieParam || 'spiderman-new-beginning';
  const foundMovie = mockMovieDatabase[slug];

  const movieTitle = foundMovie ? foundMovie.title : MOCK_DIGITAL_TICKET.movieTitle;
  const posterUrl = foundMovie ? foundMovie.poster : MOCK_DIGITAL_TICKET.posterUrl;
  const movieFormat = foundMovie ? foundMovie.format : MOCK_DIGITAL_TICKET.movieFormat;
  const ageRating = foundMovie ? foundMovie.age : MOCK_DIGITAL_TICKET.ageRating;

  const cinemaName = cinemaParam ? decodeURIComponent(cinemaParam) : MOCK_DIGITAL_TICKET.cinemaName;
  const showTime = timeParam || '18:00';
  const showDate = formatShowDate(dateParam);
  const seatLabels = seatsParam ? seatsParam.split(',').join(', ') : MOCK_DIGITAL_TICKET.seatLabels;
  const totalPaid = totalParam ? parseInt(totalParam, 10) : MOCK_DIGITAL_TICKET.totalPaid;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CINE-${bookingId}-${slug}-${seatsParam || 'D09D10'}`;

  return {
    bookingId,
    movieTitle,
    movieSlug: slug,
    posterUrl,
    movieFormat,
    ageRating,
    cinemaName,
    roomName: 'Phòng chiếu 01 (IMAX Laser)',
    showTime,
    showDate,
    seatLabels,
    qrCodeUrl,
    totalPaid,
    paidAt: 'Vừa xong',
    paymentMethodName: 'Ví MoMo',
  };
}
