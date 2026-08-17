import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { DigitalTicketInfo } from '../types/booking-success.types';
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
  const session = getBookingSession(showtimeId || '');
  const cleanBookingId = bookingIdParam || session?.bookingCode || session?.bookingId || 'CINEDOT-TICKET';

  // 1. Try to fetch real booking from Backend if valid ID or code
  if (bookingIdParam && !bookingIdParam.startsWith('MOCK')) {
    try {
      const res = await apiClient.get<ApiResponse<any>>(ENDPOINTS.BOOKINGS.DETAIL(bookingIdParam));
      if (res.data?.success && res.data?.data) {
        const b = res.data.data;
        const showtime = b.showtime || {};
        const movie = b.movie || {};
        const cinema = b.cinema || {};
        const room = b.room || {};

        const seatList =
          Array.isArray(b.seats) && b.seats.length > 0
            ? b.seats
                .map((s: any) => s.seat_code || s.seat_number || (s.row_name ? `${s.row_name}${s.seat_number || ''}` : ''))
                .filter(Boolean)
                .join(', ')
            : seatsParam || session?.seatSummaryText || 'Chưa xác định';

        const startTime = showtime.showtime_start
          ? new Date(showtime.showtime_start).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          : timeParam || session?.showTime || '19:30';

        const codeStr = b.booking_code || bookingIdParam;
        const qrUrl = b.qr_code_url || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CINE-${codeStr}`;

        const combos =
          b.booking_combos?.map((bc: any) => ({
            name: bc.combo?.name || 'Combo Bắp Nước',
            quantity: bc.quantity || 1,
            price: bc.price || bc.combo?.price || 0,
            image: imageHelper.getComboUrl(bc.combo?.image_url || bc.combo?.imageUrl),
          })) || [];

        return {
          bookingId: codeStr,
          movieTitle: movie.title || session?.movieTitle || 'Vé Xem Phim CineDot',
          movieSlug: movie.slug || movieParam || session?.movieSlug || 'movie-detail',
          posterUrl: imageHelper.getPosterUrl(movie.poster_url || session?.posterUrl),
          movieFormat: b.price_breakdown?.metadata?.format || room.room_type || session?.movieFormat || '2D Phụ Đề',
          ageRating: movie.age_rating || session?.ageRating || 'P',
          cinemaName: cinema.cinema_name || cinema.name || cinemaParam || session?.cinemaName || 'CineDot Cinema',
          roomName: room.room_name || session?.roomName || 'Phòng chiếu CineDot',
          showTime: startTime,
          showDate: showtime.showtime_start ? formatShowDate(showtime.showtime_start) : formatShowDate(dateParam || session?.showDate),
          seatLabels: seatList,
          qrCodeUrl: qrUrl,
          totalPaid: Number(b.final_amount || b.final_total || b.total_price || totalParam || 0),
          paidAt: b.created_at ? new Date(b.created_at).toLocaleString('vi-VN') : 'Vừa xong',
          paymentMethodName: b.payment_method || 'Cổng VNPAY',
          combos,
        };
      }
    } catch {
      // Fallback to session
    }
  }

  // 2. Read authoritative state from BookingSession
  const slug = movieParam || session?.movieSlug || 'movie-detail';
  const cinemaName = cinemaParam
    ? decodeURIComponent(cinemaParam)
    : session?.cinemaName || 'CineDot Cinema';
  const showTime = timeParam || session?.showTime || '19:30';
  const showDate = formatShowDate(dateParam || session?.showDate);
  const seatLabels = seatsParam ? seatsParam.split(',').join(', ') : session?.seatSummaryText || 'Chưa chọn ghế';
  const totalPaid = totalParam ? parseInt(totalParam, 10) : session?.totalPaid || session?.ticketTotalPrice || 0;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CINE-${cleanBookingId}-${slug}-${seatsParam || ''}`;

  const combos =
    session?.combos?.map((c) => ({
      name: c.name || 'Combo',
      quantity: c.quantity || 1,
      price: c.price || 0,
      image: imageHelper.getComboUrl(c.image_url),
    })) || [];

  return {
    bookingId: String(cleanBookingId),
    movieTitle: session?.movieTitle || (movieParam ? decodeURIComponent(movieParam).replace(/-/g, ' ').toUpperCase() : 'Vé Xem Phim'),
    movieSlug: slug,
    posterUrl: session?.posterUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    movieFormat: session?.movieFormat || '2D Phụ Đề',
    ageRating: session?.ageRating || 'P',
    cinemaName,
    roomName: session?.roomName || 'Phòng chiếu CineDot',
    showTime,
    showDate,
    seatLabels,
    qrCodeUrl,
    totalPaid,
    paidAt: 'Vừa xong',
    paymentMethodName: 'Cổng VNPAY',
    combos,
  };
}
