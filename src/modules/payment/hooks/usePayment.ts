'use client';

import { useState, useEffect, useMemo } from 'react';
import { PaymentMethodId, VoucherInfo } from '../types/payment.types';
import {
  validateVoucherCode,
  processBookingPayment,
  calculateBookingSummary,
} from '../services/payment.service';
import { formatShowDate, seatBookingService } from '@/modules/booking/services/seat-booking.service';
import { getRemainingBookingSeconds, formatSecondsToMMSS } from '@/modules/booking/services/bookingTimerService';
import { getBookingSession, updateBookingSession } from '@/modules/booking/services/bookingSessionService';
import { useAuthStore } from '@/shared/store/useAuthStore';

export interface AppliedPricingRuleSummary {
  ruleId: number;
  name: string;
  modifierType: string;
  modifierValue: number;
  ticketCount: number;
  totalAdjustment: number;
  isDiscount: boolean;
}

export interface ItemizedSeatItem {
  id: string;
  typeName: string;
  price: number;
}

export interface TicketPriceComposition {
  totalBasePrice: number;
  totalSurcharge: number;
  totalRuleAdjustment: number;
  appliedRules: AppliedPricingRuleSummary[];
}

export function usePayment(
  showtimeId: string = 'showtime-101',
  movieParam?: string,
  seatsParam?: string,
  combosParam?: string,
  dateParam?: string,
  timeParam?: string,
  cinemaParam?: string
) {
  const authUser = useAuthStore((state) => state.user);
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
  const [serverSeats, setServerSeats] = useState<ItemizedSeatItem[] | null>(null);
  const [serverComboPrice, setServerComboPrice] = useState<number | null>(null);
  const [serverTierDiscount, setServerTierDiscount] = useState<number>(0);
  const [serverTierName, setServerTierName] = useState<string | undefined>(undefined);
  const [serverVoucherDiscount, setServerVoucherDiscount] = useState<number>(0);
  const [serverFoodList, setServerFoodList] = useState<{ id: string; name: string; quantity: number; price: number }[] | null>(null);
  const [serverFinalAmount, setServerFinalAmount] = useState<number | null>(null);
  const [appliedPricingRules, setAppliedPricingRules] = useState<AppliedPricingRuleSummary[]>([]);
  const [ticketPriceComposition, setTicketPriceComposition] = useState<TicketPriceComposition | null>(null);
  const [serverVatBreakdown, setServerVatBreakdown] = useState<{
    ticket_vat_rate: number;
    ticket_vat_amount: number;
    combo_vat_rate: number;
    combo_vat_amount: number;
    total_vat_amount: number;
    is_included_in_price: boolean;
  } | null>(null);
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
      calculatedPrice += sweetboxPairs * (basePrice + 40000) * 2; // Sweetbox couple pair (2 seats)
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

  // Concessions Food List: use server authoritative name and price if available
  const fallbackFoodList = useMemo(() => {
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
            price: 0,
          });
        }
      }
    });

    return list;
  }, [combosParam]);

  const selectedFoodList = serverFoodList ?? fallbackFoodList;

  const totalFoodPrice = serverComboPrice ?? selectedFoodList.reduce((sum, item) => sum + item.price, 0);

  const subtotal = ticketPrice + totalFoodPrice;

  // Tier info & fallback discount
  const effectiveTierName = useMemo(() => {
    if (serverTierName) return serverTierName;
    if (authUser?.user_tier) return authUser.user_tier;
    const pts = authUser?.total_points || 0;
    if (pts >= 2000) return 'Platinum';
    if (pts >= 1000) return 'Gold';
    if (pts >= 500) return 'Silver';
    if (authUser) return 'Bronze';
    return undefined;
  }, [serverTierName, authUser]);

  const clientTierDiscount = useMemo(() => {
    if (serverTierDiscount > 0) return serverTierDiscount;
    if (!authUser) return 0;

    const tier = (effectiveTierName || '').toLowerCase();
    let percent = 0;
    if (tier.includes('diamond') || tier.includes('platinum')) percent = 0.15;
    else if (tier.includes('gold')) percent = 0.10;
    else if (tier.includes('silver')) percent = 0.05;
    else if ((authUser.total_points || 0) >= 2000) percent = 0.15;
    else if ((authUser.total_points || 0) >= 1000) percent = 0.10;
    else if ((authUser.total_points || 0) >= 500) percent = 0.05;

    return percent > 0 ? Math.round(subtotal * percent) : 0;
  }, [serverTierDiscount, authUser, effectiveTierName, subtotal]);

  const tierDiscountAmount = serverTierDiscount > 0 ? serverTierDiscount : clientTierDiscount;
  const voucherDiscountAmount = appliedVoucher
    ? (serverVoucherDiscount > 0 ? serverVoucherDiscount : appliedVoucher.discountAmount)
    : serverVoucherDiscount;
  const discountAmount = tierDiscountAmount + voucherDiscountAmount;

  // VAT breakdown (5% for movie tickets, 8% for F&B concessions - included in prices)
  const vatBreakdown = useMemo(() => {
    if (serverVatBreakdown) {
      return {
        ticketVatRate: serverVatBreakdown.ticket_vat_rate,
        ticketVatAmount: serverVatBreakdown.ticket_vat_amount,
        comboVatRate: serverVatBreakdown.combo_vat_rate,
        comboVatAmount: serverVatBreakdown.combo_vat_amount,
        totalVatAmount: serverVatBreakdown.total_vat_amount,
        isIncluded: true,
      };
    }

    const ticketVatRate = 0.05;
    const comboVatRate = 0.08;

    const ticketNet = Math.round(ticketPrice / (1 + ticketVatRate));
    const ticketVat = ticketPrice - ticketNet;

    const comboNet = Math.round(totalFoodPrice / (1 + comboVatRate));
    const comboVat = totalFoodPrice - comboNet;

    const totalVat = ticketVat + comboVat;

    return {
      ticketVatRate: 5,
      ticketVatAmount: ticketVat,
      comboVatRate: 8,
      comboVatAmount: comboVat,
      totalVatAmount: totalVat,
      isIncluded: true,
    };
  }, [serverVatBreakdown, ticketPrice, totalFoodPrice]);

  const grandTotal =
    serverFinalAmount !== null && (!appliedVoucher || serverVoucherDiscount > 0)
      ? serverFinalAmount
      : Math.max(0, subtotal - discountAmount);

  // Call calculateBookingSummary API
  const fetchSummary = async (voucherCodeToUse?: string) => {
    const rawSeats = seatsParam ? seatsParam.split(',').filter(Boolean) : [];
    if (rawSeats.length === 0) return;

    const cleanShowtimeId = String(showtimeId).replace('showtime-', '');

    const combos = combosParam
      ? combosParam
          .split(',')
          .map((pair) => {
            const [id, qStr] = pair.split(':');
            return { combo_id: Number(id), quantity: Number(qStr || 1) };
          })
          .filter((c) => c.combo_id > 0 && c.quantity > 0)
      : [];

    const session = getBookingSession(showtimeId);
    let sessionSeatIds = session?.showtimeSeatIds || [];

    // If session doesn't have seat IDs, fetch seats from seatBookingService
    if (sessionSeatIds.length === 0 && rawSeats.length > 0) {
      try {
        const seatData = await seatBookingService.fetchShowtimeBookingData(cleanShowtimeId);
        if (seatData?.seats?.length > 0) {
          sessionSeatIds = seatData.seats
            .filter((s) => rawSeats.includes(s.id))
            .map((s) => s.showtime_seat_id);
          if (sessionSeatIds.length > 0) {
            updateBookingSession(showtimeId, { showtimeSeatIds: sessionSeatIds });
          }
        }
      } catch {
        // Fallback
      }
    }

    const result = await calculateBookingSummary({
      showtime_id: cleanShowtimeId,
      showtime_seat_ids: sessionSeatIds.length > 0 ? sessionSeatIds : undefined,
      seats: seatsParam,
      combos: combos.length > 0 ? combos : undefined,
      voucher_code: voucherCodeToUse,
    });

    if (result && result.financial_breakdown) {
      const fb = result.financial_breakdown;
      setServerTicketPrice(fb.subtotal_tickets);
      setServerComboPrice(fb.subtotal_combos);

      const tierD = fb.discounts?.tier_discount;
      const tierAmt = fb.tier_discount_amount ?? tierD?.deducted_amount ?? 0;
      setServerTierDiscount(tierAmt);
      if (tierD?.tier_name) {
        setServerTierName(tierD.tier_name);
      }

      const vD = fb.discounts?.voucher_discount;
      const vAmt = fb.voucher_discount_amount ?? vD?.deducted_amount ?? 0;
      setServerVoucherDiscount(vAmt);

      if (fb.vat_breakdown) {
        setServerVatBreakdown(fb.vat_breakdown);
      }

      // Parse itemized tickets for pricing rule breakdown & exact seat costs
      if (result.items?.tickets && result.items.tickets.length > 0) {
        let totalBase = 0;
        let totalSurch = 0;
        let totalRuleAdj = 0;
        const ruleMap: Record<number, AppliedPricingRuleSummary> = {};

        const mappedTickets: ItemizedSeatItem[] = result.items.tickets.map((t: any) => {
          totalBase += t.base_price || 0;
          totalSurch += t.surcharge || 0;

          if (t.applied_rule) {
            const r = t.applied_rule;
            const ruleId = r.rule_id;
            const modType = r.modifier_type;
            const modVal = Number(r.modifier_value) || 0;
            const isDiscount = modVal < 0;

            let adjPerTicket = 0;
            if (modType === 'PERCENT') {
              adjPerTicket = ((t.base_price || 0) + (t.surcharge || 0)) * (modVal / 100);
            } else {
              adjPerTicket = modVal;
            }
            totalRuleAdj += adjPerTicket;

            if (!ruleMap[ruleId]) {
              ruleMap[ruleId] = {
                ruleId,
                name: r.name,
                modifierType: modType,
                modifierValue: modVal,
                ticketCount: 0,
                totalAdjustment: 0,
                isDiscount,
              };
            }
            ruleMap[ruleId].ticketCount += 1;
            ruleMap[ruleId].totalAdjustment += adjPerTicket;
          }

          const rawType = (t.seat_type || 'standard').toLowerCase();
          const typeName = rawType.includes('vip')
            ? 'Ghế VIP'
            : rawType.includes('couple') || rawType.includes('sweet')
            ? 'Ghế Đôi Sweetbox'
            : 'Ghế Thường';

          return {
            id: t.seat_code || t.code || 'Ghế',
            typeName,
            price: Number(t.final_price || ((t.base_price || 0) + (t.surcharge || 0))),
          };
        });

        setServerSeats(mappedTickets);

        const ruleList = Object.values(ruleMap);
        setAppliedPricingRules(ruleList);
        setTicketPriceComposition({
          totalBasePrice: totalBase,
          totalSurcharge: totalSurch,
          totalRuleAdjustment: totalRuleAdj,
          appliedRules: ruleList,
        });
      }


      // Update food combo names and real prices from server response
      if (result.items?.combos && result.items.combos.length > 0) {
        const mappedCombos = result.items.combos.map((c) => ({
          id: String(c.combo_id),
          name: c.name,
          quantity: c.quantity,
          price: c.total_combo_price,
        }));
        setServerFoodList(mappedCombos);
      }

      setServerFinalAmount(fb.final_amount_to_pay);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [showtimeId, seatsParam, combosParam]);

  // Apply Voucher
  const handleApplyVoucher = async () => {
    if (!voucherInput.trim()) return;
    setIsApplyingVoucher(true);
    setVoucherError('');

    try {
      const code = voucherInput.trim().toUpperCase();
      const result = await validateVoucherCode(code, subtotal);
      if (result) {
        setAppliedVoucher(result);
        setVoucherError('');
        await fetchSummary(code);
      } else {
        setVoucherError('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
      }
    } catch {
      setVoucherError('Không thể áp dụng mã voucher lúc này.');
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  // Remove Voucher
  const handleRemoveVoucher = async () => {
    setAppliedVoucher(null);
    setVoucherInput('');
    setVoucherError('');
    await fetchSummary('');
  };

  const handleProcessPayment = async (payload: any) => {
    const combosPayload = combosParam
      ? combosParam
          .split(',')
          .map((pair) => {
            const [id, qStr] = pair.split(':');
            return { combo_id: parseInt(id, 10), quantity: parseInt(qStr, 10) || 0 };
          })
          .filter((c) => c.combo_id > 0 && c.quantity > 0)
      : [];

    return processBookingPayment({
      ...payload,
      bookingId: bookingId || payload.bookingId,
      bookingCode: bookingCode || payload.bookingCode,
      combos: combosPayload,
      voucherCode: appliedVoucher?.code,
    });
  };

  const itemizedSeats = useMemo<ItemizedSeatItem[]>(() => {
    if (serverSeats && serverSeats.length > 0) {
      return serverSeats;
    }

    const session = getBookingSession(showtimeId);
    if (session?.selectedSeats && session.selectedSeats.length > 0) {
      return session.selectedSeats.map((s) => {
        const rawType = (s.type || 'standard').toLowerCase();
        const typeName = rawType.includes('vip')
          ? 'Ghế VIP'
          : rawType.includes('couple') || rawType.includes('sweet')
          ? 'Ghế Đôi Sweetbox'
          : 'Ghế Thường';
        return {
          id: s.id,
          typeName,
          price: s.price,
        };
      });
    }

    const rawSeats = seatsParam ? seatsParam.split(',').filter(Boolean) : [];
    const basePrice = session?.basePrice || 90000;

    return rawSeats.map((id) => {
      const row = id.charAt(0).toUpperCase();
      if (['E', 'F', 'G', 'H'].includes(row)) {
        return { id, typeName: 'Ghế VIP', price: basePrice + 20000 };
      } else if (['I', 'J'].includes(row)) {
        return { id, typeName: 'Ghế Đôi Sweetbox', price: basePrice + 40000 };
      }
      return { id, typeName: 'Ghế Thường', price: basePrice };
    });
  }, [serverSeats, showtimeId, seatsParam]);

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
    itemizedSeats,
    ticketPrice,
    appliedPricingRules,
    ticketPriceComposition,
    selectedFoodList,
    totalFoodPrice,
    tierDiscountAmount,
    tierName: effectiveTierName,
    voucherDiscountAmount,
    discountAmount,
    vatBreakdown,
    grandTotal,
    processBookingPayment: handleProcessPayment,
  };
}

