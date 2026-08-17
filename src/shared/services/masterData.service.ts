import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { ApiResponse } from '@/shared/types/api.types';

export interface ProvinceItem {
  province_id: number;
  province_name: string;
  province_code: string;
}

export interface BannerItem {
  banner_id: number;
  id?: number | string;
  title: string;
  image_url: string;
  imageUrl?: string;
  link_url?: string;
  linkUrl?: string;
  subtitle?: string;
  ctaText?: string;
  badge?: string;
}

export interface ComboItem {
  combo_id: number;
  id?: number | string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  imageUrl?: string;
  is_active?: boolean;
}

export interface GenreItem {
  genre_id: number;
  id?: number;
  name: string;
  genre_name?: string;
  slug?: string;
  description?: string;
}

export interface PersonItem {
  person_id: number;
  name: string;
  original_name?: string;
  character?: string;
  profile_path?: string;
  bio?: string;
  birthday?: string;
  known_for_department?: string;
}

const FALLBACK_PROVINCES: ProvinceItem[] = [
  { province_id: 1, province_name: 'Hồ Chí Minh', province_code: 'HCM' },
  { province_id: 2, province_name: 'Hà Nội', province_code: 'HN' },
  { province_id: 3, province_name: 'Đà Nẵng', province_code: 'DN' },
  { province_id: 4, province_name: 'Hải Phòng', province_code: 'HP' },
  { province_id: 5, province_name: 'Cần Thơ', province_code: 'CT' },
];

const FALLBACK_GENRES: GenreItem[] = [
  { genre_id: 28, id: 28, name: 'Phim Hành Động', genre_name: 'Phim Hành Động', slug: 'phim-hanh-dong' },
  { genre_id: 12, id: 12, name: 'Phim Phiêu Lưu', genre_name: 'Phim Phiêu Lưu', slug: 'phim-phieu-luu' },
  { genre_id: 16, id: 16, name: 'Phim Hoạt Hình', genre_name: 'Phim Hoạt Hình', slug: 'phim-hoat-hinh' },
  { genre_id: 35, id: 35, name: 'Phim Hài', genre_name: 'Phim Hài', slug: 'phim-hai' },
  { genre_id: 878, id: 878, name: 'Phim Khoa Học Viễn Tưởng', genre_name: 'Phim Khoa Học Viễn Tưởng', slug: 'phim-khoa-hoc-vien-tuong' },
  { genre_id: 27, id: 27, name: 'Phim Kinh Dị', genre_name: 'Phim Kinh Dị', slug: 'phim-kinh-di' },
  { genre_id: 10749, id: 10749, name: 'Phim Lãng Mạn', genre_name: 'Phim Lãng Mạn', slug: 'phim-lang-man' },
  { genre_id: 14, id: 14, name: 'Phim Giả Tưởng', genre_name: 'Phim Giả Tưởng', slug: 'phim-gia-tuong' },
  { genre_id: 53, id: 53, name: 'Phim Gây Cấn', genre_name: 'Phim Gây Cấn', slug: 'phim-gay-can' },
];

export const masterDataService = {
  /**
   * Lấy danh sách Tỉnh / Thành phố hoạt động
   */
  async getProvinces(): Promise<ProvinceItem[]> {
    try {
      const res = await apiClient.get<ApiResponse<ProvinceItem[]>>(ENDPOINTS.MASTER.PROVINCES);
      if (res.data?.success && Array.isArray(res.data?.data) && res.data.data.length > 0) {
        return res.data.data.map((p: any) => ({
          province_id: p.province_id || p.id,
          province_name: p.province_name || p.name,
          province_code: p.province_code || p.code || 'VN',
        }));
      }
      return FALLBACK_PROVINCES;
    } catch {
      return FALLBACK_PROVINCES;
    }
  },

  /**
   * Lấy danh sách Banner slider trang chủ
   */
  async getBanners(): Promise<BannerItem[]> {
    try {
      const res = await apiClient.get<ApiResponse<BannerItem[]>>(ENDPOINTS.MASTER.BANNERS);
      return res.data?.data || [];
    } catch {
      return [];
    }
  },

  /**
   * Lấy danh sách Combo Bắp Nước (F&B)
   */
  async getCombos(): Promise<ComboItem[]> {
    try {
      const res = await apiClient.get<ApiResponse<ComboItem[]>>(ENDPOINTS.MASTER.COMBOS);
      return res.data?.data || [];
    } catch {
      return [];
    }
  },

  /**
   * Lấy danh sách Thể loại Phim
   */
  async getGenres(): Promise<GenreItem[]> {
    try {
      const res = await apiClient.get<ApiResponse<any[]>>(ENDPOINTS.MASTER.GENRES);
      if (res.data?.success && Array.isArray(res.data?.data) && res.data.data.length > 0) {
        return res.data.data.map((g: any) => ({
          genre_id: Number(g.genre_id || g.id),
          id: Number(g.id || g.genre_id),
          name: g.name || g.genre_name || 'Thể Loại',
          genre_name: g.genre_name || g.name || 'Thể Loại',
          slug: g.slug || '',
        }));
      }
      return FALLBACK_GENRES;
    } catch {
      return FALLBACK_GENRES;
    }
  },

  /**
   * Lấy chi tiết Diễn viên / Đạo diễn
   */
  async getPerson(personId: number | string): Promise<PersonItem | null> {
    try {
      const res = await apiClient.get<ApiResponse<PersonItem>>(ENDPOINTS.MASTER.PERSON(personId));
      return res.data?.data || null;
    } catch {
      return null;
    }
  },
};
