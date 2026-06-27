import { UserProfileDTO } from '../dto/profile.dto';
import { TicketHistoryDTO } from '../dto/ticket-history.dto';
import {
  UserProfile,
  TicketHistory,
  MembershipTier,
  MEMBERSHIP_TIER_META,
} from '../types/profile.type';
import { imageHelper } from '@shared/utils/imageHelper';

// ─── Formatters ──────────────────────────────────────────────────────────────

const formatPoints = (points: number): string =>
  `${points.toLocaleString('vi-VN')} pts`;

/**
 * formatAmount is safe in the mapper because it produces a locale-independent
 * numeric string (no weekday, no timezone-sensitive date rendering).
 * The result is deterministic: same input → same output on server and client.
 */
const formatAmount = (amount: number): string =>
  `${amount.toLocaleString('vi-VN')} ₫`;

const resolveAvatarUrl = (avatar?: string | null): string | null => {
  if (!avatar) return null;
  // If already an absolute URL, return as-is
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) return avatar;
  // Otherwise pass to imageHelper as a relative TMDB path
  return imageHelper.getProfileUrl(avatar, 'md');
};

// ─── Profile Mapper ───────────────────────────────────────────────────────────

export const profileMapper = {
  /**
   * Maps UserProfileDTO → UserProfile domain model.
   */
  toUserProfile: (dto: UserProfileDTO): UserProfile => {
    const tier = dto.membershipTier as MembershipTier || 'Standard';
    return {
      id: dto.id,
      fullName: dto.full_name,
      email: dto.email,
      phone: dto.phone ?? null,
      dateOfBirth: dto.date_of_birth ?? null,
      avatarUrl: resolveAvatarUrl(dto.avatar),
      membershipTier: tier,
      membershipMeta: MEMBERSHIP_TIER_META[tier] || MEMBERSHIP_TIER_META['Standard'],
      totalPoints: dto.totalPoints || 0,
      formattedPoints: formatPoints(dto.totalPoints || 0),
    };
  },

  /**
   * Maps TicketHistoryDTO → TicketHistory domain model.
   *
   * IMPORTANT: showtimeStart is stored as a raw ISO 8601 string.
   * Date formatting (weekday, locale-specific time) MUST be done
   * in Client Components ONLY using useMemo or a client-side helper
   * to avoid Next.js SSR hydration mismatches.
   *
   * posterUrl uses imageHelper.getPosterUrl() per AGENTS.md Rule 9.
   */
  toTicketHistory: (dto: TicketHistoryDTO): TicketHistory => ({
    id: dto.id,
    bookingId: dto.bookingId,
    movieTitle: dto.movieTitle,
    posterUrl: imageHelper.getPosterUrl(dto.posterPath, 'md'),
    cinemaName: dto.cinemaName,
    roomName: dto.roomName,
    seatLabels: dto.seatLabels,
    showtimeStart: dto.showtimeStart, // raw ISO — format in Client Component
    totalAmount: dto.totalAmount,
    formattedAmount: formatAmount(dto.totalAmount),
    status: dto.status,
    qrCodeString: dto.qrCodeString,
  }),

  /**
   * Maps array of TicketHistoryDTOs → TicketHistory[].
   */
  toTicketHistoryList: (dtos: TicketHistoryDTO[]): TicketHistory[] =>
    (dtos || []).map(profileMapper.toTicketHistory),
};
