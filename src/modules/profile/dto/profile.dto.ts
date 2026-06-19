/**
 * UserProfileDTO
 * Normalized data contract from backend `/profile/me` endpoint.
 * This is the raw shape coming from Laravel — NOT a raw TMDB field.
 */

export type MembershipTierDTO = 'Standard' | 'VIP' | 'VVIP';

export interface UserProfileDTO {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  membershipTier: MembershipTierDTO;
  totalPoints: number;
}

export interface ProfileUpdateRequestDTO {
  name: string;
  phone?: string | null;
}
