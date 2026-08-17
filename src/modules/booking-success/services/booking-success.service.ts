import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { DigitalTicketInfo } from '../types/booking-success.types';
import { MOCK_DIGITAL_TICKET } from '../mocks/mockTicketData';
import { formatShowDate } from '@/modules/booking/services/seat-booking.service';
import { ApiResponse } from '@/shared/types/api.types';
import { getBookingSession } from '@/modules/booking/services/bookingSessionService';
import { imageHelper } from '@/shared/utils/imageHelper';

export async function fetchDigitalTicket(
  bookingIdParam?: string,
  movieParam?: string,
  seatsParam?: string,
  dateParam?: string,
  timeParam?: string,
  cinemaParam?: string,
  totalParam?: string,
  showtimeId?: string
): Promise<DigitalTicketInfo> {
  const bookingId = bookingIdParam || MOCK_DIGITAL_TICKET.bookingId;
  const session = getBookingSession(showtimeId || '');

  // Try to fetch real booking from BE if valid ID
  if (bookingIdParam && !bookingIdParam.startsWith('MOCK')) {
    try {
      const res = await apiClient.get<ApiResponse<any>>(ENDPOINTS.BOOKINGS.DETAIL(bookingIdParam));
      if (res.data?.success && res.data?.data) {
        const b = res.data.data;
        const showtime = b.showtime || {};
        const movie = b.movie || {};
        const cinema = b.cinema || {};
        const room = b.room || {};

        const seatList = Array.isArray(b.seats)
          ? b.seats.map((s: any) => s.seat_code || s.seat_number).join(', ')
          : seatsParam || 'D09, D10';

        const startTime = showtime.showtime_start
          ? new Date(showtime.showtime_start).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          : timeParam || '18:00';

        const codeStr = b.booking_code || bookingIdParam;
        const qrUrl = b.qr_code_url || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CINE-${codeStr}`;

        const combos = b.booking_combos?.map((bc: any) => ({
          name: bc.combo?.name || 'Combo',
          quantity: bc.quantity || 1,
          price: bc.price || bc.combo?.price || 0,
          image: imageHelper.getComboUrl(bc.combo?.image_url || bc.combo?.imageUrl),
        })) || [];

        return {
          bookingId: codeStr,
          movieTitle: movie.title || 'Người Nhện: Khởi Đầu Mới',
          movieSlug: movie.slug || movieParam || 'spiderman-new-beginning',
          posterUrl: imageHelper.getPosterUrl(movie.poster_url || session?.posterUrl),
          movieFormat: b.price_breakdown?.metadata?.format || room.room_type || session?.movieFormat || '2D Phụ Đề',
          ageRating: movie.age_rating || session?.ageRating || 'T13',
          cinemaName: cinema.cinema_name || cinemaParam || 'CineDot Landmark 81',
          roomName: room.room_name || 'Phòng chiếu 01 (IMAX Laser)',
          showTime: startTime,
          showDate: showtime.showtime_start ? formatShowDate(showtime.showtime_start) : formatShowDate(dateParam),
          seatLabels: seatList,
          qrCodeUrl: qrUrl,
          totalPaid: Number(b.final_amount || b.final_total || b.total_price || totalParam || 230000),
          paidAt: b.created_at ? new Date(b.created_at).toLocaleString('vi-VN') : 'Vừa xong',
          paymentMethodName: b.payment_method || 'Cổng VNPay',
          combos,
        };
      }
    } catch {
      // Fallback
    }
  }

  const slug = movieParam || session?.movieSlug || 'movie-detail';
  const cinemaName = cinemaParam
    ? decodeURIComponent(cinemaParam)
    : session?.cinemaName || MOCK_DIGITAL_TICKET.cinemaName;
  const showTime = timeParam || session?.showTime || '18:00';
  const showDate = formatShowDate(dateParam || session?.showDate);
  const seatLabels = seatsParam ? seatsParam.split(',').join(', ') : MOCK_DIGITAL_TICKET.seatLabels;
  const totalPaid = totalParam ? parseInt(totalParam, 10) : MOCK_DIGITAL_TICKET.totalPaid;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CINE-${bookingId}-${slug}-${seatsParam || 'D09D10'}`;

  // Read combos from session if available
  const combos = session?.combos?.map((c: any) => ({
    name: c.combo_name || c.name || 'Combo',
    quantity: c.quantity || 1,
    price: c.price || 0,
    image: imageHelper.getComboUrl(c.image_url || c.imageUrl),
  })) || [];

  return {
    bookingId,
    movieTitle: session?.movieTitle || MOCK_DIGITAL_TICKET.movieTitle,
    movieSlug: slug,
    posterUrl: session?.posterUrl || MOCK_DIGITAL_TICKET.posterUrl,
    movieFormat: session?.movieFormat || MOCK_DIGITAL_TICKET.movieFormat,
    ageRating: session?.ageRating || MOCK_DIGITAL_TICKET.ageRating,
    cinemaName,
    roomName: session?.roomName || 'Phòng chiếu 01 (IMAX Laser)',
    showTime,
    showDate,
    seatLabels,
    qrCodeUrl,
    totalPaid,
    paidAt: 'Vừa xong',
    paymentMethodName: 'Cổng VNPay / MoMo',
    combos,
  };
}
