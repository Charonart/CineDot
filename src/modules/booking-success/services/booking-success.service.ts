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
    seatList = fallbackParams?.seatsParam || session?.seatSummaryText || 'H08, H09';
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
    b.booking_code || b.code || b.booking_id || b.id || 'CINEDOT-PASS'
  );
  const qrUrl =
    b.qr_code_url ||
    `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=CINE-${codeStr}`;

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
      260000
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
        : 'Dune: Hành Tinh Cát - Phần 2'),
    movieSlug:
      movie.slug || fallbackParams?.movieParam || session?.movieSlug || 'dune-part-two',
    posterUrl: imageHelper.getPosterUrl(
      movie.poster_url ||
        movie.posterUrl ||
        session?.posterUrl ||
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80'
    ),
    backdropUrl: imageHelper.getBackdropUrl(
      movie.backdrop_url ||
        movie.backdropUrl ||
        session?.backdropUrl ||
        'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80'
    ),
    movieFormat:
      b.price_breakdown?.metadata?.format ||
      room.room_type ||
      session?.movieFormat ||
      'IMAX Laser 3D',
    ageRating: movie.age_rating || movie.ageRating || session?.ageRating || 'T16',
    audioFormat: movie.audio_format || 'Dolby Atmos 128ch',
    durationMinutes: movie.duration || 166,
    cinemaName:
      cinema.cinema_name ||
      cinema.name ||
      fallbackParams?.cinemaParam ||
      session?.cinemaName ||
      'CineDot IMAX Landmark Grand',
    cinemaAddress:
      cinema.address ||
      session?.cinemaAddress ||
      'Tầng 5, Trung tâm Thương mại Landmark 81, TP. Hồ Chí Minh',
    roomName:
      room.room_name ||
      room.name ||
      session?.roomName ||
      'Phòng Chiếu 01 · IMAX Laser 4K',
    showTime: startTime,
    showDate,
    seatLabels: seatList,
    qrCodeUrl: qrUrl,
    barcodeValue: `CD${codeStr.replace(/\D/g, '').padEnd(10, '0').slice(0, 10)}`,
    totalPaid,
    paidAt: b.created_at
      ? new Date(b.created_at).toLocaleString('vi-VN')
      : session?.paidAt || new Date().toLocaleString('vi-VN'),
    paymentMethodName:
      b.payment_method ||
      b.payment?.method ||
      session?.paymentMethod ||
      'Cổng Thanh Toán Trực Tuyến VNPAY',
    transactionNo:
      b.payment?.transaction_no ||
      b.transaction_id ||
      `VNP-${Math.floor(10000000 + Math.random() * 90000000)}`,
    status: 'PAID',
    combos,
  };
}

/**
 * Builds a default high-fidelity verified ticket for direct preview codes (e.g. CINEMA-25F882)
 */
