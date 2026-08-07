import { SpecialTheaterSpec, TheaterFormat, ComparisonMatrixRow } from '../types/special-theaters.types';
import { MOCK_SPECIAL_THEATERS, MOCK_COMPARISON_MATRIX } from '../mocks/mockSpecialTheatersData';

export async function fetchSpecialTheaters(format: TheaterFormat = 'ALL'): Promise<SpecialTheaterSpec[]> {
  await new Promise((res) => setTimeout(res, 150));
  if (format === 'ALL') {
    return MOCK_SPECIAL_THEATERS;
  }
  return MOCK_SPECIAL_THEATERS.filter((th) => th.format === format);
}

export async function fetchComparisonMatrix(): Promise<ComparisonMatrixRow[]> {
  await new Promise((res) => setTimeout(res, 100));
  return MOCK_COMPARISON_MATRIX;
}
