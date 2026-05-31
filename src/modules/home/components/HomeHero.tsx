/* eslint-disable @next/next/no-img-element, @next/next/no-html-link-for-pages */
import React from 'react';
import { QuickBookingPanel } from './QuickBookingPanel';

export const HomeHero: React.FC = () => {
  return (
    <section className="hero" id="hero">
      <div className="hero-background">
        <img
          src="https://i.pinimg.com/1200x/de/7d/3d/de7d3d8327d605f83c3cd01a3f270e10.jpg"
          alt="Dune backdrop"
        />
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-slider">
        <article className="hero-slide is-active">
          <div className="hero-content">
            <div className="hero-info-card fade-up in-view">
              <span className="badge" style={{ marginBottom: '12px', display: 'inline-block' }}>
                Đang chiếu
              </span>
              <div
                className="hero-tagline"
                style={{
                  marginBottom: '20px',
                  fontSize: '16px',
                  fontWeight: 500,
                  letterSpacing: '0.5px',
                  lineHeight: 1.4,
                  color: 'rgba(255,255,255,0.85)'
                }}
              >
                Đặt vé nhanh. Xem phim hay.{' '}
                <span className="highlight-text" data-variant="underline" data-color="accent">
                  Trải nghiệm điện ảnh cao cấp.
                </span>
              </div>
              <h1 className="hero-title">
                Người Nhện:<br />
                <em>Phần 2</em>
              </h1>
              <div className="hero-meta">
                <span className="meta-tag">IMAX</span>
                <span className="meta-dot">·</span>
                <span>166 phút</span>
                <span className="meta-dot">·</span>
                <span className="meta-rating">★ 8.7</span>
              </div>
              <p className="hero-desc">
                Paul Atreides sát cánh cùng Chani và người Fremen trong cuộc hành trình trả thù những
                kẻ đã tàn sát gia tộc mình. Anh phải đối mặt với sự lựa chọn giữa tình yêu của cuộc đời và số phận của cả
                vũ trụ.
              </p>
              <div className="hero-actions">
                <a
                  href="/movies/detail/dune-part-two"
                  className="btn-primary btn-large"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none'
                  }}
                >
                  Đặt vé
                </a>
                <button className="btn-ghost btn-large" id="openTrailerBtn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                  Xem trailer
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div className="hero-scroll-hint">
        <span>Cuộn xuống</span>
        <div className="scroll-line"></div>
      </div>

      {/* QUICK BOOKING PANEL */}
      <QuickBookingPanel />
    </section>
  );
};
