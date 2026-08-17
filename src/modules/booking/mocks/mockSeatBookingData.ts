import { SeatItem, ShowtimeBookingInfo } from '../types/seat-booking.types';

export const mockShowtimeBookingInfo: ShowtimeBookingInfo = {
  showtimeId: 'showtime-101',
  movieSlug: 'cai-chet-cua-robin-hood',
  movieTitle: 'Cái Chết của Robin Hood',
  movieFormat: 'IMAX Laser',
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

  const bookedSeatIds = new Set(['C05', 'C06', 'D07', 'F06', 'F07', 'F08', 'G04', 'G05']);

  rows.forEach((row) => {
    let type: 'STANDARD' | 'VIP' | 'SWEETBOX' = 'STANDARD';
    let price = 110000;

    if (['E', 'F', 'G', 'H'].includes(row)) {
      type = 'VIP';
      price = 140000;
    } else if (['I', 'J'].includes(row)) {
      type = 'SWEETBOX';
      price = 250000;
    }

    if (type === 'SWEETBOX') {
      for (let num = 1; num <= 12; num += 2) {
        const pairId = `${row}${num.toString().padStart(2, '0')}-${row}${(num + 1).toString().padStart(2, '0')}`;
        const isBooked = bookedSeatIds.has(`${row}${num.toString().padStart(2, '0')}`);

        seats.push({
          id: `${row}${num.toString().padStart(2, '0')}`,
          showtime_seat_id: seatCounter++,
          row,
          number: num,
          type: 'SWEETBOX',
          status: isBooked ? 'BOOKED' : 'AVAILABLE',
          price,
          pairId,
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
        });
      }
    } else {
      for (let num = 1; num <= 12; num++) {
        const seatId = `${row}${num.toString().padStart(2, '0')}`;
        const isBooked = bookedSeatIds.has(seatId);

        seats.push({
          id: seatId,
          showtime_seat_id: seatCounter++,
          row,
          number: num,
          type,
          status: isBooked ? 'BOOKED' : 'AVAILABLE',
          price,
        });
      }
    }
  });

  return seats;
};
