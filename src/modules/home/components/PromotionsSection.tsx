'use client';

import React from 'react';
import Link from 'next/link';
import { PromotionItem } from '../types/home.types';

interface PromotionsSectionProps {
  promotions: PromotionItem[];
}

export const PromotionsSection: React.FC<PromotionsSectionProps> = ({ promotions }) => {
  return (
    <section className="w-full py-20 bg-[var(--bg)]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
        {/* Header with Title */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 bg-[#7C6FE8] rounded-full shadow-[0_0_12px_rgba(124,111,232,0.6)]" />
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text)] uppercase">
              TIN KHUYẾN MÃI
            </h2>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {promotions.map((promo) => (
            <Link
              key={promo.id}
              href={promo.linkUrl}
              className="group flex flex-col gap-3 p-3 rounded-3xl transition-all duration-300 hover:bg-[var(--bg2)] hover:shadow-[0_12px_30px_rgba(124,111,232,0.18)] border border-transparent hover:border-[#7C6FE8]/20"
            >
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[var(--bg2)] shadow-md">
                <img
                  src={promo.imageUrl}
                  alt={promo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[var(--text)] group-hover:text-[#7C6FE8] transition-colors leading-snug line-clamp-2">
                  {promo.title}
                </h3>
                {promo.subtitle && (
                  <p className="text-xs text-[var(--muted)] mt-1 line-clamp-1">
                    {promo.subtitle}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
