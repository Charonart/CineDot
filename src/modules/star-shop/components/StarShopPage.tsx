'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useProducts } from '../hooks/useStarShop';
import { ProductCategory } from '../types/star-shop.type';
import { appRoutes } from '@/shared/routes/appRoutes';
import { HeroSection } from './HeroSection';
import { FeaturedProductsGallery } from './FeaturedProductsGallery';
import { CampaignBanner } from './CampaignBanner';
import { PremiumShowcase } from './PremiumShowcase';
import { ProductCard } from './ProductCard';

interface StarShopPageProps {
  initialCategory?: ProductCategory;
}



function ProductSkeleton() {
  return (
    <div className="flex flex-col h-full bg-surface rounded-md border border-[var(--color-border)] shadow-[var(--shadow-sm)] overflow-hidden">
      <div className="aspect-square bg-background-soft animate-pulse shrink-0" />
      <div className="flex flex-col flex-1 p-4">
        <div className="flex flex-col gap-2 mb-3">
          <div className="h-4 w-5/6 bg-background-soft rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-background-soft rounded animate-pulse" />
          <div className="h-6 w-1/3 bg-background-soft rounded animate-pulse mt-2" />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <div className="h-9 w-full bg-background-soft rounded-[4px] animate-pulse" />
          <div className="h-9 w-full bg-background-soft rounded-[4px] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function StarShopPage({ initialCategory }: StarShopPageProps) {
  // Sync category state with category route param
  const [activeCategory, setActiveCategory] = useState<ProductCategory | undefined>(initialCategory);

  // Note: Search and sorting functionality has been removed for a cleaner UI

  // Trigger state update on route change
  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const refMovieVerse = useRef<HTMLAnchorElement>(null);
  const refFanWibu = useRef<HTMLAnchorElement>(null);
  const refInnerChild = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const activeBtn =
      activeCategory === 'movie-verse' ? refMovieVerse.current :
        activeCategory === 'fan-wibu' ? refFanWibu.current :
          activeCategory === 'inner-child' ? refInnerChild.current : null;

    if (activeBtn) {
      setIndicatorStyle({
        left: `${activeBtn.offsetLeft}px`,
        width: `${activeBtn.offsetWidth}px`,
        opacity: 1
      });
    } else {
      setIndicatorStyle({
        opacity: 0
      });
    }
  }, [activeCategory]);

  useEffect(() => {
    const handleResize = () => {
      const activeBtn =
        activeCategory === 'movie-verse' ? refMovieVerse.current :
          activeCategory === 'fan-wibu' ? refFanWibu.current :
            activeCategory === 'inner-child' ? refInnerChild.current : null;

      if (activeBtn) {
        setIndicatorStyle({
          left: `${activeBtn.offsetLeft}px`,
          width: `${activeBtn.offsetWidth}px`,
          opacity: 1
        });
      } else {
        setIndicatorStyle({
          opacity: 0
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeCategory]);

  const { data, isLoading, isError } = useProducts(activeCategory);

  const rawProducts = data?.items || [];



  return (
    <div className="star-shop-page min-h-screen bg-background text-text-primary transition-colors duration-300">
      {/* 1. Dynamic Hero Banner matching site identity */}
      <HeroSection initialCategory={activeCategory} />

      {/* 2. Category Navigation Tabs */}
      <section className="star-shop-tabs-section bg-background pt-8 pb-4" style={{ marginTop: '2.5rem' }}>
        <div className="container mx-auto px-6 text-center">
          <div className="tabs-nav-container" style={{ display: 'inline-flex' }}>
            <div className="tabs-nav" id="starShopTabs" style={{ position: 'relative' }}>
              <Link
                ref={refMovieVerse}
                href={appRoutes.starShopCategory('movie-verse')}
                className={`tab-btn ${activeCategory === 'movie-verse' ? 'active' : ''}`}
              >
                Movie-Verse
              </Link>
              <Link
                ref={refFanWibu}
                href={appRoutes.starShopCategory('fan-wibu')}
                className={`tab-btn ${activeCategory === 'fan-wibu' ? 'active' : ''}`}
              >
                Fan Wibu
              </Link>
              <Link
                ref={refInnerChild}
                href={appRoutes.starShopCategory('inner-child')}
                className={`tab-btn ${activeCategory === 'inner-child' ? 'active' : ''}`}
              >
                Inner Child
              </Link>
              <span className="tab-glow-indicator" id="starShopTabIndicator" style={indicatorStyle}></span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Products Gallery */}
      <FeaturedProductsGallery products={rawProducts} />

      {/* 4. Limited urgencies Campaign Banner */}
      <CampaignBanner />

      {/* 5. Dynamic Premium Showcase for Editorial Highlights */}
      {rawProducts.length > 0 && <PremiumShowcase products={rawProducts} />}

      {/* 6. Main Listing section */}
      <section className="star-shop-products" id="shop">
        <div className="container mx-auto px-6">

          {/* Section Heading */}
          <div className="mb-6">
            <h2 className="text-xl font-bold uppercase tracking-wider text-text-primary mb-1">
              Danh Mục Sản Phẩm
            </h2>
            <p className="text-xs text-text-muted">
              Xem toàn bộ quà tặng chất lượng cao có trong hệ thống CineDot.
            </p>
          </div>



          {/* Load Error */}
          {isError && (
            <div className="flex flex-col items-center justify-center py-12 text-center text-error border border-error/20 bg-error/5 rounded-2xl gap-2">
              <span className="text-2xl">⚠️</span>
              <p className="font-semibold text-sm">Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.</p>
            </div>
          )}

          {/* Grid View */}
          {isLoading ? (
            <div className="star-shop-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : rawProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-text-muted border border-dashed border-border rounded-2xl gap-3">
              <span className="text-3xl">🛍️</span>
              <p className="font-medium text-xs">Không tìm thấy sản phẩm phù hợp.</p>
            </div>
          ) : (
            <div className="star-shop-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {rawProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
