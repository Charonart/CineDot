import {
  UserProfile,
  UserTicketItem,
  TransactionItem,
  RewardVoucherItem,
} from '../types/profile.types';
import {
  MOCK_USER_PROFILE,
  MOCK_USER_TICKETS,
  MOCK_TRANSACTIONS,
  MOCK_REWARD_VOUCHERS,
} from '../mocks/mockProfileData';

export async function fetchUserProfile(): Promise<UserProfile> {
  await new Promise((res) => setTimeout(res, 150));
  return MOCK_USER_PROFILE;
}

export async function fetchUserTickets(tab: 'UPCOMING' | 'PAST'): Promise<UserTicketItem[]> {
  await new Promise((res) => setTimeout(res, 200));
  return MOCK_USER_TICKETS.filter((t) => t.status === tab);
}

export async function fetchTransactions(): Promise<TransactionItem[]> {
  await new Promise((res) => setTimeout(res, 200));
  return MOCK_TRANSACTIONS;
}

export async function fetchRewardVouchers(): Promise<RewardVoucherItem[]> {
  await new Promise((res) => setTimeout(res, 200));
  return MOCK_REWARD_VOUCHERS;
}
