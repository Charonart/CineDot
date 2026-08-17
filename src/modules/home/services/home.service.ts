import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { PromoBanner, MovieCardItem, ArticleItem, PromotionItem } from '../types/home.types';
import { imageHelper } from '@/shared/utils/imageHelper';
import {
  MOCK_PROMO_BANNERS,
  MOCK_MOVIES,
  MOCK_COMING_SOON_MOVIES,
  MOCK_EARLY_TICKET_MOVIES,
  MOCK_ARTICLES,
  MOCK_PROMOTIONS,
} from '../mocks/mockHomeData';
import { APP_CONFIG } from '@/shared/constants/config';

export interface HomeCinemaOption {
  id: string;
  name: string;
  city?: string;
}

export interface DynamicDateOption {
  id: string;
  label: string;
  dateStr: string;
}

export interface QuickShowtimeOption {
  id: string;
  label: string;
  time: string;
  format: string;
  showtimeId: string | number;
}

export function mapMovieToCardItem(m: any, defaultStatus: 'now-showing' | 'coming-soon' | 'early-ticket' = 'now-showing'): MovieCardItem {
  const statusStr = (m.status || '').toLowerCase();
  let status: 'now-showing' | 'coming-soon' | 'early-ticket' = defaultStatus;
  if (statusStr === 'now_showing' || statusStr === 'now-showing') status = 'now-showing';
  else if (statusStr === 'coming_soon' || statusStr === 'coming-soon' || statusStr === 'upcoming') status = 'coming-soon';
  else if (statusStr === 'early_ticket' || statusStr === 'early-ticket') status = 'early-ticket';

  const genres = Array.isArray(m.genres)
    ? m.genres.map((g: any) => g.name || g).join(', ')
    : typeof m.genre === 'string'
    ? m.genre
    : Array.isArray(m.genre)
    ? m.genre.join(', ')
    : 'Hành Động';

  const poster = imageHelper.getPosterUrl(m.posterUrl || m.poster_url || m.poster || m.poster_path);
  const duration = typeof m.runtime === 'number'
    ? `${m.runtime} phút`
    : typeof m.duration === 'number'
    ? `${m.duration} phút`
    : m.duration || '120 phút';

  return {
    id: String(m.id || m.movie_id),
    title: m.title || m.originalTitle || m.original_title || 'Tên Phim',
    slug: m.slug || 'movie-detail',
    genre: genres,
    duration,
    rating: Number(m.rating || m.vote_average || 4.8),
    ageRating: m.ageRating || m.age_rating || 'P',
    posterUrl: poster,
    status,
    isHot: Boolean(m.is_hot || m.isHot || true),
    formatBadge: m.formatBadge || m.format_badge || 'IMAX 2D',
    trailerUrl: m.trailerUrl || m.trailer_url || 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
  };
}

export async function fetchPromoBanners(): Promise<PromoBanner[]> {
  try {
    const res = await apiClient.get(ENDPOINTS.MASTER.BANNERS);
    const banners: PromoBanner[] = [];

    if (res.data?.success && Array.isArray(res.data?.data) && res.data.data.length > 0) {
      res.data.data.forEach((b: any) => {
        banners.push({
          id: String(b.id || b.banner_id),
          title: b.title || 'Ưu Đãi CineDot',
          imageUrl: imageHelper.getBackdropUrl(b.imageUrl || b.image_url),
          linkUrl: b.linkUrl || b.link_url || '/events',
          badgeText: b.badge || 'HOT EVENT',
        });
      });
    }

    // If few banners, enrich from trending movies backdrops
    if (banners.length < 3) {
      try {
        const trendingRes = await apiClient.get(ENDPOINTS.MOVIES.TRENDING);
        const list = trendingRes.data?.data?.results || [];
        list.slice(0, 3 - banners.length).forEach((m: any, idx: number) => {
          banners.push({
            id: `trending-banner-${m.id || idx}`,
            title: `Bom Tấn Khởi Chiếu: ${m.title || m.originalTitle}`,
            imageUrl: imageHelper.getBackdropUrl(m.backdropUrl || m.backdrop_url || m.posterUrl),
            linkUrl: `/movies/${m.slug || 'movie-detail'}`,
            badgeText: 'BOM TẤN HOT',
          });
        });
      } catch {
        // Ignore
      }
    }

    if (!APP_CONFIG.USE_MOCK_DATA) return banners;
    return banners.length > 0 ? banners : MOCK_PROMO_BANNERS;
  } catch {
    if (!APP_CONFIG.USE_MOCK_DATA) return [];
    return MOCK_PROMO_BANNERS;
  }
}

