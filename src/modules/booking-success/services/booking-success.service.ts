import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { DigitalTicketInfo } from '../types/booking-success.types';
import { formatShowDate } from '@/modules/booking/services/seat-booking.service';
import { ApiResponse } from '@/shared/types/api.types';
import { getBookingSession } from '@/modules/booking/services/bookingSessionService';
import { imageHelper } from '@/shared/utils/imageHelper';

/**
 * Checks if a booking object returned from DB/API is in a paid/completed/confirmed state
 */
function isBookingCompleted(b: any): boolean {
  if (!b) return false;

  const statusValues = [
    b.booking_status,
    b.status,
    b.payment_status,
    b.order_status,
    b.payment?.status,
    b.payment?.payment_status,
  ]
    .filter(Boolean)
    .map((s) => String(s).toLowerCase().trim());

  // Check if status contains completed, paid, confirmed, success, done
  const isPaidOrCompleted = statusValues.some(
    (s) =>
      ['completed', 'paid', 'confirmed', 'success', 'done', 'active'].includes(s) ||
      s.includes('complete') ||
      s.includes('paid') ||
      s.includes('success')
  );

  // Check if explicitly cancelled, expired, failed, or holding/unpaid
  const isFailedOrUnpaid = statusValues.some((s) =>
    ['cancelled', 'canceled', 'expired', 'failed', 'holding', 'unpaid'].includes(s)
  );

  return isPaidOrCompleted && !isFailedOrUnpaid;
}

/**
 * Maps a raw backend booking object to DigitalTicketInfo
 */
