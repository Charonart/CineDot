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
    <div className="star-shop-card star-shop-card--skeleton flex flex-col">
      <div className="skeleton-image aspect-[4/5] animate-pulse" />
      <div className="star-shop-card-body p-4 flex flex-col gap-3">
        <div className="skeleton-line skeleton-line--short" />
        <div className="skeleton-line" />
        <div className="skeleton-line skeleton-line--medium" />
      </div>
    </div>
  );
}

export function StarShopPage({ initialCategory }: StarShopPageProps) {
  // Sync category state with category route param
  const [activeCategory, setActiveCategory] = useState<ProductCategory | undefined>(initialCategory);
  
  // Client-side text search & sorting states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

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
  
  // 1. Client-side text query search
  let processedProducts = rawProducts;
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    processedProducts = processedProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // 2. Client-side sorting
  processedProducts = [...processedProducts].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return a.price - b.price;
    } else if (sortBy === 'price-desc') {
      return b.price - a.price;
    } else if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name);
    } else {
      // Default: newest (reverse ID sequence)
      return b.id.localeCompare(a.id);
    }
  });

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

          {/* Filtering & Sorting Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-background-soft border border-border rounded-2xl mb-8 shadow-sm">
            {/* Search Box */}
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-3 flex items-center text-text-muted text-xs">🔍</span>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-surface border border-border text-xs text-text-primary focus:outline-none focus:border-accent-deep transition-all duration-300"
              />
            </div>

            {/* Sorting Select */}
            <div className="w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface border border-border text-xs font-bold text-text-secondary cursor-pointer hover:border-text-primary focus:outline-none transition-colors"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="name-asc">Tên: A - Z</option>
                <option value="name-desc">Tên: Z - A</option>
              </select>
            </div>
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
            <div className="star-shop-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : processedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-text-muted border border-dashed border-border rounded-2xl gap-3">
              <span className="text-3xl">🛍️</span>
              <p className="font-medium text-xs">Không tìm thấy sản phẩm phù hợp.</p>
            </div>
          ) : (
            <div className="star-shop-grid">
              {processedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
