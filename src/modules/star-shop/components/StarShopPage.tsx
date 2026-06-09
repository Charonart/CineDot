'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useProducts } from '../hooks/useStarShop';
import { ProductCategory, CATEGORY_LABELS, Product } from '../types/star-shop.type';
import { appRoutes } from '@/shared/routes/appRoutes';

interface StarShopPageProps {
  initialCategory?: ProductCategory;
}

const CATEGORIES: { value: ProductCategory | undefined; label: string }[] = [
  { value: undefined, label: 'Tất Cả' },
  { value: 'movie-verse', label: 'Movie-verse' },
  { value: 'fan-wibu', label: 'Fan Wibu' },
  { value: 'inner-child', label: 'Inner Child' },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="star-shop-card">
      <div className="star-shop-card-image-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.imageUrl} alt={product.name} className="star-shop-card-image" loading="lazy" />
        {product.badge && (
          <span className={`star-shop-badge star-shop-badge--${product.badge.toLowerCase()}`}>
            {product.badge}
          </span>
        )}
        {product.discountPercent && (
          <span className="star-shop-discount-badge">-{product.discountPercent}%</span>
        )}
      </div>
      <div className="star-shop-card-body">
        <div className="star-shop-card-category">
          {CATEGORY_LABELS[product.category]}
        </div>
        <h3 className="star-shop-card-name">{product.name}</h3>
        <p className="star-shop-card-desc">{product.description}</p>
        <div className="star-shop-card-footer">
          <div className="star-shop-card-price-wrap">
            <span className="star-shop-card-price">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="star-shop-card-original-price">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <div className="star-shop-card-actions">
            <button
              type="button"
              className="btn-star-shop-add"
              disabled={!product.isInStock}
              aria-label={`Thêm ${product.name} vào giỏ hàng`}
            >
              {product.isInStock ? 'Thêm giỏ' : 'Hết hàng'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="star-shop-card star-shop-card--skeleton">
      <div className="skeleton-image" />
      <div className="star-shop-card-body">
        <div className="skeleton-line skeleton-line--short" />
        <div className="skeleton-line" />
        <div className="skeleton-line skeleton-line--medium" />
      </div>
    </div>
  );
}

export function StarShopPage({ initialCategory }: StarShopPageProps) {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | undefined>(initialCategory);
  const { data, isLoading, isError } = useProducts(activeCategory);

  const products = data?.items || [];

  return (
    <div className="star-shop-page">
      {/* Hero */}
      <section className="star-shop-hero">
        <div className="star-shop-hero-bg" aria-hidden="true" />
        <div className="container star-shop-hero-content">
          <div className="star-shop-hero-badge">🌟 Merchandise & Gifts</div>
          <h1 className="star-shop-hero-title">Star Shop</h1>
          <p className="star-shop-hero-subtitle">
            Bộ sưu tập quà tặng điện ảnh cao cấp — từ mô hình, poster đến merchandise anime chính hãng
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="star-shop-categories">
        <div className="container">
          <div className="star-shop-tabs" role="tablist" aria-label="Danh mục sản phẩm">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value ?? 'all'}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat.value}
                className={`star-shop-tab ${activeCategory === cat.value ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
          {/* Category nav links for sub-routes */}
          <div className="star-shop-category-nav">
            <Link href={appRoutes.starShop} className={`star-shop-cat-link ${!initialCategory ? 'active' : ''}`}>
              Tất Cả
            </Link>
            <Link href={appRoutes.starShopCategory('movie-verse')} className={`star-shop-cat-link ${initialCategory === 'movie-verse' ? 'active' : ''}`}>
              Movie-verse
            </Link>
            <Link href={appRoutes.starShopCategory('fan-wibu')} className={`star-shop-cat-link ${initialCategory === 'fan-wibu' ? 'active' : ''}`}>
              Fan Wibu
            </Link>
            <Link href={appRoutes.starShopCategory('inner-child')} className={`star-shop-cat-link ${initialCategory === 'inner-child' ? 'active' : ''}`}>
              Inner Child
            </Link>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="star-shop-products">
        <div className="container">
          {isError && (
            <div className="star-shop-error-state">
              <span className="state-icon">⚠️</span>
              <p>Không thể tải sản phẩm. Vui lòng thử lại sau.</p>
            </div>
          )}

          {isLoading ? (
            <div className="star-shop-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="star-shop-empty-state">
              <span className="state-icon">🛍️</span>
              <p>Chưa có sản phẩm trong danh mục này.</p>
            </div>
          ) : (
            <div className="star-shop-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
