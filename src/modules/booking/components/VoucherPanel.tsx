'use client';

import React, { useState, useEffect } from 'react';
import { useBookingStore } from '../store/bookingStore';
import { findVoucherByCode } from '../data/voucherData';
import { calculateVoucherDiscount } from '../utils/bookingCalculations';

export const VoucherPanel: React.FC = () => {
  const session = useBookingStore((state) => state.session);
  const applyVoucher = useBookingStore((state) => state.applyVoucher);
  const clearVoucher = useBookingStore((state) => state.clearVoucher);

  const { ticketTotal, comboTotal, voucherCode, discountAmount } = session;
  const subtotal = ticketTotal + comboTotal;

  const [inputCode, setInputCode] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  // Automatically sync input field if a voucher was pre-applied in the session
  useEffect(() => {
    if (voucherCode) {
      setInputCode(voucherCode);
    } else {
      setInputCode('');
    }
  }, [voucherCode]);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    const cleanCode = inputCode.trim();
    if (!cleanCode) {
      setMessage('Vui lòng nhập mã giảm giá.');
      setMessageType('error');
      return;
    }

    const voucher = findVoucherByCode(cleanCode);
    if (!voucher) {
      setMessage('Mã không tồn tại.');
      setMessageType('error');
      return;
    }

    const result = calculateVoucherDiscount({ voucher, subtotal });
    if (!result.isValid) {
      setMessage(result.message);
      setMessageType('error');
      return;
    }

    applyVoucher(voucher.code, result.discountAmount);
    setMessage('Áp dụng mã thành công.');
    setMessageType('success');
  };

  const handleRemove = () => {
    clearVoucher();
    setInputCode('');
    setMessage('Đã xóa mã giảm giá.');
    setMessageType('success');
  };

  return (
    <div
      className="voucher-panel"
      style={{
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
      }}
    >
      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#131413', margin: '0 0 16px 0' }}>
        Mã Giảm Giá / Voucher
      </h3>

      <form onSubmit={handleApply} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          placeholder="Nhập mã (CINE10, MEMBER15...)"
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            fontSize: '14px',
            color: '#131413',
            background: 'var(--bg)',
            outline: 'none',
            transition: 'border-color 0.2s ease',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#4f3c93';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border)';
          }}
        />
        <button
          type="submit"
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            background: '#131413',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          Áp dụng
        </button>
      </form>

      {/* Message alert box */}
      {message && (
        <div
          style={{
            marginTop: '12px',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            background: messageType === 'success' ? '#E6FFFA' : '#FFF5F5',
            border: `1px solid ${messageType === 'success' ? '#B2F5EA' : '#FED7D7'}`,
            color: messageType === 'success' ? '#234E52' : '#C53030',
          }}
        >
          {message}
        </div>
      )}

      {/* Active Voucher status badge */}
      {voucherCode && messageType !== 'error' && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '12px',
            padding: '12px 16px',
            background: '#F0EEF9',
            border: '1px solid #CFC9EB',
            borderRadius: '12px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#4f3c93' }}>
              Mã đang áp dụng: {voucherCode}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>
              Đã giảm: -{discountAmount.toLocaleString('vi-VN')} đ
            </span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#E53E3E',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '4px 8px',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            Xóa
          </button>
        </div>
      )}
    </div>
  );
};
