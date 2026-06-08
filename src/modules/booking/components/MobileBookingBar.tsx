'use client';

import React from 'react';
import { SelectedSeat } from '../types';
import { useBookingStore } from '../store/bookingStore';
import { useSeatHoldTimer } from '../hooks/useSeatHoldTimer';

interface MobileBookingBarProps {
  selectedSeats: SelectedSeat[];
  onCheckout: () => void;
}

export const MobileBookingBar: React.FC<MobileBookingBarProps> = ({
  selectedSeats,
  onCheckout,
}) => {
  const { isExpired } = useSeatHoldTimer();
  const finalTotal = useBookingStore((state) => state.session.finalTotal);
  const seatLabels = selectedSeats.map((s) => s.label).join(', ');

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
        display: 'none', // Controlled via media query style injection below
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}
    >
      {/* Media query styling block embedded directly for simplicity & robustness */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 991px) {
          .mobile-booking-bar {
            display: flex !important;
          }
        }
      `}} />

      {/* Seat details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '55%' }}>
        <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text3)', fontWeight: 700 }}>
          {selectedSeats.length === 0 ? 'Chọn ghế để tiếp tục' : `${selectedSeats.length} Vé đã chọn`}
        </span>
        <strong 
          style={{ 
            fontSize: '15px', 
            color: '#4f3c93', 
            fontWeight: 700,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {selectedSeats.length === 0 ? 'Chưa có ghế' : seatLabels}
        </strong>
        <span style={{ fontSize: '16px', color: '#131413', fontWeight: 800, marginTop: '2px' }}>
          {finalTotal.toLocaleString('vi-VN')} đ
        </span>
      </div>

      {/* Action CTA */}
      <button
        type="button"
        disabled={selectedSeats.length === 0 || isExpired}
        onClick={onCheckout}
        style={{
          flex: 1,
          maxWidth: '180px',
          padding: '14px 20px',
          borderRadius: '10px',
          background: (selectedSeats.length === 0 || isExpired) ? 'var(--bg2)' : '#4f3c93',
          borderColor: (selectedSeats.length === 0 || isExpired) ? 'var(--border)' : '#4f3c93',
          color: (selectedSeats.length === 0 || isExpired) ? 'var(--text3)' : '#ffffff',
          fontWeight: 700,
          fontSize: '14px',
          borderWidth: '1px',
          borderStyle: 'solid',
          cursor: (selectedSeats.length === 0 || isExpired) ? 'not-allowed' : 'pointer',
          transition: 'var(--transition)',
          textAlign: 'center',
        }}
      >
        {isExpired ? 'Hết hạn' : `Tiếp tục (${selectedSeats.length})`}
      </button>
    </div>
  );
};
