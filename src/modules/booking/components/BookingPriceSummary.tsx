'use client';

import React, { useState, useEffect } from 'react';
import { SeatItem } from '../data/seatMapData';

interface BookingPriceSummaryProps {
  selectedSeats: SeatItem[];
  onCheckout: () => void;
}

export const BookingPriceSummary: React.FC<BookingPriceSummaryProps> = ({
  selectedSeats,
  onCheckout,
}) => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  // Active session timer countdown logic
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTimer = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  // Group selected seat labels
  const seatLabels = selectedSeats.map((s) => s.label).join(', ');

  // Calculate pricing
  const totalAmount = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <aside 
      className="price-summary"
      style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '32px 24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
        maxWidth: '360px',
        height: 'fit-content',
        position: 'sticky',
        top: '110px',
      }}
    >
      {/* Session hold timer indicator */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FFF8F0',
          border: '1px dashed #FFD6A5',
          borderRadius: '12px',
          padding: '12px 16px',
        }}
      >
        <span style={{ fontSize: '13px', color: '#C2700D', fontWeight: 600 }}>Thời gian giữ ghế</span>
        <strong style={{ fontSize: '16px', color: '#E07A00', fontFamily: 'monospace', fontWeight: 700 }}>
          {formatTimer(timeLeft)}
        </strong>
      </div>

      {/* Selected seats list block */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text3)', margin: 0, fontWeight: 700 }}>Ghế đã chọn</h3>
        {selectedSeats.length === 0 ? (
          <p style={{ fontSize: '14.5px', color: 'var(--text2)', margin: 0, fontStyle: 'italic' }}>Chưa có ghế nào được chọn</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <strong style={{ fontSize: '18px', color: '#4f3c93', fontWeight: 700, wordBreak: 'break-word' }}>
              {seatLabels}
            </strong>
            <span style={{ fontSize: '13px', color: 'var(--text2)' }}>
              Số lượng: {selectedSeats.length} Vé
            </span>
          </div>
        )}
      </div>

      <div style={{ height: '1px', background: 'var(--border)' }} />

      {/* Pricing list breakdowns */}
      {selectedSeats.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text3)', margin: 0, fontWeight: 700 }}>Chi tiết giá vé</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '150px', overflowY: 'auto' }}>
            {selectedSeats.map((seat) => (
              <div key={seat.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: 'var(--text2)' }}>
                <span>{seat.label} ({seat.type.toUpperCase()})</span>
                <span>{seat.price.toLocaleString('vi-VN')} đ</span>
              </div>
            ))}
          </div>
          <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
        </div>
      )}

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <span style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 600 }}>Tạm tính:</span>
        <strong style={{ fontSize: '24px', color: '#131413', fontFamily: 'var(--font-head)', fontWeight: 700 }}>
          {totalAmount.toLocaleString('vi-VN')} đ
        </strong>
      </div>

      {/* Checkout CTA */}
      <button
        type="button"
        disabled={selectedSeats.length === 0}
        onClick={onCheckout}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '12px',
          background: selectedSeats.length === 0 ? 'var(--bg2)' : '#4f3c93',
          borderColor: selectedSeats.length === 0 ? 'var(--border)' : '#4f3c93',
          color: selectedSeats.length === 0 ? 'var(--text3)' : '#ffffff',
          fontWeight: 700,
          fontSize: '15px',
          borderWidth: '1px',
          borderStyle: 'solid',
          cursor: selectedSeats.length === 0 ? 'not-allowed' : 'pointer',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: selectedSeats.length === 0 ? 'none' : '0 4px 15px rgba(79, 60, 147, 0.2)',
        }}
        onMouseEnter={(e) => {
          if (selectedSeats.length > 0) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(79, 60, 147, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          if (selectedSeats.length > 0) {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(79, 60, 147, 0.2)';
          }
        }}
      >
        Tiếp tục thanh toán
      </button>
    </aside>
  );
};
