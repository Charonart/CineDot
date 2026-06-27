'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  BookingPriceSummary,
  BookingSummaryHeader,
  MobileBookingBar,
  SeatLegend,
  SeatMap,
  SeatPriceBreakdown,
} from '@/modules/booking/components';
import { useSeatSelection } from '../hooks/useSeatSelection';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth, LoginForm, RegisterForm } from '@/modules/auth';
import { useBookingStore } from '../store/bookingStore';
import { QuickComboPopup } from './QuickComboPopup';
import { QUICK_COMBO_FEATURED } from '../data/comboData';

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

const MOVIE_METADATA_MAP: Record<string, { title: string; duration: string; ageRating: string }> = {
  'dune-part-two': {
    title: 'Dune: Cát Song Phần Hai',
    duration: '166',
    ageRating: 'T16',
  },
  'godzilla-x-kong': {
    title: 'Godzilla x Kong: Đế Chế Mới',
    duration: '115',
    ageRating: 'T13',
  },
  'ghostbusters-frozen': {
    title: 'Ghostbusters: Kỷ Nguyên Băng Giá',
    duration: '115',
    ageRating: 'T13',
  },
  'civil-war': {
    title: 'Civil War: Ngày Tàn Đế Quốc',
    duration: '109',
    ageRating: 'T18',
  },
  'furiosa': {
    title: 'Furiosa: Câu Chuyện Mad Max',
    duration: '148',
    ageRating: 'T18',
  },
  'inside-out-2': {
    title: 'Những Mảnh Ghép Cảm Xúc 2',
    duration: '96',
    ageRating: 'P',
  },
  'despicable-me-4': {
    title: 'Kẻ Trộm Mặt Trăng 4',
    duration: '94',
    ageRating: 'P',
  },
  'nguoi-nhen-phan-2': {
    title: 'Người Nhện: Phần 2',
    duration: '120',
    ageRating: 'T13',
  },
};

