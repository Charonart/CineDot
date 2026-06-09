'use client';

import React from 'react';
import { Seat, SeatPricing, SeatType } from '../types/booking.type';

interface SeatPriceBreakdownProps {
  pricing: SeatPricing[];
  selectedSeats: Seat[];
}

const getSeatTypeVisual = (seatType: SeatType): React.CSSProperties => {
  if (seatType === 'vip') return { width: '20px', height: '20px', border: '1px solid #CFC9EB', borderRadius: '4px', background: '#F0EEF9' };
  if (seatType === 'couple') return { width: '36px', height: '20px', border: '1px solid #FFA4A4', borderRadius: '6px', background: '#FFF2F2' };
  return { width: '20px', height: '20px', border: '1px solid #d9d9d9', borderRadius: '4px', background: '#ffffff' };
};

export const SeatPriceBreakdown: React.FC<SeatPriceBreakdownProps> = ({ pricing, selectedSeats }) => {
  const grandTotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  return (
    <div
      className="seat-price-breakdown-card"
      style={{
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '24px 30px',
        boxShadow: 'var(--shadow-sm)',
        width: '100%',
        marginTop: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <h3
        style={{
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--text3)',
          margin: 0,
          fontWeight: 700,
        }}
      >
        Giá vé theo loại ghế
      </h3>

      <div
        className="seat-price-breakdown-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          alignItems: 'center',
        }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          @media (max-width: 768px) {
            .seat-price-breakdown-grid {
              grid-template-columns: 1fr 1fr !important;
              gap: 16px !important;
            }
          }
          @media (max-width: 480px) {
            .seat-price-breakdown-grid {
              grid-template-columns: 1fr !important;
              gap: 14px !important;
            }
          }
        `}} />

        {pricing.map((priceItem) => {
          const seatsByType = selectedSeats.filter((seat) => seat.type === priceItem.seatType);
          const typeTotal = seatsByType.reduce((sum, seat) => sum + seat.price, 0);

          return (
            <div
              key={priceItem.seatType}
              className="seat-price-item"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <div
                className="seat-price-icon"
                style={{
                  ...getSeatTypeVisual(priceItem.seatType),
                  marginTop: '2px',
                  flexShrink: 0,
                }}
              />
              <div>
                <span className="seat-price-label" style={{ fontSize: '13px', color: 'var(--text2)', fontWeight: 600, display: 'block' }}>{priceItem.label}</span>
                <span className="seat-price-value" style={{ fontSize: '14px', color: '#131413', fontWeight: 700 }}>
                  {seatsByType.length} x {priceItem.price.toLocaleString('vi-VN')} đ
                </span>
                {seatsByType.length > 0 && (
                  <span style={{ fontSize: '12.5px', color: 'var(--text3)', display: 'block', marginTop: '2px' }}>
                    Tổng: {typeTotal.toLocaleString('vi-VN')} đ
                  </span>
                )}
              </div>
            </div>
          );
        })}

        <div
          className="seat-price-total"
          style={{
            borderLeft: '1px solid var(--border)',
            paddingLeft: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <style dangerouslySetInnerHTML={{__html: `
            @media (max-width: 768px) {
              .seat-price-total {
                borderLeft: none !important;
                borderTop: 1px solid var(--border) !important;
                paddingLeft: 0 !important;
                paddingTop: 16px !important;
                grid-column: span 2 !important;
              }
            }
            @media (max-width: 480px) {
              .seat-price-total {
                grid-column: span 1 !important;
              }
            }
          `}} />
          <span style={{ fontSize: '13px', color: 'var(--text2)', fontWeight: 600 }}>Tổng tiền vé</span>
          <strong style={{ fontSize: '20px', color: '#4f3c93', fontWeight: 800, marginTop: '4px' }}>
            {grandTotal.toLocaleString('vi-VN')} đ
          </strong>
        </div>
      </div>
    </div>
  );
};
