import {
  AdminBookingItemDTO,
  AdminBookingStatsDTO,
} from '../dto/adminBooking.dto';
import {
  AdminBookingItem,
  AdminBookingStats,
  AdminBookingSeat,
  AdminBookingCombo,
  BookingStatusType,
} from '../types/adminBooking.types';

export const adminBookingMapper = {
  toDomain(dto: AdminBookingItemDTO): AdminBookingItem {
    const rawSeats = Array.isArray(dto.booking_seats) ? dto.booking_seats : [];
    const seats: AdminBookingSeat[] = rawSeats.map((bs) => {
      let seatCode = '';
      if (bs.showtime_seat) {
        seatCode = `${bs.showtime_seat.row_name}${bs.showtime_seat.seat_number}`;
      }
      if (!seatCode) {
        seatCode = `Ghế #${bs.showtime_seat_id || bs.booking_seat_id}`;
      }

      return {
        id: bs.booking_seat_id,
        seatId: bs.showtime_seat_id,
        seatCode,
        ticketType: bs.ticket_type || 'Standard',
        price: Number(bs.price || 0),
      };
    });

    const seatsFormatted = seats.map((s) => s.seatCode).join(', ') || 'Chưa chọn ghế';

    const rawCombos = Array.isArray(dto.booking_combos)
      ? dto.booking_combos
      : Array.isArray(dto.bookingCombos)
      ? dto.bookingCombos
      : [];

    const combos: AdminBookingCombo[] = rawCombos.map((c) => ({
      id: c.booking_combo_id,
      comboId: c.combo_id,
      name: c.combo?.combo_name || 'Combo Bắp Nước',
      quantity: Number(c.quantity || 0),
      price: Number(c.combo?.price || 0),
      isClaimed: Boolean(c.is_claimed),
    }));

    // Format showtime
    let startTime = '';
    let endTime = '';
    let showDate = '';
    let showtimeFormatted = 'Chưa xếp suất';

    if (dto.showtime?.showtime_start) {
      try {
        const dStart = new Date(dto.showtime.showtime_start);
        if (!isNaN(dStart.getTime())) {
          startTime = dStart.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
          showDate = dStart.toLocaleDateString('vi-VN');
        }
      } catch {
        // ignore
      }
    }

    if (dto.showtime?.showtime_end) {
      try {
        const dEnd = new Date(dto.showtime.showtime_end);
        if (!isNaN(dEnd.getTime())) {
          endTime = dEnd.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        }
      } catch {
        // ignore
      }
    }

    if (startTime && showDate) {
      showtimeFormatted = `${startTime}${endTime ? ' - ' + endTime : ''} • ${showDate}`;
    }

    // Format checkedInAt
    let checkedInAtFormatted = '';
    const isCheckedIn = Boolean(dto.checked_in_at);
    if (dto.checked_in_at) {
      try {
        const d = new Date(dto.checked_in_at);
        if (!isNaN(d.getTime())) {
          checkedInAtFormatted = `${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ${d.toLocaleDateString('vi-VN')}`;
        }
      } catch {
        checkedInAtFormatted = String(dto.checked_in_at);
      }
    }

    // Format createdAt
    let createdAtFormatted = '';
    if (dto.created_at) {
      try {
        const d = new Date(dto.created_at);
        if (!isNaN(d.getTime())) {
          createdAtFormatted = `${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ${d.toLocaleDateString('vi-VN')}`;
        }
      } catch {
        createdAtFormatted = String(dto.created_at);
      }
    }

    const rawStatus = (dto.booking_status || 'pending').toLowerCase() as BookingStatusType;
    let statusLabel = 'Chờ thanh toán';
    if (rawStatus === 'refunded') {
      statusLabel = 'Đã hoàn tiền';
    } else if (rawStatus === 'cancelled') {
      statusLabel = 'Đã hủy';
    } else if (rawStatus === 'completed' || rawStatus === 'paid') {
      statusLabel = isCheckedIn ? 'Đã soát vé' : 'Đã thanh toán';
    } else if (rawStatus === 'cancelling') {
      statusLabel = 'Yêu cầu hủy';
    }

    return {
      id: Number(dto.booking_id || 0),
      bookingCode: dto.booking_code || '',
      userId: dto.user_id,
      customerName: dto.user?.fullname || dto.user?.name || 'Khách vãng lai',
      customerPhone: dto.user?.phone || '',
      customerEmail: dto.user?.email || '',
      customerAvatar: dto.user?.avatar,
      movieId: dto.showtime?.movie?.movie_id,
      movieTitle: dto.showtime?.movie?.title || 'Vé Xem Phim',
      moviePoster: dto.showtime?.movie?.poster_url,
      movieAgeRating: dto.showtime?.movie?.age_rating || 'P',
      movieDuration: Number(dto.showtime?.movie?.duration || 0),
      cinemaName: dto.showtime?.room?.cinema?.cinema_name || 'Cụm Rạp CineDot',
      roomName: dto.showtime?.room?.room_name || 'Phòng chiếu',
      roomType: dto.showtime?.room?.room_type || '2D Standard',
      showtimeFormatted,
      showDate,
      startTime,
      endTime,
      seats,
      seatsFormatted,
      seatCount: seats.length,
      combos,
      combosCount: combos.reduce((sum, c) => sum + c.quantity, 0),
      finalAmount: Number(dto.final_amount || 0),
      discountAmount: Number(dto.discount_amount || 0),
      status: rawStatus,
      statusLabel,
      isCheckedIn,
      checkedInAt: dto.checked_in_at,
      checkedInAtFormatted,
      createdAt: dto.created_at,
      createdAtFormatted,
      priceBreakdown: dto.price_breakdown,
    };
  },

  statsToDomain(dto: AdminBookingStatsDTO): AdminBookingStats {
    return {
      totalBookings: Number(dto.totalBookings || 0),
      totalRevenue: Number(dto.totalRevenue || 0),
      todayRevenue: Number(dto.todayRevenue || 0),
      totalCheckedIn: Number(dto.totalCheckedIn || 0),
      totalRefunded: Number(dto.totalRefunded || 0),
      checkInRate: Number(dto.checkInRate || 0),
    };
  },
};
