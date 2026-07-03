'use client';

import React from 'react';
import { useCartStore } from '../store/useCartStore';
function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

interface Props {
  onContinue: () => void;
  isLoading?: boolean;
}

export const StarShopOrderSummary: React.FC<Props> = ({ onContinue, isLoading }) => {
  const { items, totalPrice } = useCartStore();

  const handleCheckoutClick = () => {
    onContinue();
  };

  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: '24px',
      border: '1px solid var(--border)',
      padding: '24px',
      position: 'sticky',
      top: '100px',
      boxShadow: '0 4px 30px rgba(0,0,0,0.03)'
    }}>
      <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', marginBottom: '24px' }}>
        Tóm tắt đơn hàng
      </h2>

      {/* Items List Snapshot */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        {items.map(item => (
          <div key={item.productId} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', background: '#f0f0f0', flexShrink: 0 }}>
              <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', lineHeight: 1.3, marginBottom: '4px' }}>
                {item.name}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text2)' }}>
                {item.quantity} x {formatPrice(item.price)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: '1px', background: 'var(--border)', margin: '0 0 20px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px', color: 'var(--text2)' }}>
        <span>Tạm tính</span>
        <span style={{ fontWeight: 600, color: 'var(--text)' }}>{formatPrice(totalPrice)}</span>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '14px', color: 'var(--text2)' }}>
        <span>Phí vận chuyển</span>
        <span style={{ color: '#4CAF50', fontWeight: 600 }}>Miễn phí (Nhận tại rạp)</span>
      </div>

      <div style={{ 
        display: 'flex', justifyContent: 'space-between', 
        paddingTop: '20px', borderTop: '1px dashed var(--border)',
        marginBottom: '24px'
      }}>
        <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>Tổng cộng</span>
        <span style={{ fontSize: '24px', fontWeight: 800, color: '#7C6FE8' }}>
          {formatPrice(totalPrice)}
        </span>
      </div>

      <button
        type="button"
        onClick={handleCheckoutClick}
        disabled={isLoading || items.length === 0}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '12px',
          background: (isLoading || items.length === 0) ? '#a095c5' : '#7C6FE8',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '16px',
          border: 'none',
          cursor: (isLoading || items.length === 0) ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px'
        }}
        onMouseEnter={(e) => {
          if (!isLoading && items.length > 0) e.currentTarget.style.opacity = '0.9';
        }}
        onMouseLeave={(e) => {
          if (!isLoading && items.length > 0) e.currentTarget.style.opacity = '1';
        }}
      >
        {isLoading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
        {!isLoading && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        )}
      </button>
    </div>
  );
};
