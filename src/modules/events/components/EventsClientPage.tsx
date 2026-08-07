'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CineDotEvent, EventCategory } from '../types/events.types';
import { fetchEvents, fetchFeaturedEvent } from '../services/events.service';
import { EventsHeroBanner } from './EventsHeroBanner';
import { EventsCategoryTabs } from './EventsCategoryTabs';
import { EventCard } from './EventCard';
import { Skeleton } from '@/shared/ui/Skeleton';

export function EventsClientPage() {
  const [activeCategory, setActiveCategory] = useState<EventCategory>('ALL');
  const [featuredEvent, setFeaturedEvent] = useState<CineDotEvent | null>(null);
  const [events, setEvents] = useState<CineDotEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [feat, list] = await Promise.all([
          fetchFeaturedEvent(),
          fetchEvents('ALL'),
        ]);
        setFeaturedEvent(feat);
        setEvents(list);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredEvents = useMemo(() => {
    if (activeCategory === 'ALL') return events;
    return events.filter((evt) => evt.category === activeCategory);
  }, [events, activeCategory]);

  return (
    <div className="w-full flex flex-col font-sans bg-[#FEFEFE] text-[#131413] min-h-screen pt-28 pb-20 selection:bg-[#7C6FE8] selection:text-white">
      <main className="w-full">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
          {/* Page Header */}
          <div className="flex flex-col gap-2 mb-8">
            <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#7C6FE8] rounded-full inline-block" />
              <span>Chương Trình Ưu Đãi & Khuyến Mãi</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Sự Kiện & Khuyến Mãi CineDot
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl">
              Săn mã giảm giá vé xem phim IMAX, voucher bắp nước quà tặng và đặc quyền dành riêng cho thành viên rạp CineDot.
            </p>
          </div>

          {/* 1. Featured Spotlight Mega Banner */}
          {loading ? (
            <Skeleton variant="card" className="w-full h-80 rounded-3xl mb-12" />
          ) : (
            featuredEvent && <EventsHeroBanner event={featuredEvent} />
          )}

          {/* 2. Category Filter Tabs */}
          <EventsCategoryTabs
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          {/* 3. Event Cards 3-Column Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} variant="card" className="h-72 rounded-3xl" />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 rounded-3xl border border-gray-100 flex flex-col items-center gap-3">
              <span className="text-lg font-extrabold text-slate-700">Chưa có chương trình ưu đãi nào trong danh mục này</span>
              <button
                onClick={() => setActiveCategory('ALL')}
                className="px-5 py-2 rounded-full bg-[#7C6FE8] text-white font-extrabold text-xs"
              >
                Xem tất cả sự kiện
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
