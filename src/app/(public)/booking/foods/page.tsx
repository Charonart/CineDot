'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingStore } from '@/modules/booking/store/bookingStore';
import { useSeatHoldTimer } from '@/modules/booking/hooks/useSeatHoldTimer';
import { COMBO_ITEMS } from '@/modules/booking/data/comboData';
import {
  BookingStepper,
  FoodComboList,
  BookingOrderSummary,
} from '@/modules/booking/components';
import {
  buildBookingFailedUrl,
  buildSeatsUrlFromSession,
} from '@/modules/booking';

export default function BookingFoodsPage() {
  const router = useRouter();
  const [hasHydrated, setHasHydrated] = useState(false);

  const session = useBookingStore((state) => state.session);
  const { movie, cinema, showtime, seats, quickComboHandled, seatHoldExpiresAt, status } = session;
  
  const setCurrentStep = useBookingStore((state) => state.setCurrentStep);

  // Set hydration complete flag
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Set step state on load
  useEffect(() => {
    if (hasHydrated) {
      setCurrentStep('foods');
    }
  }, [hasHydrated, setCurrentStep]);

  // Access guards to prevent invalid booking actions or stale statuses
  useEffect(() => {
    if (!hasHydrated) return;

    // Direct redirect if expired
    if (status === 'expired') {
      router.replace(buildBookingFailedUrl('expired') || '/booking/failed?reason=expired');
      return;
    }

    // Direct redirect if missing mandatory session details
    if (
      !movie ||
      !cinema ||
      !showtime ||
      seats.length === 0 ||
      !quickComboHandled ||
      !seatHoldExpiresAt
    ) {
      router.replace('/movies');
    }
  }, [hasHydrated, movie, cinema, showtime, seats, quickComboHandled, seatHoldExpiresAt, status, router]);

  // Expiry check redirection using hook
  const { isExpired } = useSeatHoldTimer({
    onExpired: () => {
      router.replace(buildBookingFailedUrl('expired') || '/booking/failed?reason=expired');
    },
  });

  const handleBackToSeats = () => {
    const seatsUrl = buildSeatsUrlFromSession(session);
    if (seatsUrl) {
      router.replace(seatsUrl);
    } else {
      router.replace('/movies');
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
        Đang tải thông tin đơn hàng...
      </div>
    );
  }

  return (
    <div
      className="booking-foods-page"
      style={{
        background: '#F6F6F6', // Standard CINE Light mode background
        minHeight: '100vh',
        padding: '120px 0 100px 0',
      }}
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Progress Stepper Visual indicator */}
        <BookingStepper currentStep="foods" />

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
          {/* Concession Food Combos Column */}
          <div style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Back Button */}
            <button
              type="button"
              onClick={handleBackToSeats}
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
              Quay lại chọn ghế
            </button>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
              }}
            >
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#131413', margin: '0 0 6px 0' }}>
                Chọn Thức Ăn
              </h2>
              <p style={{ fontSize: '14.5px', color: 'var(--text2)', margin: 0 }}>
                Thêm combo bắp nước để trải nghiệm xem phim của bạn thêm phần trọn vẹn và hoàn hảo.
              </p>
            </div>

            {/* List of food item options */}
            <FoodComboList combos={COMBO_ITEMS} />
          </div>

          {/* Checkout Order Summary Card Column */}
          <div style={{ width: '100%', maxWidth: '360px' }} className="price-summary-desktop-wrap">
            <BookingOrderSummary
              continueLabel="Tiếp tục"
              onContinue={() => {
                if (!isExpired) {
                  router.push('/booking/payment');
                }
              }}
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
    </div>
  );
}
