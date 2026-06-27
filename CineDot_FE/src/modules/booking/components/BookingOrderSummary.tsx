'use client';

import React from 'react';
import { useBookingStore } from '../store/bookingStore';
import { useSeatHoldTimer } from '../hooks/useSeatHoldTimer';

interface BookingOrderSummaryProps {
  onContinue: () => void;
  continueLabel?: string;
  disabled?: boolean;
}

export const BookingOrderSummary: React.FC<BookingOrderSummaryProps> = ({
  onContinue,
  continueLabel = 'Tiếp tục',
  disabled = false,
}) => {
  const { isActive, formattedTime, isExpired } = useSeatHoldTimer();

  const session = useBookingStore((state) => state.session);
  const { movie, cinema, showtime, seats, combos, ticketTotal, comboTotal, discountAmount, finalTotal } = session;

  const seatLabels = seats.map((s) => s.label).join(', ');

  return (
    <aside
      className="order-summary-sidebar"
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '28px 24px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        height: 'fit-content',
        position: 'sticky',
        top: '120px',
      }}
    >
      {/* Expiry Hold Timer */}
      {isActive && (
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
            {formattedTime}
          </strong>
        </div>
      )}

      {/* Show Info details */}
      {movie && (
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={movie.poster}
            alt={movie.title}
            style={{
              width: '64px',
              height: '92px',
              borderRadius: '8px',
              objectFit: 'cover',
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#131413', margin: 0, lineHeight: 1.3 }}>
              {movie.title}
            </h4>
            <span style={{ fontSize: '12.5px', color: '#4f3c93', fontWeight: 700 }}>
              {movie.format}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text2)' }}>
              Thời lượng: {movie.duration}
            </span>
          </div>
        </div>
      )}

      <div style={{ height: '1px', background: 'var(--border)' }} />

      {/* Cinema / Showtime */}
      {cinema && showtime && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13.5px', color: 'var(--text2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>Rạp:</span>
            <span style={{ textAlign: 'right', fontWeight: 500 }}>{cinema.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>Phòng chiếu:</span>
            <span>{cinema.hall}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>Suất chiếu:</span>
            <span style={{ fontWeight: 700, color: '#131413' }}>{showtime.time} - {showtime.date}</span>
          </div>
        </div>
      )}

      <div style={{ height: '1px', background: 'var(--border)' }} />

      {/* Seats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <h5 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text3)', margin: 0, fontWeight: 700 }}>
          Ghế đã chọn
        </h5>
        {seats.length === 0 ? (
          <span style={{ fontSize: '13.5px', color: 'var(--text2)', fontStyle: 'italic' }}>Chưa chọn ghế</span>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <strong style={{ fontSize: '16px', color: '#4f3c93', fontWeight: 700 }}>
              {seatLabels}
            </strong>
            <span style={{ fontSize: '12px', color: 'var(--text2)' }}>
              Số lượng: {seats.length} Vé
            </span>
          </div>
        )}
      </div>

      <div style={{ height: '1px', background: 'var(--border)' }} />

      {/* Combos list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h5 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text3)', margin: 0, fontWeight: 700 }}>
          Combo đã chọn
        </h5>
        {combos.length === 0 ? (
          <span style={{ fontSize: '13.5px', color: 'var(--text2)', fontStyle: 'italic' }}>Chưa chọn combo</span>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {combos.map((combo) => (
              <div key={combo.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13.5px' }}>
                <span style={{ color: 'var(--text)', fontWeight: 600 }}>
                  {combo.name} <strong style={{ color: '#4f3c93' }}>x{combo.quantity}</strong>
                </span>
                <span style={{ color: 'var(--text2)', fontWeight: 500 }}>
                  {(combo.price * combo.quantity).toLocaleString('vi-VN')} đ
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ height: '1px', background: 'var(--border)' }} />

      {/* Totals Summary */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text2)' }}>
          <span>Tạm tính vé:</span>
          <span>{ticketTotal.toLocaleString('vi-VN')} đ</span>
        </div>
        {comboTotal > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text2)' }}>
            <span>Tạm tính combo:</span>
            <span>{comboTotal.toLocaleString('vi-VN')} đ</span>
          </div>
        )}
        {discountAmount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E53E3E', fontWeight: 600 }}>
            <span>Giảm giá:</span>
            <span>-{discountAmount.toLocaleString('vi-VN')} đ</span>
          </div>
        )}
        <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span style={{ fontWeight: 700, color: 'var(--text)' }}>Tổng cộng:</span>
          <strong style={{ fontSize: '22px', color: '#131413', fontWeight: 800 }}>
            {finalTotal.toLocaleString('vi-VN')} đ
          </strong>
        </div>
      </div>

      {/* Action CTA */}
      <button
        type="button"
        disabled={disabled || isExpired}
        onClick={onContinue}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '12px',
          background: (disabled || isExpired) ? 'var(--bg2)' : '#4f3c93',
          borderColor: (disabled || isExpired) ? 'var(--border)' : '#4f3c93',
          color: (disabled || isExpired) ? 'var(--text3)' : '#ffffff',
          fontWeight: 700,
          fontSize: '15px',
          borderWidth: '1px',
          borderStyle: 'solid',
          cursor: (disabled || isExpired) ? 'not-allowed' : 'pointer',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: (disabled || isExpired) ? 'none' : '0 4px 15px rgba(79, 60, 147, 0.2)',
          textAlign: 'center',
          marginTop: '8px',
        }}
        onMouseEnter={(e) => {
          if (!disabled && !isExpired) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(79, 60, 147, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !isExpired) {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(79, 60, 147, 0.2)';
          }
        }}
      >
        {isExpired ? 'Phiên giữ ghế đã hết hạn' : continueLabel}
      </button>
    </aside>
  );
};
