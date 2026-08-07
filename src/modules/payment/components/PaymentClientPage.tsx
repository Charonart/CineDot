'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { usePayment } from '../hooks/usePayment';
import { BookingStepWizard } from '@/modules/booking/components/BookingStepWizard';
import { VoucherInputBar } from './VoucherInputBar';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { PaymentSidebar } from './PaymentSidebar';
import { PaymentLoadingOverlay } from './PaymentLoadingOverlay';
import { SeatTimeoutModal } from '@/modules/booking/components/SeatTimeoutModal';
import { MOCK_PAYMENT_METHODS } from '../mocks/mockPaymentData';

interface PaymentClientPageProps {
  showtimeId?: string;
  movieParam?: string;
  seatsParam?: string;
  combosParam?: string;
  dateParam?: string;
  timeParam?: string;
  cinemaParam?: string;
}

export function PaymentClientPage({
  showtimeId = 'showtime-101',
  movieParam,
  seatsParam,
  combosParam,
  dateParam,
  timeParam,
  cinemaParam,
}: PaymentClientPageProps) {
  const router = useRouter();

  const {
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
    showTime,
    seatSummaryText,
    ticketPrice,
    selectedFoodList,
    totalFoodPrice,
    discountAmount,
    grandTotal,
    processBookingPayment,
  } = usePayment(showtimeId, movieParam, seatsParam, combosParam, dateParam, timeParam, cinemaParam);

  const selectedMethodObj = MOCK_PAYMENT_METHODS.find((m) => m.id === selectedMethod);

  // Preserve ALL parameters on the Back button to Food Booking (including combos)
  const backToFoodHref = `/booking/food?showtime_id=${showtimeId}&movie=${movieParam}&seats=${seatsParam}&date=${dateParam}&time=${timeParam}&cinema=${encodeURIComponent(
    decodedCinemaName
  )}${combosParam ? `&combos=${encodeURIComponent(combosParam)}` : ''}`;

  const handleSubmitPayment = async () => {
    setIsProcessing(true);
    try {
      const res = await processBookingPayment({
        showtimeId,
        movieSlug: movieInfo.slug,
        seats: seatsParam || 'D09,D10',
        paymentMethod: selectedMethod,
        totalAmount: grandTotal,
      });

      if (res.success) {
        // Redirect to Booking Success Page (Page 4)
        router.push(
          `/booking/success?booking_id=${res.bookingId}&movie=${movieInfo.slug}&seats=${seatsParam}&date=${dateParam}&time=${timeParam}&cinema=${encodeURIComponent(
            decodedCinemaName
          )}&total=${grandTotal}`
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full flex flex-col font-sans bg-[#FEFEFE] text-[#131413] min-h-screen pt-24 pb-20 selection:bg-[#7C6FE8] selection:text-white">
      {/* 1. Step Wizard Bar (Step 4: Thanh toán ACTIVE, 80% progress) */}
      <BookingStepWizard currentStep={4} />

      {/* 2. Main Content 2-Column Container */}
      <main className="w-full">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: 68% Width (lg:col-span-8 - Voucher & Payment Method Cards) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Back to Food Booking Link */}
              <div className="flex items-center justify-between pb-1">
                <Link href={backToFoodHref}>
                  <button className="text-xs font-bold text-[#7C6FE8] hover:text-[#685bc7] flex items-center gap-1.5 transition-colors cursor-pointer">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Quay lại chọn bắp nước</span>
                  </button>
                </Link>
              </div>

              {/* Voucher Coupon Bar */}
              <VoucherInputBar
                voucherInput={voucherInput}
                onInputChange={setVoucherInput}
                appliedVoucher={appliedVoucher}
                voucherError={voucherError}
                isApplying={isApplyingVoucher}
                onApply={handleApplyVoucher}
                onRemove={handleRemoveVoucher}
              />

              {/* Payment Method Selector */}
              <PaymentMethodSelector
                methods={MOCK_PAYMENT_METHODS}
                selectedId={selectedMethod}
                onSelect={setSelectedMethod}
              />
            </div>

            {/* Right Column: 32% Width (lg:col-span-4 - Payment Summary Sidebar) */}
            <div className="lg:col-span-4">
              <PaymentSidebar
                movieTitle={movieInfo.title}
                movieFormat={movieInfo.format}
                posterUrl={movieInfo.poster}
                ageRating={movieInfo.age}
                cinemaName={decodedCinemaName}
                showTime={showTime}
                showDate={formattedShowDate}
                seatSummaryText={seatSummaryText}
                ticketPrice={ticketPrice}
                selectedFoodList={selectedFoodList}
                totalFoodPrice={totalFoodPrice}
                discountAmount={discountAmount}
                grandTotal={grandTotal}
                formattedCountdown={formattedCountdown}
                isAgreedTerms={isAgreedTerms}
                onToggleTerms={setIsAgreedTerms}
                onSubmitPayment={handleSubmitPayment}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </div>
      </main>

      {/* 3. Full-screen Loading Overlay on Payment Process */}
      <PaymentLoadingOverlay
        isOpen={isProcessing}
        paymentMethodName={selectedMethodObj ? selectedMethodObj.name : 'Cổng Thanh Toán'}
      />

      {/* 4. Seat Timeout Expiration Modal Popup */}
      <SeatTimeoutModal
        isOpen={isTimeout}
        movieSlug={movieInfo.slug}
      />
    </div>
  );
}