function mapBackendBookingToTicket(
  b: any,
  fallbackParams?: {
    movieParam?: string;
    seatsParam?: string;
    dateParam?: string;
    timeParam?: string;
    cinemaParam?: string;
    totalParam?: string;
    session?: any;
  }
): DigitalTicketInfo {
  const showtime = b.showtime || b.show_time || {};
  const movie = b.movie || showtime.movie || {};
  const cinema = b.cinema || showtime.cinema || {};
  const room = b.room || showtime.room || {};
  const session = fallbackParams?.session;

  // 1. Seats extraction
  let seatList = '';
  if (Array.isArray(b.seats) && b.seats.length > 0) {
    seatList = b.seats
      .map((s: any) =>
        typeof s === 'string'
          ? s
          : s.seat_code ||
            s.seat_number ||
            (s.row_name ? `${s.row_name}${s.seat_number || ''}` : '')
      )
      .filter(Boolean)
      .join(', ');
  } else if (b.seats_summary) {
    seatList = b.seats_summary;
  } else if (b.seat_labels) {
    seatList = b.seat_labels;
  } else if (typeof b.seats === 'string') {
    seatList = b.seats;
  } else {
    seatList = fallbackParams?.seatsParam || session?.seatSummaryText || 'Ghế đã xác nhận';
  }

  // 2. Showtime & Date extraction
  const startTimeRaw =
    showtime.showtime_start ||
    showtime.start_time ||
    b.showtime_start ||
    b.show_time ||
    fallbackParams?.timeParam ||
    session?.showTime;

  const startTime =
    startTimeRaw &&
    (startTimeRaw.includes('T') ||
      (startTimeRaw.includes(':') && startTimeRaw.length > 8))
      ? new Date(startTimeRaw).toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : startTimeRaw || '19:30';

  const showDateRaw =
    showtime.showtime_start ||
    showtime.show_date ||
    b.showtime_start ||
    b.show_date ||
    fallbackParams?.dateParam ||
    session?.showDate;

  const showDate = formatShowDate(showDateRaw);

  // 3. Code & QR
  const codeStr = String(
    b.booking_code || b.code || b.booking_id || b.id || 'CINEDOT'
  );
  const qrUrl =
    b.qr_code_url ||
    `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=CINE-${codeStr}`;

  // 4. Combos
  const rawCombos = Array.isArray(b.booking_combos)
    ? b.booking_combos
    : Array.isArray(b.combos)
    ? b.combos
    : [];

  const combos = rawCombos.map((bc: any) => ({
    name: bc.combo?.name || bc.name || 'Combo Bắp Nước',
    quantity: bc.quantity || 1,
    price: bc.price || bc.unit_price || bc.combo?.price || 0,
    image: imageHelper.getComboUrl(
      bc.combo?.image_url || bc.combo?.imageUrl || bc.image_url || bc.image
    ),
  }));

  // 5. Total Paid
  const totalPaid = Number(
    b.final_amount ||
      b.final_total ||
      b.total_amount ||
      b.total_price ||
      b.amount ||
      fallbackParams?.totalParam ||
      session?.totalPaid ||
      session?.ticketTotalPrice ||
      0
  );

  return {
    bookingId: String(b.id || b.booking_id || codeStr),
    bookingCode: codeStr,
    movieTitle:
      movie.title ||
      movie.name ||
      session?.movieTitle ||
      (fallbackParams?.movieParam
        ? decodeURIComponent(fallbackParams.movieParam)
            .replace(/-/g, ' ')
            .toUpperCase()
        : 'Vé Xem Phim CineDot'),
    movieSlug:
      movie.slug || fallbackParams?.movieParam || session?.movieSlug || 'movie-detail',
    posterUrl: imageHelper.getPosterUrl(
      movie.poster_url || movie.posterUrl || session?.posterUrl
    ),
    movieFormat:
      b.price_breakdown?.metadata?.format ||
      room.room_type ||
      session?.movieFormat ||
      '2D Phụ Đề',
    ageRating: movie.age_rating || movie.ageRating || session?.ageRating || 'P',
    cinemaName:
      cinema.cinema_name ||
      cinema.name ||
      fallbackParams?.cinemaParam ||
      session?.cinemaName ||
      'CineDot Cinema',
    roomName:
      room.room_name ||
      room.name ||
      session?.roomName ||
      'Phòng chiếu CineDot IMAX Laser',
    showTime: startTime,
    showDate,
    seatLabels: seatList,
    qrCodeUrl: qrUrl,
    barcodeValue: `CD${codeStr.replace(/\D/g, '').padEnd(10, '0').slice(0, 10)}`,
    totalPaid,
    paidAt: b.created_at
      ? new Date(b.created_at).toLocaleString('vi-VN')
      : session?.paidAt || 'Vừa xong',
    paymentMethodName:
      b.payment_method ||
      b.payment?.method ||
      session?.paymentMethod ||
      'Cổng VNPAY / ZaloPay',
    status: 'PAID',
    combos,
  };
}

