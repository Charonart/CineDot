'use client';

import React from 'react';
import {
  BookingPriceSummary,
  BookingSummaryHeader,
  MobileBookingBar,
  SeatLegend,
  SeatMap,
  SeatPriceBreakdown,
} from '@/modules/booking/components';
import { useSeatSelection } from '../hooks/useSeatSelection';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/modules/auth';
import { appRoutes } from '@/shared/routes/appRoutes';

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

  const handleCheckout = () => {
    if (!isAuthenticated) {
      const currentPath = window.location.pathname;
      router.push(appRoutes.login(currentPath));
      return;
    }
    handleCreateHold();
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
