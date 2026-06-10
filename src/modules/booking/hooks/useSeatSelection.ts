import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/booking.service';
import { Seat, SeatHold } from '../types/booking.type';

const SHOWTIME_STALE_TIME = 5 * 60 * 1000;
const SEAT_MAP_STALE_TIME = 30 * 1000;
const SEAT_MAP_GC_TIME = 10 * 60 * 1000;

export const bookingKeys = {
  all: ['booking'] as const,
  showtime: (showtimeId: string) => [...bookingKeys.all, 'showtime', showtimeId] as const,
  seatMap: (showtimeId: string) => [...bookingKeys.all, 'seat-map', showtimeId] as const,
  hold: (holdId: string) => [...bookingKeys.all, 'hold', holdId] as const,
};

const getFriendlyError = (code: string) => {
  if (code === 'SEAT_NOT_AVAILABLE') return 'Một hoặc nhiều ghế không còn khả dụng. Vui lòng chọn lại ghế.';
  if (code === 'SHOWTIME_NOT_OPEN_FOR_SALE') return 'Suất chiếu này chưa mở bán hoặc đã ngừng bán.';
  if (code === 'INVALID_SHOWTIME_ID') return 'Suất chiếu không hợp lệ.';
  return 'Không thể xử lý yêu cầu. Vui lòng thử lại.';
};

export const useSeatSelection = (showtimeId: string) => {
  const queryClient = useQueryClient();
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [hold, setHold] = useState<SeatHold | null>(null);
  const [holdReceivedAtMs, setHoldReceivedAtMs] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number | null>(null);

  const showtimeQuery = useQuery({
    queryKey: bookingKeys.showtime(showtimeId),
    queryFn: ({ signal }) => bookingService.getShowtimeDetail(showtimeId, signal),
    enabled: !!showtimeId,
    staleTime: SHOWTIME_STALE_TIME,
    gcTime: SEAT_MAP_GC_TIME,
  });

  const seatMapQuery = useQuery({
    queryKey: bookingKeys.seatMap(showtimeId),
    queryFn: ({ signal }) => bookingService.getSeatMap(showtimeId, signal),
    enabled: !!showtimeId,
    staleTime: SEAT_MAP_STALE_TIME,
    gcTime: SEAT_MAP_GC_TIME,
    refetchOnWindowFocus: true,
  });

  const seatMap = seatMapQuery.data;
  const showtime = showtimeQuery.data;

  const selectedSeats = useMemo(
    () => (seatMap?.seats ?? []).filter((seat) => selectedSeatIds.includes(seat.id)),
    [seatMap?.seats, selectedSeatIds],
  );

  const totalAmount = useMemo(
    () => selectedSeats.reduce((sum, seat) => sum + seat.price, 0),
    [selectedSeats],
  );

  const canSelectSeats = !!showtime?.isOpenForSale;
  const canCheckout = canSelectSeats && selectedSeats.length > 0 && !seatMapQuery.isFetching;

  useEffect(() => {
    setSelectedSeatIds([]);
    setHold(null);
    setHoldReceivedAtMs(null);
    setErrorMessage(null);
    setTimeLeftSeconds(null);
  }, [showtimeId]);

  useEffect(() => {
    if (!seatMap) return;

    const availableIds = new Set(
      seatMap.seats.filter((seat) => seat.status === 'available').map((seat) => seat.id),
    );

    setSelectedSeatIds((current) => {
      const validIds = current.filter((id) => availableIds.has(id));
      if (validIds.length !== current.length) {
        setErrorMessage('Một số ghế vừa chọn đã thay đổi trạng thái. Vui lòng kiểm tra lại.');
      }
      return validIds;
    });
  }, [seatMap]);

  useEffect(() => {
    if (!hold || holdReceivedAtMs === null) {
      setTimeLeftSeconds(null);
      return;
    }

    const updateTimeLeft = () => {
      const expiresAt = new Date(hold.expiresAt).getTime();
      const serverTime = new Date(hold.serverTime).getTime();
      const holdDurationMs = Math.max(0, expiresAt - serverTime);
      const elapsedMs = Date.now() - holdReceivedAtMs;
      const seconds = Math.max(0, Math.floor((holdDurationMs - elapsedMs) / 1000));

      setTimeLeftSeconds(seconds);

      if (seconds === 0) {
        setHold(null);
        setHoldReceivedAtMs(null);
        setSelectedSeatIds([]);
        setErrorMessage('Thời gian giữ ghế đã hết. Vui lòng chọn lại ghế.');
      }
    };

    updateTimeLeft();
    const interval = window.setInterval(updateTimeLeft, 1000);
    return () => window.clearInterval(interval);
  }, [hold, holdReceivedAtMs]);

  const refreshSeatMap = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: bookingKeys.seatMap(showtimeId) });
    // Realtime events such as seat.sold, seat.held, and seat.released should invalidate this key.
  }, [queryClient, showtimeId]);

  const clearSelection = useCallback(() => {
    setSelectedSeatIds([]);
    setHold(null);
    setHoldReceivedAtMs(null);
    setErrorMessage(null);
  }, []);

  const toggleSeat = useCallback((seat: Seat) => {
    setErrorMessage(null);

    if (!canSelectSeats) {
      setErrorMessage('Suất chiếu này chưa sẵn sàng để chọn ghế.');
      return;
    }

    if (seat.status !== 'available') {
      setErrorMessage('Ghế này không còn khả dụng.');
      return;
    }

    const maxSeats = seatMap?.selectionRules.maxSeatsPerBooking ?? 8;

    setSelectedSeatIds((current) => {
      const isSelected = current.includes(seat.id);
      if (isSelected) return current.filter((id) => id !== seat.id);

      if (current.length >= maxSeats) {
        setErrorMessage(`Bạn chỉ được chọn tối đa ${maxSeats} ghế trong một giao dịch.`);
        return current;
      }

      return [...current, seat.id];
    });
  }, [canSelectSeats, seatMap?.selectionRules.maxSeatsPerBooking]);

  const holdMutation = useMutation({
    mutationFn: () => bookingService.createSeatHold({ showtimeId, seatIds: selectedSeatIds }),
    onSuccess: (seatHold) => {
      setHold(seatHold);
      setHoldReceivedAtMs(Date.now());
      setErrorMessage(null);
      refreshSeatMap();
    },
    onError: (error) => {
      const code = error instanceof Error ? error.message : 'FAILED_TO_CREATE_SEAT_HOLD';
      setErrorMessage(getFriendlyError(code));
      setHold(null);
      setHoldReceivedAtMs(null);
      refreshSeatMap();
    },
  });

  const handleCreateHold = useCallback(() => {
    if (!canCheckout || holdMutation.isPending) return;
    holdMutation.mutate();
  }, [canCheckout, holdMutation]);

  return {
    showtime,
    seatMap,
    selectedSeatIds,
    selectedSeats,
    totalAmount,
    canCheckout,
    hold,
    holdExpiresAt: hold?.expiresAt ?? null,
    serverTime: hold?.serverTime ?? seatMap?.serverTime ?? null,
    timeLeftSeconds,
    errorMessage,
    isLoading: showtimeQuery.isLoading || seatMapQuery.isLoading,
    isError: showtimeQuery.isError || seatMapQuery.isError,
    isSeatMapFetching: seatMapQuery.isFetching,
    isHoldingSeats: holdMutation.isPending,
    isOpenForSale: !!showtime?.isOpenForSale,
    toggleSeat,
    clearSelection,
    handleCreateHold,
    refreshSeatMap,
  };
};
