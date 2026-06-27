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
    <div className="star-shop-card group h-full flex flex-col">
      {/* Image Container */}
      <div className="star-shop-card-image-wrap aspect-square relative overflow-hidden bg-background-soft shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="star-shop-card-image w-full h-full object-cover"
          loading="lazy"
        />

        {/* Badges */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2 py-1 text-[10px] font-bold tracking-wider text-white uppercase bg-linear-to-r from-orange-500 to-red-500 rounded-sm shadow-sm">
              {product.badge}
            </span>
          </div>
        )}

        {product.discountPercent && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2 py-1 text-[10px] font-bold tracking-wider text-white uppercase bg-error/90 backdrop-blur-sm rounded-sm shadow-sm">
              -{product.discountPercent}%
            </span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="star-shop-card-body flex flex-col flex-1 justify-between">
        <div className="flex flex-col gap-1">
          <span className="star-shop-card-category">{CATEGORY_LABELS[product.category]}</span>

          <h3
            className="star-shop-card-name line-clamp-2 group-hover:text-[#7C6FE8] transition-colors duration-300"
            style={{
              height: '40px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {product.name}
          </h3>
        </div>

        {/* Price & Original Price */}
        <div className="flex items-baseline gap-2 mt-auto mb-3">
          <span className="star-shop-card-price text-[18px] font-bold text-[#7C6FE8]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="star-shop-card-original-price text-xs line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Footer Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={!product.isInStock}
            className={`w-full h-[38px] rounded-[4px] text-[13px] font-medium transition-colors duration-300 ${product.isInStock
              ? 'bg-[#7C6FE8] text-white hover:opacity-90 shadow-sm cursor-pointer'
              : 'bg-surface border border-border text-text-muted cursor-not-allowed'
              }`}
            aria-label={`Mua ngay ${product.name}`}
          >
            {product.isInStock ? 'Mua ngay' : 'Hết hàng'}
          </button>

          <button
            type="button"
            disabled={!product.isInStock}
            className={`w-full h-[38px] flex justify-center items-center gap-1.5 rounded-[4px] text-[13px] font-medium border-[1.5px] border-solid transition-colors duration-300 ${product.isInStock
              ? 'border-[#7C6FE8] text-[#7C6FE8] bg-surface hover:bg-[#7C6FE8]/10 cursor-pointer'
              : 'border-border text-text-muted bg-background-soft cursor-not-allowed'
              }`}
            aria-label={`Thêm ${product.name} vào giỏ hàng`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className="truncate">Thêm vào giỏ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
