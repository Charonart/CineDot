export type TheaterFormat =
  | 'ALL'
  | 'IMAX'
  | 'SCREENX'
  | 'DOLBY_CINEMA'
  | 'ONYX_LED'
  | 'GOLD_CLASS'
  | 'STANDARD_3D'
  | '4DX'
  | 'DOLBY_ATMOS';

export interface SpecialTheaterSpec {
  id: string;
  format: TheaterFormat;
  formatName: string;
  tagline: string;
  description: string;
  imageUrl: string;
  badgeText: string;
  badgeColor: string;
  screenType?: string;
  soundTechnology?: string;
  specs: string[];
  features: string[];
  applicableCinemas: string[];
  priceRange: string;
  ctaText: string;
}

export interface ComparisonMatrixRow {
  featureName: string;
  imax: string;
  screenx: string;
  dolbyCinema: string;
  onyxLed: string;
  goldClass: string;
  standard3d: string;
}

