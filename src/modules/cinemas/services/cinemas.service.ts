import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { CinemaItem, PricingFormatTab, CinemaPricingFormat } from '../types/cinemas.types';
import { MOCK_CINEMAS, MOCK_PRICING_DATA, MOCK_CITIES } from '../mocks/mockCinemasData';
import { APP_CONFIG } from '@/shared/constants/config';

export async function fetchCities(): Promise<string[]> {
  try {
    const res = await apiClient.get(ENDPOINTS.MASTER.PROVINCES);
    if (res.data?.success && Array.isArray(res.data?.data)) {
      const cities = res.data.data.map((p: any) => p.province_name);
      return ['Tất cả thành phố', ...cities];
    }
  } catch {
    // Fallback
  }
  if (!APP_CONFIG.USE_MOCK_DATA) return [];
  return MOCK_CITIES;
}

export async function fetchCinemasByCity(city?: string): Promise<CinemaItem[]> {
  try {
    const params: Record<string, any> = {};
    if (city && city !== 'Tất cả thành phố') {
      params.city = city;
    }

    const res = await apiClient.get(ENDPOINTS.CINEMAS.LIST, { params });
    if (res.data?.success && Array.isArray(res.data?.data)) {
      const rawList = res.data.data;
      if (rawList.length > 0) {
        return rawList.map((c: any) => ({
          id: String(c.cinema_id || c.id),
          slug: c.slug || 'cinedot-landmark-81',
          name: c.name || 'CineDot Cinema',
          city: c.province?.province_name || c.city || 'Hồ Chí Minh',
          address: c.address || 'Địa chỉ cụm rạp',
          phone: c.phone || '1900 1234',
          status: c.status === 'MAINTENANCE' ? 'MAINTENANCE' : 'OPEN',
          isOpen: c.is_open ?? true,
          bannerUrl: c.banner_url || c.bannerUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
          mapUrl: c.map_url || c.mapUrl || 'https://maps.google.com',
          description: c.description || 'Cụm rạp tiêu chuẩn quốc tế với phòng chiếu hiện đại.',
        }));
      }
    }
  } catch {
    // Fallback
  }
  if (!APP_CONFIG.USE_MOCK_DATA) return [];
  if (!city || city === 'Tất cả thành phố') return MOCK_CINEMAS;
  return MOCK_CINEMAS.filter((c) => c.city === city);
}

export async function fetchCinemaDetail(slug: string): Promise<CinemaItem | null> {
  try {
    const res = await apiClient.get(ENDPOINTS.CINEMAS.DETAIL_BY_SLUG(slug));
    if (res.data?.success && res.data?.data) {
      const c = res.data.data;
      return {
        id: String(c.cinema_id || c.id),
        slug: c.slug || slug,
        name: c.name || 'CineDot Cinema',
        city: c.province?.province_name || c.city || 'Hồ Chí Minh',
        address: c.address || 'Địa chỉ cụm rạp',
        phone: c.phone || '1900 1234',
        status: c.status === 'MAINTENANCE' ? 'MAINTENANCE' : 'OPEN',
        isOpen: c.is_open ?? true,
        bannerUrl: c.banner_url || c.bannerUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
        mapUrl: c.map_url || c.mapUrl || 'https://maps.google.com',
        description: c.description || 'Cụm rạp tiêu chuẩn quốc tế với phòng chiếu hiện đại.',
      };
    }
  } catch {
    // Fallback
  }
  if (!APP_CONFIG.USE_MOCK_DATA) return null;
  return MOCK_CINEMAS.find((c) => c.slug === slug) || MOCK_CINEMAS[0];
}

export async function fetchPricingFormat(tab: PricingFormatTab): Promise<CinemaPricingFormat> {
  try {
    const res = await apiClient.get(ENDPOINTS.CINEMAS.PRICING);
    if (res.data?.success && res.data?.data) {
      const data = res.data.data;
      if (data[tab]) return data[tab];
    }
  } catch {
    // Fallback
  }
  if (!APP_CONFIG.USE_MOCK_DATA) throw new Error('Failed to fetch pricing');
  return MOCK_PRICING_DATA[tab] || MOCK_PRICING_DATA['2d'];
}
