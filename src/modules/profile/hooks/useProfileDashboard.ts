'use client';

import { useState, useEffect } from 'react';
import {
  UserProfile,
  UserTicketItem,
  StarShopOrderItem,
  ProfileDashboardTab,
} from '../types/profile.types';
import {
  fetchUserProfile,
  fetchUserTickets,
  fetchUserOrders,
  updateUserProfile,
} from '../services/profile.service';
import { masterDataService, ProvinceItem } from '@/shared/services/masterData.service';

export function useProfileDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeNavTab, setActiveNavTab] = useState<ProfileDashboardTab>('TICKETS');
  const [ticketFilterTab, setTicketFilterTab] = useState<'UPCOMING' | 'PAST'>('UPCOMING');
  const [tickets, setTickets] = useState<UserTicketItem[]>([]);
  const [orders, setOrders] = useState<StarShopOrderItem[]>([]);
  const [provinces, setProvinces] = useState<ProvinceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Success notifications
  const [accountUpdateSuccess, setAccountUpdateSuccess] = useState(false);
  const [securityUpdateSuccess, setSecurityUpdateSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [profData, ticketsData, ordersData, provincesData] = await Promise.all([
          fetchUserProfile(),
          fetchUserTickets(ticketFilterTab),
          fetchUserOrders(),
          masterDataService.getProvinces(),
        ]);
        if (isMounted) {
          setProfile(profData);
          setTickets(ticketsData);
          setOrders(ordersData);
          setProvinces(provincesData);
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

  const handleUpdateAccountInfo = async (updatedProfile: Partial<UserProfile>) => {
    try {
      // Find the province_id from the city name
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
    } catch (err) {
      alert('Đã xảy ra lỗi khi cập nhật thông tin');
    }
  };

  const handleUpdateSecurityPassword = () => {
    setSecurityUpdateSuccess(true);
    setTimeout(() => setSecurityUpdateSuccess(false), 3000);
  };

  return {
    profile,
    activeNavTab,
    setActiveNavTab,
    ticketFilterTab,
    setTicketFilterTab,
    tickets,
    orders,
    provinces,
    loading,
    accountUpdateSuccess,
    securityUpdateSuccess,
    handleUpdateAccountInfo,
    handleUpdateSecurityPassword,
  };
}
