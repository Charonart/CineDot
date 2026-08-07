'use client';

import { useState, useEffect, useMemo } from 'react';
import { SeatItem, ShowtimeBookingInfo } from '../types/seat-booking.types';
import { fetchBookingInfo, fetchSeatGrid } from '../services/seat-booking.service';
import { getRemainingBookingSeconds, formatSecondsToMMSS } from '../services/bookingTimerService';

export function useSeatBooking(
  showtimeId: string = 'showtime-101',
  movieParam?: string,
  initialSeatsParam?: string,
  dateParam?: string,
  timeParam?: string,
  cinemaParam?: string
) {
  const [bookingInfo, setBookingInfo] = useState<ShowtimeBookingInfo | null>(null);
  const [seats, setSeats] = useState<SeatItem[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(() => getRemainingBookingSeconds(showtimeId));
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [info, seatData] = await Promise.all([
          fetchBookingInfo(showtimeId, movieParam, dateParam, timeParam, cinemaParam),
          fetchSeatGrid(showtimeId),
        ]);

        if (isMounted) {
          setBookingInfo(info);
          setSeats(seatData);
          setIsTimeout(false);

          // Restore initial seats from URL searchParams
          if (initialSeatsParam) {
            const rawIds = initialSeatsParam.split(',').filter(Boolean);
            const restoredSet = new Set<string>();

            rawIds.forEach((id) => {
              const matchedSeat = seatData.find((s) => s.id === id);
              if (matchedSeat) {
                if (matchedSeat.type === 'SWEETBOX' && matchedSeat.pairId) {
                  seatData
                    .filter((s) => s.pairId === matchedSeat.pairId)
                    .forEach((s) => restoredSet.add(s.id));
                } else {
                  restoredSet.add(id);
                }
              } else {
                restoredSet.add(id);
              }
            });

            setSelectedSeatIds(Array.from(restoredSet));
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [showtimeId, movieParam, initialSeatsParam, dateParam, timeParam, cinemaParam]);

  // Continuous Countdown timer synced with sessionStorage expiration
  useEffect(() => {
    const updateCountdown = () => {
      const remaining = getRemainingBookingSeconds(showtimeId);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        setIsTimeout(true);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [showtimeId]);

  const formattedCountdown = useMemo(() => {
    return formatSecondsToMMSS(timeLeft);
  }, [timeLeft]);

  // Toggle Seat Selection
  const toggleSelectSeat = (seatId: string) => {
    const targetSeat = seats.find((s) => s.id === seatId);
    if (!targetSeat || targetSeat.status === 'BOOKED' || targetSeat.status === 'HOLDING') {
      return;
    }

    let seatIdsToToggle = [seatId];

    if (targetSeat.type === 'SWEETBOX' && targetSeat.pairId) {
      seatIdsToToggle = seats
        .filter((s) => s.pairId === targetSeat.pairId && s.status !== 'BOOKED')
        .map((s) => s.id);
    }

    const isAlreadySelected = selectedSeatIds.includes(seatId);

    if (isAlreadySelected) {
      setSelectedSeatIds((prev) => prev.filter((id) => !seatIdsToToggle.includes(id)));
    } else {
      setSelectedSeatIds((prev) => [...prev, ...seatIdsToToggle]);
    }
  };

  // Selected Seats Info
  const selectedSeats = useMemo(() => {
    return seats.filter((s) => selectedSeatIds.includes(s.id));
  }, [seats, selectedSeatIds]);

  // Total Price calculation
  const totalPrice = useMemo(() => {
    const sweetboxPairs = new Set<string>();
    let total = 0;

    selectedSeats.forEach((s) => {
      if (s.type === 'SWEETBOX' && s.pairId) {
        if (!sweetboxPairs.has(s.pairId)) {
          sweetboxPairs.add(s.pairId);
          total += s.price;
        }
      } else {
        total += s.price;
      }
    });

    return total;
  }, [selectedSeats]);

  const selectedSeatLabels = useMemo(() => {
    return selectedSeats.map((s) => s.id).join(', ');
  }, [selectedSeats]);

  return {
    bookingInfo,
    seats,
    selectedSeatIds,
    toggleSelectSeat,
    selectedSeats,
    totalPrice,
    selectedSeatLabels,
    formattedCountdown,
    isTimeout,
    loading,
  };
}
