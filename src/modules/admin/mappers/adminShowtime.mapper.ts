import { imageHelper } from '@/shared/utils/imageHelper';
import { AdminShowtimeItemDTO } from '../dto/adminShowtime.dto';
import { AdminShowtimeGridItem } from '../types/adminShowtime.types';

export const adminShowtimeMapper = {
  toGridItem(dto: AdminShowtimeItemDTO): AdminShowtimeGridItem {
    let showDate = '';
    let startTime = '00:00';
    let endTime = '00:00';
    let startMinutes = 0;
    let endMinutes = 0;

    if (dto.showtime_start) {
      try {
        const dStart = new Date(dto.showtime_start);
        if (!isNaN(dStart.getTime())) {
          showDate = dStart.toISOString().split('T')[0];
          startTime = dStart.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
          startMinutes = dStart.getHours() * 60 + dStart.getMinutes();
        }
      } catch {
        // ignore
      }
    }

    if (dto.showtime_end) {
      try {
        const dEnd = new Date(dto.showtime_end);
        if (!isNaN(dEnd.getTime())) {
          endTime = dEnd.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
          endMinutes = dEnd.getHours() * 60 + dEnd.getMinutes();
        }
      } catch {
        // ignore
      }
    }

    const duration = Number(dto.movie?.duration || 120);
    if (!endMinutes && startMinutes) {
      endMinutes = startMinutes + duration;
      const h = Math.floor(endMinutes / 60) % 24;
      const m = Math.floor(endMinutes % 60);
      endTime = `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
    }

    const totalSeats = Number(dto.total_seats_count || 0);
    const bookedSeats = Number(dto.booked_seats_count || 0);
    const occupancyRate = totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 1000) / 10 : 0;
    const isLocked = bookedSeats > 0;

    const rawPoster = dto.movie?.poster_path || dto.movie?.poster_url || dto.movie?.poster || '';
    const rawBackdrop = dto.movie?.backdrop_path || dto.movie?.backdrop_url || dto.movie?.banner_url || rawPoster;

    return {
      id: Number(dto.showtime_id),
      showtimeId: Number(dto.showtime_id),
      movieId: Number(dto.movie_id || dto.movie?.movie_id || 0),
      movieTitle: dto.movie?.title || 'Phim Chiếu Rạp',
      moviePoster: imageHelper.getPosterUrl(rawPoster, 'md'),
      movieBanner: imageHelper.getBackdropUrl(rawBackdrop, 'lg'),
      movieAgeRating: dto.movie?.age_rating || 'P',
      durationMinutes: duration,
      cleaningBufferMinutes: 15,
      cinemaId: Number(dto.room?.cinema_id || dto.room?.cinema?.cinema_id || 0),
      cinemaName: dto.room?.cinema?.cinema_name || 'CineDot',
      roomId: Number(dto.room_id || dto.room?.room_id || 0),
      roomName: dto.room?.room_name || 'Phòng chiếu',
      roomType: dto.room?.room_type || '2D Standard',
      showDate,
      startTime,
      endTime,
      startMinutes,
      endMinutes,
      basePrice: Number(dto.base_price || 0),
      bookedSeats,
      totalSeats,
      occupancyRate,
      isLocked,
      status: 'OPEN',
    };
  },
};
