import { useState, useEffect, useMemo } from 'react';
import { SeatItem, SeatRowGroup, ShowtimeBookingInfo, SeatTypeInfo, SeatStatus, SeatStatusUpdatedEvent } from '../types/seat-booking.types';
import { seatBookingService } from '../services/seat-booking.service';
import { getRemainingBookingSeconds, formatSecondsToMMSS } from '../services/bookingTimerService';
import { saveBookingSession, updateBookingSession } from '../services/bookingSessionService';
import { getEcho } from '@/shared/lib/echo';
import { useAuthStore } from '@/shared/store/useAuthStore';

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


  const [otherSelectingSeatIds, setOtherSelectingSeatIds] = useState<string[]>([]);

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

  // Realtime Seat Status via WebSocket (Pusher / Laravel Echo)
  useEffect(() => {
    if (!showtimeId) return;

    const echo = getEcho();
    if (!echo) return;

    const cleanShowtimeId = String(showtimeId).replace('showtime-', '');
    const channelName = `showtimes.${cleanShowtimeId}`;

    const handleSeatStatusUpdated = (event: any) => {
      console.log('📡 [Pusher Realtime Event]', event);

      // Trích xuất danh sách ID ghế từ các biến thể payload có thể có
      const rawSeatIds = event.seat_ids || event.showtime_seat_ids || (event.seat_id ? [event.seat_id] : []);
      const rawStatus = String(event.status || 'holding').toLowerCase();
      const userId = event.user_id;

      if (!rawSeatIds || !Array.isArray(rawSeatIds) || rawSeatIds.length === 0) {
        console.warn('⚠️ [Pusher Realtime] Invalid or empty seat_ids payload:', event);
        return;
      }

      const currentUserId = useAuthStore.getState().user?.id;
      const isOtherUser = !currentUserId || String(userId) !== String(currentUserId);

      // Helper map matching IDs with local seat codes / DB IDs
      const matchSeatIds = (seat: SeatItem) => {
        return rawSeatIds.some((id: any) => {
          const sId = String(id).toLowerCase().trim();
          return (
            sId === String(seat.showtime_seat_id).toLowerCase().trim() ||
            sId === String(seat.id).toLowerCase().trim() ||
            sId === `${seat.row}${seat.number}`.toLowerCase().trim()
          );
        });
      };

      // 1. Nếu có người đang chọn ghế (selecting)
      if (rawStatus === 'selecting') {
        if (isOtherUser) {
          // Lấy danh sách ID mã ghế (A1, B2) tương ứng để kích hoạt viền nhấp nháy
          setSeats((prevSeats) => {
            const matchedSeatCodes = prevSeats.filter(matchSeatIds).map((s) => s.id);
            setOtherSelectingSeatIds((prevOther) => {
              const combined = new Set([...prevOther, ...matchedSeatCodes]);
              return Array.from(combined);
            });
            return prevSeats;
          });
        }
        return;
      }

      // 2. Với các trạng thái khác (available, holding, booked, unselect):
      // Xóa khỏi danh sách người khác đang nhắm
      setSeats((prevSeats) => {
        const matchedSeatCodes = prevSeats.filter(matchSeatIds).map((s) => s.id);
        if (matchedSeatCodes.length > 0) {
          setOtherSelectingSeatIds((prevOther) =>
            prevOther.filter((id) => !matchedSeatCodes.includes(id))
          );
        }

        // Trạng thái AVAILABLE
        if (rawStatus === 'available' || rawStatus === 'unselect') {
          return prevSeats.map((seat) => {
            if (matchSeatIds(seat)) {
              return { ...seat, status: 'AVAILABLE' as SeatStatus };
            }
            return seat;
          });
        }

        // Trạng thái HOLDING hoặc BOOKED
        const upperStatus: SeatStatus = rawStatus === 'booked' ? 'BOOKED' : 'HOLDING';

        // Nếu là người khác giữ/mua -> tự động bỏ chọn ở máy mình
        if (isOtherUser) {
          if (matchedSeatCodes.length > 0) {
            setSelectedSeatIds((prevSelected) =>
              prevSelected.filter((id) => !matchedSeatCodes.includes(id))
            );
          }
        }

        return prevSeats.map((seat) => {
          if (matchSeatIds(seat)) {
            return {
              ...seat,
              status: upperStatus,
            };
          }
          return seat;
        });
      });
    };

    // Lắng nghe qua Echo Channel
    const channel = echo.channel(channelName);
    channel.listen('.seat.updated', handleSeatStatusUpdated);
    channel.listen('seat.updated', handleSeatStatusUpdated);
    channel.listen('.SeatStatusUpdated', handleSeatStatusUpdated);
    channel.listen('SeatStatusUpdated', handleSeatStatusUpdated);

    // Lắng nghe trực tiếp qua Pusher instance dự phòng
    try {
      const pusherInstance = (echo.connector as any)?.pusher;
      const pusherChan = pusherInstance?.channel(channelName);
      if (pusherChan) {
        pusherChan.bind('seat.updated', handleSeatStatusUpdated);
        pusherChan.bind('SeatStatusUpdated', handleSeatStatusUpdated);
        pusherChan.bind('App\\Events\\SeatStatusUpdated', handleSeatStatusUpdated);
      }
    } catch {
      // Ignored
    }

    return () => {
      echo.leaveChannel(channelName);
    };
  }, [showtimeId]);

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
    const cleanShowtimeId = String(showtimeId).replace('showtime-', '');

    // Validate all target seats
    const targetSeatItems = seats.filter((s) => ids.includes(s.id));
    const validSeats = targetSeatItems.filter(
      (targetSeat) =>
        targetSeat.status !== 'BOOKED' &&
        targetSeat.status !== 'HOLDING' &&
        targetSeat.status !== 'BLOCKED'
    );

    if (validSeats.length === 0) return;
    const validIds = validSeats.map((s) => s.id);

    setSelectedSeatIds((prev) => {
      let next = [...prev];
      const seatsToSelectDbIds: number[] = [];
      const seatsToUnselectDbIds: number[] = [];

      for (const validSeat of validSeats) {
        const id = validSeat.id;
        if (next.includes(id)) {
          next = next.filter((s) => s !== id);
          if (validSeat.showtime_seat_id) {
            seatsToUnselectDbIds.push(validSeat.showtime_seat_id);
          }
        } else {
          if (next.length >= 8) {
            alert('Bạn chỉ có thể chọn tối đa 8 ghế cho mỗi lần đặt vé.');
            return prev; // abort further additions
          }
          next.push(id);
          if (validSeat.showtime_seat_id) {
            seatsToSelectDbIds.push(validSeat.showtime_seat_id);
          }
        }
      }

      // Gửi API thông báo trạng thái selecting / unselect lên Backend
      if (seatsToSelectDbIds.length > 0) {
        seatBookingService.selectingSeats(cleanShowtimeId, seatsToSelectDbIds);
      }
      if (seatsToUnselectDbIds.length > 0) {
        seatBookingService.unselectSeats(cleanShowtimeId, seatsToUnselectDbIds);
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
    otherSelectingSeatIds,
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
