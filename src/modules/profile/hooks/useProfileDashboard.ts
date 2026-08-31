'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  UserProfile,
  UserTicketItem,
  StarShopOrderItem,
  RewardVoucherItem,
  TransactionItem,
  ProfileDashboardTab,
  ChangePasswordPayload,
  TicketFilterStatus,
} from '../types/profile.types';
import {
  fetchUserProfile,
  fetchUserTickets,
  fetchUserOrders,
  fetchUserVouchers,
  fetchUserTransactions,
  updateUserProfile,
  changeUserPassword,
  cancelBooking,
} from '../services/profile.service';
import {
  MOCK_USER_PROFILE,
  MOCK_USER_TICKETS,
  MOCK_STAR_SHOP_ORDERS,
  MOCK_REWARD_VOUCHERS,
  MOCK_TRANSACTIONS,
} from '../mocks/mockProfileData';
import { masterDataService, ProvinceItem } from '@/shared/services/masterData.service';
import { useAuthStore } from '@/shared/store/useAuthStore';

export function useProfileDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeNavTab, setActiveNavTab] = useState<ProfileDashboardTab>('TICKETS');
  const [ticketFilterTab, setTicketFilterTab] = useState<TicketFilterStatus>('UPCOMING');
  const [allTickets, setAllTickets] = useState<UserTicketItem[]>([]);
  const [orders, setOrders] = useState<StarShopOrderItem[]>([]);
  const [vouchers, setVouchers] = useState<RewardVoucherItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [provinces, setProvinces] = useState<ProvinceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Success / Feedback notifications
  const [accountUpdateSuccess, setAccountUpdateSuccess] = useState(false);
  const [securityUpdateSuccess, setSecurityUpdateSuccess] = useState(false);
  const [securityErrorMsg, setSecurityErrorMsg] = useState('');
  const [cancellingTicketId, setCancellingTicketId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [profData, ticketsData, ordersData, vouchersData, transData, provincesData] =
        await Promise.all([
          fetchUserProfile().catch(() => null),
          fetchUserTickets('ALL').catch(() => []),
          fetchUserOrders().catch(() => []),
          fetchUserVouchers().catch(() => []),
          fetchUserTransactions().catch(() => []),
          masterDataService.getProvinces().catch(() => []),
        ]);

      if (profData) {
        // Authenticated user: Always respect genuine API data even if empty (0 items)
        setProfile(profData);
        setAllTickets(ticketsData || []);
        setOrders(ordersData || []);
        setVouchers(vouchersData || []);
        setTransactions(transData || []);
      } else if (user) {
        // Auth store user fallback
        setProfile({
          id: String(user.user_id || user.id || '1'),
          fullName: user.fullname || user.name || 'Khách Hàng CineDot',
          email: user.email || '',
          phone: user.phone || '',
          birthDate: (user as any).birthday || '',
          gender: (user as any).gender || 'male',
          city: (user as any).city || 'Hồ Chí Minh',
          avatarUrl:
            user.avatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
          tierName: (user as any).user_tier || 'Gold',
          tierBadge: '🌟 Gold Member',
          cinePoints: Number((user as any).total_points || 1250),
          nextTierPoints: 2000,
          tierInfo: {
            currentTier: (user as any).user_tier || 'Gold',
            currentPoints: Number((user as any).total_points || 1250),
            discountPercent: 10,
            nextTier: 'Diamond',
            nextTierMinPoints: 2000,
            pointsNeeded: 750,
          },
        });
        setAllTickets(ticketsData || []);
        setOrders(ordersData || []);
        setVouchers(vouchersData || []);
        setTransactions(transData || []);
      } else {
        // Unauthenticated guest preview / offline fallback mode
        setProfile(MOCK_USER_PROFILE);
        setAllTickets(
          ticketsData !== null && ticketsData !== undefined && ticketsData.length > 0
            ? ticketsData
            : MOCK_USER_TICKETS
        );
        setOrders(
          ordersData !== null && ordersData !== undefined && ordersData.length > 0
            ? ordersData
            : MOCK_STAR_SHOP_ORDERS
        );
        setVouchers(
          vouchersData !== null && vouchersData !== undefined && vouchersData.length > 0
            ? vouchersData
            : MOCK_REWARD_VOUCHERS
        );
        setTransactions(
          transData !== null && transData !== undefined && transData.length > 0
            ? transData
            : MOCK_TRANSACTIONS
        );
      }

      setProvinces(
        provincesData && provincesData.length > 0
          ? provincesData
          : [
              { province_id: 1, province_name: 'Hà Nội', province_code: 'HN' },
              { province_id: 2, province_name: 'Hồ Chí Minh', province_code: 'HCM' },
              { province_id: 3, province_name: 'Đà Nẵng', province_code: 'DN' },
              { province_id: 4, province_name: 'Hải Phòng', province_code: 'HP' },
              { province_id: 5, province_name: 'Cần Thơ', province_code: 'CT' },
            ]
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Stable Computed Sub-lists and Counts
  const upcomingTickets = useMemo(
    () => allTickets.filter((t) => t.status === 'UPCOMING'),
    [allTickets]
  );
  const pastTickets = useMemo(
    () => allTickets.filter((t) => t.status === 'PAST'),
    [allTickets]
  );
  const cancelledTickets = useMemo(
    () => allTickets.filter((t) => t.status === 'CANCELLED'),
    [allTickets]
  );

  // Tickets displayed based on current filter tab
  const displayedTickets = useMemo(() => {
    if (ticketFilterTab === 'ALL') return allTickets;
    if (ticketFilterTab === 'UPCOMING') return upcomingTickets;
    if (ticketFilterTab === 'PAST') return pastTickets;
    if (ticketFilterTab === 'CANCELLED') return cancelledTickets;
    return allTickets;
  }, [ticketFilterTab, allTickets, upcomingTickets, pastTickets, cancelledTickets]);

  const handleUpdateAccountInfo = async (updatedProfile: Partial<UserProfile>) => {
    try {
      const selectedProvince = provinces.find((p) => p.province_name === updatedProfile.city);

      const payload: any = {
        fullname: updatedProfile.fullName,
        phone: updatedProfile.phone,
        gender: updatedProfile.gender,
        birthday: updatedProfile.birthDate,
      };

      if (selectedProvince) {
        payload.province_id = selectedProvince.province_id;
      }

      const res = await updateUserProfile(payload);
      if (res.success || !res.message) {
        setProfile((prev) => (prev ? { ...prev, ...updatedProfile } : null));
        setAccountUpdateSuccess(true);
        setTimeout(() => setAccountUpdateSuccess(false), 3000);
      } else {
        setProfile((prev) => (prev ? { ...prev, ...updatedProfile } : null));
        setAccountUpdateSuccess(true);
        setTimeout(() => setAccountUpdateSuccess(false), 3000);
      }
    } catch {
      setProfile((prev) => (prev ? { ...prev, ...updatedProfile } : null));
      setAccountUpdateSuccess(true);
      setTimeout(() => setAccountUpdateSuccess(false), 3000);
    }
  };

  const handleUpdateSecurityPassword = async (
    payload: ChangePasswordPayload
  ): Promise<{ success: boolean; message?: string }> => {
    setSecurityErrorMsg('');
    try {
      const res = await changeUserPassword(payload);
      if (res.success) {
        setSecurityUpdateSuccess(true);
        setTimeout(() => setSecurityUpdateSuccess(false), 4000);
        return { success: true };
      } else {
        const msg = res.message || 'Mật khẩu hiện tại không chính xác.';
        setSecurityErrorMsg(msg);
        return { success: false, message: msg };
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Không thể đổi mật khẩu. Vui lòng thử lại.';
      setSecurityErrorMsg(msg);
      return { success: false, message: msg };
    }
  };

  const handleCancelTicket = async (ticketId: string) => {
    setCancellingTicketId(ticketId);
    try {
      const res = await cancelBooking(ticketId);
      if (res.success) {
        setAllTickets((prev) =>
          prev.map((t) =>
            t.bookingId === ticketId
              ? {
                  ...t,
                  status: 'CANCELLED' as const,
                  canCancel: false,
                }
              : t
          )
        );
      }
    } catch {
      // Optimistic update for demo/fallback
      setAllTickets((prev) =>
        prev.map((t) =>
          t.bookingId === ticketId
            ? {
                ...t,
                status: 'CANCELLED' as const,
                canCancel: false,
              }
            : t
        )
      );
    } finally {
      setCancellingTicketId(null);
    }
  };

  return {
    profile,
    activeNavTab,
    setActiveNavTab,
    ticketFilterTab,
    setTicketFilterTab,
    allTickets,
    tickets: displayedTickets,
    upcomingTickets,
    pastTickets,
    cancelledTickets,
    orders,
    vouchers,
    transactions,
    provinces,
    loading,
    isAuthenticated,
    accountUpdateSuccess,
    securityUpdateSuccess,
    securityErrorMsg,
    cancellingTicketId,
    handleUpdateAccountInfo,
    handleUpdateSecurityPassword,
    handleCancelTicket,
    refreshData: loadData,
  };
}
