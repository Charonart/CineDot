'use client';

import React from 'react';
import { useBookingStore } from '../store/bookingStore';
import { PAYMENT_METHODS } from '../data/paymentMethods';

export const PaymentMethodSelector: React.FC = () => {
  const session = useBookingStore((state) => state.session);
  const setPaymentMethod = useBookingStore((state) => state.setPaymentMethod);
  const selectedMethod = session.paymentMethod;

  return (
    <div
      className="payment-method-selector"
      style={{
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
      }}
    >
      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#131413', margin: '0 0 4px 0' }}>
        Phương Thức Thanh Toán
      </h3>
      <p style={{ fontSize: '13px', color: 'var(--text3)', margin: '0 0 20px 0' }}>
        Vui lòng chọn phương thức thanh toán phù hợp.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '12px',
        }}
      >
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selectedMethod === method.id;

          return (
            <div
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px',
                borderRadius: '14px',
                background: isSelected ? 'rgba(79, 60, 147, 0.03)' : '#ffffff',
                border: isSelected ? '2px solid #4f3c93' : '2px solid var(--border)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 4px 12px rgba(79, 60, 147, 0.05)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--text3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--border)';
                }
              }}
            >
              {/* Radio Indicator */}
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: isSelected ? '5px solid #4f3c93' : '2px solid var(--border)',
                  background: '#ffffff',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '14.5px', fontWeight: 700, color: '#131413' }}>
                  {method.label}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.3 }}>
                  {method.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
