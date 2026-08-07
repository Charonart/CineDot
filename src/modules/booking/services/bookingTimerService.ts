'use client';

const TIMER_KEY_PREFIX = 'cinedot_booking_timer_expires_at_';

export function startBookingTimer(showtimeId: string = 'showtime-101', durationSeconds: number = 600): number {
  if (typeof window === 'undefined') return Date.now() + durationSeconds * 1000;

  const key = `${TIMER_KEY_PREFIX}${showtimeId}`;
  const stored = sessionStorage.getItem(key);

  // If a valid active countdown timer ALREADY EXISTS -> KEEP IT, DO NOT OVERWRITE!
  if (stored) {
    const expiresAt = parseInt(stored, 10);
    if (expiresAt > Date.now()) {
      return expiresAt;
    }
  }

  // Only create a new expiration timestamp if no active timer exists or if expired
  const newExpiresAt = Date.now() + durationSeconds * 1000;
  sessionStorage.setItem(key, newExpiresAt.toString());
  return newExpiresAt;
}

export function hasActiveBookingTimer(showtimeId: string = 'showtime-101'): boolean {
  if (typeof window === 'undefined') return false;
  const key = `${TIMER_KEY_PREFIX}${showtimeId}`;
  const stored = sessionStorage.getItem(key);
  if (!stored) return false;
  const expiresAt = parseInt(stored, 10);
  return expiresAt > Date.now();
}

export function getRemainingBookingSeconds(showtimeId: string = 'showtime-101'): number {
  if (typeof window === 'undefined') return 600;

  const key = `${TIMER_KEY_PREFIX}${showtimeId}`;
  const stored = sessionStorage.getItem(key);

  if (!stored) return 600;

  const expiresAt = parseInt(stored, 10);
  const diffMs = expiresAt - Date.now();
  return Math.max(0, Math.floor(diffMs / 1000));
}

export function formatSecondsToMMSS(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function resetBookingTimer(showtimeId: string = 'showtime-101') {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(`${TIMER_KEY_PREFIX}${showtimeId}`);
  }
}
