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

export function mapMovieToCardItem(m: any, defaultStatus: 'now-showing' | 'coming-soon' = 'now-showing'): MovieCardItem {
  const statusStr = (m.status || '').toLowerCase();
  let status: 'now-showing' | 'coming-soon' = defaultStatus;
  if (statusStr === 'now_showing' || statusStr === 'now-showing') status = 'now-showing';
  else if (statusStr === 'coming_soon' || statusStr === 'coming-soon' || statusStr === 'upcoming') status = 'coming-soon';

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
    const [nowShowingRes, upcomingRes] = await Promise.all([
      apiClient.get(ENDPOINTS.MOVIES.LIST, { params: { status: 'now_showing', per_page: 12 } }),
      apiClient.get(ENDPOINTS.MOVIES.LIST, { params: { status: 'upcoming', per_page: 12 } }),
    ]);

    const nowShowingPayload = nowShowingRes.data?.data;
    const nowShowingRaw = Array.isArray(nowShowingPayload)
      ? nowShowingPayload
      : nowShowingPayload?.results || nowShowingPayload?.data || [];

    const upcomingPayload = upcomingRes.data?.data;
    const upcomingRaw = Array.isArray(upcomingPayload)
      ? upcomingPayload
      : upcomingPayload?.results || upcomingPayload?.data || [];

    const nowShowingCards = nowShowingRaw.map((m: any) => mapMovieToCardItem(m, 'now-showing'));
    const upcomingCards = upcomingRaw.map((m: any) => mapMovieToCardItem(m, 'coming-soon'));

    if (nowShowingCards.length > 0 || upcomingCards.length > 0) {
      return [...nowShowingCards, ...upcomingCards];
    }
  } catch (e) {
    console.error('Failed to fetch home movies', e);
  }
  return [];
}

export async function fetchQuickBookingMovies(): Promise<{ id: string; slug: string; title: string }[]> {
  try {
    const res = await apiClient.get(ENDPOINTS.MOVIES.LIST, { params: { per_page: 30 } });
    if (res.data?.success && res.data?.data) {
      const results = Array.isArray(res.data.data) ? res.data.data : res.data.data.results || res.data.data.data || [];
      return results.map((m: any) => ({
        id: String(m.id || m.movie_id),
        slug: m.slug || 'movie-detail',
        title: m.title || m.original_title || 'Tên Phim',
      }));
    }
  } catch (e) {
    console.error('Failed to fetch quick booking movies', e);
  }
  return [];
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
  } catch (e) {
    console.error('Failed to fetch home cinemas', e);
  }
  return [];
}

export interface MovieShowtimeTreeCinema {
  cinema: {
    id?: string | number;
    cinema_id?: string | number;
    name?: string;
    cinema_name?: string;
  };
  times: {
    id?: string | number;
    showtime_id?: string | number;
    time?: string;
    showtime_start?: string;
    format?: string;
    room?: {
      room_id?: string | number;
      room_name?: string;
      room_type?: string;
    };
  }[];
}

export interface MovieShowtimeTreeDay {
  date: string;
  cinemas: MovieShowtimeTreeCinema[];
}

export async function fetchMovieShowtimesTree(movieSlug: string): Promise<MovieShowtimeTreeDay[]> {
  try {
    const res = await apiClient.get(ENDPOINTS.MOVIES.SHOWTIMES(movieSlug));
    if (res.data?.success && res.data?.data) {
      const results = res.data.data.results || res.data.data;
      if (Array.isArray(results)) {
        return results;
      }
    }
  } catch (e) {
    console.error('Failed to fetch movie showtimes tree', e);
  }
  return [];
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
