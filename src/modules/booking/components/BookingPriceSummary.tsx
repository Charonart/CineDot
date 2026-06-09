'use client';

import React from 'react';
import { Seat } from '../types/booking.type';
import { useBookingStore } from '../store/bookingStore';

interface BookingPriceSummaryProps {
  selectedSeats: Seat[];
  totalAmount: number;
  canCheckout: boolean;
  isHoldingSeats: boolean;
  timeLeftSeconds: number | null;
  onCheckout: () => void;
}

const formatTimer = (seconds: number) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

export const BookingPriceSummary: React.FC<BookingPriceSummaryProps> = ({
  selectedSeats,
  totalAmount,
  canCheckout,
  isHoldingSeats,
  timeLeftSeconds,
  onCheckout,
}) => {
  const comboTotal = useBookingStore((state) => state.session.comboTotal);
  const discountAmount = useBookingStore((state) => state.session.discountAmount);
  const combos = useBookingStore((state) => state.session.combos);
  const finalTotal = totalAmount + comboTotal - discountAmount;

  const seatLabels = selectedSeats.map((seat) => seat.label).join(', ');
  const isDisabled = !canCheckout || isHoldingSeats;

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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: timeLeftSeconds === null ? '#F6F6F6' : '#FFF8F0',
          border: timeLeftSeconds === null ? '1px solid var(--border)' : '1px dashed #FFD6A5',
          borderRadius: '12px',
          padding: '12px 16px',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '13px', color: timeLeftSeconds === null ? 'var(--text2)' : '#C2700D', fontWeight: 600 }}>
          {timeLeftSeconds === null ? 'Ghế chỉ được giữ sau khi tiếp tục' : 'Thời gian giữ ghế'}
        </span>
        {timeLeftSeconds !== null && (
          <strong style={{ fontSize: '16px', color: '#E07A00', fontFamily: 'monospace', fontWeight: 700 }}>
            {formatTimer(timeLeftSeconds)}
          </strong>
        )}
      </div>

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
              Số lượng: {selectedSeats.length} vé
            </span>
          </div>
        )}
      </div>

      <div style={{ height: '1px', background: 'var(--border)' }} />

      {/* Selected combos list block */}
      {combos.length > 0 && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text3)', margin: 0, fontWeight: 700 }}>Combo đã chọn</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {combos.map((combo) => (
                <div key={combo.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '14.5px', color: '#131413', fontWeight: 600 }}>
                    {combo.name} x{combo.quantity}
                  </strong>
                  <span style={{ fontSize: '14px', color: 'var(--text2)' }}>
                    {(combo.price * combo.quantity).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: '1px', background: 'var(--border)' }} />
        </>
      )}

      {/* Pricing list breakdowns */}
      {selectedSeats.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text3)', margin: 0, fontWeight: 700 }}>Chi tiết giá vé</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '150px', overflowY: 'auto' }}>
            {selectedSeats.map((seat) => (
              <div key={seat.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: 'var(--text2)', gap: '12px' }}>
                <span>{seat.label} ({seat.type.toUpperCase()})</span>
                <span>{seat.price.toLocaleString('vi-VN')} đ</span>
              </div>
            ))}
          </div>
          <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
        </div>
      )}

      {/* Totals & Discounts Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14.5px', color: 'var(--text2)' }}>
          <span>Tạm tính vé:</span>
          <span>{totalAmount.toLocaleString('vi-VN')} đ</span>
        </div>
        {comboTotal > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14.5px', color: 'var(--text2)' }}>
            <span>Tạm tính combo:</span>
            <span>{comboTotal.toLocaleString('vi-VN')} đ</span>
          </div>
        )}
        {discountAmount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14.5px', color: '#E53E3E', fontWeight: 600 }}>
            <span>Giảm giá:</span>
            <span>-{discountAmount.toLocaleString('vi-VN')} đ</span>
          </div>
        )}
        <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 700 }}>Tổng cộng:</span>
          <strong style={{ fontSize: '24px', color: '#131413', fontFamily: 'var(--font-head)', fontWeight: 700 }}>
            {finalTotal.toLocaleString('vi-VN')} đ
          </strong>
        </div>
      </div>

      <button
        type="button"
        disabled={isDisabled}
        onClick={onCheckout}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '12px',
          background: isDisabled ? 'var(--bg2)' : '#4f3c93',
          borderColor: isDisabled ? 'var(--border)' : '#4f3c93',
          color: isDisabled ? 'var(--text3)' : '#ffffff',
          fontWeight: 700,
          fontSize: '15px',
          borderWidth: '1px',
          borderStyle: 'solid',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isDisabled ? 'none' : '0 4px 15px rgba(79, 60, 147, 0.2)',
        }}
        onMouseEnter={(e) => {
          if (!isDisabled) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(79, 60, 147, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isDisabled) {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(79, 60, 147, 0.2)';
          }
        }}
      >
        {isHoldingSeats ? 'Đang giữ ghế...' : 'Tiếp tục'}
      </button>
    </aside>
  );
};
