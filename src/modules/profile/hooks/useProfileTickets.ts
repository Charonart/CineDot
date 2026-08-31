'use client';

import { useState, useEffect } from 'react';
import { UserProfile, UserTicketItem, TicketFilterStatus } from '../types/profile.types';
import { fetchUserProfile, fetchUserTickets } from '../services/profile.service';

export function useProfileTickets() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<TicketFilterStatus>('UPCOMING');
  const [tickets, setTickets] = useState<UserTicketItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [profData, ticketsData] = await Promise.all([
          fetchUserProfile(),
          fetchUserTickets(activeTab),
        ]);
        if (isMounted) {
          setProfile(profData);
          setTickets(ticketsData);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  return {
    profile,
    activeTab,
    setActiveTab,
    tickets,
    loading,
  };
}
