'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ZaloPayReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const status = searchParams.get('status');
  const appTransId = searchParams.get('apptransid');
  const amount = searchParams.get('amount');

  const isSuccess = status === '1';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F6F6F6',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '40px 32px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
          textAlign: 'center',
          border: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: isSuccess ? '#E6FFFA' : '#FFF5F5',
            color: isSuccess ? '#319795' : '#C53030',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto',
          }}
        >
          {isSuccess ? (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#131413', margin: '0 0 12px 0' }}>
          {isSuccess ? 'Thanh Toán Thành Công' : 'Thanh Toán Thất Bại'}
        </h2>

        <p style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: 1.6, margin: '0 0 32px 0' }}>
          {isSuccess
            ? 'Cảm ơn bạn đã đặt vé. Mã giao dịch của bạn là '
            : 'Rất tiếc, giao dịch của bạn đã bị huỷ hoặc có lỗi xảy ra. Mã giao dịch: '}
          <strong style={{ color: '#131413' }}>{appTransId || 'Không xác định'}</strong>.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          {!isSuccess && (
            <button
              type="button"
              onClick={() => router.push('/booking/payment')}
              style={{
                padding: '14px 24px',
                borderRadius: '12px',
                background: '#ffffff',
                color: '#131413',
                border: '2px solid #131413',
                fontWeight: 700,
                fontSize: '14.5px',
                cursor: 'pointer',
                flex: 1,
              }}
            >
              Thử lại
            </button>
          )}
          <button
            type="button"
            onClick={() => router.push('/')}
            style={{
              padding: '14px 24px',
              borderRadius: '12px',
              background: '#131413',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '14.5px',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ZaloPayReturnPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '100px' }}>Đang tải...</div>}>
      <ZaloPayReturnContent />
    </Suspense>
  );
}
