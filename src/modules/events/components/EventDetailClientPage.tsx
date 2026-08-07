'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  Check,
  Building2,
  ShieldAlert,
  Ticket,
  Sparkles,
  Gift,
  CheckCircle2,
} from 'lucide-react';
import { CineDotEvent } from '../types/events.types';
import { fetchEventByIdOrSlug } from '../services/events.service';
import { Skeleton } from '@/shared/ui/Skeleton';

interface EventDetailClientPageProps {
  idOrSlug: string;
}

export function EventDetailClientPage({ idOrSlug }: EventDetailClientPageProps) {
  const [event, setEvent] = useState<CineDotEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const found = await fetchEventByIdOrSlug(idOrSlug);
        setEvent(found);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [idOrSlug]);

  const handleCopyCode = () => {
    if (event?.couponCode) {
      navigator.clipboard.writeText(event.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="w-full pt-28 pb-20 bg-[#FEFEFE] min-h-screen">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-8 flex flex-col gap-6">
          <Skeleton variant="text" className="w-1/4 h-6" />
          <Skeleton variant="text" className="w-3/4 h-12" />
          <Skeleton variant="card" className="w-full h-80 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="w-full pt-36 pb-20 bg-[#FEFEFE] min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <h2 className="text-2xl font-extrabold text-slate-800">Không tìm thấy thông tin sự kiện này</h2>
        <p className="text-sm text-slate-500">Chương trình khuyến mãi có thể đã hết hạn hoặc không khả dụng.</p>
        <Link href="/events">
          <button className="px-6 py-2.5 rounded-full bg-[#7C6FE8] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#685bc7] transition-all cursor-pointer">
            Quay lại Danh sách Sự kiện
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col font-sans bg-[#FEFEFE] text-[#131413] min-h-screen pt-28 pb-20 selection:bg-[#7C6FE8] selection:text-white">
      <main className="w-full">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8">
          {/* Breadcrumb Back Button */}
          <div className="mb-6">
            <Link href="/events">
              <button className="text-xs font-bold text-[#7C6FE8] hover:text-[#685bc7] flex items-center gap-1.5 transition-colors cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại Danh sách Sự kiện & Ưu Đãi</span>
              </button>
            </Link>
          </div>

          {/* Header Title Section */}
          <div className="flex flex-col gap-3 mb-8">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-100 text-[#7C6FE8] text-xs font-extrabold uppercase">
                {event.categoryName}
              </span>
              {event.badgeText && (
                <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-extrabold uppercase">
                  {event.badgeText}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
              {event.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-3xl">
              {event.summary}
            </p>
          </div>

          {/* Feature Image Cover */}
          <div className="w-full aspect-video max-h-[440px] rounded-3xl overflow-hidden bg-slate-900 shadow-md mb-10 relative">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Main 2-Column Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
            {/* Left Column: 8 Cols - Detailed Terms & Guide */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Coupon Box (If voucher exists) */}
              {event.couponCode && (
                <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#7C6FE8] text-white flex items-center justify-center shrink-0">
                      <Gift className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                        MÃ VOUCHER ƯU ĐÃI
                      </span>
                      <span className="text-xl font-extrabold text-[#7C6FE8] font-mono tracking-wider">
                        {event.couponCode}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'ĐÃ SAO CHÉP MÃ!' : 'SAO CHÉP MÃ'}</span>
                  </button>
                </div>
              )}

              {/* Event Description Paragraphs */}
              <div className="flex flex-col gap-4 text-sm text-slate-700 font-medium leading-relaxed">
                <h3 className="text-base font-extrabold text-slate-900 border-b border-gray-100 pb-2">
                  Nội Dung Chi Tiết Chương Trình
                </h3>
                <p>{event.description || event.summary}</p>
              </div>

              {/* Steps To Redeem */}
              {event.stepsToRedeem && event.stepsToRedeem.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-base font-extrabold text-slate-900 border-b border-gray-100 pb-2">
                    Hướng Dẫn Nhận Ưu Đãi
                  </h3>
                  <div className="flex flex-col gap-3">
                    {event.stepsToRedeem.map((step, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-gray-100 flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#7C6FE8] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 leading-relaxed">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Terms and Conditions */}
              {event.termsAndConditions && event.termsAndConditions.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-base font-extrabold text-slate-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#7C6FE8]" />
                    <span>Điều Khoản & Điều Kiện Sử Dụng</span>
                  </h3>
                  <ul className="flex flex-col gap-2.5 text-xs text-slate-600 font-medium pl-2">
                    {event.termsAndConditions.map((term, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column: 4 Cols - Sticky Quick Actions Card */}
            <div className="lg:col-span-4 flex flex-col gap-6 sticky top-28">
              <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-5">
                <div className="flex flex-col border-b border-gray-100 pb-4">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    GIÁ TRỊ ƯU ĐÃI
                  </span>
                  <span className="text-2xl font-extrabold text-[#7C6FE8]">
                    {event.discountValue || 'ƯU ĐÃI ĐẶC BIỆT'}
                  </span>
                </div>

                <div className="flex flex-col gap-3 text-xs text-slate-600 font-semibold">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#7C6FE8]" />
                    <span>Hạn đến: {event.endDate}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-[#7C6FE8] shrink-0 mt-0.5" />
                    <span>Áp dụng: {event.applicableCinemas.join(', ')}</span>
                  </div>
                </div>

                <Link href="/movies">
                  <button className="w-full py-4 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#7C6FE8]/30 transition-all cursor-pointer">
                    <Ticket className="w-4 h-4" />
                    <span>ĐẶT VÉ VỚI ƯU ĐÃI NÀY</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
