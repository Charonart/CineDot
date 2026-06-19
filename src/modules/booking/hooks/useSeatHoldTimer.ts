'use client';

import { useState, useEffect } from 'react';
import { useBookingStore } from '../store/bookingStore';

export type SeatHoldTimerState = {
  isActive: boolean;
  isExpired: boolean;
  timeLeftMs: number;
  minutes: string;
  seconds: string;
  formattedTime: string;
};

export function useSeatHoldTimer(options?: {
  onExpired?: () => void;
}): SeatHoldTimerState {
  const [isMounted, setIsMounted] = useState(false);
  const seatHoldExpiresAt = useBookingStore((state) => state.session.seatHoldExpiresAt);
  const status = useBookingStore((state) => state.session.status);
  const expireSeatHold = useBookingStore((state) => state.expireSeatHold);

  const [timeLeftMs, setTimeLeftMs] = useState<number>(0);

  // Set mounted flag to prevent hydration mismatches
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !seatHoldExpiresAt) {
      setTimeLeftMs(0);
      return;
    }

    // Only run the timer if the status is active holding
    if (status !== 'holding') {
      setTimeLeftMs(0);
      return;
    }

    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = seatHoldExpiresAt - now;
      if (difference <= 0) {
        setTimeLeftMs(0);
        if (status === 'holding') {
          expireSeatHold();
          if (options?.onExpired) {
            options.onExpired();
          }
        }
        return false; // stop timer
      } else {
        setTimeLeftMs(difference);
        return true; // continue timer
      }
    };

    // Calculate immediately
    const shouldContinue = calculateTimeLeft();
    if (!shouldContinue) return;

    const intervalId = setInterval(() => {
      const active = calculateTimeLeft();
      if (!active) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isMounted, seatHoldExpiresAt, status, expireSeatHold, options]);

  // Default server side / non-mounted / inactive timer response
  if (!isMounted || !seatHoldExpiresAt) {
    return {
      isActive: false,
      isExpired: false,
      timeLeftMs: 0,
      minutes: '00',
      seconds: '00',
      formattedTime: '',
    };
  }

  const isExpired = status === 'expired' || timeLeftMs <= 0;
  const totalSeconds = Math.max(0, Math.floor(timeLeftMs / 1000));
  const min = Math.floor(totalSeconds / 60);
  const sec = totalSeconds % 60;

  const minutesStr = String(min).padStart(2, '0');
  const secondsStr = String(sec).padStart(2, '0');
  const formattedTime = `${minutesStr}:${secondsStr}`;

  return {
    isActive: status === 'holding' && seatHoldExpiresAt > Date.now(),
    isExpired,
    timeLeftMs,
    minutes: minutesStr,
    seconds: secondsStr,
    formattedTime,
  };
}