export async function fetchHomeMovies(): Promise<MovieCardItem[]> {
  try {
    const res = await apiClient.get(ENDPOINTS.MOVIES.LIST, { params: { per_page: 20 } });
    if (res.data?.success && res.data?.data) {
      const payload = res.data.data;
      const raw = Array.isArray(payload) ? payload : payload?.results || payload?.data || [];
      if (raw.length > 0) {
        return raw.map((m: any) => mapMovieToCardItem(m, 'now-showing'));
      }
    }
    
    if (!APP_CONFIG.USE_MOCK_DATA) return [];
    return [...MOCK_MOVIES, ...MOCK_COMING_SOON_MOVIES, ...MOCK_EARLY_TICKET_MOVIES];
  } catch {
    if (!APP_CONFIG.USE_MOCK_DATA) return [];
    return [...MOCK_MOVIES, ...MOCK_COMING_SOON_MOVIES, ...MOCK_EARLY_TICKET_MOVIES];
  }
}

export async function fetchHomeCinemas(): Promise<HomeCinemaOption[]> {
  try {
    const res = await apiClient.get(ENDPOINTS.CINEMAS.LIST);
    if (res.data?.success && Array.isArray(res.data?.data)) {
      return res.data.data.map((c: any) => ({
        id: String(c.id || c.cinema_id),
        name: c.name || c.cinema_name || 'CineDot Cinema',
        city: c.city || c.province_name,
      }));
    }
  } catch {
    // Fallback
  }
  return [
    { id: 'c-1', name: 'CineDot Landmark 81 Saigon' },
    { id: 'c-2', name: 'CineDot Hanoi Centre' },
    { id: 'c-3', name: 'CineDot Danang Riverside' },
  ];
}

export function generateDynamicDateOptions(): DynamicDateOption[] {
  const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dates: DynamicDateOption[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const dayName = i === 0 ? 'Hôm nay' : i === 1 ? 'Ngày mai' : daysOfWeek[d.getDay()];
    const dateFormatted = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    const isoDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    dates.push({
      id: isoDate,
      label: `${dayName} (${dateFormatted})`,
      dateStr: dateFormatted,
    });
  }

  return dates;
}

export async function fetchQuickShowtimes(
  movieSlug: string,
  cinemaId?: string,
  date?: string
): Promise<QuickShowtimeOption[]> {
  try {
    if (movieSlug) {
      const res = await apiClient.get(ENDPOINTS.MOVIES.SHOWTIMES(movieSlug), {
        params: { date, cinema_id: cinemaId },
      });
      if (res.data?.success && Array.isArray(res.data?.data)) {
        const slots: QuickShowtimeOption[] = [];
        res.data.data.forEach((group: any) => {
          if (Array.isArray(group.formatGroups)) {
            group.formatGroups.forEach((fg: any) => {
              if (Array.isArray(fg.showtimes)) {
                fg.showtimes.forEach((st: any) => {
                  slots.push({
                    id: String(st.id),
                    showtimeId: st.id,
                    time: st.time,
                    format: fg.formatName || '2D Phụ Đề',
                    label: `${st.time} - ${fg.formatName || '2D'}`,
                  });
                });
              }
            });
          }
        });
        if (slots.length > 0) return slots;
      }
    }
  } catch {
    // Fallback
  }

  return [
    { id: 'st-1', showtimeId: 'showtime-101', time: '18:30', format: 'IMAX 2D', label: '18:30 - IMAX 2D' },
    { id: 'st-2', showtimeId: 'showtime-102', time: '19:45', format: '2D Phụ Đề', label: '19:45 - 2D Phụ Đề' },
    { id: 'st-3', showtimeId: 'showtime-103', time: '21:15', format: '4DX 3D', label: '21:15 - 4DX 3D' },
    { id: 'st-4', showtimeId: 'showtime-104', time: '22:30', format: '2D Lồng Tiếng', label: '22:30 - 2D Lồng Tiếng' },
  ];
}

