import React from 'react';
import { Product, CATEGORY_LABELS } from '../types/star-shop.type';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="star-shop-card">
      <div className="star-shop-card-image-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="star-shop-card-image"
          loading="lazy"
        />

        {/* Dynamic Badges */}
        {product.badge && (
          <span className={`star-shop-badge star-shop-badge--${product.badge.toLowerCase()}`}>
            {product.badge}
          </span>
        )}

        {product.discountPercent && (
          <span className="star-shop-discount-badge">
            -{product.discountPercent}%
          </span>
        )}
      </div>

      <div className="star-shop-card-body">
        <div className="star-shop-card-category">
          {CATEGORY_LABELS[product.category]}
        </div>

        <h3 className="star-shop-card-name">
          {product.name}
        </h3>

        <p className="star-shop-card-desc">
          {product.description}
        </p>

        {/* Footer Area with Price and Actions */}
        <div className="star-shop-card-footer">
          <div className="star-shop-card-price-wrap">
            <span className="star-shop-card-price">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="star-shop-card-original-price">
                {formatPrice(product.originalPrice)}
              </span>
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
