import React from 'react';
import { ProductCategory } from '../types/star-shop.type';
import { ScrollTextSlideLeft, HighlightText } from '@/shared/components/visual';
interface HeroSectionProps {
  initialCategory?: ProductCategory;
}

interface HeroContent {
  badge: string;
  title: string;
  accentTitle: string;
  subtitle: string;
  imageUrl: string;
}

const HERO_METADATA: Record<string, HeroContent> = {
  all: {
    badge: 'Merchandise & Gifts',
    title: 'Sưu Tầm Vũ Trụ',
    accentTitle: 'Điện Ảnh',
    subtitle: 'Khám phá bộ sưu tập quà tặng điện ảnh cao cấp — từ mô hình nhân vật, steelbook phiên bản giới hạn đến merchandise anime chính hãng.',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1600&q=80',
  },
  'movie-verse': {
    badge: 'Movie Merchandise',
    title: 'Vũ Trụ Điện Ảnh',
    accentTitle: 'Movie-Verse',
    subtitle: 'Mô hình bom tấn, đĩa thép steelbook giới hạn và những vật phẩm sưu tầm độc quyền từ các franchise điện ảnh lớn nhất.',
    imageUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1600&q=80',
  },
  'fan-wibu': {
    badge: 'Otaku & Anime',
    title: 'Thế Giới Anime &',
    accentTitle: 'Manga',
    subtitle: 'Thỏa mãn đam mê với figure tinh xảo từ các bộ anime hot nhất, cosplay chất lượng cao và các ấn phẩm manga chính hãng độc quyền.',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1600&q=80',
  },
  'inner-child': {
    badge: 'Toys & Nostalgia',
    title: 'Đánh Thức Tuổi Thơ',
    accentTitle: 'Inner Child',
    subtitle: 'Tìm lại những kỷ niệm ấm áp với gấu bông mềm mại, artbook chính gốc của Pixar/Ghibli và các bộ xếp hình nghệ thuật sáng tạo.',
    imageUrl: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=1600&q=80',
  },
};

export function HeroSection({ initialCategory }: HeroSectionProps) {
  const content = HERO_METADATA[initialCategory || 'all'] || HERO_METADATA.all;

  return (
    <section className="star-shop-hero">
      <div className="star-shop-hero-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={content.imageUrl}
          alt={content.badge}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.25,
            mixBlendMode: 'overlay',
          }}
        />
      </div>
      
      <div className="container star-shop-hero-content">
        <div className="max-w-2xl flex flex-col items-start gap-4">
          <span className="star-shop-hero-badge">
            🌟 {content.badge}
          </span>
          
          <ScrollTextSlideLeft as="h2" className="star-shop-hero-title">
            {content.title}{' '}
            <HighlightText variant="underline" color="primary">
              {content.accentTitle}
            </HighlightText>
          </ScrollTextSlideLeft>
          
          <p className="star-shop-hero-subtitle">
            {content.subtitle}
          </p>

          <div className="flex gap-4 mt-4">
            <a href="#shop" className="btn-primary btn-large">
              🛍️ Mua Sắm Ngay
            </a>
            <a href="#collections" className="btn-ghost btn-large">
              Khám Phá Bộ Sưu Tập
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
