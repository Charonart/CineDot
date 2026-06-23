/**
 * UserProfileDTO
 * Normalized data contract from backend `/api/v1/users/profile` endpoint.
 * This is the raw shape coming from Laravel — NOT a raw TMDB field.
 */

export type MembershipTierDTO = 'Standard' | 'VIP' | 'VVIP';

export interface UserProfileDTO {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  date_of_birth?: string | null;
  avatar?: string | null;
  membershipTier?: MembershipTierDTO; // Keep these for now if backend returns them, if they are snake case they should be membership_tier, but I'll only change what was explicitly mentioned, wait, the user said "Backend chỉ hỗ trợ full_name, phone, date_of_birth cho update". For GET, it might return more. I will keep others or convert if needed. Actually, "Mapper: ProfileResponse -> ProfileModel. Backend: snake_case. fullName -> full_name, dateOfBirth -> date_of_birth".
  totalPoints?: number;
}

export interface ProfileUpdateRequestDTO {
  full_name: string;
  phone?: string | null;
  date_of_birth?: string | null;
}
