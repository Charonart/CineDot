'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tag, Sparkles, ArrowUpRight, Check, Copy } from 'lucide-react';
import { PromotionItem } from '../types/home.types';
import { MOCK_PROMOTIONS } from '../mocks/mockHomeData';

interface PromotionsSectionProps {
  promotions: PromotionItem[];
}

export const PromotionsSection: React.FC<PromotionsSectionProps> = ({ promotions }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activePromotions = React.useMemo(() => {
    return promotions && promotions.length > 0 ? promotions : MOCK_PROMOTIONS;
  }, [promotions]);

  const samplePromoCodes: Record<string, string> = {
    '0': 'CINEDOT20',
    '1': 'VETHU3_50K',
    '2': 'POPCORN_FREE',
    '3': 'STUDENT_PASS',
  };

  const handleCopyCode = (e: React.MouseEvent, code: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section className="relative w-full py-16 sm:py-20 bg-white border-t border-b border-gray-200/60">
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-5 bg-[#7C6FE8] rounded-full" />
              <span className="text-xs font-bold tracking-widest text-[#7C6FE8] uppercase">
                ƯU ĐÃI ĐẶC QUYỀN
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-950">
              Sự Kiện & Khuyến Mãi Hot
            </h2>
          </div>

          <Link href="/events">
            <span className="text-xs sm:text-sm font-bold text-[#7C6FE8] hover:text-[#685bc7] flex items-center gap-1 transition-colors">
              Xem tất cả ưu đãi <ArrowUpRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

        {/* 4 Cards Promo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activePromotions.map((promo, idx) => {
            const promoCode = samplePromoCodes[String(idx)] || 'CINEVIP';
            const isCopied = copiedCode === promoCode;

            return (
              <Link
                key={promo.id}
                href={promo.linkUrl || '/events'}
                className="group relative flex flex-col justify-between rounded-2xl p-4 bg-white border border-gray-200/80 hover:border-[#7C6FE8]/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div>
                  {/* Image Frame with Aspect Ratio */}
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-gray-100 mb-3.5">
                    <img
                      src={promo.imageUrl}
                      alt={promo.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-[#7C6FE8] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <Tag className="w-3 h-3" />
                      Ưu đãi
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-[#7C6FE8] transition-colors leading-snug line-clamp-2">
                    {promo.title}
                  </h3>
                  {promo.subtitle && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {promo.subtitle}
                    </p>
                  )}
                </div>

                {/* Voucher Code Strip */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-700 font-mono">
                    <span className="text-[10px] text-gray-400 uppercase font-sans">Mã:</span>
                    <span className="font-bold text-[#7C6FE8]">{promoCode}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleCopyCode(e, promoCode)}
                    className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-[#7C6FE8] text-[#7C6FE8] hover:text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Đã lưu</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Lưu mã</span>
                      </>
                    )}
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
