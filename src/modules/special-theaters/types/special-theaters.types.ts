export type TheaterFormat = 'ALL' | 'IMAX' | '4DX' | 'GOLD_CLASS' | 'DOLBY_ATMOS';

export interface SpecialTheaterSpec {
  id: string;
  format: TheaterFormat;
  formatName: string;
  tagline: string;
  description: string;
  imageUrl: string;
  badgeText: string;
  badgeColor: string;
  specs: string[];
  features: string[];
  applicableCinemas: string[];
  priceRange: string;
  ctaText: string;
}

export interface ComparisonMatrixRow {
  featureName: string;
  imax: string;
  fourDx: string;
  goldClass: string;
  dolbyAtmos: string;
}