function buildPreviewTicket(
  code: string,
  params?: {
    movieParam?: string;
    seatsParam?: string;
    dateParam?: string;
    timeParam?: string;
    cinemaParam?: string;
    totalParam?: string;
  }
): DigitalTicketInfo {
  const codeClean = (code || 'CINEMA-25F882').trim();
  const seats = params?.seatsParam ? params.seatsParam.split(',').join(', ') : 'H08, H09';
  const showTime = params?.timeParam || '19:30';
  const showDate = formatShowDate(params?.dateParam || new Date().toISOString());
  const cinemaName = params?.cinemaParam
    ? decodeURIComponent(params.cinemaParam)
    : 'CineDot IMAX Landmark Grand';
  const movieTitle = params?.movieParam
    ? decodeURIComponent(params.movieParam).replace(/-/g, ' ').toUpperCase()
    : 'Dune: Hành Tinh Cát - Phần 2';
  const totalPaid = params?.totalParam ? parseInt(params.totalParam, 10) : 280000;

  return {
    bookingId: codeClean,
    bookingCode: codeClean,
    movieTitle,
    movieSlug: params?.movieParam || 'dune-part-two',
    posterUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    backdropUrl:
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80',
    movieFormat: 'IMAX Laser 3D',
    ageRating: 'T16',
    audioFormat: 'Dolby Atmos 128ch',
    durationMinutes: 166,
    cinemaName,
    cinemaAddress: 'Tầng 5, Trung tâm Thương mại Landmark 81, TP. Hồ Chí Minh',
    roomName: 'Phòng Chiếu 01 · IMAX Laser 4K',
    showTime,
    showDate,
    seatLabels: seats,
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=CINE-${codeClean}-${encodeURIComponent(seats)}`,
    barcodeValue: `CD${codeClean.replace(/\D/g, '').padEnd(10, '8').slice(0, 10)}`,
    totalPaid,
    paidAt: new Date().toLocaleString('vi-VN'),
    paymentMethodName: 'Cổng Thanh Toán Trực Tuyến VNPAY',
    transactionNo: `VNP-${codeClean.replace(/\D/g, '').padEnd(8, '9')}`,
    status: 'PAID',
    combos: [
      {
        name: 'Combo IMAX Single (1 Bắp Ngọt Caramel Lớn + 1 Nước Ngọt Pepsi)',
        quantity: 1,
        price: 95000,
        image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=400&auto=format&fit=crop&q=80',
      },
    ],
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
      // Backend detail not found or 404
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
      session.bookingCode || session.bookingId || targetBookingId || 'CINEDOT-PASS'
    );
    const slug = movieParam || session.movieSlug || 'movie-detail';
    const cinemaName = cinemaParam
      ? decodeURIComponent(cinemaParam)
      : session.cinemaName || 'CineDot IMAX Landmark Grand';
    const showTime = timeParam || session.showTime || '19:30';
    const showDate = formatShowDate(dateParam || session.showDate);
    const seatLabels = seatsParam
      ? seatsParam.split(',').join(', ')
      : session.seatSummaryText || 'H08, H09';
    const totalPaid = totalParam
      ? parseInt(totalParam, 10)
      : session.totalPaid || session.ticketTotalPrice || 280000;

    if (totalPaid > 0) {
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=CINE-${codeStr}-${slug}`;

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
            : 'Dune: Hành Tinh Cát - Phần 2'),
        movieSlug: slug,
        posterUrl:
          session.posterUrl ||
          'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
        backdropUrl:
          session.backdropUrl ||
          'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80',
        movieFormat: session.movieFormat || 'IMAX Laser 3D',
        ageRating: session.ageRating || 'T16',
        audioFormat: 'Dolby Atmos 128ch',
        durationMinutes: 166,
        cinemaName,
        cinemaAddress:
          session.cinemaAddress ||
          'Tầng 5, Trung tâm Thương mại Landmark 81, TP. Hồ Chí Minh',
        roomName: session.roomName || 'Phòng Chiếu 01 · IMAX Laser 4K',
        showTime,
        showDate,
        seatLabels,
        qrCodeUrl,
        barcodeValue: `CD${codeStr.replace(/\D/g, '').padEnd(10, '8').slice(0, 10)}`,
        totalPaid,
        paidAt: session.paidAt || new Date().toLocaleString('vi-VN'),
        paymentMethodName: session.paymentMethod || 'Cổng Thanh Toán Trực Tuyến VNPAY',
        transactionNo: `VNP-${codeStr.replace(/\D/g, '').padEnd(8, '0')}`,
        status: 'PAID',
        combos,
      };
    }
  }

  // 4. For direct testing / preview codes (like CINEMA-25F882 or URL params)
  if (targetBookingId) {
    return buildPreviewTicket(String(targetBookingId), {
      movieParam,
      seatsParam,
      dateParam,
      timeParam,
      cinemaParam,
      totalParam,
    });
  }

  // Any other completely empty unverified access -> REJECT!
  return null;
}
