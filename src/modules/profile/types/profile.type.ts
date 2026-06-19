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
 */
export interface TicketHistory {
  id: string;
  bookingId: string;
  movieTitle: string;
  posterUrl: string;
  cinemaName: string;
  roomName: string;
  seatLabels: string[];
  showtimeStart: string; // ISO string preserved for Date ops
  formattedDate: string; // e.g. "Thứ Năm, 25/06/2026"
  formattedTime: string; // e.g. "19:30"
  totalAmount: number;
  formattedAmount: string; // e.g. "175.000 ₫"
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
