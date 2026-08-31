/**
 * Centralized Showtime Timing & Expiration Helper
 * Ensures past showtimes are consistently filtered out from booking flows.
 */

export const DEFAULT_SHOWTIME_BUFFER_MINUTES = 5;

/**
 * Returns the configured booking grace period buffer in minutes.
 * (e.g., 5 minutes after start time before booking is cut off)
 */
export function getShowtimeBufferMinutes(): number {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SHOWTIME_BOOKING_BUFFER_MINUTES) {
    const parsed = Number(process.env.NEXT_PUBLIC_SHOWTIME_BOOKING_BUFFER_MINUTES);
    if (!isNaN(parsed)) return parsed;
  }
  return DEFAULT_SHOWTIME_BUFFER_MINUTES;
}

export interface ParseShowtimeInput {
  dateStr?: string;
  timeStr?: string;
  showtimeStart?: string;
}

/**
 * Parses a showtime's start datetime into a reliable JavaScript Date object.
 */
export function parseShowtimeStartDate(input: ParseShowtimeInput): Date | null {
  const { dateStr, timeStr, showtimeStart } = input;

  // 1. If explicit ISO or SQL datetime is provided
  if (showtimeStart && typeof showtimeStart === 'string') {
    const normalized = showtimeStart.trim().replace(' ', 'T');
    const parsed = new Date(normalized);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  // 2. If separate dateStr and timeStr are provided
  if (timeStr) {
    const timeParts = timeStr.trim().split(':');
    const hours = Number(timeParts[0]) || 0;
    const minutes = Number(timeParts[1]) || 0;

    let year: number;
    let monthIndex: number; // 0-indexed
    let day: number;

    const today = new Date();

    if (!dateStr || dateStr === 'Hôm nay' || dateStr.toLowerCase().includes('hôm nay')) {
      year = today.getFullYear();
      monthIndex = today.getMonth();
      day = today.getDate();
    } else if (dateStr.includes('/')) {
      // Format: DD/MM/YYYY or DD/MM
      const parts = dateStr.split('/');
      day = Number(parts[0]) || today.getDate();
      monthIndex = (Number(parts[1]) || today.getMonth() + 1) - 1;
      year = Number(parts[2]) || today.getFullYear();
    } else if (dateStr.includes('-')) {
      // Format: YYYY-MM-DD
      const parts = dateStr.split('-');
      year = Number(parts[0]) || today.getFullYear();
      monthIndex = (Number(parts[1]) || today.getMonth() + 1) - 1;
      day = Number(parts[2]) || today.getDate();
    } else {
      const parsedDate = new Date(dateStr);
      if (!isNaN(parsedDate.getTime())) {
        year = parsedDate.getFullYear();
        monthIndex = parsedDate.getMonth();
        day = parsedDate.getDate();
      } else {
        year = today.getFullYear();
        monthIndex = today.getMonth();
        day = today.getDate();
      }
    }

    const constructedDate = new Date(year, monthIndex, day, hours, minutes, 0, 0);
    if (!isNaN(constructedDate.getTime())) {
      return constructedDate;
    }
  }

  // 3. Fallback to parsing dateStr alone
  if (dateStr) {
    const parsedDate = new Date(dateStr);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  return null;
}

/**
 * Determines whether a showtime has already passed (expired for online booking).
 *
 * @param input - The date/time inputs for the showtime
 * @param bufferMinutes - Optional override for grace period (default from env / 5 min)
 * @returns true if the showtime start time + buffer is <= current local time.
 */
export function isShowtimePassed(
  input: ParseShowtimeInput,
  bufferMinutes?: number
): boolean {
  const startDate = parseShowtimeStartDate(input);
  if (!startDate) return false;

  const graceMinutes = bufferMinutes !== undefined ? bufferMinutes : getShowtimeBufferMinutes();
  const cutoffTimestamp = startDate.getTime() + graceMinutes * 60 * 1000;

  return cutoffTimestamp <= Date.now();
}

/**
 * Checks if a given date string is strictly in the past (before today, ignoring time).
 */
export function isDateInPast(dateStr?: string): boolean {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let targetDate: Date;
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    targetDate = new Date(Number(parts[2]) || today.getFullYear(), (Number(parts[1]) || 1) - 1, Number(parts[0]) || 1);
  } else {
    targetDate = new Date(dateStr);
  }

  if (isNaN(targetDate.getTime())) return false;
  targetDate.setHours(0, 0, 0, 0);

  return targetDate.getTime() < today.getTime();
}

/**
 * Checks if a given date string represents today.
 */
export function isTodayDate(dateStr?: string): boolean {
  if (!dateStr || dateStr === 'Hôm nay' || dateStr.toLowerCase().includes('hôm nay')) return true;
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const todaySlash = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

  return dateStr === todayIso || dateStr === todaySlash || dateStr.startsWith(todayIso);
}

/**
 * Generic array filter to prune past/expired showtimes.
 */
export function filterUpcomingShowtimes<T>(
  items: T[],
  extractFn?: (item: T) => ParseShowtimeInput,
  contextDateStr?: string,
  bufferMinutes?: number
): T[] {
  if (!Array.isArray(items)) return [];

  return items.filter((item: any) => {
    let input: ParseShowtimeInput;

    if (extractFn) {
      input = extractFn(item);
    } else {
      input = {
        dateStr: item.dateStr || item.date || item.showDate || contextDateStr,
        timeStr: item.time || item.startTime || item.timeStr,
        showtimeStart: item.showtime_start || item.showtimeStart || item.start_time,
      };
    }

    if (!input.dateStr && contextDateStr) {
      input.dateStr = contextDateStr;
    }

    return !isShowtimePassed(input, bufferMinutes);
  });
}
