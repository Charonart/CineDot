'use client';

import { useState, useEffect, useMemo } from 'react';
import { PaymentMethodId, VoucherInfo } from '../types/payment.types';
import {
  validateVoucherCode,
  processBookingPayment,
  calculateBookingSummary,
} from '../services/payment.service';
import { formatShowDate } from '@/modules/booking/services/seat-booking.service';
import { getRemainingBookingSeconds, formatSecondsToMMSS } from '@/modules/booking/services/bookingTimerService';
import { getBookingSession } from '@/modules/booking/services/bookingSessionService';

export function usePayment(
  showtimeId: string = 'showtime-101',
  movieParam?: string,
  seatsParam?: string,
  combosParam?: string,
  dateParam?: string,
  timeParam?: string,
  cinemaParam?: string
) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>('VNPAY');
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherInfo | null>(null);
  const [voucherError, setVoucherError] = useState('');
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [isAgreedTerms, setIsAgreedTerms] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(() => getRemainingBookingSeconds(showtimeId));
  const [isTimeout, setIsTimeout] = useState(false);

  // Server-calculated financial breakdown
  const [serverTicketPrice, setServerTicketPrice] = useState<number | null>(null);
  const [serverComboPrice, setServerComboPrice] = useState<number | null>(null);
  const [serverTierDiscount, setServerTierDiscount] = useState<number>(0);
  const [serverVoucherDiscount, setServerVoucherDiscount] = useState<number>(0);
  const [serverFinalAmount, setServerFinalAmount] = useState<number | null>(null);
  const [bookingId, setBookingId] = useState<string | number | undefined>(() => getBookingSession(showtimeId)?.bookingId);
  const [bookingCode, setBookingCode] = useState<string | undefined>(() => getBookingSession(showtimeId)?.bookingCode);

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

  // Movie Info - prefer booking session, fallback to URL param
  const movieInfo = useMemo(() => {
    const slug = movieParam || 'movie-detail';
    const session = getBookingSession(showtimeId);
    if (session) {
      return {
        slug: session.movieSlug || slug,
        title: session.movieTitle,
        poster: session.posterUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
        format: session.movieFormat,
        age: session.ageRating || 'P',
      };
    }
    return {
      slug,
      title: 'Đang tải...',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      format: '2D Phụ Đề',
      age: 'P',
    };
  }, [movieParam, showtimeId]);

  const decodedCinemaName = useMemo(() => {
    const session = getBookingSession(showtimeId);
    if (session?.cinemaName) return session.cinemaName;
    return cinemaParam ? decodeURIComponent(cinemaParam) : 'CineDot Cinema';
  }, [cinemaParam, showtimeId]);

  const formattedShowDate = useMemo(() => {
    return formatShowDate(dateParam);
  }, [dateParam]);

  // Ticket Calculation (client-side fallback)
  const { ticketPriceFallback, seatSummaryText } = useMemo(() => {
    const rawSeats = seatsParam ? seatsParam.split(',').filter(Boolean) : [];
    if (rawSeats.length === 0) {
      return { ticketPriceFallback: 0, seatSummaryText: 'Chưa chọn ghế' };
    }

    const session = getBookingSession(showtimeId);
    const basePrice = session?.basePrice || 110000;

    let calculatedPrice = 0;
    const stdList: string[] = [];
    const vipList: string[] = [];
    const sweetboxList: string[] = [];

    rawSeats.forEach((id) => {
      const row = id.charAt(0).toUpperCase();
      if (['E', 'F', 'G', 'H'].includes(row)) {
        vipList.push(id);
        calculatedPrice += basePrice + 20000; // VIP surcharge
      } else if (['I', 'J'].includes(row)) {
        sweetboxList.push(id);
      } else {
        stdList.push(id);
        calculatedPrice += basePrice;
      }
    });

    if (sweetboxList.length > 0) {
      const sweetboxPairs = Math.ceil(sweetboxList.length / 2);
      calculatedPrice += sweetboxPairs * (basePrice + 40000); // Sweetbox surcharge
    }

    const parts: string[] = [];
    if (stdList.length > 0) parts.push(`Ghế Thường (x${stdList.length}): ${stdList.join(', ')}`);
    if (vipList.length > 0) parts.push(`Ghế VIP (x${vipList.length}): ${vipList.join(', ')}`);
    if (sweetboxList.length > 0) parts.push(`Ghế Đôi Sweetbox: ${sweetboxList.join(', ')}`);

    return {
      ticketPriceFallback: calculatedPrice,
      seatSummaryText: parts.join(' | '),
    };
  }, [seatsParam, showtimeId]);

  // Use server price if available, otherwise fallback
  const ticketPrice = serverTicketPrice ?? ticketPriceFallback;

  // Parse Concessions from combosParam URL e.g. "1:1,2:2"
  const selectedFoodList = useMemo(() => {
    if (!combosParam) return [];
    const list: { id: string; name: string; quantity: number; price: number }[] = [];

    combosParam.split(',').forEach((pair) => {
      const [id, qStr] = pair.split(':');
      if (id && qStr) {
        const quantity = parseInt(qStr, 10);
        if (quantity > 0) {
          list.push({
            id,
            name: `Combo (${id})`,
            quantity,
            price: 95000 * quantity, // Will be overridden by server response
          });
        }
      }
    });

    return list;
  }, [combosParam]);

  const totalFoodPrice = serverComboPrice ?? selectedFoodList.reduce((sum, item) => sum + item.price, 0);

  const discountAmount = (appliedVoucher ? appliedVoucher.discountAmount : 0) + serverTierDiscount + serverVoucherDiscount;
  const subtotal = ticketPrice + totalFoodPrice;
  const grandTotal = serverFinalAmount ?? Math.max(0, subtotal - discountAmount);

  // Call calculateBookingSummary API on mount to get exact pricing
  useEffect(() => {
    async function fetchSummary() {
      const rawSeats = seatsParam ? seatsParam.split(',').filter(Boolean) : [];
      if (rawSeats.length === 0) return;

      // We need showtime_seat_ids which we don't have directly from URL.
      // The calculate-summary endpoint may accept seat codes or we pass what we have.
      // For now, call with available data
      const combos = combosParam
        ? combosParam.split(',').map((pair) => {
            const [id, qStr] = pair.split(':');
            return { combo_id: Number(id), quantity: Number(qStr || 1) };
          }).filter((c) => c.combo_id > 0 && c.quantity > 0)
        : [];

      const session = getBookingSession(showtimeId);
      const sessionSeatIds = session?.showtimeSeatIds || [];

      const result = await calculateBookingSummary({
        showtime_id: showtimeId,
        showtime_seat_ids: sessionSeatIds, 
        combos: combos.length > 0 ? combos : undefined,
      });

      if (result) {
        setServerTicketPrice(result.financial_breakdown.subtotal_tickets);
        setServerComboPrice(result.financial_breakdown.subtotal_combos);
        setServerTierDiscount(result.financial_breakdown.discounts?.tier_discount?.deducted_amount || 0);
        setServerVoucherDiscount(result.financial_breakdown.discounts?.voucher_discount?.deducted_amount || 0);
        setServerFinalAmount(result.financial_breakdown.final_amount_to_pay);

        // Update food names from server response
        if (result.items?.combos && result.items.combos.length > 0) {
          // Food names will be reflected in sidebar via server data
        }
      }
    }
    fetchSummary();
  }, [showtimeId, seatsParam, combosParam]);

  // Apply Voucher
  const handleApplyVoucher = async () => {
    if (!voucherInput.trim()) return;
    setIsApplyingVoucher(true);
    setVoucherError('');

    try {
      const result = await validateVoucherCode(voucherInput, subtotal);
      if (result) {
        setAppliedVoucher(result);
        setVoucherError('');
      }
    } catch (err: any) {
      setAppliedVoucher(null);
      setVoucherError(err.message || 'Mã không hợp lệ hoặc đã hết hạn! Thử CINEDOT50K hoặc MOMODAY');
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherInput('');
    setVoucherError('');
  };

  const handleProcessPayment = async (payload: Parameters<typeof processBookingPayment>[0]) => {
    const combosPayload = combosParam
      ? combosParam.split(',').map((pair) => {
          const [id, qStr] = pair.split(':');
          return { combo_id: Number(id), quantity: Number(qStr || 1) };
        }).filter((c) => c.combo_id > 0 && c.quantity > 0)
      : [];

    return processBookingPayment({
      ...payload,
      bookingId: bookingId || payload.bookingId,
      bookingCode: bookingCode || payload.bookingCode,
      combos: combosPayload,
      voucherCode: appliedVoucher?.code,
    });
  };

  return {
    selectedMethod,
    setSelectedMethod,
    voucherInput,
    setVoucherInput,
    appliedVoucher,
    voucherError,
    isApplyingVoucher,
    handleApplyVoucher,
    handleRemoveVoucher,
    isAgreedTerms,
    setIsAgreedTerms,
    isProcessing,
    setIsProcessing,
    formattedCountdown,
    isTimeout,
    movieInfo,
    decodedCinemaName,
    formattedShowDate,
    showTime: timeParam || '18:00',
    seatSummaryText,
    ticketPrice,
    selectedFoodList,
    totalFoodPrice,
    discountAmount,
    grandTotal,
    processBookingPayment: handleProcessPayment,
  };
}
