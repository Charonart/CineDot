'use client';

import React from 'react';
import Link from 'next/link';
import { usePricing } from '../hooks/useCinemas';
import { appRoutes } from '@/shared/routes/appRoutes';

function formatPrice(vnd: number): string {
  return new Intl.NumberFormat('vi-VN').format(vnd) + 'đ';
}

export function CinemaPricingPage() {
  const { data: pricing, isLoading, isError } = usePricing();

  return (
    <div className="pricing-page">
      {/* Hero */}
      <section className="pricing-hero">
        <div className="pricing-hero-bg" aria-hidden="true" />
        <div className="container pricing-hero-content">
          <div className="pricing-hero-badge">💳 Bảng Giá Vé</div>
          <h1 className="pricing-hero-title">Giá Vé CineDot</h1>
          <p className="pricing-hero-subtitle">
            Giá vé minh bạch, phù hợp mọi đối tượng. Đặt vé online để nhận ưu đãi tốt nhất.
          </p>
        </div>
      </section>

      <div className="container pricing-content">
        {isError && (
          <div className="cinemas-error-state">
            <span className="state-icon">⚠️</span>
            <p>Không thể tải bảng giá. Vui lòng thử lại sau.</p>
          </div>
        )}

        {isLoading ? (
          <div className="pricing-skeleton">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-line" style={{ height: '3rem', marginBottom: '0.5rem' }} />
            ))}
          </div>
        ) : pricing ? (
          <>
            <div className="pricing-table-wrap">
              <table className="pricing-table" aria-label="Bảng giá vé CineDot">
                <thead>
                  <tr>
                    <th scope="col">Loại vé / Định dạng</th>
                    <th scope="col">Ngày thường<br /><small>(T2 — T6)</small></th>
                    <th scope="col">Cuối tuần<br /><small>(T7, CN, Lễ)</small></th>
                    <th scope="col">Phụ thu<br /><small>(so với 2D)</small></th>
                    <th scope="col">Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {pricing.categories.map((row) => (
                    <tr key={row.type} className={`pricing-row pricing-row--${row.type}`}>
                      <td className="pricing-label">{row.label}</td>
                      <td className="pricing-price">{formatPrice(row.weekday)}</td>
                      <td className="pricing-price pricing-price--weekend">{formatPrice(row.weekend)}</td>
                      <td className="pricing-surcharge">
                        {row.surcharge ? `+${formatPrice(row.surcharge)}` : '—'}
                      </td>
                      <td className="pricing-desc">{row.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pricing-note">
              <strong>Lưu ý:</strong> {pricing.note}
              <span className="pricing-updated"> · Cập nhật: {pricing.updatedAt}</span>
            </div>

            <div className="pricing-cta-section">
              <h2 className="pricing-cta-title">Sẵn sàng đặt vé?</h2>
              <p className="pricing-cta-desc">Chọn phim, chọn suất, thanh toán online — nhanh chóng và tiện lợi.</p>
              <Link href={`${appRoutes.movies}?category=now-showing`} className="btn-primary pricing-cta-btn">
                Xem Phim Đang Chiếu
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
