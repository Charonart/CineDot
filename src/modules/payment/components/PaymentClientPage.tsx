/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · genre: modern-minimal · macrostructure: Workbench · theme: White Minimal · component: PaymentClientPage */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { usePayment } from '../hooks/usePayment';
import { BookingStepWizard } from '@/modules/booking/components/BookingStepWizard';
import { VoucherInputBar } from './VoucherInputBar';
import { UserVoucherSelectorModal } from './UserVoucherSelectorModal';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { PaymentSidebar } from './PaymentSidebar';
import { PaymentLoadingOverlay } from './PaymentLoadingOverlay';
import { SeatTimeoutModal } from '@/modules/booking/components/SeatTimeoutModal';
import { MOCK_PAYMENT_METHODS } from '../mocks/mockPaymentData';
import { resetBookingTimer } from '@/modules/booking/services/bookingTimerService';
import { updateBookingSession } from '@/modules/booking/services/bookingSessionService';

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
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

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
    itemizedSeats,
    ticketPrice,
    appliedPricingRules,
    ticketPriceComposition,
    selectedFoodList,
    totalFoodPrice,
    tierDiscountAmount,
    tierName,
    voucherDiscountAmount,
    discountAmount,
    vatBreakdown,
    grandTotal,
    processBookingPayment,
  } = usePayment(showtimeId, movieParam, seatsParam, combosParam, dateParam, timeParam, cinemaParam);

  const selectedMethodObj = MOCK_PAYMENT_METHODS.find((m) => m.id === selectedMethod);

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
        updateBookingSession(showtimeId, {
          paymentConfirmed: true,
          totalPaid: grandTotal,
          paymentMethod: selectedMethod,
          paidAt: new Date().toLocaleString('vi-VN'),
        });

        if (res.paymentUrl) {
          window.location.href = res.paymentUrl;
        } else {
          router.replace(
            `/booking/success?booking_id=${res.bookingId}&movie=${movieInfo.slug}&seats=${seatsParam}&date=${dateParam}&time=${timeParam}&cinema=${encodeURIComponent(
              decodedCinemaName
            )}&total=${grandTotal}`
          );
        }
      } else {

        alert((res as any)?.message || 'Thanh toán thất bại, vui lòng thử lại.');
      }
    } catch {
      alert('Đã có lỗi xảy ra trong quá trình xử lý thanh toán.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-gray-900 flex flex-col justify-between pt-24 sm:pt-28 pb-24 selection:bg-[#7C6FE8] selection:text-white">
      {/* Main Payment Workflow Workbench Layout */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-8 py-4 sm:py-6 w-full flex-1">
        {/* Slim Horizontal Booking Step Wizard Ribbon */}
        <BookingStepWizard
          currentStep={4}
          showtimeId={showtimeId}
          movieSlug={movieParam || movieInfo.slug}
          movieTitle={movieInfo.title}
          seatsParam={seatsParam}
          combosParam={combosParam}
          dateParam={dateParam}
          timeParam={timeParam || showTime}
          cinemaParam={cinemaParam || decodedCinemaName}
          className="mb-6"
        />

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left Column: 68% Width (Payment Options) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Back navigation button */}
              <div className="flex items-center justify-between pb-1">
                <Link href={backToFoodHref}>
                  <button
                    type="button"
                    className="text-xs font-bold text-[#7C6FE8] hover:text-[#685bc7] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
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
                onApply={() => handleApplyVoucher()}
                onRemove={handleRemoveVoucher}
                onOpenSelector={() => setIsVoucherModalOpen(true)}
              />

              {/* Payment Method Selector */}
              <PaymentMethodSelector
                methods={MOCK_PAYMENT_METHODS}
                selectedId={selectedMethod}
                onSelect={setSelectedMethod}
              />
            </div>

            {/* Right Column: 32% Width (Payment Summary Sidebar) */}
            <div className="lg:col-span-4 sticky top-28">
              <PaymentSidebar
                movieTitle={movieInfo.title}
                movieFormat={movieInfo.format}
                posterUrl={movieInfo.poster}
                ageRating={movieInfo.age}
                cinemaName={decodedCinemaName}
                showTime={showTime}
                showDate={formattedShowDate}
                seatSummaryText={seatSummaryText}
                itemizedSeats={itemizedSeats}
                ticketPrice={ticketPrice}
                appliedPricingRules={appliedPricingRules}
                ticketPriceComposition={ticketPriceComposition}
                selectedFoodList={selectedFoodList}
                totalFoodPrice={totalFoodPrice}
                tierDiscountAmount={tierDiscountAmount}
                tierName={tierName}
                voucherDiscountAmount={voucherDiscountAmount}
                discountAmount={discountAmount}
                vatBreakdown={vatBreakdown}
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

      {/* 3. User Voucher Selector Modal */}
      <UserVoucherSelectorModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        orderAmount={ticketPrice + totalFoodPrice}
        appliedVoucherCode={appliedVoucher?.code}
        onApplyVoucher={(code) => handleApplyVoucher(code)}
      />

      {/* 4. Full-screen Loading Overlay on Payment Process */}
      <PaymentLoadingOverlay
        isOpen={isProcessing}
        paymentMethodName={selectedMethodObj ? selectedMethodObj.name : 'Cổng Thanh Toán'}
      />

      {/* 5. Seat Timeout Expiration Modal Popup */}
      <SeatTimeoutModal
        isOpen={isTimeout}
        movieSlug={movieInfo.slug}
        onReset={() => resetBookingTimer(showtimeId)}
      />
    </div>
  );
}

