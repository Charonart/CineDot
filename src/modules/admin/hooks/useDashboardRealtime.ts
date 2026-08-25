import { useState, useEffect, useRef, useCallback } from 'react';
import { getEcho } from '@/shared/lib/echo';
import { RealtimeConnectionStatus, LiveActivityItem } from '../types/adminReport.types';

export interface DashboardToast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface UseDashboardRealtimeOptions {
  onRevenueUpdated?: () => void;
  cinemaId?: string;
}

interface PusherConnector {
  pusher?: {
    connection?: {
      state: string;
      bind: (event: string, callback: () => void) => void;
    };
    channel?: (name: string) => {
      bind: (event: string, callback: (payload: RealtimeDashboardEvent) => void) => void;
    };
  };
}

interface RealtimeDashboardEvent {
  type?: string;
  action?: string;
  status?: string;
  booking_code?: string;
  bookingCode?: string;
  booking_id?: string | number;
  amount?: number | string;
  total_amount?: number | string;
  revenue?: number | string;
  customer_name?: string;
  user_name?: string;
  cinema_id?: string | number;
  cinema_name?: string;
  [key: string]: unknown;
}

export function useDashboardRealtime({ onRevenueUpdated, cinemaId }: UseDashboardRealtimeOptions = {}) {
  const [connectionStatus, setConnectionStatus] = useState<RealtimeConnectionStatus>('connecting');
  const [recentActivities, setRecentActivities] = useState<LiveActivityItem[]>([]);
  const [activeToast, setActiveToast] = useState<DashboardToast | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const processedEventsRef = useRef<Map<string, number>>(new Map());

  // Debounced refetch trigger to avoid stampedes when multiple events fire in short bursts
  const triggerDebouncedRefetch = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      onRevenueUpdated?.();
    }, 400);
  }, [onRevenueUpdated]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    const toast: DashboardToast = {
      id: String(Date.now()),
      message,
      type,
    };
    setActiveToast(toast);
    toastTimerRef.current = setTimeout(() => {
      setActiveToast((current) => (current?.id === toast.id ? null : current));
    }, 4000);
  }, []);

  const addActivity = useCallback((item: Omit<LiveActivityItem, 'id' | 'timestamp'>) => {
    const nowTs = Date.now();
    setRecentActivities((prev) => {
      // Deduplicate: check if an identical bookingCode + actionType was added in the last 4 seconds
      const duplicateIndex = prev.findIndex(
        (act) => act.bookingCode === item.bookingCode && act.actionType === item.actionType && nowTs - act.timestamp < 4000
      );

      if (duplicateIndex !== -1) {
        // Update the existing entry if amount or customer name was populated
        const updated = [...prev];
        updated[duplicateIndex] = {
          ...updated[duplicateIndex],
          ...item,
          amount: item.amount || updated[duplicateIndex].amount,
          customerName: item.customerName || updated[duplicateIndex].customerName,
        };
        return updated;
      }

      const newActivity: LiveActivityItem = {
        ...item,
        id: `${item.bookingCode}-${nowTs}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: nowTs,
      };

      return [newActivity, ...prev.slice(0, 19)];
    });
  }, []);

  useEffect(() => {
    const echo = getEcho();
    if (!echo) {
      setConnectionStatus('disconnected');
      return;
    }

    const pusherInstance = (echo.connector as unknown as PusherConnector)?.pusher;

    // Track Pusher Connection States
    if (pusherInstance && pusherInstance.connection) {
      const state = pusherInstance.connection.state;
      if (state === 'connected') {
        setConnectionStatus('connected');
      } else if (state === 'connecting') {
        setConnectionStatus('connecting');
      } else {
        setConnectionStatus('disconnected');
      }

      const handleConnected = () => setConnectionStatus('connected');
      const handleConnecting = () => setConnectionStatus('connecting');
      const handleDisconnected = () => setConnectionStatus('disconnected');

      pusherInstance.connection.bind('connected', handleConnected);
      pusherInstance.connection.bind('connecting', handleConnecting);
      pusherInstance.connection.bind('unavailable', handleDisconnected);
      pusherInstance.connection.bind('failed', handleDisconnected);
      pusherInstance.connection.bind('disconnected', handleDisconnected);
    }

    const channelName = 'admin.dashboard';
    const privateChannel = echo.private(channelName);

    // Event Handler for dashboard events
    const handleRevenueUpdated = (event: RealtimeDashboardEvent) => {
      // Filter by cinema if specified
      if (cinemaId && cinemaId !== 'ALL' && event.cinema_id && String(event.cinema_id) !== String(cinemaId)) {
        return;
      }

      // Check event action type
      const eventType = String(event.type || event.action || 'revenue.updated');
      const bookingCode = String(event.booking_code || event.bookingCode || (event.booking_id ? `#${event.booking_id}` : '#---'));

      // Comprehensive amount extraction from all possible event fields
      const rawAmount =
        event.amount ??
        event.total_amount ??
        event.final_amount ??
        event.finalAmount ??
        event.revenue ??
        event.price ??
        event.total_price ??
        (event.booking && typeof event.booking === 'object'
          ? ((event.booking as Record<string, unknown>).final_amount ??
             (event.booking as Record<string, unknown>).total_amount ??
             (event.booking as Record<string, unknown>).amount)
          : undefined) ??
        (event.ticket && typeof event.ticket === 'object'
          ? ((event.ticket as Record<string, unknown>).final_amount ??
             (event.ticket as Record<string, unknown>).total_amount ??
             (event.ticket as Record<string, unknown>).price)
          : undefined);

      const amount = rawAmount !== undefined && rawAmount !== null ? Number(rawAmount) : 0;

      // Event Deduplication: Guard against multiple listeners firing for the same event
      const dedupeKey = `${bookingCode}_${eventType}_${event.status || ''}_${amount}`;
      const nowTs = Date.now();
      const lastSeen = processedEventsRef.current.get(dedupeKey);
      if (lastSeen && nowTs - lastSeen < 3000) {
        return;
      }
      processedEventsRef.current.set(dedupeKey, nowTs);

      // Clean up old dedupe keys
      if (processedEventsRef.current.size > 100) {
        for (const [k, v] of processedEventsRef.current.entries()) {
          if (nowTs - v > 10000) processedEventsRef.current.delete(k);
        }
      }

      console.log('📡 [Pusher Dashboard Event]', eventType, event);

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      if (eventType === 'payment_completed' || event.status === 'PAID') {
        showToast(`Đơn hàng ${bookingCode} đã thanh toán thành công.`, 'success');
        addActivity({
          bookingCode,
          action: 'Thanh toán hoàn tất',
          actionType: 'payment_completed',
          amount: amount > 0 ? amount : undefined,
          time: timeStr,
          customerName: event.customer_name || event.user_name || 'Khách hàng',
          cinemaName: event.cinema_name,
        });
      } else if (eventType === 'refund_completed' || event.status === 'REFUNDED') {
        showToast(`Đơn hàng ${bookingCode} đã được hoàn tiền.`, 'warning');
        addActivity({
          bookingCode,
          action: 'Hoàn tiền sự cố',
          actionType: 'refund_completed',
          amount: amount > 0 ? amount : undefined,
          time: timeStr,
          customerName: event.customer_name || event.user_name || 'Khách hàng',
        });
      } else if (eventType === 'booking_cancelled' || event.status === 'CANCELLED') {
        showToast(`Đơn hàng ${bookingCode} đã được hủy.`, 'info');
        addActivity({
          bookingCode,
          action: 'Hủy đơn đặt vé',
          actionType: 'booking_cancelled',
          amount: amount > 0 ? amount : undefined,
          time: timeStr,
        });
      } else if (
        eventType === 'check_in' ||
        eventType === 'ticket.checked_in' ||
        eventType === 'ticket_checked_in' ||
        eventType === 'TicketCheckedIn' ||
        eventType.includes('check_in') ||
        eventType.includes('checked_in') ||
        eventType.includes('scanned') ||
        event.status === 'CHECKED_IN'
      ) {
        showToast(`Đơn hàng ${bookingCode} đã check-in vào rạp.`, 'success');
        addActivity({
          bookingCode,
          action: 'Check-in soát vé',
          actionType: 'check_in',
          amount: amount > 0 ? amount : undefined,
          time: timeStr,
          customerName: event.customer_name || event.user_name || 'Khách hàng',
          cinemaName: event.cinema_name,
        });
      } else {
        // General revenue update event
        showToast(`Dữ liệu doanh thu vừa được cập nhật theo thời gian thực.`, 'info');
        addActivity({
          bookingCode,
          action: 'Doanh thu cập nhật',
          actionType: 'general',
          amount: amount > 0 ? amount : undefined,
          time: timeStr,
        });
      }

      // Invalidate & refetch API
      triggerDebouncedRefetch();
    };

    // Listen to canonical Echo events
    const eventNames = [
      'revenue.updated',
      '.revenue.updated',
      'RevenueUpdated',
      'payment_completed',
      '.payment_completed',
      'refund_completed',
      '.refund_completed',
      'booking_cancelled',
      '.booking_cancelled',
      'ticket.checked_in',
      '.ticket.checked_in',
      'TicketCheckedIn',
      'ticket.scanned',
      '.ticket.scanned',
      'TicketScanned',
      'check_in',
      '.check_in',
    ];

    eventNames.forEach((evt) => {
      privateChannel.listen(evt, handleRevenueUpdated);
    });

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      echo.leave(`private-${channelName}`);
      echo.leave(channelName);
    };
  }, [cinemaId, triggerDebouncedRefetch, showToast, addActivity]);

  return {
    connectionStatus,
    recentActivities,
    activeToast,
    dismissToast: () => setActiveToast(null),
    showToast,
  };
}
