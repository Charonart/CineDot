'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  BookingSummaryHeader, 
  SeatMap, 
  SeatLegend, 
  BookingPriceSummary, 
  MobileBookingBar,
  SeatPriceBreakdown,
  QuickComboPopup,
  BookingStepper
} from '@/modules/booking/components';
import { generateSeatGrid, SeatItem, MOVIE_MOCK_DETAILS } from '@/modules/booking/data/seatMapData';
import { useBookingStore } from '@/modules/booking/store/bookingStore';
import {
  QUICK_COMBO_FEATURED,
  useSeatHoldTimer,
  buildBookingFailedUrl,
  buildMovieDetailUrlFromSession,
} from '@/modules/booking';

function SeatsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Extract show details from URL search params
  const movieParam = searchParams.get('movie') || 'dune-part-two';
  const cinemaParam = searchParams.get('cinema') || 'CINE Landmark - Q1';
  const dateParam = searchParams.get('date') || '2026-06-01';
  const timeParam = searchParams.get('time') || '19:30';

  // Read movie mock details
  const movieMeta = MOVIE_MOCK_DETAILS[movieParam] || MOVIE_MOCK_DETAILS['dune-part-two'];

  // Hydration guard to prevent SSR/client mismatch
  const [hasHydrated, setHasHydrated] = useState(false);
  
  // Zustand store mappings
  const selectedSeats = useBookingStore((state) => state.session.seats);
  const addSeat = useBookingStore((state) => state.addSeat);
  const removeSeat = useBookingStore((state) => state.removeSeat);
  const initializeBooking = useBookingStore((state) => state.initializeBooking);
  
  const quickComboHandled = useBookingStore((state) => state.session.quickComboHandled);
  const startSeatHold = useBookingStore((state) => state.startSeatHold);
  const addOrUpdateCombo = useBookingStore((state) => state.addOrUpdateCombo);

  const { isExpired } = useSeatHoldTimer({
    onExpired: () => {
      router.replace(buildBookingFailedUrl('expired') || '/booking/failed?reason=expired');
    }
  });

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Initialize booking details in useEffect after client-side hydration
  useEffect(() => {
    if (!hasHydrated) return;

    initializeBooking({
      movie: {
        slug: movieParam,
        title: movieMeta.title,
        poster: movieMeta.poster,
        format: 'IMAX 2D',
        duration: `${movieMeta.runtime} phút`,
      },
      cinema: {
        id: cinemaParam.replace(/\s+/g, '-').toLowerCase(),
        name: cinemaParam,
        hall: 'Cinema Hall 4 (IMAX)',
      },
      showtime: {
        date: dateParam,
        time: timeParam,
      }
    });
  }, [hasHydrated, movieParam, cinemaParam, dateParam, timeParam, movieMeta, initializeBooking]);

  // Extract session details to determine safe redirect
  const sessionStatus = useBookingStore((state) => state.session.status);
  const seatHoldExpiresAt = useBookingStore((state) => state.session.seatHoldExpiresAt);

  // Redirect to failed page if session expires
  useEffect(() => {
    if (!hasHydrated) return;
    if (!seatHoldExpiresAt) return;
    if (sessionStatus !== 'expired') return;
    router.replace(buildBookingFailedUrl('expired') || '/booking/failed?reason=expired');
  }, [hasHydrated, sessionStatus, seatHoldExpiresAt, router]);

  // Generate seats grid
  const [seats] = useState<SeatItem[]>(() => generateSeatGrid());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Quick Combo Popup status
  const [isQuickComboOpen, setIsQuickComboOpen] = useState(false);
  
  // Temporary Foods Message Modal status
  const [isFoodsMessageOpen, setIsFoodsMessageOpen] = useState(false);

  // Handle seat selection click
  const handleToggleSeat = (seat: SeatItem) => {
    if (isExpired) return;
    setErrorMessage(null);

    const isAlreadySelected = selectedSeats.some((s) => s.id === seat.id);

    if (isAlreadySelected) {
      // Unselect seat
      removeSeat(seat.id);
    } else {
      // Validate ticket booking limit (maximum 8 seats)
      if (selectedSeats.length >= 8) {
        setErrorMessage('Bạn chỉ được chọn tối đa 8 ghế trong một giao dịch đặt vé.');
        return;
      }

      // Select seat and map properties to SelectedSeat
      addSeat({
        id: seat.id,
        row: seat.row,
        number: String(seat.number),
        label: seat.label,
        type: seat.type,
        price: seat.price,
      });
    }
  };

  const handleCheckoutClick = () => {
    if (isExpired) return;
    if (selectedSeats.length > 0) {
      if (!quickComboHandled) {
        setIsQuickComboOpen(true);
      } else {
        router.push('/booking/foods');
      }
    }
  };

  const handleSkipQuickCombo = () => {
    if (isExpired) return;
    startSeatHold();
    setIsQuickComboOpen(false);
  };

  const handleBuyQuickCombo = () => {
    if (isExpired) return;
    addOrUpdateCombo(QUICK_COMBO_FEATURED, 1);
    startSeatHold();
    setIsQuickComboOpen(false);
    router.push('/booking/foods');
  };

  const handleBackToMovieDetail = () => {
    const session = useBookingStore.getState().session;
    const url = buildMovieDetailUrlFromSession(session) || `/movies/detail/${movieParam}?focus=schedule`;
    router.replace(url);
  };

  // Render a clean skeleton UI loader before hydration is done
  if (!hasHydrated) {
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
          fontWeight: 500
        }}
      >
        Đang tải sơ đồ rạp...
      </div>
    );
  }

  return (
    <div 
      className="booking-seats-page"
      style={{
        background: '#F6F6F6', // CINE Light mode standard background
        minHeight: '100vh',
        padding: '120px 0 100px 0',
      }}
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Booking Stepper */}
        <BookingStepper currentStep="seats" />

        {/* Step Header */}
        <BookingSummaryHeader
          movieTitle={movieMeta.title}
          cinemaName={cinemaParam}
          roomName="Cinema Hall 4 (IMAX)"
          showDate={dateParam}
          showTime={timeParam}
          format="IMAX 2D"
          runtime={movieMeta.runtime}
          onBack={handleBackToMovieDetail}
        />

        {/* Selected seats warnings & alert banners */}
        {errorMessage && (
          <div 
            style={{
              background: '#FFF2F2',
              border: '1px solid #FFA4A4',
              color: '#E53E3E',
              padding: '12px 20px',
              borderRadius: '12px',
              fontSize: '14.5px',
              fontWeight: 600,
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errorMessage}
          </div>
        )}

        <SeatLegend />

        {/* 2-Column Desktop Grid Layout */}
        <div 
          style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
          className="booking-layout-wrap"
        >
          {/* Main Seat Mapping Map column */}
          <div style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <SeatMap
              seats={seats}
              selectedSeats={selectedSeats}
              onToggleSeat={handleToggleSeat}
            />
            
            <SeatPriceBreakdown selectedSeats={selectedSeats} />
          </div>

          {/* Pricing summary details card (Desktop) */}
          <div style={{ width: '100%', maxWidth: '360px' }} className="price-summary-desktop-wrap">
            <BookingPriceSummary
              selectedSeats={selectedSeats}
              onCheckout={handleCheckoutClick}
            />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions summary sheet (Mobile) */}
      <MobileBookingBar
        selectedSeats={selectedSeats}
        onCheckout={handleCheckoutClick}
      />

      {/* Embedded style block to hide desktop pricing cards on tablet viewports */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 991px) {
          .price-summary-desktop-wrap {
            display: none !important;
          }
          .booking-layout-wrap {
            flex-direction: column !important;
          }
        }
      `}} />

      {/* Quick Combo Popup Modal */}
      <QuickComboPopup
        isOpen={isQuickComboOpen}
        combo={QUICK_COMBO_FEATURED}
        onSkip={handleSkipQuickCombo}
        onBuyNow={handleBuyQuickCombo}
        onClose={handleSkipQuickCombo}
      />

      {/* Temporary Foods Message Modal (Correction 6) */}
      {isFoodsMessageOpen && (
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
            opacity: 1,
            pointerEvents: 'all'
          }}
          onClick={() => setIsFoodsMessageOpen(false)}
        >
          <div 
            className="modal-container"
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
              textAlign: 'center',
              border: '1px solid var(--border)',
              transform: 'scale(1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#F0EEF9',
                color: '#4f3c93',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </div>
            
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#131413', margin: '0 0 10px 0' }}>
              Bước tiếp theo: Chọn Combo / Thức ăn
            </h3>
            
            <div style={{ fontSize: '14.5px', color: 'var(--text2)', lineHeight: 1.5, margin: '0 0 24px 0', textAlign: 'left' }}>
              Bạn đã chọn thành công các ghế: <strong>{selectedSeats.map(s => s.label).join(', ')}</strong>.
              <br /><br />
              <div 
                style={{ 
                  background: '#F0EEF9', 
                  border: '1px solid #CFC9EB', 
                  borderRadius: '10px', 
                  padding: '12px 16px', 
                  color: '#4f3c93', 
                  fontWeight: 500,
                  fontSize: '13.5px' 
                }}
              >
                Trang chọn thức ăn sẽ được triển khai ở Micro-task Booking 5.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsFoodsMessageOpen(false)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                background: '#4f3c93',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '14.5px',
                border: 'none',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              Đóng và Quay lại
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function SeatsPage() {
  return (
    <Suspense 
      fallback={
        <div 
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F6F6F6',
            color: 'var(--text)',
            fontSize: '16px',
            fontWeight: 500
          }}
        >
          Đang tải sơ đồ rạp...
        </div>
      }
    >
      <SeatsPageContent />
    </Suspense>
  );
}
