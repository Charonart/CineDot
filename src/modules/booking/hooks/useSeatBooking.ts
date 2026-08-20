'use client';

import { useState, useEffect, useMemo } from 'react';
import { SeatItem, SeatRowGroup, ShowtimeBookingInfo, SeatTypeInfo } from '../types/seat-booking.types';
import { seatBookingService } from '../services/seat-booking.service';
import { getRemainingBookingSeconds, formatSecondsToMMSS } from '../services/bookingTimerService';
import { saveBookingSession, updateBookingSession } from '../services/bookingSessionService';

export function useSeatBooking(
  showtimeId: string = '1726',
  movieParam?: string,
  initialSeatsParam?: string,
  dateParam?: string,
  timeParam?: string,
  cinemaParam?: string
) {
  const [bookingInfo, setBookingInfo] = useState<ShowtimeBookingInfo | null>(null);
  const [seats, setSeats] = useState<SeatItem[]>([]);
  const [seatTypes, setSeatTypes] = useState<SeatTypeInfo[]>([]);
  const [seatRowGroups, setSeatRowGroups] = useState<SeatRowGroup[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(() => getRemainingBookingSeconds(showtimeId));
  const [isTimeout, setIsTimeout] = useState(false);
  const [holdError, setHoldError] = useState<string | null>(null);
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const data = await seatBookingService.fetchShowtimeBookingData(showtimeId);
        if (isMounted) {
          setBookingInfo(data.showtimeInfo);
          setSeats(data.seats);
          setSeatTypes(data.seatTypes || []);
          setSeatRowGroups(data.seatRowGroups);
          setIsTimeout(false);

          // Persist showtime metadata to sessionStorage for downstream booking steps
          saveBookingSession({
            showtimeId: String(data.showtimeInfo.showtimeId),
            movieSlug: data.showtimeInfo.movieSlug,
            movieTitle: data.showtimeInfo.movieTitle,
            movieFormat: data.showtimeInfo.movieFormat,
            posterUrl: data.showtimeInfo.posterUrl || '',
            ageRating: data.showtimeInfo.ageRating,
            duration: data.showtimeInfo.duration || '',
            cinemaName: data.showtimeInfo.cinemaName,
            cinemaAddress: data.showtimeInfo.cinemaAddress,
            roomName: data.showtimeInfo.roomName,
            showTime: data.showtimeInfo.showTime,
            endTime: data.showtimeInfo.endTime,
            showDate: data.showtimeInfo.showDate,
            basePrice: data.showtimeInfo.basePrice,
          });

          // Restore initial seats from searchParams if any
          if (initialSeatsParam) {
            const rawIds = initialSeatsParam.split(',').filter(Boolean);
            const restored = data.seats.filter((s) => rawIds.includes(s.id) && s.status === 'AVAILABLE');
            setSelectedSeatIds(restored.map((s) => s.id));
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

  // Countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const remaining = getRemainingBookingSeconds(showtimeId);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        setIsTimeout(true);
        if (selectedSeatIds.length > 0) {
          const seatDbIds = seats
            .filter((s) => selectedSeatIds.includes(s.id))
            .map((s) => s.showtime_seat_id);
          seatBookingService.releaseSeats(showtimeId, seatDbIds);
        }
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [showtimeId, selectedSeatIds, seats]);

  const formattedCountdown = useMemo(() => {
    return formatSecondsToMMSS(timeLeft);
  }, [timeLeft]);

  // Toggle Seat Selection
  const toggleSelectSeat = (seatIdOrIds: string | string[]) => {
    const ids = Array.isArray(seatIdOrIds) ? seatIdOrIds : [seatIdOrIds];
    
    // Validate all target seats
    const validIds = ids.filter(id => {
      const targetSeat = seats.find((s) => s.id === id);
      return targetSeat && targetSeat.status !== 'BOOKED' && targetSeat.status !== 'HOLDING' && targetSeat.status !== 'BLOCKED';
    });

    if (validIds.length === 0) return;

    setSelectedSeatIds((prev) => {
      let next = [...prev];
      for (const id of validIds) {
        if (next.includes(id)) {
          next = next.filter((s) => s !== id);
        } else {
          if (next.length >= 8) {
            alert('Bạn chỉ có thể chọn tối đa 8 ghế cho mỗi lần đặt vé.');
            return prev; // abort further additions
          }
          next.push(id);
        }
      }
      return next;
    });
  };

  // Selected Seats Info
  const selectedSeats = useMemo(() => {
    return seats.filter((s) => selectedSeatIds.includes(s.id));
  }, [seats, selectedSeatIds]);

  // Total Price calculation
  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((acc, s) => acc + (s.price || 0), 0);
  }, [selectedSeats]);

  const selectedSeatLabels = useMemo(() => {
    return selectedSeats.map((s) => s.id).join(', ');
  }, [selectedSeats]);

  // Hold selected seats in Redis before advancing
  const handleHoldSeats = async () => {
    if (selectedSeats.length === 0) return { success: false, message: 'Vui lòng chọn ít nhất 1 ghế' };
    setIsHolding(true);
    setHoldError(null);
    try {
      const showtimeSeatIds = selectedSeats.map((s) => s.showtime_seat_id);
      const res = await seatBookingService.holdSeats({
        showtime_id: showtimeId,
        showtime_seat_ids: showtimeSeatIds,
      });

      if (!res.success) {
        setHoldError(res.message || 'Không thể giữ ghế');
      } else {
        // Save to session
        updateBookingSession(showtimeId, {
          bookingId: res.booking_id,
          bookingCode: res.booking_code,
          showtimeSeatIds: showtimeSeatIds,
          selectedSeatCodes: selectedSeats.map((s) => s.id),
          selectedSeats: selectedSeats.map((s) => ({
            id: s.id,
            showtime_seat_id: s.showtime_seat_id,
            row: s.row,
            number: s.number,
            type: s.type,
            price: s.price,
          })),
          seatSummaryText: selectedSeatLabels,
          ticketTotalPrice: totalPrice,
        });
      }
      return res;
    } finally {
      setIsHolding(false);
    }
  };

  return {
    bookingInfo,
    seats,
    seatTypes,
    seatRowGroups,
    selectedSeatIds,
    toggleSelectSeat,
    selectedSeats,
    totalPrice,
    selectedSeatLabels,
    formattedCountdown,
    isTimeout,
    holdError,
    isHolding,
    handleHoldSeats,
    loading,
  };
}
