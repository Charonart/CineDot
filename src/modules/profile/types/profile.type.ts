/**
 * Profile Domain Types
 * Frontend-facing models derived from ProfileDTO and TicketHistoryDTO.
 * All raw DTO fields are transformed here — no raw backend shape in UI.
 */

export type MembershipTier = 'Standard' | 'VIP' | 'VVIP';
export type TicketStatus = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

/**
 * Derived membership tier metadata for display.
 */
export interface MembershipTierMeta {
  label: MembershipTier;
  color: string;       // CSS color for gradient ring and badge
  accentColor: string; // lighter variant
  icon: '⭐' | '💎' | '👑';
}

export const MEMBERSHIP_TIER_META: Record<MembershipTier, MembershipTierMeta> = {
  Standard: {
    label: 'Standard',
    color: '#6B7280',
    accentColor: '#9CA3AF',
    icon: '⭐',
  },
  VIP: {
    label: 'VIP',
    color: '#F59E0B',
    accentColor: '#FCD34D',
    icon: '💎',
  },
  VVIP: {
    label: 'VVIP',
    color: '#A855F7',
    accentColor: '#C084FC',
    icon: '👑',
  },
};

/**
 * UserProfile — clean domain model.
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  membershipTier: MembershipTier;
  membershipMeta: MembershipTierMeta;
  totalPoints: number;
  formattedPoints: string; // e.g. "2,850 pts"
}

/**
 * TicketHistory — clean domain model with formatted fields.
 * NOTE: showtimeStart is kept as a raw ISO string.
 * Date/time formatting MUST happen in Client Components only
 * to avoid Next.js hydration mismatches (server vs client locale).
 */
export interface TicketHistory {
  id: string;
  bookingId: string;
  movieTitle: string;
  posterUrl: string;
  cinemaName: string;
  roomName: string;
  seatLabels: string[];
  showtimeStart: string; // ISO 8601 — format in Client Component
  totalAmount: number;
  formattedAmount: string; // VND — locale-independent: uses toLocaleString('vi-VN') safely as amount-only
  status: TicketStatus;
  qrCodeString: string;
}

/**
 * Profile update form input shape (for AccountForm).
 */
export interface ProfileUpdateForm {
  name: string;
  phone: string;
}

/**
 * Active profile tab identifier.
 */
export type ProfileTab = 'account' | 'tickets' | 'vouchers';
