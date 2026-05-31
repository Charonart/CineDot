import React from 'react';

export const Footer: React.FC = () => {
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
              <a href="#" className="social-link">FB</a>
              <a href="#" className="social-link">IG</a>
              <a href="#" className="social-link">TW</a>
              <a href="#" className="social-link">YT</a>
            </div>
          </div>
          <div className="footer-links-group">
            <h4>Phim</h4>
            <a href="#">Đang chiếu</a>
            <a href="#">Sắp chiếu</a>
            <a href="#">Đặt vé trước</a>
            <a href="#">Suất chiếu đặc biệt</a>
          </div>
          <div className="footer-links-group">
            <h4>Hệ thống rạp</h4>
            <a href="#">CINE Landmark</a>
            <a href="#">CINE Crescent</a>
            <a href="#">CINE Vincom</a>
            <a href="#">Tìm rạp chiếu</a>
          </div>
          <div className="footer-links-group">
            <h4>Hỗ trợ</h4>
            <a href="#">Trung tâm trợ giúp</a>
            <a href="#">Câu hỏi thường gặp</a>
            <a href="#">Chính sách hoàn tiền</a>
            <a href="#">Liên hệ</a>
          </div>
          <div className="footer-app">
            <h4>Tải ứng dụng</h4>
            <a href="#" className="app-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              App Store
            </a>
            <a href="#" className="app-btn">
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
            <a href="#">Quyền riêng tư</a>
            <a href="#">Điều khoản</a>
            <a href="#">Cookie</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
