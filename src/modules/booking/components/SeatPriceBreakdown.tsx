'use client';

import React from 'react';
import { SeatItem } from '../data/seatMapData';

interface SeatPriceBreakdownProps {
  selectedSeats: SeatItem[];
}

export const SeatPriceBreakdown: React.FC<SeatPriceBreakdownProps> = ({ selectedSeats }) => {
  // Base prices (fallback if no seats selected to inspect)
  const STANDARD_PRICE = 120000;
  const VIP_PRICE = 150000;
  const COUPLE_PRICE = 300000;

  // Calculate seat counts and totals based on selected seats array
  const standardCount = selectedSeats.filter((s) => s.type === 'standard').length;
  const vipCount = selectedSeats.filter((s) => s.type === 'vip').length;
  const coupleCount = selectedSeats.filter((s) => s.type === 'couple').length;

  const standardTotal = standardCount * STANDARD_PRICE;
  const vipTotal = vipCount * VIP_PRICE;
  const coupleTotal = coupleCount * COUPLE_PRICE;
  const grandTotal = standardTotal + vipTotal + coupleTotal;

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
          fontWeight: 700 
        }}
      >
        Giá vé theo loại ghế
      </h3>

      {/* Grid containing breakdowns and total */}
      <div 
        className="seat-price-breakdown-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          alignItems: 'center',
        }}
      >
        {/* Shorthand styles media injection for mobile responsiveness */}
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

        {/* Standard Seat Info Column */}
        <div 
          className="seat-price-item"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          {/* Legend shape */}
          <div 
            className="seat-price-icon"
            style={{ 
              width: '20px', 
              height: '20px', 
              border: '1px solid #d9d9d9', 
              borderRadius: '4px', 
              background: '#ffffff',
              marginTop: '2px',
              flexShrink: 0
            }} 
          />
          <div>
            <span className="seat-price-label" style={{ fontSize: '13px', color: 'var(--text2)', fontWeight: 600, display: 'block' }}>Ghế thường</span>
            <span className="seat-price-value" style={{ fontSize: '14px', color: '#131413', fontWeight: 700 }}>
              {standardCount > 0 ? `${standardCount} x ` : '0 x '} {STANDARD_PRICE.toLocaleString('vi-VN')} đ
            </span>
            {standardCount > 0 && (
              <span style={{ fontSize: '12.5px', color: 'var(--text3)', display: 'block', marginTop: '2px' }}>
                Tổng: {standardTotal.toLocaleString('vi-VN')} đ
              </span>
            )}
          </div>
        </div>

        {/* VIP Seat Info Column */}
        <div 
          className="seat-price-item"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          {/* Legend shape */}
          <div 
            className="seat-price-icon"
            style={{ 
              width: '20px', 
              height: '20px', 
              border: '1px solid #CFC9EB', 
              borderRadius: '4px', 
              background: '#F0EEF9',
              marginTop: '2px',
              flexShrink: 0
            }} 
          />
          <div>
            <span className="seat-price-label" style={{ fontSize: '13px', color: 'var(--text2)', fontWeight: 600, display: 'block' }}>Ghế VIP</span>
            <span className="seat-price-value" style={{ fontSize: '14px', color: '#131413', fontWeight: 700 }}>
              {vipCount > 0 ? `${vipCount} x ` : '0 x '} {VIP_PRICE.toLocaleString('vi-VN')} đ
            </span>
            {vipCount > 0 && (
              <span style={{ fontSize: '12.5px', color: 'var(--text3)', display: 'block', marginTop: '2px' }}>
                Tổng: {vipTotal.toLocaleString('vi-VN')} đ
              </span>
            )}
          </div>
        </div>

        {/* Couple Seat Info Column */}
        <div 
          className="seat-price-item"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          {/* Legend shape */}
          <div 
            className="seat-price-icon"
            style={{ 
              width: '36px', 
              height: '20px', 
              border: '1px solid #FFA4A4', 
              borderRadius: '6px', 
              background: '#FFF2F2',
              marginTop: '2px',
              flexShrink: 0
            }} 
          />
          <div>
            <span className="seat-price-label" style={{ fontSize: '13px', color: 'var(--text2)', fontWeight: 600, display: 'block' }}>Ghế đôi</span>
            <span className="seat-price-value" style={{ fontSize: '14px', color: '#131413', fontWeight: 700 }}>
              {coupleCount > 0 ? `${coupleCount} x ` : '0 x '} {COUPLE_PRICE.toLocaleString('vi-VN')} đ
            </span>
            {coupleCount > 0 && (
              <span style={{ fontSize: '12.5px', color: 'var(--text3)', display: 'block', marginTop: '2px' }}>
                Tổng: {coupleTotal.toLocaleString('vi-VN')} đ
              </span>
            )}
          </div>
        </div>

        {/* Grand Total Info Column */}
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
