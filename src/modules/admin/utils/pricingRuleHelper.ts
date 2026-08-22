import { ModifierType, PricingRuleConditions } from '../types/adminPricingRule.types';

export const DAY_OPTIONS = [
  { id: 'Monday', label: 'Thứ 2', short: 'T2' },
  { id: 'Tuesday', label: 'Thứ 3', short: 'T3' },
  { id: 'Wednesday', label: 'Thứ 4', short: 'T4' },
  { id: 'Thursday', label: 'Thứ 5', short: 'T5' },
  { id: 'Friday', label: 'Thứ 6', short: 'T6' },
  { id: 'Saturday', label: 'Thứ 7', short: 'T7' },
  { id: 'Sunday', label: 'Chủ Nhật', short: 'CN' },
];

export const SEAT_TYPE_OPTIONS = [
  { id: 'standard', label: 'Ghế Thường (Standard)' },
  { id: 'vip', label: 'Ghế VIP' },
  { id: 'sweetbox', label: 'Ghế Đôi Sweetbox' },
  { id: 'deluxe', label: 'Ghế Deluxe' },
  { id: 'bed', label: 'Ghế Giường Nằm (Bed)' },
];

export const CATEGORY_OPTIONS = [
  { id: 'weekend_surcharge', label: 'Phụ thu cuối tuần' },
  { id: 'prime_time_surcharge', label: 'Phụ thu giờ vàng' },
  { id: 'early_bird_discount', label: 'Giảm giá suất sớm (Early Bird)' },
  { id: 'happy_tuesday', label: 'Thứ 3 vui vẻ (Happy Tuesday)' },
  { id: 'holiday_surcharge', label: 'Phụ thu Lễ / Tết' },
  { id: 'student_discount', label: 'Ưu đãi Học sinh - Sinh viên' },
  { id: 'senior_discount', label: 'Ưu đãi Người cao tuổi' },
  { id: 'women_day_discount', label: 'Ưu đãi Ngày phụ nữ (8/3, 20/10)' },
  { id: 'general', label: 'Quy tắc giá chung' },
];

export function parseConditions(conditions: any): PricingRuleConditions {
  if (!conditions) return {};
  if (typeof conditions === 'string') {
    try {
      return JSON.parse(conditions);
    } catch {
      return {};
    }
  }
  if (typeof conditions === 'object' && !Array.isArray(conditions)) {
    return conditions;
  }
  return {};
}

export function formatModifier(type: ModifierType, value: number | string) {
  const num = Number(value) || 0;
  const isDiscount = num < 0;
  const absNum = Math.abs(num);

  if (type === 'percentage') {
    return {
      text: `${isDiscount ? '-' : '+'}${absNum}%`,
      isDiscount,
      formattedValue: `${absNum}%`,
      sign: isDiscount ? '-' : '+',
    };
  }

  return {
    text: `${isDiscount ? '-' : '+'}${absNum.toLocaleString('vi-VN')}đ`,
    isDiscount,
    formattedValue: `${absNum.toLocaleString('vi-VN')}đ`,
    sign: isDiscount ? '-' : '+',
  };
}

export function getCategoryLabel(category: string): string {
  const found = CATEGORY_OPTIONS.find((c) => c.id === category);
  if (found) return found.label;
  return category || 'Chung';
}

/**
 * Tự động dịch conditions JSON thành câu văn tiếng Việt tự nhiên, dễ hiểu
 */
export function translateConditionsToVietnamese(
  conditions: PricingRuleConditions | null | undefined,
  modifierType: ModifierType,
  modifierValue: number | string
): string {
  const conds = parseConditions(conditions);
  const mod = formatModifier(modifierType, modifierValue);
  const actionText = mod.isDiscount ? `Giảm ${mod.formattedValue}` : `Phụ thu ${mod.formattedValue}`;

  const clauses: string[] = [];

  // 1. Days
  if (conds.days && Array.isArray(conds.days) && conds.days.length > 0) {
    const rawDays = conds.days.map((d) => d.toLowerCase());
    if (rawDays.includes('weekend') || (rawDays.includes('saturday') && rawDays.includes('sunday') && rawDays.length === 2)) {
      clauses.push('vào các ngày cuối tuần (Thứ 7 & CN)');
    } else if (rawDays.includes('weekday') || (rawDays.length === 5 && !rawDays.includes('saturday') && !rawDays.includes('sunday'))) {
      clauses.push('vào các ngày trong tuần (T2 đến T6)');
    } else if (rawDays.length === 7) {
      clauses.push('tất cả các ngày trong tuần');
    } else {
      const dayNames = conds.days
        .map((d) => {
          const matched = DAY_OPTIONS.find((opt) => opt.id.toLowerCase() === d.toLowerCase());
          return matched ? matched.label : d;
        })
        .join(', ');
      clauses.push(`vào ngày ${dayNames}`);
    }
  }

  // 2. Time
  const timeFrom = conds.time_from || conds.time_range?.from;
  const timeTo = conds.time_to || conds.time_range?.to;
  if (timeFrom && timeTo) {
    clauses.push(`khung giờ từ ${timeFrom} đến ${timeTo}`);
  } else if (timeFrom) {
    clauses.push(`suất chiếu từ sau ${timeFrom}`);
  } else if (timeTo) {
    clauses.push(`suất chiếu trước ${timeTo}`);
  }

  // 3. Seat Types
  if (conds.seat_types && Array.isArray(conds.seat_types) && conds.seat_types.length > 0) {
    const seatNames = conds.seat_types
      .map((st) => {
        const found = SEAT_TYPE_OPTIONS.find((s) => s.id.toLowerCase() === st.toLowerCase());
        return found ? found.label : st.toUpperCase();
      })
      .join(', ');
    clauses.push(`cho ${seatNames}`);
  }

  // 4. Dates / Date Range
  if (conds.date_range?.from && conds.date_range?.to) {
    clauses.push(`giai đoạn từ ${conds.date_range.from} đến ${conds.date_range.to}`);
  } else if (conds.dates && Array.isArray(conds.dates) && conds.dates.length > 0) {
    clauses.push(`vào các ngày ${conds.dates.join(', ')}`);
  }

  // 5. Min Seats
  if (conds.min_seats && conds.min_seats > 1) {
    clauses.push(`khi mua từ ${conds.min_seats} vé trở lên`);
  }

  // 6. Age Range
  if (conds.min_age !== undefined && conds.max_age !== undefined) {
    clauses.push(`dành cho khách hàng từ ${conds.min_age} đến ${conds.max_age} tuổi`);
  } else if (conds.max_age !== undefined) {
    clauses.push(`dành cho khách hàng dưới ${conds.max_age} tuổi (HSSV)`);
  } else if (conds.min_age !== undefined) {
    clauses.push(`dành cho khách hàng từ ${conds.min_age} tuổi trở lên (Người cao tuổi)`);
  }

  // 7. Genders
  if (conds.genders && Array.isArray(conds.genders) && conds.genders.length > 0) {
    const isFemale = conds.genders.some((g) => g.toLowerCase() === 'female');
    if (isFemale) {
      clauses.push('ưu tiên cho khách hàng nữ');
    }
  }

  if (clauses.length === 0) {
    return `${actionText} áp dụng cho tất cả các suất chiếu và loại vé.`;
  }

  return `${actionText} ${clauses.join(' ')}.`;
}
