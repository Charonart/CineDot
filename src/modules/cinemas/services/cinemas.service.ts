import { CinemaItem, PricingFormatTab, CinemaPricingFormat } from '../types/cinemas.types';
import { MOCK_CINEMAS, MOCK_PRICING_DATA, MOCK_CITIES } from '../mocks/mockCinemasData';

export async function fetchCities(): Promise<string[]> {
  await new Promise((res) => setTimeout(res, 100));
  return MOCK_CITIES;
}

export async function fetchCinemasByCity(city?: string): Promise<CinemaItem[]> {
  await new Promise((res) => setTimeout(res, 150));
  if (!city || city === 'Tất cả thành phố') return MOCK_CINEMAS;
  return MOCK_CINEMAS.filter((c) => c.city === city);
}

export async function fetchPricingFormat(tab: PricingFormatTab): Promise<CinemaPricingFormat> {
  await new Promise((res) => setTimeout(res, 100));
  return MOCK_PRICING_DATA[tab] || MOCK_PRICING_DATA['2d'];
}
