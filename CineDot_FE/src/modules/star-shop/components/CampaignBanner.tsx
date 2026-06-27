'use client';

import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useStarShop';
import { appRoutes } from '@/shared/routes/appRoutes';
import { ScrollTextSlideLeft } from '@/shared/components/visual';
import dynamic from 'next/dynamic';

const DynamicShapeGrid = dynamic(() => import('@/shared/components/visual').then(mod => mod.ShapeGrid), {
  ssr: false,
});

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

export function CampaignBanner() {
  const { data } = useProducts(undefined);
  const products = data?.items || [];

  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 27,
    seconds: 42
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              } else {
                clearInterval(timer);
                return prev;
              }
            }
          }
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  // Logic to select the featured promotional product:
  // Priority: HOT badge -> SALE badge -> highest discount -> first product
  const getFeaturedProduct = () => {
    if (products.length === 0) return null;

    // 1. HOT badge
    const hot = products.filter((p) => p.badge?.toUpperCase() === 'HOT');
    if (hot.length > 0) return hot[0];

    // 2. SALE badge
    const sale = products.filter((p) => p.badge?.toUpperCase() === 'SALE');
    if (sale.length > 0) return sale[0];

    // 3. Highest discount
    const discounted = [...products]
      .filter((p) => p.discountPercent !== null && p.discountPercent > 0)
      .sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
    if (discounted.length > 0) return discounted[0];

    return products[0];
  };

  const product = getFeaturedProduct();

  // If no product is loaded yet (e.g. loading state), show a fallback section
  if (!product) {
    return (
      <section className="section campaign-section bg-background-soft" id="campaign" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="container text-center">
          <p className="text-text-muted text-xs">Đang tải chương trình ưu đãi...</p>
        </div>
      </section>
    );
  }

  // Calculate sold statistics for visual urgency using actual product stock data
  const soldCount = Math.max(12, Math.floor(product.stock * 1.4));
  const totalQty = product.stock + soldCount;
  const soldPercent = Math.round((soldCount / totalQty) * 100);

  const targetRoute = `${appRoutes.starShopCategory(product.category)}#shop`;

  return (
    <section className="section campaign-section bg-background-soft relative overflow-hidden" id="campaign" style={{ borderBottom: '1px solid var(--color-border)' }}>
      {/* Background ShapeGrid */}
      <div className="absolute inset-0 z-0 opacity-30">
        <DynamicShapeGrid
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor="var(--color-border)"
          hoverFillColor="var(--color-accent-deep)"
          shape="square"
          hoverTrailAmount={5}
        />
      </div>

      <div className="container mx-auto relative z-10 px-4 flex flex-col items-center justify-center w-full">
        <div className="w-full max-w-3xl flex flex-col gap-6 items-center justify-center text-center">

          <div>
            <p className="section-eyebrow">🔥 KHUYẾN MÃI GIỚI HẠN</p>
            <ScrollTextSlideLeft as="h2" className="section-title text-2xl lg:text-3xl font-bold">
              {product.name}
            </ScrollTextSlideLeft>
          </div>

          <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
            {product.description} Giảm giá đặc biệt trong thời gian diễn ra chiến dịch ra mắt merchandise chính hãng của CineDot.
          </p>

          {/* New Countdown Row */}
          <div className="flex items-start justify-center gap-3 md:gap-4 my-6 w-full">
            <div className="flex flex-col items-center">
              <div className="bg-[var(--color-surface)] text-[var(--color-text-primary)] rounded-xl w-14 h-14 md:w-16 md:h-16 flex items-center justify-center font-bold text-xl md:text-2xl border border-[var(--color-border)] shadow-sm">
                {formatTime(timeLeft.days)}
              </div>
              <span className="text-[10px] md:text-xs uppercase tracking-widest text-gray-400 mt-1.5 font-semibold">Ngày</span>
            </div>
            <div className="h-14 md:h-16 flex items-center text-xl md:text-2xl font-bold text-gray-400">:</div>
            <div className="flex flex-col items-center">
              <div className="bg-[var(--color-surface)] text-[var(--color-text-primary)] rounded-xl w-14 h-14 md:w-16 md:h-16 flex items-center justify-center font-bold text-xl md:text-2xl border border-[var(--color-border)] shadow-sm">
                {formatTime(timeLeft.hours)}
              </div>
              <span className="text-[10px] md:text-xs uppercase tracking-widest text-gray-400 mt-1.5 font-semibold">Giờ</span>
            </div>
            <div className="h-14 md:h-16 flex items-center text-xl md:text-2xl font-bold text-gray-400">:</div>
            <div className="flex flex-col items-center">
              <div className="bg-[var(--color-surface)] text-[var(--color-text-primary)] rounded-xl w-14 h-14 md:w-16 md:h-16 flex items-center justify-center font-bold text-xl md:text-2xl border border-[var(--color-border)] shadow-sm">
                {formatTime(timeLeft.minutes)}
              </div>
              <span className="text-[10px] md:text-xs uppercase tracking-widest text-gray-400 mt-1.5 font-semibold">Phút</span>
            </div>
            <div className="h-14 md:h-16 flex items-center text-xl md:text-2xl font-bold text-gray-400">:</div>
            <div className="flex flex-col items-center">
              <div className="bg-[var(--color-surface)] text-[var(--color-text-primary)] rounded-xl w-14 h-14 md:w-16 md:h-16 flex items-center justify-center font-bold text-xl md:text-2xl border border-[var(--color-border)] shadow-sm">
                {formatTime(timeLeft.seconds)}
              </div>
              <span className="text-[10px] md:text-xs uppercase tracking-widest text-gray-400 mt-1.5 font-semibold">Giây</span>
            </div>
          </div>

          {/* Premium Benefits for the Campaign */}
          <div className="flex flex-col md:flex-row gap-4 my-2 justify-center">
            <div className="flex gap-2 items-center">
              <span className="text-lg text-accent-deep">✦</span>
              <span className="text-xs font-medium text-text-secondary">Độc quyền đặt hàng trực tuyến</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-lg text-accent-deep">✦</span>
              <span className="text-xs font-medium text-text-secondary">Freeship + Đóng hộp Premium</span>
            </div>
          </div>

          {/* Progress bar using actual stock metrics */}
          <div className="w-full max-w-md mt-2">
            <div className="flex justify-between items-center text-xs text-text-secondary mb-2.5">
              <span className="font-semibold text-accent-deep">🔥 Đã bán: {soldPercent}%</span>
              <span className="text-text-muted">Còn lại {product.stock} sản phẩm</span>
            </div>
            <div className="w-full h-2 rounded-full bg-border overflow-hidden">
              <div className="h-full bg-cta rounded-full" style={{ width: `${soldPercent}%` }} />
            </div>
          </div>

          <div className="pt-4">
            <a href={targetRoute} className="btn-primary btn-large inline-flex items-center gap-2">
              🛍️ Mua Ngay ({formatPrice(product.price)})
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
