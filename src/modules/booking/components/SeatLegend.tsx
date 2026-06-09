'use client';

import React from 'react';

export const SeatLegend: React.FC = () => {
  return (
    <div
      className="seat-legend"
      style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '20px 24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '24px',
        width: '100%',
        marginTop: '24px',
        marginBottom: '24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '20px', height: '20px', border: '1px solid #d9d9d9', borderRadius: '4px', background: '#ffffff' }} />
        <span style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 500 }}>Ghế thường</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '20px', height: '20px', border: '1px solid #CFC9EB', borderRadius: '4px', background: '#F0EEF9' }} />
        <span style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 500 }}>Ghế VIP</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '36px', height: '20px', border: '1px solid #FFA4A4', borderRadius: '6px', background: '#FFF2F2' }} />
        <span style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 500 }}>Ghế đôi</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '20px', height: '20px', border: '1px solid #4f3c93', borderRadius: '4px', background: '#4f3c93' }} />
        <span style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 500 }}>Đang chọn</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '20px', height: '20px', border: '1px solid #d0d0d0', borderRadius: '4px', background: '#e0e0e0' }} />
        <span style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 500 }}>Đã bán</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '20px',
            height: '20px',
            border: '1px solid #e8dcce',
            borderRadius: '4px',
            background: '#f2eae1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c29c78',
          }}
        >
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <span style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 500 }}>Đang giữ</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '20px', height: '20px', border: '1px solid #d4d4d8', borderRadius: '4px', background: '#f4f4f5', opacity: 0.6 }} />
        <span style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 500 }}>Không khả dụng</span>
      </div>
    </div>
  );
};
