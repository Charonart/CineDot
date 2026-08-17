'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  UserTicketItem,
  StarShopOrderItem,
  RewardVoucherItem,
  TransactionItem,
  ProfileDashboardTab,
  ChangePasswordPayload,
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
import { masterDataService, ProvinceItem } from '@/shared/services/masterData.service';

export function useProfileDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeNavTab, setActiveNavTab] = useState<ProfileDashboardTab>('TICKETS');
  const [ticketFilterTab, setTicketFilterTab] = useState<'UPCOMING' | 'PAST'>('UPCOMING');
  const [tickets, setTickets] = useState<UserTicketItem[]>([]);
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
          fetchUserTickets(ticketFilterTab),
          fetchUserOrders(),
          fetchUserVouchers(),
          fetchUserTransactions(),
          masterDataService.getProvinces(),
        ]);

      if (profData) setProfile(profData);
      setTickets(ticketsData);
      setOrders(ordersData);
      setVouchers(vouchersData);
      setTransactions(transData);
      setProvinces(provincesData);
    } finally {
      setLoading(false);
    }
  }, [ticketFilterTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
      if (res.success) {
        setProfile((prev) => (prev ? { ...prev, ...updatedProfile } : null));
        setAccountUpdateSuccess(true);
        setTimeout(() => setAccountUpdateSuccess(false), 3000);
      } else {
        alert(res.message || 'Cập nhật thất bại');
      }
    } catch {
      alert('Đã xảy ra lỗi khi cập nhật thông tin');
    }
  };

  const handleUpdateSecurityPassword = async (payload: ChangePasswordPayload): Promise<{ success: boolean; message?: string }> => {
    setSecurityErrorMsg('');
    const res = await changeUserPassword(payload);
    if (res.success) {
      setSecurityUpdateSuccess(true);
      setTimeout(() => setSecurityUpdateSuccess(false), 4000);
    } else {
      setSecurityErrorMsg(res.message || 'Đổi mật khẩu thất bại');
    }
    return res;
  };

  const handleCancelTicket = async (ticketId: string) => {
    setCancellingTicketId(ticketId);
    try {
      const res = await cancelBooking(ticketId);
      if (res.success) {
        alert('Hủy vé thành công! Yêu cầu hoàn tiền đã được tiếp nhận.');
        await loadData();
      } else {
        alert(res.message || 'Không thể hủy vé');
      }
    } catch {
      alert('Đã xảy ra lỗi khi hủy vé');
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
    tickets,
    orders,
    vouchers,
    transactions,
    provinces,
    loading,
    accountUpdateSuccess,
    securityUpdateSuccess,
    securityErrorMsg,
    cancellingTicketId,
    handleUpdateAccountInfo,
    handleUpdateSecurityPassword,
    handleCancelTicket,
    refreshDashboard: loadData,
  };
}
