'use client';

import React from 'react';
import { Product } from '../types/star-shop.type';
import { ScrollTextSlideLeft, HighlightText } from '@/shared/components/visual';
import dynamic from 'next/dynamic';

const DynamicCircularGallery = dynamic(
  () => import('@/shared/components/visual').then((mod) => mod.CircularGallery),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center text-text-muted">Đang tải Gallery...</div> }
);
interface FeaturedProductsGalleryProps {
  products: Product[];
}

function getShortName(name: string): string {
  if (name.includes('Dune Part Two')) return 'Dune Part Two';
  if (name.includes('Godzilla x Kong')) return 'Mô hình Godzilla';
  if (name.includes('Túi Tote')) return 'Túi Tote CineDot';
  if (name.includes('Akatsuki')) return 'Áo choàng Akatsuki';
  if (name.includes('Gear 5')) return 'Figure Luffy Gear 5';
  if (name.includes('Sukuna')) return 'Poster Sukuna';
  if (name.includes('Doraemon')) return 'Gấu bông Doraemon';
  if (name.includes('Pixar')) return 'Sách Art of Pixar';
  if (name.includes('Spirited Away')) return 'Puzzle Spirited Away';
  if (name.includes('Avengers')) return 'Bộ ly Avengers';
  if (name.includes('Kimetsu no Yaiba') || name.includes('Demon Slayer')) return 'Ghim Demon Slayer';
  if (name.includes('Combo Trẻ Em')) return 'Combo Trẻ Em';

  // Fallback splitting logic
  const parts = name.split(/—|-|–/);
  let short = parts[0].trim();
  if (short.length > 20) {
    short = short.substring(0, 18) + '...';
  }
  return short;
}

export function FeaturedProductsGallery({ products }: FeaturedProductsGalleryProps) {
  // Curate display products (top 10 items)
  const displayProducts = products.slice(0, 10);

  // Map products data to CircularGalleryItem format with clean, short names
  const galleryItems = displayProducts.map((product) => ({
    image: product.imageUrl,
    text: getShortName(product.name),
  }));

  return (
    <section className="section bg-background select-none overflow-hidden" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '3rem' }}>
      <div className="container mx-auto px-6">
        {/* Section Header matching CineDot standards */}
        <div className="section-header-tabs" style={{ marginBottom: '32px' }}>
          <div className="header-left">
            <p className="section-eyebrow">Sản phẩm nổi bật</p>
            <ScrollTextSlideLeft as="h2" className="section-title">
              Vũ Trụ{' '}
              <HighlightText variant="underline" color="primary">
                Quà Tặng
              </HighlightText>
            </ScrollTextSlideLeft>
          </div>
        </div>
      </div>

      {/* Gallery Viewport */}
      <div 
        className="relative w-full overflow-hidden"
        style={{ height: '480px' }}
      >
        {displayProducts.length === 0 ? (
          <div className="w-full flex items-center justify-center py-12 text-text-muted text-sm border border-dashed border-border rounded-2xl">
            Không có sản phẩm nổi bật nào.
          </div>
        ) : (
          <DynamicCircularGallery
            items={galleryItems}
            bend={0.5} // Gentle curvature (bend = 0.5) as requested
            textColor="var(--color-text-primary)"
            borderRadius={0.05}
            scrollEase={0.05}
            scrollSpeed={2}
          />
        )}
      </div>
    </section>
  );
}
export default FeaturedProductsGallery;
