'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useBookingStore } from '../store/bookingStore';
import { useSeatHoldTimer } from '../hooks/useSeatHoldTimer';
import { bookingApi } from '../api/booking.api';
import { PAYMENT_METHODS } from '../data/paymentMethods';

interface TicketConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TicketConfirmModal: React.FC<TicketConfirmModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // ─── Store selectors ────────────────────────────────────────────────────────
  const session = useBookingStore((state) => state.session);
  const resetBooking = useBookingStore((state) => state.resetBooking);
  const markPendingPayment = useBookingStore((state) => state.markPendingPayment);
  const markPaid = useBookingStore((state) => state.markPaid);
  const markFailed = useBookingStore((state) => state.markFailed);

  // ─── Local UI state ─────────────────────────────────────────────────────────
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ─── Timer ──────────────────────────────────────────────────────────────────
  const { isExpired } = useSeatHoldTimer();

  // Đóng modal khi nhấn Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  // Reset local state mỗi lần mở lại modal
  useEffect(() => {
    if (isOpen) {
      setIsChecked(false);
      setErrorMsg(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const {
    movie,
    cinema,
    showtime,
    showtimeId,
    seats,
    combos,
    discountAmount,
    finalTotal,
    paymentMethod,
    voucherCode,
  } = session;

  const seatLabels = seats.map((s) => s.label).join(', ');
  const paymentMethodLabel =
    PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label || paymentMethod || '';

 // ─── LUỒNG THANH TOÁN CHÍNH ────────────────
  const handleConfirmPayment = async () => {
    // Bước 1: Validate session.bookingId và các điều kiện cơ bản
    if (isSubmitting) return;
    
    if (!session.bookingId) {
      setErrorMsg('Dữ liệu đơn hàng không tồn tại. Vui lòng thử lại từ đầu.');
      return;
    }
    if (!paymentMethod) {
      setErrorMsg('Vui lòng chọn phương thức thanh toán.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      // Bước 2: Gọi API processPayment
      await bookingApi.processPayment({
        booking_id: session.bookingId,
        payment_method: paymentMethod,
      });
      markPaid();
      // Bước 3: Invalidate cache lịch sử vé
      queryClient.invalidateQueries({ queryKey: ['ticket-history'] });
      // Bước 4: Chuyển trang về trang chủ TRƯỚC
      router.replace('/');
      // Bước 5: Gọi resetBooking trong setTimeout để state dọn dẹp sau khi route đã đổi, 
      // tránh làm showtimeId bị null quá sớm gây lỗi văng về trang /movies
      setTimeout(() => {
        resetBooking();
      }, 500);
    } catch (err: any) {
      // Bước 6: Xử lý lỗi
      markFailed();
      const message = err?.response?.data?.message || err?.message || 'Đã xảy ra lỗi trong quá trình xử lý thanh toán.';
      setErrorMsg(message);
    } finally {
      // Cuối cùng tắt trạng thái isSubmitting
      setIsSubmitting(false);
    }
  };

  // ─── RENDER ─────────────────────────────────────────────────────────────────
  const canSubmit = isChecked && !isSubmitting && !isExpired;

  return (
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
      onClick={() => !isSubmitting && onClose()}
    >
      <div
        className="modal-container"
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '32px',
          maxWidth: '520px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          border: '1px solid var(--border)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 20px 0' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#131413', margin: 0 }}>
            Thông Tin Đặt Vé
          </h3>
          <button
            type="button"
            onClick={() => !isSubmitting && onClose()}
            disabled={isSubmitting}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              fontWeight: 500,
              color: 'var(--text3)',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              lineHeight: 1,
              padding: '4px',
            }}
          >
            &times;
          </button>
        </div>

        {/* Cảnh báo hết hạn */}
        {isExpired && (
          <div
            style={{
              background: '#FFF5F5',
              border: '1px solid #FED7D7',
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '16px',
              fontSize: '13.5px',
              color: '#C53030',
              fontWeight: 600,
            }}
          >
            ⏰ Phiên giữ ghế đã hết hạn. Vui lòng quay lại chọn ghế mới.
          </div>
        )}

        {/* Info Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
          {movie && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <span style={{ fontSize: '13.5px', color: 'var(--text2)', fontWeight: 600 }}>Phim:</span>
              <div style={{ textAlign: 'right' }}>
                <strong style={{ fontSize: '14.5px', color: '#131413', display: 'block' }}>{movie.title}</strong>
                <span style={{ fontSize: '12.5px', color: '#4f3c93', fontWeight: 700 }}>{movie.format}</span>
              </div>
            </div>
          )}

          {cinema && showtime && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                <span style={{ fontSize: '13.5px', color: 'var(--text2)', fontWeight: 600 }}>Rạp / Phòng:</span>
                <span style={{ fontSize: '14px', color: '#131413', fontWeight: 500 }}>
                  {cinema.name} - {cinema.hall}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                <span style={{ fontSize: '13.5px', color: 'var(--text2)', fontWeight: 600 }}>Suất chiếu:</span>
                <strong style={{ fontSize: '14px', color: '#131413' }}>
                  {showtime.time} | {showtime.date}
                </strong>
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
            <span style={{ fontSize: '13.5px', color: 'var(--text2)', fontWeight: 600 }}>Ghế đã chọn:</span>
            <strong style={{ fontSize: '14.5px', color: '#4f3c93' }}>{seatLabels}</strong>
          </div>

          {combos.length > 0 && (
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <span style={{ fontSize: '13.5px', color: 'var(--text2)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Combo bắp nước:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '12px' }}>
                {combos.map((combo) => (
                  <div key={combo.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text)' }}>
                    <span>{combo.name} x{combo.quantity}</span>
                    <span>{(combo.price * combo.quantity).toLocaleString('vi-VN')} đ</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <span style={{ fontSize: '13.5px', color: 'var(--text2)', fontWeight: 600 }}>Giảm giá voucher:</span>
              <span style={{ fontSize: '14px', color: '#E53E3E', fontWeight: 600 }}>
                -{discountAmount.toLocaleString('vi-VN')} đ
              </span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
            <span style={{ fontSize: '13.5px', color: 'var(--text2)', fontWeight: 600 }}>Phương thức thanh toán:</span>
            <span style={{ fontSize: '14px', color: '#131413', fontWeight: 600 }}>{paymentMethodLabel}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px' }}>
            <span style={{ fontSize: '15px', color: 'var(--text)', fontWeight: 700 }}>Tổng tiền cần thanh toán:</span>
            <strong style={{ fontSize: '20px', color: '#131413', fontWeight: 800 }}>
              {finalTotal.toLocaleString('vi-VN')} đ
            </strong>
          </div>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div
            style={{
              background: '#FFF5F5',
              border: '1px solid #FEB2B2',
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '16px',
              fontSize: '13.5px',
              color: '#C53030',
              fontWeight: 500,
            }}
          >
            ❌ {errorMsg}
          </div>
        )}

        {/* Checkbox agreement */}
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            padding: '12px 14px',
            background: 'var(--bg)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            marginBottom: '24px',
            userSelect: 'none',
            opacity: isSubmitting ? 0.6 : 1,
          }}
        >
          <input
            type="checkbox"
            id="confirm-booking-agreement"
            checked={isChecked}
            onChange={(e) => !isSubmitting && setIsChecked(e.target.checked)}
            disabled={isSubmitting}
            style={{
              marginTop: '3px',
              width: '16px',
              height: '16px',
              accentColor: '#4f3c93',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          />
          <span style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.4 }}>
            Tôi xác nhận thông tin đặt vé đã chính xác và đồng ý với điều khoản dịch vụ.
          </span>
        </label>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={() => !isSubmitting && onClose()}
            disabled={isSubmitting}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '12px',
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text2)',
              fontWeight: 700,
              fontSize: '14.5px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s ease',
              opacity: isSubmitting ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) e.currentTarget.style.background = 'var(--bg2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Quay lại
          </button>

          <button
            type="button"
            id="confirm-payment-btn"
            disabled={!canSubmit}
            onClick={handleConfirmPayment}
            style={{
              flex: 2,
              padding: '14px',
              borderRadius: '12px',
              background: canSubmit ? '#4f3c93' : 'var(--bg2)',
              color: canSubmit ? '#ffffff' : 'var(--text3)',
              fontWeight: 700,
              fontSize: '14.5px',
              border: 'none',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              transition: 'opacity 0.2s ease',
              boxShadow: canSubmit ? '0 4px 15px rgba(79, 60, 147, 0.2)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              if (canSubmit) e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              if (canSubmit) e.currentTarget.style.opacity = '1';
            }}
          >
            {isSubmitting ? (
              <>
                {/* Spinner inline */}
                <span
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.7s linear infinite',
                  }}
                />
                Đang xử lý...
              </>
            ) : (
              'Xác nhận thanh toán'
            )}
          </button>
        </div>
      </div>

      {/* Keyframe cho spinner */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
