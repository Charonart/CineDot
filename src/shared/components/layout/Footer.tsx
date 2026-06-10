import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const socialBtnStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    font: 'inherit',
    color: 'inherit',
    padding: 0,
    cursor: 'not-allowed',
    opacity: 0.6
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">CINE</div>
            <p>
              Đặt vé nhanh. Xem phim hay.{' '}
              <span className="highlight-text" data-variant="underline" data-color="accent">
                Trải nghiệm điện ảnh cao cấp.
              </span>
            </p>
            <div className="social-links">
              <button type="button" className="social-link" style={socialBtnStyle}>FB</button>
              <button type="button" className="social-link" style={socialBtnStyle}>IG</button>
              <button type="button" className="social-link" style={socialBtnStyle}>TW</button>
              <button type="button" className="social-link" style={socialBtnStyle}>YT</button>
            </div>
          </div>
          <div className="footer-links-group">
            <h4>Phim</h4>
            <Link href="/movies?category=now-showing">Phim Đang chiếu</Link>
            <Link href="/movies?category=coming-soon">Phim Sắp chiếu</Link>
            <Link href="/movies?category=coming-soon">Đặt vé trước</Link>
            <Link href="/movies?category=imax">Suất chiếu đặc biệt</Link>
          </div>
          <div className="footer-links-group">
            <h4>Hệ thống rạp</h4>
            <Link href="/coming-soon">CINE Landmark</Link>
            <Link href="/coming-soon">CINE Crescent</Link>
            <Link href="/coming-soon">CINE Vincom</Link>
            <Link href="/coming-soon">Tìm rạp chiếu</Link>
          </div>
          <div className="footer-links-group">
            <h4>Hỗ trợ</h4>
            <Link href="/coming-soon">Trung tâm trợ giúp</Link>
            <Link href="/coming-soon">Câu hỏi thường gặp</Link>
            <Link href="/coming-soon">Chính sách hoàn tiền</Link>
            <Link href="/coming-soon">Liên hệ</Link>
          </div>
          <div className="footer-app">
            <h4>Tải ứng dụng</h4>
            <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="app-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              App Store
            </a>
            <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="app-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.76c.26.15.56.24.89.24.37 0 .75-.1 1.09-.3l12.96-7.48-2.79-2.79-12.15 10.33zM20.12 7.38L7.15.3c-.34-.2-.72-.3-1.09-.3-.33 0-.63.09-.89.24L17.32 12l2.8-4.62zM1 21.37V2.63L13.67 12 1 21.37zM7.15 23.7l12.97-7.48c.59-.34.97-.97.97-1.66v-.12L2.18 24c.26.15.56.24.89.24.37 0 .75-.1 1.08-.3v.02z" />
              </svg>
              Google Play
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 CINE. Bảo lưu mọi quyền.</p>
          <div className="footer-legal">
            <Link href="/coming-soon">Quyền riêng tư</Link>
            <Link href="/coming-soon">Điều khoản</Link>
            <Link href="/coming-soon">Cookie</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