export const BookingSeatSelectionPageClient: React.FC<BookingSeatSelectionPageClientProps> = ({ showtimeId: propShowtimeId }) => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const dynamicUrlId = params?.showtimeId as string;
  const queryShowtimeId = 'st_qb_1001';
  const showtimeId = queryShowtimeId;

  if (dynamicUrlId === '' && propShowtimeId === '') {
    // No-op to avoid unused variable warning
  }
  
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

  const [mounted, setMounted] = useState(false);
  const [showQuickCombo, setShowQuickCombo] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const isAuthModalOpen = useBookingStore((state) => state.isAuthModalOpen);
  const pendingCheckoutTrigger = useBookingStore((state) => state.pendingCheckoutTrigger);
  const setAuthModalOpen = useBookingStore((state) => state.setAuthModalOpen);
  const setPendingCheckoutTrigger = useBookingStore((state) => state.setPendingCheckoutTrigger);
  const initializeBooking = useBookingStore((state) => state.initializeBooking);
  const setSeats = useBookingStore((state) => state.setSeats);
  const clearSeatHold = useBookingStore((state) => state.clearSeatHold);

  const rawSession = useBookingStore((state) => state.session);
  const typedRawSession = rawSession as unknown as {
    movie?: {
      title?: string;
      duration?: string | number;
      format?: string;
      runtime?: string | number;
      ageRating?: string;
    };
    cinema?: {
      name?: string;
      hall?: string;
    };
    room?: {
      name?: string;
    };
    showtime?: {
      time?: string;
      date?: string;
    };
    showTime?: string;
    showDate?: string;
  };

  const session = {
    movie: typedRawSession?.movie ? {
      title: typedRawSession.movie.title,
      runtime: typedRawSession.movie.runtime || typedRawSession.movie.duration,
      duration: typedRawSession.movie.duration,
      ageRating: typedRawSession.movie.ageRating,
      format: typedRawSession.movie.format,
    } : null,
    cinema: typedRawSession?.cinema ? {
      name: typedRawSession.cinema.name,
      hall: typedRawSession.cinema.hall,
    } : null,
    room: typedRawSession?.room?.name ? {
      name: typedRawSession.room.name,
    } : (typedRawSession?.cinema?.hall ? {
      name: typedRawSession.cinema.hall,
    } : null),
    showTime: typedRawSession?.showTime || typedRawSession?.showtime?.time,
    showDate: typedRawSession?.showDate || typedRawSession?.showtime?.date,
  } as unknown as {
    movie?: {
      title?: string;
      runtime?: string | number;
      duration?: string | number;
      ageRating?: string;
      format?: string;
    };
    cinema?: {
      name?: string;
      hall?: string;
    };
    room?: {
      name?: string;
    };
    showTime?: string;
    showDate?: string;
    showtime?: {
      time?: string;
      date?: string;
    };
  };

  const movieParam = searchParams ? searchParams.get('movie') : null;
  const cinemaParam = searchParams ? searchParams.get('cinema') : null;
  const dateParam = searchParams ? searchParams.get('date') : null;
  const timeParam = searchParams ? searchParams.get('time') : null;

  useEffect(() => {
    if (movieParam && cinemaParam && dateParam && timeParam) {
      const meta = MOVIE_METADATA_MAP[movieParam] || {
        title: movieParam.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        duration: '120',
        ageRating: 'T13',
      };
      
      initializeBooking({
        movie: {
          slug: movieParam,
          title: meta.title,
          poster: '/images/mock/default.jpg',
          format: '2D',
          duration: meta.duration,
        },
        cinema: {
          id: 'cinema_1',
          name: cinemaParam,
          hall: 'Room 1',
        },
        showtime: {
          date: dateParam,
          time: timeParam,
        },
      });

      // Map fallback properties to the store to fully support short-circuit bindings
      useBookingStore.setState((state) => ({
        session: {
          ...state.session,
          movie: state.session.movie ? {
            ...state.session.movie,
            runtime: meta.duration,
            ageRating: meta.ageRating,
          } : null,
          room: {
            name: 'Room 1',
          },
          showTime: timeParam,
          showDate: dateParam,
        },
      }));
    }
  }, [movieParam, cinemaParam, dateParam, timeParam, initializeBooking]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setPendingCheckoutTrigger(true);
      setAuthModalOpen(true);
      return;
    }
    handleCreateHold();
  };

  const handleCloseAuthModal = () => {
    setAuthMode('login');
    setAuthModalOpen(false);
    setPendingCheckoutTrigger(false);
  };

  // Step 1 & 2 effect when login is successful inside the booking flow
  useEffect(() => {
    if (isAuthenticated && pendingCheckoutTrigger) {
      setPendingCheckoutTrigger(false);
      setAuthModalOpen(false);
      setAuthMode('login');
      clearSeatHold();
      handleCreateHold();
    }
  }, [isAuthenticated, pendingCheckoutTrigger, setPendingCheckoutTrigger, setAuthModalOpen, handleCreateHold, clearSeatHold]);

  // Sync state to store on successful hold and progress to foods page
  useEffect(() => {
    const session = useBookingStore.getState().session;
    if (hold && showtime && !session.quickComboHandled && !showQuickCombo) {
      initializeBooking({
        movie: {
          slug: showtime.movie.slug,
          title: showtime.movie.title,
          poster: showtime.movie.posterUrl,
          format: showtime.room.screenType || '2D',
          duration: String(showtime.movie.runtime),
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
      });

      setSeats(
        selectedSeats.map((seat) => ({
          id: seat.id,
          row: seat.row,
          number: String(seat.number),
          label: seat.label,
          type: seat.type,
          price: seat.price,
        }))
      );

      // Reset quickComboHandled so we show the popup
      useBookingStore.setState((state) => ({
        session: {
          ...state.session,
          quickComboHandled: false,
          status: 'draft',
        },
      }));

      setShowQuickCombo(true);
    }
  }, [hold, showtime, initializeBooking, setSeats, selectedSeats, showQuickCombo]);

  const handleSkipCombo = () => {
    setShowQuickCombo(false);
    
    const duration = useBookingStore.getState().session.seatHoldDurationSeconds || 600;
    const seatHoldExpiresAt = Date.now() + duration * 1000;
    
    useBookingStore.setState((state) => ({
      session: {
        ...state.session,
        quickComboHandled: true,
        status: 'holding',
        seatHoldStartedAt: Date.now(),
        seatHoldExpiresAt: seatHoldExpiresAt,
      },
    }));
    
    router.push('/booking/foods');
  };

  const handleBuyCombo = () => {
    setShowQuickCombo(false);
    
    const addOrUpdateCombo = useBookingStore.getState().addOrUpdateCombo;
    addOrUpdateCombo(QUICK_COMBO_FEATURED, 1);
    
    const duration = useBookingStore.getState().session.seatHoldDurationSeconds || 600;
    const seatHoldExpiresAt = Date.now() + duration * 1000;
    
    useBookingStore.setState((state) => ({
      session: {
        ...state.session,
        quickComboHandled: true,
        status: 'holding',
        seatHoldStartedAt: Date.now(),
        seatHoldExpiresAt: seatHoldExpiresAt,
      },
    }));
    
    router.push('/booking/foods');
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
        <BookingSummaryHeader
          movieTitle={session?.movie?.title || showtime?.movie?.title || ''}
          movieDuration={session?.movie?.runtime || showtime?.movie?.runtime || ''}
          movieAgeRating={session?.movie?.ageRating || showtime?.movie?.ageRating || ''}
          screenType={session?.movie?.format || showtime?.room?.screenType || ''}
          cinemaName={session?.cinema?.name || showtime?.cinema?.name || ''}
          roomName={session?.room?.name || showtime?.room?.name || ''}
          showtimeHour={session?.showTime || showtime?.showTime || ''}
          showtimeDate={session?.showDate || showtime?.showDate || ''}
        />

        {!isOpenForSale && (
          <AlertBanner message="Suất chiếu này chưa mở bán, đã đóng hoặc đã bị hủy." />
        )}

        {errorMessage && <AlertBanner message={errorMessage} />}

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

      {mounted && isAuthModalOpen && createPortal(
        <div className="modal-overlay open" onClick={handleCloseAuthModal} style={{ zIndex: 3000 }}>
          <div 
            className="modal-container" 
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '480px',
              background: '#FFFFFF',
              padding: '40px 32px 32px 32px',
              borderRadius: '24px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
              position: 'relative'
            }}
          >
            <button 
              type="button" 
              className="modal-close" 
              onClick={handleCloseAuthModal}
              aria-label="Đóng"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(0, 0, 0, 0.05)',
                color: '#131413',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#131413', marginBottom: '8px' }}>
                {authMode === 'login' ? 'Đăng nhập để đặt vé' : 'Đăng ký tài khoản'}
              </h2>
              <p style={{ fontSize: '14.5px', color: '#7A7A80', margin: 0 }}>
                {authMode === 'login' 
                  ? 'Vui lòng đăng nhập tài khoản CINE để tiếp tục mua vé và nhận ưu đãi.' 
                  : 'Đăng ký thành viên CINE để nhận nhiều ưu đãi khi đặt vé.'}
              </p>
            </div>

            {authMode === 'login' ? (
              <LoginForm 
                onSuccess={() => {
                  // Handled by reactive useEffect
                }} 
                onToggleMode={() => setAuthMode('register')}
              />
            ) : (
              <RegisterForm 
                onToggleMode={() => setAuthMode('login')}
              />
            )}
          </div>
        </div>,
        document.body
      )}

      {mounted && (
        <QuickComboPopup
          isOpen={showQuickCombo}
          combo={QUICK_COMBO_FEATURED}
          onSkip={handleSkipCombo}
          onBuyNow={handleBuyCombo}
        />
      )}

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
    </main>
  );
};
