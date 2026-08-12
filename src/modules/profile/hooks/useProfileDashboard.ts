'use client';

import { useState, useEffect } from 'react';
import {
  UserProfile,
  UserTicketItem,
  TransactionItem,
  RewardVoucherItem,
  ProfileDashboardTab,
} from '../types/profile.types';
import {
  fetchUserProfile,
  fetchUserTickets,
  fetchTransactions,
  fetchRewardVouchers,
} from '../services/profile.service';

export function useProfileDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeNavTab, setActiveNavTab] = useState<ProfileDashboardTab>('TICKETS');
  const [ticketFilterTab, setTicketFilterTab] = useState<'UPCOMING' | 'PAST'>('UPCOMING');
  const [tickets, setTickets] = useState<UserTicketItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [vouchers, setVouchers] = useState<RewardVoucherItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Success notifications
  const [accountUpdateSuccess, setAccountUpdateSuccess] = useState(false);
  const [securityUpdateSuccess, setSecurityUpdateSuccess] = useState(false);
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [profData, ticketsData, txData, rewardsData] = await Promise.all([
          fetchUserProfile(),
          fetchUserTickets(ticketFilterTab),
          fetchTransactions(),
          fetchRewardVouchers(),
        ]);
        if (isMounted) {
          setProfile(profData);
          setTickets(ticketsData);
          setTransactions(txData);
          setVouchers(rewardsData);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [ticketFilterTab]);

  const handleUpdateAccountInfo = (updatedProfile: Partial<UserProfile>) => {
    setProfile((prev) => (prev ? { ...prev, ...updatedProfile } : null));
    setAccountUpdateSuccess(true);
    setTimeout(() => setAccountUpdateSuccess(false), 3000);
  };

  const handleUpdateSecurityPassword = () => {
    setSecurityUpdateSuccess(true);
    setTimeout(() => setSecurityUpdateSuccess(false), 3000);
  };

  const handleRedeemVoucher = (voucher: RewardVoucherItem) => {
    if (!profile) return;
    if (profile.cinePoints < voucher.pointsRequired) {
      alert('Bạn không đủ điểm CinePoints để đổi voucher này!');
      return;
    }
    setProfile((prev) =>
      prev ? { ...prev, cinePoints: prev.cinePoints - voucher.pointsRequired } : null
    );
    setRedeemSuccessMsg(`Đổi thành công ${voucher.title}! Mã voucher: ${voucher.code}`);
    setTimeout(() => setRedeemSuccessMsg(''), 4000);
  };

  return {
    profile,
    activeNavTab,
    setActiveNavTab,
    ticketFilterTab,
    setTicketFilterTab,
    tickets,
    transactions,
    vouchers,
    loading,
    accountUpdateSuccess,
    securityUpdateSuccess,
    redeemSuccessMsg,
    handleUpdateAccountInfo,
    handleUpdateSecurityPassword,
    handleRedeemVoucher,
  };
}
