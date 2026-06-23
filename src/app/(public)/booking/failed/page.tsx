'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useBookingStore } from '@/modules/booking/store/bookingStore';

function FailedPageContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'expired';

  // Read movie slug from the bookingStore
  const movieSlug = useBookingStore((state) => state.session.movie?.slug);

  const title = reason === 'expired' ? 'Đã hết thời gian giữ ghế' : 'Giao dịch không thành công';
  const description = reason === 'expired' 
    ? 'Phiên đặt vé của bạn đã hết hạn do quá thời gian giữ ghế (10 phút). Vui lòng chọn lại suất chiếu hoặc quay về trang phim.'
    : 'Có lỗi xảy ra trong quá trình xử lý giao dịch. Vui lòng thử lại sau.';

  // Determine back to movie details URL
  const movieDetailsUrl = movieSlug ? `/movies/${movieSlug}` : '/movies';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F6F6F6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 20px 80px 20px',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '40px 32px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.05)',
          textAlign: 'center',
          border: '1px solid var(--border)',
        }}
      >
        {/* Failed Warning Icon */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: '#FFF2F2',
            color: '#E53E3E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto',
            border: '1px solid #FFA4A4',
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h1
          style={{
            fontSize: '24px',
            fontWeight: 800,
            color: '#131413',
            margin: '0 0 12px 0',
            fontFamily: 'var(--font-head)',
          }}
        >
          {title}
        </h1>

        <p
          style={{
            fontSize: '15px',
            color: 'var(--text2)',
            lineHeight: '1.6',
            margin: '0 0 32px 0',
          }}
        >
          {description}
        </p>

        {/* Buttons actions */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <Link
            href={movieDetailsUrl}
            style={{
              padding: '14px',
              borderRadius: '10px',
              background: '#4f3c93',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '15px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              display: 'block',
              boxShadow: '0 4px 12px rgba(79, 60, 147, 0.2)',
            }}
          >
            Chọn lại suất chiếu
          </Link>
          
          <Link
            href="/"
            style={{
              padding: '14px',
              borderRadius: '10px',
              background: '#ffffff',
              border: '1px solid var(--border)',
              color: 'var(--text2)',
              fontWeight: 600,
              fontSize: '15px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              display: 'block',
            }}
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FailedPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F6F6F6',
            color: 'var(--text)',
            fontSize: '16px',
            fontWeight: 500,
          }}
        >
          Đang tải...
        </div>
      }
    >
      <FailedPageContent />
    </Suspense>
  );
}
