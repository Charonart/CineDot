'use client';

import React, { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBookingStore } from '@/modules/booking/store/bookingStore';

function ZaloPayReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const status = searchParams.get('status');
  const appTransId = searchParams.get('apptransid');
  
  // Trạng thái thành công khi status === '1'
  const isSuccess = status === '1';

  const markPaid = useBookingStore((state) => state.markPaid);
  const markFailed = useBookingStore((state) => state.markFailed);
  const hasSynced = useRef(false);

  useEffect(() => {
    if (!hasSynced.current) {
      if (isSuccess) {
        markPaid();
      } else {
        markFailed();
      }
      hasSynced.current = true;
    }
  }, [isSuccess, markPaid, markFailed]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#131413', // Dark background for premium look
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: isSuccess 
            ? 'radial-gradient(circle, rgba(49,151,149,0.15) 0%, rgba(19,20,19,0) 70%)'
            : 'radial-gradient(circle, rgba(229,62,62,0.15) 0%, rgba(19,20,19,0) 70%)',
          zIndex: 0,
        }}
      />

      <div
        style={{
          background: 'rgba(25, 26, 25, 0.7)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '24px',
          padding: '48px 40px',
          maxWidth: '480px',
          width: '100%',
          boxShadow: isSuccess
            ? '0 20px 60px rgba(49, 151, 149, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 20px 60px rgba(229, 62, 62, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          textAlign: 'center',
          border: isSuccess ? '1px solid rgba(49, 151, 149, 0.3)' : '1px solid rgba(229, 62, 62, 0.3)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: isSuccess ? 'rgba(49, 151, 149, 0.15)' : 'rgba(229, 62, 62, 0.15)',
            color: isSuccess ? '#4FD1C5' : '#FC8181',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 28px auto',
            boxShadow: isSuccess 
              ? '0 0 30px rgba(49, 151, 149, 0.3), inset 0 0 20px rgba(49, 151, 149, 0.2)'
              : '0 0 30px rgba(229, 62, 62, 0.3), inset 0 0 20px rgba(229, 62, 62, 0.2)',
            border: isSuccess ? '2px solid rgba(49, 151, 149, 0.4)' : '2px solid rgba(229, 62, 62, 0.4)',
          }}
        >
          {isSuccess ? (
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          ) : (
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          )}
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0', letterSpacing: '-0.5px' }}>
          {isSuccess ? 'Thanh Toán Thành Công' : 'Thanh Toán Thất Bại'}
        </h2>

        <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, margin: '0 0 36px 0' }}>
          {isSuccess
            ? 'Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của CineDot. Mã giao dịch ZaloPay của bạn là '
            : 'Rất tiếc, giao dịch của bạn đã bị hủy hoặc hệ thống gặp sự cố trong quá trình xử lý. Mã giao dịch: '}
          <strong style={{ color: '#ffffff', fontWeight: 700 }}>{appTransId || 'Không xác định'}</strong>.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {!isSuccess ? (
            <>
              <button
                type="button"
                onClick={() => router.push('/booking/payment')}
                style={{
                  padding: '16px 24px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #E53E3E 0%, #C53030 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: 'pointer',
                  width: '100%',
                  boxShadow: '0 4px 15px rgba(229, 62, 62, 0.3)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(229, 62, 62, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(229, 62, 62, 0.3)';
                }}
              >
                Thử thanh toán lại
              </button>
              <button
                type="button"
                onClick={() => router.push('/')}
                style={{
                  padding: '16px 24px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
              >
                Về trang chủ
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => router.push('/user/tickets')}
              style={{
                padding: '16px 24px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #319795 0%, #285E61 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                width: '100%',
                boxShadow: '0 4px 15px rgba(49, 151, 149, 0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(49, 151, 149, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(49, 151, 149, 0.3)';
              }}
            >
              Xem vé của tôi
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ZaloPayReturnPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '100px', color: 'white', background: '#131413', minHeight: '100vh' }}>Đang tải kết quả giao dịch...</div>}>
      <ZaloPayReturnContent />
    </Suspense>
  );
}
