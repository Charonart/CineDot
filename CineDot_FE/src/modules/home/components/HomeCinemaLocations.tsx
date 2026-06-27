import React from 'react';
import { ScrollTextSlideLeft, HighlightText } from '@/shared/components/visual';

export const HomeCinemaLocations: React.FC = () => {
  return (
    <section className="section locations fade-up in-view">
      <div className="container">
        <div className="section-header">
          <div>
            <p className="section-eyebrow">Tìm rạp</p>
            <ScrollTextSlideLeft as="h2" className="section-title">
              Hệ thống <HighlightText variant="underline" color="primary">Rạp</HighlightText>
            </ScrollTextSlideLeft>
          </div>
        </div>
        <div className="locations-grid">
          {/* Card 1: CINE Landmark */}
          <div className="location-card">
            <div className="location-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="location-content">
              <h3>CINE Landmark</h3>
              <p className="location-address">72 Lê Thánh Tôn, Quận 1</p>
              <p className="location-distance">Cách đây 0.8 km</p>
              <div className="format-tags">
                <span className="format-tag imax">IMAX</span>
                <span className="format-tag dolby">Dolby</span>
                <span className="format-tag">4DX</span>
              </div>
            </div>
            <button className="btn-outline">Xem suất chiếu</button>
          </div>

          {/* Card 2: CINE Crescent Mall */}
          <div className="location-card">
            <div className="location-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="location-content">
              <h3>CINE Crescent Mall</h3>
              <p className="location-address">101 Tôn Dật Tiên, Quận 7</p>
              <p className="location-distance">Cách đây 4.2 km</p>
              <div className="format-tags">
                <span className="format-tag imax">IMAX</span>
                <span className="format-tag">Tiêu chuẩn</span>
              </div>
            </div>
            <button className="btn-outline">Xem suất chiếu</button>
          </div>

          {/* Card 3: CINE Vincom Đồng Khởi */}
          <div className="location-card">
            <div className="location-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="location-content">
              <h3>CINE Vincom Đồng Khởi</h3>
              <p className="location-address">72 Lê Thánh Tôn, Quận 3</p>
              <p className="location-distance">Cách đây 1.5 km</p>
              <div className="format-tags">
                <span className="format-tag dolby">Dolby</span>
                <span className="format-tag">4K</span>
              </div>
            </div>
            <button className="btn-outline">Xem suất chiếu</button>
          </div>
        </div>
      </div>
    </section>
  );
};
