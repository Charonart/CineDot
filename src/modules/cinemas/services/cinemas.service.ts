import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { masterDataService } from '@/shared/services/masterData.service';
import { imageHelper } from '@/shared/utils/imageHelper';
import {
  CinemaItem,
  PricingFormatTab,
  CinemaPricingFormat,
  CinemaMovieShowtime,
} from '../types/cinemas.types';
import { isShowtimePassed } from '@/shared/utils/showtimeHelper';

export async function fetchCities(): Promise<string[]> {
  try {
    const provinces = await masterDataService.getProvinces();
    if (provinces && provinces.length > 0) {
      const cityNames = provinces.map((p) => p.province_name);
      return ['Tất cả thành phố', ...cityNames];
    }
  } catch (error) {
    console.error('Failed to fetch cinema cities', error);
  }
  return ['Tất cả thành phố', 'TP.Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'];
}

export async function fetchCinemasByCity(city?: string): Promise<CinemaItem[]> {
  try {
    const params: Record<string, any> = {};
    if (city && city !== 'Tất cả thành phố') {
      params.city = city;
    }

    const res = await apiClient.get(ENDPOINTS.CINEMAS.LIST, { params });
    if (res.data?.success && Array.isArray(res.data?.data)) {
      return res.data.data.map((c: any) => ({
        id: String(c.cinema_id || c.id),
        slug: c.slug || 'cinedot-landmark-81',
        name: c.cinema_name || c.name || 'CineDot Cinema',
        city: c.province || c.province_name || c.city || 'Hồ Chí Minh',
        address: c.cinema_address || c.address || 'Địa chỉ cụm rạp',
        phone: c.phone || '1900 1234',
        status: c.isActive === false ? 'MAINTENANCE' : 'OPEN',
        isOpen: c.isActive !== false,
        bannerUrl: imageHelper.getBackdropUrl(c.banner_url || c.bannerUrl),
        mapUrl: c.map_url || `https://maps.google.com/?q=${encodeURIComponent(c.cinema_name || c.name)}`,
        description: c.description || 'Cụm rạp tiêu chuẩn quốc tế với phòng chiếu hiện đại và âm thanh vòm đỉnh cao.',
      }));
    }
  } catch (error) {
    console.error('Failed to fetch cinemas by city', error);
  }
  return [];
}

export async function fetchCinemaDetail(slug: string): Promise<CinemaItem | null> {
  try {
    const res = await apiClient.get(ENDPOINTS.CINEMAS.DETAIL_BY_SLUG(slug));
    if (res.data?.success && res.data?.data) {
      const c = res.data.data;
      return {
        id: String(c.cinema_id || c.id),
        slug: c.slug || slug,
        name: c.cinema_name || c.name || 'CineDot Cinema',
        city: c.province || c.province_name || c.city || 'Hồ Chí Minh',
        address: c.cinema_address || c.address || 'Địa chỉ cụm rạp',
        phone: c.phone || '1900 1234',
        status: c.isActive === false ? 'MAINTENANCE' : 'OPEN',
        isOpen: c.isActive !== false,
        bannerUrl: imageHelper.getBackdropUrl(c.banner_url || c.bannerUrl),
        mapUrl: c.map_url || `https://maps.google.com/?q=${encodeURIComponent(c.cinema_name || c.name)}`,
        description: c.description || 'Cụm rạp tiêu chuẩn quốc tế với phòng chiếu hiện đại và âm thanh vòm đỉnh cao.',
      };
    }
  } catch (error) {
    console.error('Failed to fetch cinema detail', error);
  }
  return null;
}

export async function fetchPricingFormat(tab: PricingFormatTab): Promise<CinemaPricingFormat> {
  try {
    const res = await apiClient.get(ENDPOINTS.CINEMAS.PRICING);
    if (res.data?.success && res.data?.data) {
      const data = res.data.data;
      if (data[tab]) return data[tab];
      if (data[tab.toUpperCase()]) return data[tab.toUpperCase()];
    }
  } catch (error) {
    console.error('Failed to fetch pricing format', error);
  }

  // Fallback structure
  return {
    formatName: tab === 'imax' ? 'IMAX Laser' : tab === '3d' ? '3D Experience' : '2D Digital Tiêu Chuẩn',
    formatBadge: tab.toUpperCase(),
    categories: [
      { dayType: 'Thứ 2 - Thứ 5', timeSlot: 'Trước 17:00', standardPrice: 75000, vipPrice: 85000, sweetboxPrice: 170000 },
      { dayType: 'Thứ 2 - Thứ 5', timeSlot: 'Sau 17:00', standardPrice: 85000, vipPrice: 95000, sweetboxPrice: 190000 },
      { dayType: 'Thứ 6, Thứ 7, CN, Ngày Lễ', timeSlot: 'Cả ngày', standardPrice: 95000, vipPrice: 105000, sweetboxPrice: 210000 },
    ],
  };
}

export async function fetchCinemaShowtimes(slug: string, date?: string): Promise<CinemaMovieShowtime[]> {
  try {
    const res = await apiClient.get(ENDPOINTS.CINEMAS.SHOWTIMES_BY_SLUG(slug), {
      params: { date },
    });

    if (res.data?.success && Array.isArray(res.data?.data)) {
      return res.data.data
        .map((item: any) => {
          const movie = item.movie || {};
          const rawTimes = Array.isArray(item.times) ? item.times : [];

          const slots = rawTimes
            .filter((st: any) => {
              return !isShowtimePassed({
                dateStr: date,
                timeStr: st.time,
                showtimeStart: st.showtime_start,
              });
            })
            .map((st: any) => {
              const startTime = st.showtime_start ? new Date(st.showtime_start).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : (st.time || '19:30');
              const room = st.room || {};
              return {
                id: st.showtime_id || st.id,
                showtimeId: st.showtime_id || st.id,
                time: startTime,
                format: room.room_type || st.format || '2D Phụ Đề',
                roomName: room.room_name || 'Phòng 01',
              };
            });

          const genres = Array.isArray(movie.genres)
            ? movie.genres.map((g: any) => g.name || g.genre_name || g).join(', ')
            : 'Điện Ảnh';

          return {
            movieId: movie.movie_id || movie.id,
            title: movie.title || 'Tên Phim',
            slug: movie.slug || 'movie-detail',
            posterUrl: imageHelper.getPosterUrl(movie.poster_path || movie.poster_url),
            ageRating: movie.age_rating || (movie.adult ? 'T18' : 'P'),
            duration: movie.duration ? `${movie.duration} phút` : '120 phút',
            genres,
            slots,
          };
        })
        .filter((movie: any) => movie.slots.length > 0);
    }
  } catch (error) {
    console.error('Failed to fetch cinema showtimes', error);
  }
  return [];
}
