import { SeatItem, ShowtimeBookingInfo } from '../types/seat-booking.types';
import { generateMockSeats } from '../mocks/mockSeatBookingData';
import { MOCK_DATE_OPTIONS } from '@/modules/movie-detail/mocks/mockMovieDetailData';

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
  'dune-2': {
    title: 'Hành Tinh Cát: Phần Hai (Dune 2)',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    format: 'IMAX 2D Phụ Đề',
    age: 'T16',
  },
};

export function formatShowDate(dateParam?: string): string {
  if (!dateParam) return 'Thứ Năm, 30/07/2026';

  const matched = MOCK_DATE_OPTIONS.find(
    (d) => d.displayDate === dateParam || d.dateStr.endsWith(dateParam)
  );

  if (matched) {
    const dayLabel = matched.displayDay === 'Hôm Nay' ? 'Thứ Năm' : matched.displayDay;
    return `${dayLabel}, ${matched.displayDate}/2026`;
  }

  return `Ngày ${dateParam}/2026`;
}

export async function fetchBookingInfo(
  showtimeId: string,
  movieParam?: string,
  dateParam?: string,
  timeParam?: string,
  cinemaParam?: string
): Promise<ShowtimeBookingInfo> {
  await new Promise((res) => setTimeout(res, 200));

  const slug = movieParam || 'conan-movie-27';
  const foundMovie = mockMovieDatabase[slug];

  const movieTitle = foundMovie
    ? foundMovie.title
    : 'Thám Tử Lừng Danh Conan: Ngôi Sao 5 Cánh 1 Triệu Đô';
  const posterUrl = foundMovie
    ? foundMovie.poster
    : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80';
  const movieFormat = foundMovie ? foundMovie.format : 'IMAX 2D Phụ Đề';
  const ageRating = foundMovie ? foundMovie.age : 'P';

  const cinemaName = cinemaParam ? decodeURIComponent(cinemaParam) : 'CineDot Landmark 81';
  const showTime = timeParam || '19:30';
  const showDate = formatShowDate(dateParam);

  return {
    showtimeId,
    movieSlug: slug,
    movieTitle,
    movieFormat,
    posterUrl,
    ageRating,
    cinemaName,
    roomName: 'Phòng chiếu 01 (IMAX Laser)',
    showTime,
    showDate,
    countdownSeconds: 600,
  };
}

export async function fetchSeatGrid(showtimeId: string): Promise<SeatItem[]> {
  await new Promise((res) => setTimeout(res, 300));
  return generateMockSeats();
}
