'use client';

import React from 'react';
import { Seat } from '../types/booking.type';
import { useBookingStore } from '../store/bookingStore';

interface MobileBookingBarProps {
  selectedSeats: Seat[];
  totalAmount: number;
  canCheckout: boolean;
  isHoldingSeats: boolean;
  onCheckout: () => void;
}

export const MobileBookingBar: React.FC<MobileBookingBarProps> = ({
  selectedSeats,
  totalAmount,
  canCheckout,
  isHoldingSeats,
  onCheckout,
}) => {
  const comboTotal = useBookingStore((state) => state.session.comboTotal);
  const discountAmount = useBookingStore((state) => state.session.discountAmount);
  const finalTotal = totalAmount + comboTotal - discountAmount;

  const seatLabels = selectedSeats.map((seat) => seat.label).join(', ');
  const isDisabled = !canCheckout || isHoldingSeats;

  return (
    <div
      className="mobile-booking-bar"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border)',
        padding: '16px 20px',
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.08)',
        zIndex: 999,
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 991px) {
          .mobile-booking-bar {
            display: flex !important;
          }
        }
      `}} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '55%' }}>
        <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text3)', fontWeight: 700 }}>
          {selectedSeats.length === 0 ? 'Chọn ghế để tiếp tục' : `${selectedSeats.length} vé đã chọn`}
        </span>
        <strong
          style={{
            fontSize: '15px',
            color: '#4f3c93',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {selectedSeats.length === 0 ? 'Chưa có ghế' : seatLabels}
        </strong>
        <span style={{ fontSize: '16px', color: '#131413', fontWeight: 800, marginTop: '2px' }}>
          {finalTotal.toLocaleString('vi-VN')} đ
        </span>
      </div>

      <button
        type="button"
        disabled={isDisabled}
        onClick={onCheckout}
        style={{
          flex: 1,
          maxWidth: '180px',
          padding: '14px 20px',
          borderRadius: '10px',
          background: isDisabled ? 'var(--bg2)' : '#4f3c93',
          borderColor: isDisabled ? 'var(--border)' : '#4f3c93',
          color: isDisabled ? 'var(--text3)' : '#ffffff',
          fontWeight: 700,
          fontSize: '14px',
          borderWidth: '1px',
          borderStyle: 'solid',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          transition: 'var(--transition)',
          textAlign: 'center',
        }}
      >
        {isHoldingSeats ? 'Đang giữ...' : `Tiếp tục (${selectedSeats.length})`}
      </button>
    </div>
  );
};
