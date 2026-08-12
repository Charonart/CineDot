'use client';

import { useState, useEffect, useMemo } from 'react';
import { PaymentMethodId, VoucherInfo } from '../types/payment.types';
import { validateVoucherCode, processBookingPayment } from '../services/payment.service';
import { formatShowDate } from '@/modules/booking/services/seat-booking.service';
import { getRemainingBookingSeconds, formatSecondsToMMSS } from '@/modules/booking/services/bookingTimerService';

const mockMovieDatabase: Record<string, { title: string; poster: string; format: string; age: string }> = {
  'spiderman-new-beginning': {
    title: 'Người Nhện: Khởi Đầu Mới',
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80',
    format: '2D Phụ Đề',
    age: 'T13',
  },
  'spider-man-across-the-spider-verse': {
    title: 'Người Nhện: Khởi Đầu Mới',
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80',
    format: '2D Phụ Đề',
    age: 'T13',
  },
  'mai': {
    title: 'Phim Điện Ảnh Mai',
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=80',
    format: '2D Lồng Tiếng',
    age: 'T18',
  },
  'inside-out-2': {
    title: 'Những Mảnh Mảnh Cảm Xúc 2',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    format: '3D Lồng Tiếng',
    age: 'P',
  },
};

const mockFoodCatalog: Record<string, { name: string; price: number }> = {
  'food-1': { name: 'Combo Cine Single', price: 95000 },
  'food-2': { name: 'Combo Cine Couple', price: 129000 },
  'food-3': { name: 'Combo Cine Party (Nhóm 4)', price: 199000 },
  'food-4': { name: 'Bắp Rang Phô Mai Hạn Số 1', price: 65000 },
  'food-5': { name: 'Nước Ngọt Pepsi Lớn 32oz', price: 35000 },
};

export function usePayment(
  showtimeId: string = 'showtime-101',
  movieParam?: string,
  seatsParam?: string,
  combosParam?: string,
  dateParam?: string,
  timeParam?: string,
  cinemaParam?: string
) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>('MOMO');
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherInfo | null>(null);
  const [voucherError, setVoucherError] = useState('');
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [isAgreedTerms, setIsAgreedTerms] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(() => getRemainingBookingSeconds(showtimeId));
  const [isTimeout, setIsTimeout] = useState(false);

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

  // Movie Info
  const movieInfo = useMemo(() => {
    const slug = movieParam || 'spiderman-new-beginning';
    const found = mockMovieDatabase[slug];
    return {
      slug,
      title: found ? found.title : 'Người Nhện: Khởi Đầu Mới',
      poster: found
        ? found.poster
        : 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80',
      format: found ? found.format : '2D Phụ Đề',
      age: found ? found.age : 'T13',
    };
  }, [movieParam]);

  const decodedCinemaName = useMemo(() => {
    return cinemaParam ? decodeURIComponent(cinemaParam) : 'Galaxy CineX Hanoi Centre';
  }, [cinemaParam]);

  const formattedShowDate = useMemo(() => {
    return formatShowDate(dateParam);
  }, [dateParam]);

  // Ticket Calculation
  const { ticketPrice, seatSummaryText } = useMemo(() => {
    const rawSeats = seatsParam ? seatsParam.split(',').filter(Boolean) : [];
    if (rawSeats.length === 0) {
      return { ticketPrice: 220000, seatSummaryText: 'Ghế Thường (x2): D09, D10' };
    }

    let calculatedPrice = 0;
    const stdList: string[] = [];
    const vipList: string[] = [];
    const sweetboxList: string[] = [];

    rawSeats.forEach((id) => {
      const row = id.charAt(0).toUpperCase();
      if (['E', 'F', 'G', 'H'].includes(row)) {
        vipList.push(id);
        calculatedPrice += 140000;
      } else if (['I', 'J'].includes(row)) {
        sweetboxList.push(id);
      } else {
        stdList.push(id);
        calculatedPrice += 110000;
      }
    });

    if (sweetboxList.length > 0) {
      const sweetboxPairs = Math.ceil(sweetboxList.length / 2);
      calculatedPrice += sweetboxPairs * 250000;
    }

    const parts: string[] = [];
    if (stdList.length > 0) parts.push(`Ghế Thường (x${stdList.length}): ${stdList.join(', ')}`);
    if (vipList.length > 0) parts.push(`Ghế VIP (x${vipList.length}): ${vipList.join(', ')}`);
    if (sweetboxList.length > 0) parts.push(`Ghế Đôi Sweetbox: ${sweetboxList.join(', ')}`);

    return {
      ticketPrice: calculatedPrice,
      seatSummaryText: parts.join(' | '),
    };
  }, [seatsParam]);

  // Parse Concessions from combosParam URL e.g. "food-1:1,food-2:2"
  const selectedFoodList = useMemo(() => {
    if (!combosParam) return [];
    const list: { id: string; name: string; quantity: number; price: number }[] = [];

    combosParam.split(',').forEach((pair) => {
      const [id, qStr] = pair.split(':');
      if (id && qStr) {
        const quantity = parseInt(qStr, 10);
        if (quantity > 0) {
          const catalog = mockFoodCatalog[id] || { name: `Combo (${id})`, price: 95000 };
          list.push({
            id,
            name: catalog.name,
            quantity,
            price: catalog.price * quantity,
          });
        }
      }
    });

    return list;
  }, [combosParam]);

  const totalFoodPrice = useMemo(() => {
    return selectedFoodList.reduce((sum, item) => sum + item.price, 0);
  }, [selectedFoodList]);

  const discountAmount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  const subtotal = ticketPrice + totalFoodPrice;
  const grandTotal = Math.max(0, subtotal - discountAmount);

  // Apply Voucher
  const handleApplyVoucher = async () => {
    if (!voucherInput.trim()) return;
    setIsApplyingVoucher(true);
    setVoucherError('');

    try {
      const result = await validateVoucherCode(voucherInput);
      if (result) {
        setAppliedVoucher(result);
        setVoucherError('');
      } else {
        setVoucherError('Mã không hợp lệ hoặc đã hết hạn! Thử CINEDOT50K hoặc MOMODAY');
      }
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherInput('');
    setVoucherError('');
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
    processBookingPayment,
  };
}
