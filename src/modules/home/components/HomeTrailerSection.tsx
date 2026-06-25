import React, { useState } from 'react';
import Link from 'next/link';
import {
  VideoPlayer,
  HighlightText,
  ScrollTextSlideLeft
} from '@/shared/components/visual';
import { appRoutes } from '@/shared/routes/appRoutes';
import dynamic from 'next/dynamic';

const DynamicTrailerModal = dynamic(
  () => import('@/shared/components/visual').then((mod) => mod.TrailerModal),
  { ssr: false }
);

export const HomeTrailerSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* TRAILER SECTION */}
      <section className="section trailer-section fade-up in-view">
        <div className="container">
          <div className="trailer-inner">
            <div className="trailer-visual-wrapper" style={{ position: 'relative', width: '100%', aspectRatio: '16/9', zIndex: 1 }}>
              {/* Decorative blurred background glow */}
              <div 
                className="trailer-visual-bg" 
                style={{ 
                  position: 'absolute', 
                  inset: '-20px', 
                  zIndex: 0, 
                  backgroundImage: `url('https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1200&q=80')`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center', 
                  filter: 'blur(30px) opacity(0.3)', 
                  pointerEvents: 'none',
                  borderRadius: '30px'
                }}
              />
              <VideoPlayer
                src="https://www.youtube.com/embed/ZXAcQeaTq0Q"
                poster="https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1200&q=80"
                title="Denis Villeneuve Masterpiece"
                className="cine-video-player"
                style={{ position: 'relative', zIndex: 2 }}
              />
            </div>
            <div className="trailer-content">
              <p className="section-eyebrow">Trailer nổi bật</p>

              <ScrollTextSlideLeft as="h2" className="section-title">
                Trải nghiệm{' '}
                <HighlightText variant="underline" color="primary">
                  Điện ảnh
                </HighlightText>
                <br />
                đỉnh cao
              </ScrollTextSlideLeft>

              <p className="trailer-desc">
                Đắm chìm vào thế giới tráng lệ của Arrakis. Chiêm ngưỡng toàn bộ sự kỳ vĩ trong kiệt
                tác của Denis Villeneuve — hiện đang chiếu tại các phòng chiếu IMAX và Dolby Cinema trên toàn hệ thống CINE.
              </p>
              <div className="trailer-stats">
                <div className="stat-item">
                  <span className="stat-num">166</span>
                  <span className="stat-label">Phút</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-num">8.7</span>
                  <span className="stat-label">Điểm IMDb</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-num">97%</span>
                  <span className="stat-label">Rotten Tomatoes</span>
                </div>
              </div>
              <Link
                href={appRoutes.movies}
                className="btn-primary btn-large"
                id="openTrailerBtn3"
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Đặt vé ngay
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CINEMATIC TRAILER MODAL */}
      {isModalOpen && (
        <DynamicTrailerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          videoSrc="https://www.youtube.com/embed/ZXAcQeaTq0Q"
          poster="https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=1200&q=80"
          title="Featured Trailer"
        />
      )}
    </>
  );
};
