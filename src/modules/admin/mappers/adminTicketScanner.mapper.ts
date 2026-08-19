import { ScanTicketResponseDTO, RecentScanItemDTO } from '../dto/adminTicketScanner.dto';
import { ScannedTicketDetail, RecentScanItem } from '../types/adminTicketScanner.types';

export const adminTicketScannerMapper = {
  toDomain(dto: ScanTicketResponseDTO): ScannedTicketDetail {
    const seatsList = Array.isArray(dto.seats) ? dto.seats : [];
    const combosList = Array.isArray(dto.combos) ? dto.combos : [];

    const seatsFormatted = seatsList.map((s) => s.seatCode).join(', ') || 'Chưa xếp ghế';

    const startTime = dto.startTime ? dto.startTime.slice(0, 5) : '';
    const endTime = dto.endTime ? dto.endTime.slice(0, 5) : '';
    let showtimeFormatted = 'Chưa xác định suất chiếu';
    if (startTime && dto.showDate) {
      showtimeFormatted = `${startTime}${endTime ? ' - ' + endTime : ''} • ${dto.showDate}`;
    } else if (startTime) {
      showtimeFormatted = `${startTime}${endTime ? ' - ' + endTime : ''}`;
    } else if (dto.showDate) {
      showtimeFormatted = dto.showDate;
    }

    let checkedInFormatted = '';
    const isCheckedIn = Boolean(dto.isCheckedIn || dto.checkedInAt);
    if (dto.checkedInAt) {
      try {
        const d = new Date(dto.checkedInAt);
        if (!isNaN(d.getTime())) {
          checkedInFormatted = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + d.toLocaleDateString('vi-VN');
        } else {
          checkedInFormatted = String(dto.checkedInAt);
        }
      } catch {
        checkedInFormatted = String(dto.checkedInAt);
      }
    }

    return {
      bookingId: Number(dto.bookingId || 0),
      bookingCode: dto.bookingCode || '',
      status: dto.bookingStatus || 'completed',
      isCheckedIn,
      checkedInAt: checkedInFormatted,
      movieTitle: dto.movieTitle || 'Vé Xem Phim',
      moviePoster: dto.moviePoster || '',
      ageRating: dto.ageRating || 'P',
      durationMinutes: Number(dto.duration || 0),
      cinemaName: dto.cinemaName || 'CineDot',
      roomName: dto.roomName || 'Phòng chiếu',
      roomType: dto.roomType || '2D Standard',
      showDate: dto.showDate || '',
      startTime,
      endTime,
      showtimeFormatted,
      customerName: dto.customerName || 'Khách vãng lai',
      customerPhone: dto.customerPhone || '',
      customerEmail: dto.customerEmail || '',
      finalAmount: Number(dto.finalAmount || 0),
      seats: seatsList.map((s) => ({
        id: s.seatId,
        seatCode: s.seatCode,
        price: s.price,
      })),
      seatsFormatted,
      combos: combosList.map((c) => ({
        id: c.bookingComboId,
        name: c.comboName,
        quantity: c.quantity,
        isClaimed: c.isClaimed,
      })),
    };
  },

  recentScanToDomain(dto: RecentScanItemDTO): RecentScanItem {
    let checkedInFormatted = dto.checkedInAt || '';
    try {
      const d = new Date(dto.checkedInAt);
      if (!isNaN(d.getTime())) {
        checkedInFormatted = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      }
    } catch {
      // ignore
    }

    return {
      bookingId: Number(dto.bookingId),
      bookingCode: dto.bookingCode,
      checkedInAtFormatted: checkedInFormatted,
      movieTitle: dto.movieTitle,
      moviePoster: dto.moviePoster || '',
      cinemaName: dto.cinemaName,
      roomName: dto.roomName,
      showtime: dto.showtime,
      customerName: dto.customerName,
      seats: dto.seats,
      combosCount: dto.combosCount,
    };
  },
};
