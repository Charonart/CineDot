import React from 'react';
import { ScrollTextSlideLeft, HighlightText } from '@/shared/components/visual';

export const HomeMembership: React.FC = () => {
  return (
    <section className="section membership fade-up in-view">
      <div className="container">
        <div className="membership-inner">
          <div className="membership-left">
            <p className="section-eyebrow">Quyền lợi độc quyền</p>
            <ScrollTextSlideLeft as="h2" className="section-title">
              Thành viên <HighlightText variant="underline" color="primary">CINE</HighlightText>
            </ScrollTextSlideLeft>
            <p className="membership-desc">
              Mở khóa thế giới đặc quyền điện ảnh. Tích điểm với mỗi lần đặt vé, tận hưởng vị trí
              ngồi ưu tiên và tham gia các buổi chiếu phim đặc biệt dành riêng cho thành viên trước bất kỳ ai khác.
            </p>
            <div className="benefits-list">
              <div className="benefit-item">
                <div className="benefit-icon">✦</div>
                <div>
                  <strong>Tích lũy & Đổi điểm</strong>
                  <p>Tích lũy 10 điểm mỗi vé. Đổi điểm nhận vé xem phim miễn phí.</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✦</div>
                <div>
                  <strong>Đặt vé trước</strong>
                  <p>Đặt vé sớm trước 48 giờ đối với các phim mới phát hành.</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✦</div>
                <div>
                  <strong>Suất chiếu thành viên</strong>
                  <p>Các buổi chiếu thử độc quyền. Miễn phí đồ uống đi kèm.</p>
                </div>
              </div>
            </div>
            <button className="btn-primary btn-large">Đăng ký Thành viên</button>
          </div>
          <div className="membership-right">
            <div className="member-card">
              <div className="member-card-top">
                <span className="member-logo">CINE</span>
                <span className="member-tier">Thành viên Gold</span>
              </div>
              <div className="member-card-name">Nguyen Van A</div>
              <div className="member-card-points">
                <div className="points-label">Điểm tích lũy</div>
                <div className="points-value">2.450</div>
                <div className="points-bar-wrap">
                  <div className="points-bar">
                    <div className="points-fill" style={{ width: '65%' }}></div>
                  </div>
                  <span className="points-next">Còn 650 điểm để lên Platinum</span>
                </div>
              </div>
              <div className="member-card-number">•••• •••• •••• 4821</div>
            </div>
            <div className="offer-banner">
              <div className="offer-icon">🎬</div>
              <div>
                <strong>Ưu đãi cuối tuần</strong>
                <p>Mua 1 vé, giảm 50% cho vé thứ hai — áp dụng mỗi Thứ Bảy & Chủ Nhật.</p>
              </div>
              <button className="btn-sm btn-primary">Nhận ưu đãi</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
