/**
 * Age Rating Classification & Helpers for Vietnam Cinemas
 * Compliant with Circular 05/2023/TT-BVHTTDL by Ministry of Culture, Sports and Tourism:
 * - 'P': Phổ biến cho mọi lứa tuổi (General)
 * - 'K': Dưới 13 tuổi có người giám hộ đi cùng (Kids with guardian)
 * - 'T13' (C13): Khán giả từ đủ 13 tuổi trở lên (13+)
 * - 'T16' (C16): Khán giả từ đủ 16 tuổi trở lên (16+)
 * - 'T18' (C18): Khán giả từ đủ 18 tuổi trở lên (18+)
 * - 'C': Cấm phổ biến
 */

export type AgeRating = 'P' | 'K' | 'T13' | 'T16' | 'T18' | 'C';

export interface AgeRatingInfo {
  code: AgeRating;
  label: string;
  shortLabel: string;
  subLabel: string;
  description: string;
  minAge: number;
  color: string;
  bgHex: string;
  textHex: string;
  badgeClass: string;
  borderClass: string;
  softBgClass: string;
  isRestricted: boolean;
}

export const AGE_RATING_CONFIG: Record<AgeRating, AgeRatingInfo> = {
  P: {
    code: 'P',
    label: 'Khán giả mọi lứa tuổi',
    shortLabel: 'P - Mọi lứa tuổi',
    subLabel: 'Phổ biến',
    description: 'Phim được phép phổ biến rộng rãi đến người xem ở mọi lứa tuổi.',
    minAge: 0,
    color: '#22c55e',
    bgHex: '#16a34a',
    textHex: '#ffffff',
    badgeClass: 'bg-emerald-600 text-white border-emerald-500 shadow-xs',
    borderClass: 'border-emerald-500/30',
    softBgClass: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    isRestricted: false,
  },
  K: {
    code: 'K',
    label: 'Dưới 13 tuổi có người giám hộ',
    shortLabel: 'K - Dưới 13T có GH',
    subLabel: 'Cần người lớn',
    description: 'Phim được phép phổ biến đến người xem dưới 13 tuổi với điều kiện xem cùng cha, mẹ hoặc người giám hộ.',
    minAge: 0,
    color: '#3b82f6',
    bgHex: '#2563eb',
    textHex: '#ffffff',
    badgeClass: 'bg-blue-600 text-white border-blue-500 shadow-xs',
    borderClass: 'border-blue-500/30',
    softBgClass: 'bg-blue-50 text-blue-800 border border-blue-200',
    isRestricted: false,
  },
  T13: {
    code: 'T13',
    label: 'Khán giả từ đủ 13 tuổi (13+)',
    shortLabel: 'T13 - Từ 13 tuổi',
    subLabel: '13+ Khán giả',
    description: 'Phim được phép phổ biến đến người xem từ đủ 13 tuổi trở lên. Rạp có thể kiểm tra giấy tờ tùy thân.',
    minAge: 13,
    color: '#f59e0b',
    bgHex: '#d97706',
    textHex: '#ffffff',
    badgeClass: 'bg-amber-500 text-white border-amber-400 shadow-xs',
    borderClass: 'border-amber-500/30',
    softBgClass: 'bg-amber-50 text-amber-800 border border-amber-200',
    isRestricted: true,
  },
  T16: {
    code: 'T16',
    label: 'Khán giả từ đủ 16 tuổi (16+)',
    shortLabel: 'T16 - Từ 16 tuổi',
    subLabel: '16+ Khán giả',
    description: 'Phim được phép phổ biến đến người xem từ đủ 16 tuổi trở lên. Quý khách vui lòng mang theo giấy tờ tùy thân có ảnh.',
    minAge: 16,
    color: '#f97316',
    bgHex: '#ea580c',
    textHex: '#ffffff',
    badgeClass: 'bg-orange-500 text-white border-orange-400 shadow-xs',
    borderClass: 'border-orange-500/30',
    softBgClass: 'bg-orange-50 text-orange-800 border border-orange-200',
    isRestricted: true,
  },
  T18: {
    code: 'T18',
    label: 'Khán giả từ đủ 18 tuổi (18+)',
    shortLabel: 'T18 - Từ 18 tuổi',
    subLabel: '18+ Cấm trẻ em',
    description: 'Phim cấm khán giả dưới 18 tuổi. Khán giả bắt buộc phải xuất trình CCCD hoặc giấy tờ tùy thân có ảnh khi vào rạp.',
    minAge: 18,
    color: '#ef4444',
    bgHex: '#e11d48',
    textHex: '#ffffff',
    badgeClass: 'bg-rose-600 text-white border-rose-500 shadow-xs',
    borderClass: 'border-rose-500/30',
    softBgClass: 'bg-rose-50 text-rose-800 border border-rose-200',
    isRestricted: true,
  },
  C: {
    code: 'C',
    label: 'Phim cấm phổ biến',
    shortLabel: 'C - Cấm phổ biến',
    subLabel: 'Cấm chiếu',
    description: 'Phim không được phép phổ biến tại các rạp chiếu phim.',
    minAge: 999,
    color: '#64748b',
    bgHex: '#475569',
    textHex: '#ffffff',
    badgeClass: 'bg-slate-700 text-white border-slate-600 shadow-xs',
    borderClass: 'border-slate-500/30',
    softBgClass: 'bg-slate-100 text-slate-800 border border-slate-300',
    isRestricted: true,
  },
};

/**
 * Normalizes any string or age code into canonical AgeRating
 */
export function normalizeAgeRating(value?: string | null): AgeRating {
  if (!value) return 'P';
  const v = String(value).toUpperCase().trim();
  if (v === 'T18' || v === 'C18' || v === '18+' || v === '18' || v === 'R' || v === 'NC-17') return 'T18';
  if (v === 'T16' || v === 'C16' || v === '16+' || v === '16') return 'T16';
  if (v === 'T13' || v === 'C13' || v === '13+' || v === '13' || v === 'PG-13') return 'T13';
  if (v === 'K' || v === 'PG') return 'K';
  if (v === 'C' || v === 'CAM' || v === 'BANNED') return 'C';
  return 'P';
}

/**
 * Get full AgeRating metadata
 */
export function getAgeRatingInfo(value?: string | null): AgeRatingInfo {
  const code = normalizeAgeRating(value);
  return AGE_RATING_CONFIG[code] || AGE_RATING_CONFIG.P;
}

/**
 * Check if the movie has age restrictions (T13, T16, T18)
 */
export function isRestrictedAgeRating(value?: string | null): boolean {
  const code = normalizeAgeRating(value);
  return code === 'T13' || code === 'T16' || code === 'T18';
}

/**
 * Get warning text for notices in showtime schedules or checkout
 */
export function getAgeWarningNotice(value?: string | null): string | null {
  const info = getAgeRatingInfo(value);
  if (!info.isRestricted) return null;

  if (info.code === 'T18') {
    return 'Phim dành cho khán giả từ đủ 18 tuổi trở lên. Rạp sẽ kiểm tra CCCD/giấy tờ tùy thân có ảnh khi vào phòng chiếu.';
  }
  if (info.code === 'T16') {
    return 'Phim dành cho khán giả từ đủ 16 tuổi trở lên. Quý khách vui lòng chuẩn bị giấy tờ tùy thân có ảnh khi đến rạp.';
  }
  if (info.code === 'T13') {
    return 'Phim dành cho khán giả từ đủ 13 tuổi trở lên. Khán giả cần đáp ứng điều kiện độ tuổi theo quy định.';
  }

  return null;
}
