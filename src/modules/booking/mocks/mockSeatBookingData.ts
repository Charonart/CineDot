import { SeatItem, ShowtimeBookingInfo } from '../types/seat-booking.types';

export const mockShowtimeBookingInfo: ShowtimeBookingInfo = {
  showtimeId: 'showtime-101',
  movieSlug: 'cai-chet-cua-robin-hood',
  movieTitle: 'Cái Chết của Robin Hood',
  movieFormat: 'IMAX Laser 3D',
  screenType: 'imax_laser',
  soundTechnology: 'imax_sound',
  screenConfig: {
    shape: 'curved',
    aspect_ratio: '1.90:1',
    width: 520,
    curve_depth: 35,
    label: 'MÀN HÌNH CONG IMAX LASER 3D',
  },
  posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
  ageRating: 'T16',
  cinemaName: 'CineDot Landmark 81',
  roomName: 'Phòng chiếu 01 (IMAX Laser)',
  showTime: '19:30',
  showDate: 'Hôm nay',
  basePrice: 110000,
  countdownSeconds: 600, // 10 minutes
};

export const generateMockSeats = (): SeatItem[] => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seats: SeatItem[] = [];
  let seatCounter = 1;
  const SEAT_SIZE = 35;

  const bookedSeatIds = new Set(['C05', 'C06', 'D07', 'F06', 'F07', 'F08', 'G04', 'G05']);

  rows.forEach((row, rowIdx) => {
    let type: 'STANDARD' | 'VIP' | 'SWEETBOX' = 'STANDARD';
    let price = 110000;

    if (['E', 'F', 'G', 'H'].includes(row)) {
      type = 'VIP';
      price = 140000;
    } else if (['I', 'J'].includes(row)) {
      type = 'SWEETBOX';
      price = 250000;
    }

    const actualCy = (rowIdx + 1) * SEAT_SIZE + 20;

    if (type === 'SWEETBOX') {
      for (let num = 1; num <= 12; num += 2) {
        const pairId = `${row}${num.toString().padStart(2, '0')}-${row}${(num + 1).toString().padStart(2, '0')}`;
        const isBooked = bookedSeatIds.has(`${row}${num.toString().padStart(2, '0')}`);

        let cx1 = num * SEAT_SIZE;
        let cx2 = (num + 1) * SEAT_SIZE;
        if (num > 3) { cx1 += 15; cx2 += 15; }
        if (num > 9) { cx1 += 15; cx2 += 15; }

        seats.push({
          id: `${row}${num.toString().padStart(2, '0')}`,
          showtime_seat_id: seatCounter++,
          row,
          number: num,
          type: 'SWEETBOX',
          status: isBooked ? 'BOOKED' : 'AVAILABLE',
          price,
          pairId,
          canvas: { cx: cx1, cy: actualCy, angle: 0 },
        });

        seats.push({
          id: `${row}${(num + 1).toString().padStart(2, '0')}`,
          showtime_seat_id: seatCounter++,
          row,
          number: num + 1,
          type: 'SWEETBOX',
          status: isBooked ? 'BOOKED' : 'AVAILABLE',
          price,
          pairId,
          canvas: { cx: cx2, cy: actualCy, angle: 0 },
        });
      }
    } else {
      for (let num = 1; num <= 12; num++) {
        const seatId = `${row}${num.toString().padStart(2, '0')}`;
        const isBooked = bookedSeatIds.has(seatId);

        let actualCx = num * SEAT_SIZE;
        if (num > 3) actualCx += 15;
        if (num > 9) actualCx += 15;

        let angle = 0;
        if (num <= 3) angle = 9 - (num * 3);
        else if (num >= 10) angle = - (9 - ((13 - num) * 3));

        seats.push({
          id: seatId,
          showtime_seat_id: seatCounter++,
          row,
          number: num,
          type,
          status: isBooked ? 'BOOKED' : 'AVAILABLE',
          price,
          canvas: { cx: actualCx, cy: actualCy, angle },
        });
      }
    }
  });

  return seats;
};
