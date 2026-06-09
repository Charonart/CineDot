'use client';

import React, { useState, useEffect } from 'react';
import { useBookingStore } from '../store/bookingStore';
import { PAYMENT_METHODS } from '../data/paymentMethods';

interface TicketConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const TicketConfirmModal: React.FC<TicketConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const session = useBookingStore((state) => state.session);
  const [isChecked, setIsChecked] = useState(false);

  // Close modal on escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset checked state when opening/closing
  useEffect(() => {
    if (isOpen) {
      setIsChecked(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const {
    movie,
    cinema,
    showtime,
    seats,
    combos,
    discountAmount,
    finalTotal,
    paymentMethod,
  } = session;

  const seatLabels = seats.map((s) => s.label).join(', ');
  const paymentMethodLabel =
    PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label || paymentMethod || '';

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
      onClick={onClose}
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
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              fontWeight: 500,
              color: 'var(--text3)',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '4px',
            }}
          >
            &times;
          </button>
        </div>

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

        {/* Checkbox agreement */}
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            cursor: 'pointer',
            padding: '12px 14px',
            background: 'var(--bg)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            marginBottom: '24px',
            userSelect: 'none',
          }}
        >
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            style={{
              marginTop: '3px',
              width: '16px',
              height: '16px',
              accentColor: '#4f3c93',
              cursor: 'pointer',
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
            onClick={onClose}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '12px',
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text2)',
              fontWeight: 700,
              fontSize: '14.5px',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Quay lại
          </button>
          <button
            type="button"
            disabled={!isChecked}
            onClick={onConfirm}
            style={{
              flex: 2,
              padding: '14px',
              borderRadius: '12px',
              background: isChecked ? '#4f3c93' : 'var(--bg2)',
              color: isChecked ? '#ffffff' : 'var(--text3)',
              fontWeight: 700,
              fontSize: '14.5px',
              border: 'none',
              cursor: isChecked ? 'pointer' : 'not-allowed',
              transition: 'opacity 0.2s ease',
              boxShadow: isChecked ? '0 4px 15px rgba(79, 60, 147, 0.2)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (isChecked) e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              if (isChecked) e.currentTarget.style.opacity = '1';
            }}
          >
            Xác nhận thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};