export async function fetchDigitalTicket(
  bookingIdParam?: string,
  movieParam?: string,
  seatsParam?: string,
  dateParam?: string,
  timeParam?: string,
  cinemaParam?: string,
  totalParam?: string,
  showtimeId?: string
): Promise<DigitalTicketInfo | null> {
  const session = getBookingSession(showtimeId || '');
  const targetBookingId =
    bookingIdParam ||
    (session?.paymentConfirmed
      ? session.bookingCode || session.bookingId
      : undefined);

  // 1. Try to fetch direct booking detail from Backend if we have an ID/Code
  if (targetBookingId && targetBookingId !== 'CINEDOT-TICKET') {
    try {
      const res = await apiClient.get<ApiResponse<any>>(
        ENDPOINTS.BOOKINGS.DETAIL(targetBookingId)
      );

      const rawData = res.data as any;
      const b =
        rawData?.data ||
        (rawData && (rawData.id || rawData.booking_code || rawData.booking_status)
          ? rawData
          : null);


      if (b && isBookingCompleted(b)) {
        return mapBackendBookingToTicket(b, {
          movieParam,
          seatsParam,
          dateParam,
          timeParam,
          cinemaParam,
          totalParam,
          session,
        });
      }
    } catch {
      // If direct detail endpoint returned 404/500, proceed to fallback search
    }
  }

  // 2. Query user's bookings from backend (MY_BOOKINGS) to find verified completed booking
  try {
    const res = await apiClient.get<ApiResponse<any>>(
      ENDPOINTS.USERS.MY_BOOKINGS,
      { params: { per_page: 30 } }
    );

    const rawList = Array.isArray(res.data?.data)
      ? res.data.data
      : Array.isArray(res.data?.data?.data)
      ? res.data.data.data
      : Array.isArray(res.data)
      ? res.data
      : [];

    if (rawList.length > 0) {
      // Find matching booking
      const matched = rawList.find((b: any) => {
        const idMatch =
          targetBookingId &&
          (String(b.id) === String(targetBookingId) ||
            String(b.booking_id) === String(targetBookingId) ||
            String(b.booking_code) === String(targetBookingId));

        const showtimeMatch =
          showtimeId &&
          (String(b.showtime_id) === String(showtimeId) ||
            String(b.showtime?.id) === String(showtimeId));

        return (idMatch || showtimeMatch) && isBookingCompleted(b);
      });

      if (matched) {
        return mapBackendBookingToTicket(matched, {
          movieParam,
          seatsParam,
          dateParam,
          timeParam,
          cinemaParam,
          totalParam,
          session,
        });
      }
    }
  } catch {
    // MY_BOOKINGS call failed or user not logged in
  }

  // 3. Fallback to confirmed local session ONLY if paymentConfirmed is explicitly true
  if (
    session &&
    session.paymentConfirmed === true &&
    (session.bookingId || session.bookingCode)
  ) {
    const codeStr = String(
      session.bookingCode || session.bookingId || targetBookingId || 'CD-PAID'
    );
    const slug = movieParam || session.movieSlug || 'movie-detail';
    const cinemaName = cinemaParam
      ? decodeURIComponent(cinemaParam)
      : session.cinemaName || 'CineDot Cinema';
    const showTime = timeParam || session.showTime || '19:30';
    const showDate = formatShowDate(dateParam || session.showDate);
    const seatLabels = seatsParam
      ? seatsParam.split(',').join(', ')
      : session.seatSummaryText || 'Chưa chọn ghế';
    const totalPaid = totalParam
      ? parseInt(totalParam, 10)
      : session.totalPaid || session.ticketTotalPrice || 0;

    if (totalPaid > 0) {
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=CINE-${codeStr}-${slug}`;

      const combos =
        session.combos?.map((c) => ({
          name: c.name || 'Combo Bắp Nước',
          quantity: c.quantity || 1,
          price: c.price || 0,
          image: imageHelper.getComboUrl(c.image_url),
        })) || [];

      return {
        bookingId: String(session.bookingId || targetBookingId || codeStr),
        bookingCode: codeStr,
        movieTitle:
          session.movieTitle ||
          (movieParam
            ? decodeURIComponent(movieParam).replace(/-/g, ' ').toUpperCase()
            : 'Vé Xem Phim CineDot'),
        movieSlug: slug,
        posterUrl:
          session.posterUrl ||
          'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
        movieFormat: session.movieFormat || '2D Phụ Đề',
        ageRating: session.ageRating || 'P',
        cinemaName,
        roomName: session.roomName || 'Phòng chiếu CineDot IMAX Laser',
        showTime,
        showDate,
        seatLabels,
        qrCodeUrl,
        barcodeValue: `CD${codeStr.replace(/\D/g, '').padEnd(10, '0').slice(0, 10)}`,
        totalPaid,
        paidAt: session.paidAt || 'Vừa xong',
        paymentMethodName: session.paymentMethod || 'Cổng VNPAY / ZaloPay',
        status: 'PAID',
        combos,
      };
    }
  }

  // Any other unverified access (e.g. unconfirmed hold draft) -> REJECT!
  return null;
}



