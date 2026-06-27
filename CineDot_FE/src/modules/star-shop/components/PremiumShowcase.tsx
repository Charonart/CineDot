import React from 'react';
import { Product } from '../types/star-shop.type';
import { ScrollTextSlideLeft } from '@/shared/components/visual';

interface PremiumShowcaseProps {
  products: Product[];
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

export function PremiumShowcase({ products }: PremiumShowcaseProps) {
  // Select dynamic best-seller: first product with 'HOT' or 'SALE' badge. Fallback to first product.
  const featuredProduct =
    products.find((p) => p.badge === 'HOT' || p.badge === 'SALE') || products[0];

  if (!featuredProduct) return null;

  const savings =
    featuredProduct.originalPrice && featuredProduct.originalPrice > featuredProduct.price
      ? featuredProduct.originalPrice - featuredProduct.price
      : 0;

  return (
    <section className="section premium-showcase-section bg-background" id="spotlight" style={{ borderBottom: '1px solid var(--color-border)' }}>
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Column 1: Editorial Details & Action */}
          <div className="lg:col-span-7 flex flex-col gap-6 order-2 lg:order-1">
            <div>
              <p className="section-eyebrow">⭐ Sản phẩm tiêu biểu</p>
              <ScrollTextSlideLeft as="h2" className="section-title">
                {featuredProduct.name}
              </ScrollTextSlideLeft>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">
              {featuredProduct.description}
            </p>

            {/* Core Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-2">
              <div className="flex gap-3 items-start">
                <span className="text-base">🛡️</span>
                <div>
                  <h4 className="font-bold text-text-primary text-xs">Cam kết chính hãng</h4>
                  <p className="text-[10px] text-text-muted mt-0.5">Đầy đủ bản quyền từ nhà sản xuất phim.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-base">📦</span>
                <div>
                  <h4 className="font-bold text-text-primary text-xs">Đóng gói cao cấp</h4>
                  <p className="text-[10px] text-text-muted mt-0.5">Bọc xốp chống sốc 3 lớp, bảo vệ nguyên vẹn hộp sản phẩm.</p>
                </div>
              </div>
            </div>

            {/* Price display & purchase action */}
            <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-6">
              <div>
                <span className="text-[10px] text-text-muted block mb-0.5">Giá mở bán ưu đãi</span>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-extrabold text-cta">{formatPrice(featuredProduct.price)}</span>
                  {featuredProduct.originalPrice && (
                    <span className="text-sm text-text-muted line-through">{formatPrice(featuredProduct.originalPrice)}</span>
                  )}
                </div>
                {savings > 0 && (
                  <span className="text-[10px] font-bold text-success block mt-1">
                    Tiết kiệm {formatPrice(savings)} (-{featuredProduct.discountPercent}%)
                  </span>
                )}
              </div>

              <button
                type="button"
                className="btn-primary btn-large"
                disabled={!featuredProduct.isInStock}
              >
                {featuredProduct.isInStock ? '🛍️ Thêm Vào Giỏ' : 'Hết hàng'}
              </button>
            </div>

            {/* Stock Meter */}
            <div className="w-full">
              <div className="w-full h-1.5 rounded-full bg-border overflow-hidden mb-1.5">
                <div className="h-full bg-accent-deep rounded-full" style={{ width: '65%' }} />
              </div>
              <div className="text-[10px] text-text-muted">
                Còn lại <span className="font-bold text-text-primary">{featuredProduct.stock} sản phẩm</span> trong kho
              </div>
            </div>
          </div>

          {/* Column 2: Framed Display Image with Blur Layering */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative w-full max-w-sm mx-auto aspect-[4/5]" style={{ zIndex: 1 }}>
              {/* Decorative Blur Background Layer */}
              <div
                className="absolute inset-[-15px] rounded-3xl pointer-events-none"
                style={{
                  zIndex: 0,
                  backgroundImage: `url(${featuredProduct.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(24px) opacity(0.25)',
                }}
              />
              
              {/* Sharp Display card */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border bg-surface shadow-md flex items-center justify-center" style={{ zIndex: 2 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredProduct.imageUrl}
                  alt={featuredProduct.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
                  loading="lazy"
                />
                <span className="absolute top-4 left-4 px-3 py-1 bg-accent-deep text-white text-[9px] font-bold rounded-full uppercase tracking-wider">
                  ⭐ Nổi bật nhất
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
