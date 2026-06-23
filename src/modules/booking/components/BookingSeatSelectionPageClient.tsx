'use client';

import React from 'react';
import {
  BookingPriceSummary,
  BookingStepper,
  BookingSummaryHeader,
  MobileBookingBar,
  SeatLegend,
  SeatMap,
  SeatPriceBreakdown,
} from '@/modules/booking/components';
import { useSeatSelection } from '../hooks/useSeatSelection';
import { useBookingStore } from '../store/bookingStore';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/modules/auth';
import { appRoutes } from '@/shared/routes/appRoutes';
import { buildCancelBookingUrl, buildFoodsUrl } from '../utils/bookingNavigation';

interface BookingSeatSelectionPageClientProps {
  showtimeId: string;
}

const AlertBanner = ({ message }: { message: string }) => (
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
      gap: '10px',
    }}
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
    {message}
  </div>
);

const LoadingState = () => (
  <div
    style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F6F6F6',
      color: 'var(--text)',
      fontSize: '16px',
      fontWeight: 500,
    }}
  >
    Đang tải sơ đồ rạp...
  </div>
);

export const BookingSeatSelectionPageClient: React.FC<BookingSeatSelectionPageClientProps> = ({ showtimeId }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const resetBooking = useBookingStore((state) => state.resetBooking);
  const initializeBooking = useBookingStore((state) => state.initializeBooking);
  const initOrClearIfChanged = useBookingStore((state) => state.initOrClearIfChanged);
  const setSeats = useBookingStore((state) => state.setSeats);
  const startSeatHold = useBookingStore((state) => state.startSeatHold);
  
  const movieSlug = useBookingStore((state) => state.session.movie?.slug ?? null);

  const {
    showtime,
    seatMap,
    selectedSeats,
    totalAmount,
    canCheckout,
    hold,
    timeLeftSeconds,
    errorMessage,
    isLoading,
    isError,
    isHoldingSeats,
    isOpenForSale,
    toggleSeat,
    handleCreateHold,
  } = useSeatSelection(showtimeId);

  // Clear if showtimeId changed
  React.useEffect(() => {
    if (showtimeId) {
      initOrClearIfChanged(showtimeId);
    }
  }, [showtimeId, initOrClearIfChanged]);

  // Initialize booking session when showtime data loads
  React.useEffect(() => {
    if (showtime && showtimeId) {
      initializeBooking({
        movie: {
          slug: showtime.movie.slug,
          title: showtime.movie.title,
          poster: showtime.movie.posterUrl,
          format: showtime.room.screenType,
          duration: showtime.movie.runtime.toString(),
        },
        cinema: {
          id: showtime.cinema.id,
          name: showtime.cinema.name,
          hall: showtime.room.name,
        },
        showtime: {
          date: showtime.showDate,
          time: showtime.showTime,
        },
        showtimeId,
      });
    }
  }, [showtime, showtimeId, initializeBooking]);

  // Sync seats and navigate to foods step on successful seat hold
  React.useEffect(() => {
    if (hold && selectedSeats.length > 0) {
      const mappedSeats = selectedSeats.map((s) => ({
        id: s.id,
        row: s.row,
        number: s.number.toString(),
        label: s.label,
        type: s.type,
        price: s.price,
      }));
      setSeats(mappedSeats);
      startSeatHold();
      router.replace(buildFoodsUrl());
    }
  }, [hold, selectedSeats, setSeats, startSeatHold, router]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      const currentPath = window.location.pathname + window.location.search;
      router.push(appRoutes.login(currentPath));
      return;
    }
    handleCreateHold();
  };

  /**
   * Cancel booking: destroy the Zustand session and navigate away.
   * From the seats page, going "back" means full funnel exit.
   * router.replace is used to prevent a history loop.
   */
  const handleCancelBooking = () => {
    resetBooking();
    router.replace(buildCancelBookingUrl(movieSlug));
  };

  if (!showtimeId) {
    return (
      <main className="booking-seats-page" style={{ background: '#F6F6F6', minHeight: '100vh', padding: '120px 20px 100px 20px' }}>
        <AlertBanner message="Suất chiếu không hợp lệ." />
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="booking-seats-page" style={{ background: '#F6F6F6', minHeight: '100vh', padding: '120px 0 100px 0' }}>
        <LoadingState />
      </main>
    );
  }

  if (isError || !showtime || !seatMap) {
    return (
      <main className="booking-seats-page" style={{ background: '#F6F6F6', minHeight: '100vh', padding: '120px 20px 100px 20px' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <AlertBanner message="Không thể tải thông tin đặt ghế. Vui lòng thử lại sau." />
        </div>
      </main>
    );
  }

  const hasSeats = seatMap.seats.length > 0;
  const hasAvailableSeats = seatMap.seats.some((seat) => seat.status === 'available');

  return (
    <main
      className="booking-seats-page"
      style={{
        background: '#F6F6F6',
        minHeight: '100vh',
        padding: '120px 0 120px 0',
      }}
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>

        {/* Progress Stepper — bypass mode: "Suất chiếu" step is permanently locked */}
        <BookingStepper currentStep="seats" entryMode="bypass" />

        <BookingSummaryHeader showtime={showtime} />

        {!isOpenForSale && (
          <AlertBanner message="Suất chiếu này chưa mở bán, đã đóng hoặc đã bị hủy." />
        )}

        {errorMessage && <AlertBanner message={errorMessage} />}

        {hold && (
          <div
            style={{
              background: '#F0EEF9',
              border: '1px solid #CFC9EB',
              color: '#4f3c93',
              padding: '12px 20px',
              borderRadius: '12px',
              fontSize: '14.5px',
              fontWeight: 600,
              marginBottom: '24px',
            }}
          >
            Ghế đã được giữ tạm thời. Mã giữ ghế: {hold.holdId}
          </div>
        )}

        {!hasSeats && <AlertBanner message="Sơ đồ ghế hiện chưa có dữ liệu." />}
        {hasSeats && !hasAvailableSeats && <AlertBanner message="Suất chiếu này hiện không còn ghế khả dụng." />}

        {/* Cancel booking — prominently placed but secondary (text-link style) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <button
            type="button"
            onClick={handleCancelBooking}
            aria-label="Hủy đặt vé và quay lại trang phim"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: '1px solid #FFA4A4',
              color: '#E53E3E',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '6px 14px',
              borderRadius: '8px',
              transition: 'background 0.18s ease, color 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FFF2F2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Hủy đặt vé
          </button>
        </div>

        <SeatLegend />

        {hasSeats && (
          <div
            style={{
              display: 'flex',
              gap: '32px',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
            }}
            className="booking-layout-wrap"
          >
            <div style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <SeatMap
                seatMap={seatMap}
                selectedSeats={selectedSeats}
                onToggleSeat={toggleSeat}
              />

              <SeatPriceBreakdown pricing={seatMap.pricing} selectedSeats={selectedSeats} />
            </div>

            <div style={{ width: '100%', maxWidth: '360px' }} className="price-summary-desktop-wrap">
              <BookingPriceSummary
                selectedSeats={selectedSeats}
                totalAmount={totalAmount}
                canCheckout={canCheckout}
                isHoldingSeats={isHoldingSeats}
                timeLeftSeconds={timeLeftSeconds}
                onCheckout={handleCheckout}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}
      </div>

      <MobileBookingBar
        selectedSeats={selectedSeats}
        totalAmount={totalAmount}
        canCheckout={canCheckout}
        isHoldingSeats={isHoldingSeats}
        onCheckout={handleCheckout}
        onCheckout={handleCheckout}
      />

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 1024px) {
          .price-summary-desktop-wrap {
            display: none !important;
          }
          .booking-layout-wrap {
            flex-direction: column !important;
          }
        }
      `}} />
    </main>
  );
};
