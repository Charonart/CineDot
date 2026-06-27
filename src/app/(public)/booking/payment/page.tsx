'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingStore } from '@/modules/booking/store/bookingStore';
import { useSeatHoldTimer } from '@/modules/booking/hooks/useSeatHoldTimer';
import { useCreateZaloPayOrder } from '@/modules/booking/hooks/useZaloPay';
import {
  BookingStepper,
  BookingOrderSummary,
  VoucherPanel,
  PaymentMethodSelector,
  TicketConfirmModal,
} from '@/modules/booking/components';
import {
  buildBookingFailedUrl,
  buildSeatsUrlFromSession,
} from '@/modules/booking';

export default function BookingPaymentPage() {
  const router = useRouter();
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessMessageOpen, setIsSuccessMessageOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const session = useBookingStore((state) => state.session);
  const {
    movie,
    cinema,
    showtime,
    seats,
    quickComboHandled,
    seatHoldExpiresAt,
    status,
    paymentMethod,
  } = session;

  const setCurrentStep = useBookingStore((state) => state.setCurrentStep);
  const markPendingPayment = useBookingStore((state) => state.markPendingPayment);

  // Set hydration complete flag
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Update current step to payment
  useEffect(() => {
    if (hasHydrated) {
      setCurrentStep('payment');
    }
  }, [hasHydrated, setCurrentStep]);

  // Strict Access Guard redirections
  useEffect(() => {
    if (!hasHydrated) return;

    // Direct redirect if expired
    if (status === 'expired') {
      router.replace(buildBookingFailedUrl('expired') || '/booking/failed?reason=expired');
      return;
    }

    // Missing movie/cinema/showtime or seats -> Redirect to movies
    if (!movie || !cinema || !showtime || seats.length === 0) {
      router.replace('/movies');
      return;
    }

    // Missing quick combo selection or active timer -> Redirect back to seats page
    if (!quickComboHandled || !seatHoldExpiresAt) {
      const seatsUrl = buildSeatsUrlFromSession(session);
      if (seatsUrl) {
        router.replace(seatsUrl);
      } else {
        router.replace('/movies');
      }
    }
  }, [
    hasHydrated,
    movie,
    cinema,
    showtime,
    seats,
    quickComboHandled,
    seatHoldExpiresAt,
    status,
    router,
    session,
  ]);

  // Integrated Seat Hold Timer hook
  const { isExpired } = useSeatHoldTimer({
    onExpired: () => {
      router.replace(buildBookingFailedUrl('expired') || '/booking/failed?reason=expired');
    },
  });

  const { mutateAsync: createZaloPayOrder } = useCreateZaloPayOrder();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleCheckoutClick = () => {
    setErrorMsg('');
    if (!paymentMethod) {
      setErrorMsg('Vui lòng chọn phương thức thanh toán.');
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (paymentMethod === 'zalopay') {
      try {
        setIsProcessingPayment(true);
        // Calculate mock total amount or get from store. For sandbox demo, we use 50000.
        const orderData = {
          amount: 50000, 
          description: `Thanh toán vé xem phim ${movie?.title || ''}`,
          app_user: 'CineDotUser',
        };
        const response = await createZaloPayOrder(orderData);
        
        if (response.success && response.order_url) {
          markPendingPayment();
          window.location.href = response.order_url;
        } else {
          setErrorMsg('Lỗi tạo đơn hàng ZaloPay: ' + (response.message || 'Unknown error'));
          setIsConfirmOpen(false);
          setIsProcessingPayment(false);
        }
      } catch (error: any) {
        setErrorMsg('Đã có lỗi xảy ra khi kết nối ZaloPay.');
        setIsConfirmOpen(false);
        setIsProcessingPayment(false);
      }
    } else {
      // Mock for other methods
      markPendingPayment();
      setIsConfirmOpen(false);
      setIsSuccessMessageOpen(true);
    }
  };

  // Render a clean fallback skeleton spinner before client hydration is complete
  if (!hasHydrated || !movie || !cinema || !showtime || seats.length === 0) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F6F6F6',
          color: 'var(--text)',
          fontSize: '16px',
          fontWeight: 500,
        }}
      >
        Đang tải thông tin thanh toán...
      </div>
    );
  }

  return (
    <div
      className="booking-payment-page"
      style={{
        background: '#F6F6F6', // Standard CINE Light mode background
        minHeight: '100vh',
        padding: '120px 0 100px 0',
      }}
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Progress Stepper Visual indicator */}
        <BookingStepper currentStep="payment" />

        {/* 2-Column layout */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
          className="booking-layout-wrap"
        >
          {/* Main Selection Column */}
          <div style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Back Button */}
            <button
              type="button"
              onClick={() => router.replace('/booking/foods')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: 'none',
                color: '#4f3c93',
                fontSize: '14.5px',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '4px 0',
                marginRight: 'auto',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#382b6b'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#4f3c93'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Quay lại chọn bắp nước
            </button>

            {/* Voucher apply panel */}
            <VoucherPanel />

            {/* Payment method selection list */}
            <PaymentMethodSelector />

            {/* Error Message notification block */}
            {errorMsg && (
              <div
                style={{
                  padding: '14px 20px',
                  borderRadius: '14px',
                  background: '#FFF5F5',
                  border: '1px solid #FED7D7',
                  color: '#C53030',
                  fontSize: '14px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errorMsg}
              </div>
            )}
          </div>

          {/* Sticky checkout order summary sidebar */}
          <div style={{ width: '100%', maxWidth: '360px' }} className="price-summary-desktop-wrap">
            <BookingOrderSummary
              continueLabel="Thanh toán"
              onContinue={handleCheckoutClick}
              disabled={isExpired}
            />
          </div>
        </div>
      </div>

      {/* Embedded CSS style overrides for tablet and mobile viewport support */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 991px) {
          .price-summary-desktop-wrap {
            width: 100% !important;
            max-width: 100% !important;
            margin-top: 16px;
          }
          .booking-layout-wrap {
            flex-direction: column !important;
          }
        }
      `}} />

      {/* Ticket Confirmation details preview modal overlay */}
      <TicketConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmPayment}
      />

      {/* SUCCESS/PENDING GATEWAY NOTIFICATION OVERLAY */}
      {isSuccessMessageOpen && (
        <div
          className="modal-overlay open"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(19, 20, 19, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setIsSuccessMessageOpen(false)}
        >
          <div
            className="modal-container"
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '36px 32px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
              textAlign: 'center',
              border: '1px solid var(--border)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#E6FFFA',
                color: '#319795',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#131413', margin: '0 0 12px 0' }}>
              Xác Nhận Đơn Hàng Thành Công
            </h3>

            <div style={{ fontSize: '14.5px', color: 'var(--text2)', lineHeight: 1.5, margin: '0 0 24px 0' }}>
              <div
                style={{
                  background: '#F0EEF9',
                  border: '1px solid #CFC9EB',
                  borderRadius: '12px',
                  padding: '16px',
                  color: '#4f3c93',
                  fontWeight: 600,
                  fontSize: '14.5px',
                  textAlign: 'left',
                }}
              >
                Cổng thanh toán mock sẽ được triển khai ở Micro-task Booking 7.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSuccessMessageOpen(false)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: '#131413',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '14.5px',
                border: 'none',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