export async function fetchNavbarMovies(): Promise<{ nowShowing: MovieCardItem[]; comingSoon: MovieCardItem[] }> {
  try {
    const res = await apiClient.get(ENDPOINTS.MOVIES.NAVBAR);
    if (res.data?.success && res.data?.data) {
      const { now_showing = [], coming_soon = [], trending = [], upcoming = [] } = res.data.data;
      const nowShowingList = Array.isArray(now_showing) ? now_showing : [];
      const comingSoonList = Array.isArray(coming_soon) && coming_soon.length > 0 ? coming_soon : (Array.isArray(upcoming) && upcoming.length > 0 ? upcoming : trending);
      return {
        nowShowing: nowShowingList.map((m: any) => mapMovieToCardItem(m, 'now-showing')),
        comingSoon: comingSoonList.map((m: any) => mapMovieToCardItem(m, 'coming-soon')),
      };
    }
  } catch {
    // Fallback
  }
  return {
    nowShowing: MOCK_MOVIES,
    comingSoon: MOCK_COMING_SOON_MOVIES,
  };
}

export async function fetchHomeArticles(): Promise<ArticleItem[]> {
  try {
    const res = await apiClient.get(ENDPOINTS.MOVIES.TRENDING);
    const movies = res.data?.data?.results || [];
    if (movies.length > 0) {
      return movies.slice(0, 4).map((m: any, idx: number) => ({
        id: `article-${m.id || idx}`,
        title: idx === 0 ? `Đánh giá siêu phẩm: ${m.title} - Trải nghiệm điện ảnh đỉnh cao hè 2026` : `Toàn cảnh hậu trường & kỹ xảo ấn tượng của ${m.title}`,
        slug: m.slug || 'movie-review',
        summary: m.overview || 'Bộ phim đem lại trải nghiệm mãn nhãn với những thước phim sống động cùng cốt truyện sâu sắc lay động người xem.',
        category: idx % 2 === 0 ? 'review' : 'blog',
        imageUrl: imageHelper.getBackdropUrl(m.backdropUrl || m.posterUrl),
        publishDate: 'Hôm nay',
        ratingScore: 9.2,
        likeCount: 340 + idx * 45,
      }));
    }
  } catch {
    // Fallback
  }
  if (!APP_CONFIG.USE_MOCK_DATA) return [];
  return MOCK_ARTICLES;
}

export async function fetchHomePromotions(): Promise<PromotionItem[]> {
  try {
    const res = await apiClient.get(ENDPOINTS.MASTER.BANNERS);
    if (res.data?.success && Array.isArray(res.data?.data) && res.data.data.length > 0) {
      return res.data.data.map((b: any) => ({
        id: String(b.id || b.banner_id),
        title: b.title || 'Ưu Đãi Đặc Biệt CineDot',
        imageUrl: imageHelper.getBackdropUrl(b.imageUrl || b.image_url),
        linkUrl: b.linkUrl || b.link_url || '/events',
        subtitle: 'Áp dụng cho thành viên CineDot trên toàn quốc',
      }));
    }
  } catch {
    // Fallback
  }
  if (!APP_CONFIG.USE_MOCK_DATA) return [];
  return MOCK_PROMOTIONS;
}
