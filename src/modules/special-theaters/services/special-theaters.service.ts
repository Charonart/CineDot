import { apiClient } from '@/shared/lib/apiClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { SpecialTheaterSpec, TheaterFormat, ComparisonMatrixRow } from '../types/special-theaters.types';
import { MOCK_SPECIAL_THEATERS, MOCK_COMPARISON_MATRIX } from '../mocks/mockSpecialTheatersData';
import { APP_CONFIG } from '@/shared/constants/config';

export async function fetchSpecialTheaters(format: TheaterFormat = 'ALL'): Promise<SpecialTheaterSpec[]> {
  try {
    if (format !== 'ALL') {
      const res = await apiClient.get(ENDPOINTS.CINEMAS.SPECIAL_THEATERS(format));
      if (res.data?.success && Array.isArray(res.data?.data) && res.data.data.length > 0) {
        return res.data.data;
      }
    }
  } catch {
    // Fallback
  }

  if (!APP_CONFIG.USE_MOCK_DATA) return [];
  if (format === 'ALL') {
    return MOCK_SPECIAL_THEATERS;
  }
  return MOCK_SPECIAL_THEATERS.filter((th) => th.format === format);
}

export async function fetchComparisonMatrix(): Promise<ComparisonMatrixRow[]> {
  await new Promise((res) => setTimeout(res, 100));
  if (!APP_CONFIG.USE_MOCK_DATA) return [];
  return MOCK_COMPARISON_MATRIX;
}
