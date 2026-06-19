import { UserProfileDTO } from '../dto/profile.dto';
import { TicketHistoryDTO } from '../dto/ticket-history.dto';
import {
  UserProfile,
  TicketHistory,
  MembershipTier,
  MEMBERSHIP_TIER_META,
} from '../types/profile.type';

// ─── Formatters ──────────────────────────────────────────────────────────────

const formatPoints = (points: number): string =>
  `${points.toLocaleString('vi-VN')} pts`;

const formatAmount = (amount: number): string =>
  `${amount.toLocaleString('vi-VN')} ₫`;

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const resolveAvatarUrl = (avatar?: string | null): string | null => {
  if (!avatar) return null;
  // If already an absolute URL, return as-is
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) return avatar;
  // Otherwise treat as a relative path
  return avatar;
};

const resolvePosterUrl = (posterPath: string): string => {
  if (!posterPath) return '/images/placeholder-poster.jpg';
  if (posterPath.startsWith('http://') || posterPath.startsWith('https://')) return posterPath;
  return posterPath;
};

// ─── Profile Mapper ───────────────────────────────────────────────────────────

export const profileMapper = {
  /**
   * Maps UserProfileDTO → UserProfile domain model.
   */
  toUserProfile: (dto: UserProfileDTO): UserProfile => {
    const tier = dto.membershipTier as MembershipTier;
    return {
      id: dto.id,
      name: dto.name,
      email: dto.email,
      phone: dto.phone ?? null,
      avatarUrl: resolveAvatarUrl(dto.avatar),
      membershipTier: tier,
      membershipMeta: MEMBERSHIP_TIER_META[tier],
      totalPoints: dto.totalPoints,
      formattedPoints: formatPoints(dto.totalPoints),
    };
  },

  /**
   * Maps TicketHistoryDTO → TicketHistory domain model.
   */
  toTicketHistory: (dto: TicketHistoryDTO): TicketHistory => ({
    id: dto.id,
    bookingId: dto.bookingId,
    movieTitle: dto.movieTitle,
    posterUrl: resolvePosterUrl(dto.posterPath),
    cinemaName: dto.cinemaName,
    roomName: dto.roomName,
    seatLabels: dto.seatLabels,
    showtimeStart: dto.showtimeStart,
    formattedDate: formatDate(dto.showtimeStart),
    formattedTime: formatTime(dto.showtimeStart),
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
