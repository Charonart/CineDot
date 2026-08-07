'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Clock, Ticket, ArrowRight, Flame } from 'lucide-react';
import { CineDotEvent } from '../types/events.types';

interface EventsHeroBannerProps {
  event: CineDotEvent;
}

export const EventsHeroBanner: React.FC<EventsHeroBannerProps> = ({ event }) => {
  // Countdown Timer Logic
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 22,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-lg mb-12 grid grid-cols-1 lg:grid-cols-12 items-center group cursor-pointer max-h-none lg:max-h-[340px]"
    >
      {/* Left Column: Image Box 16:9 (lg:col-span-6) */}
      <div className="lg:col-span-6 relative aspect-video lg:aspect-auto w-full lg:h-[340px] overflow-hidden bg-slate-900 shrink-0">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 fill-white" />
            <span>{event.badgeText || 'ƯU ĐÃI NỔI BẬT'}</span>
          </span>
        </div>
      </div>

      {/* Right Column: Event Info (lg:col-span-6) */}
      <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-4 bg-white h-full">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider">
              {event.categoryName}
            </span>
            <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {event.discountValue}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-[#7C6FE8] transition-colors leading-tight">
            {event.title}
          </h2>

          <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
            {event.summary}
          </p>
        </div>

        {/* Countdown Box */}
        <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-between gap-2">
          <span className="text-[11px] font-extrabold text-[#7C6FE8] uppercase flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#7C6FE8]" />
            <span>Thời gian ưu đãi còn:</span>
          </span>

          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900 font-mono">
            <span className="bg-white px-2 py-1 rounded-lg border border-purple-200 shadow-2xs">
              {String(timeLeft.days).padStart(2, '0')} ngày
            </span>
            <span>:</span>
            <span className="bg-white px-2 py-1 rounded-lg border border-purple-200 shadow-2xs">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span>:</span>
            <span className="bg-white px-2 py-1 rounded-lg border border-purple-200 shadow-2xs">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span>:</span>
            <span className="bg-white px-2 py-1 rounded-lg border border-purple-200 shadow-2xs text-[#7C6FE8]">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Hạn đến {event.endDate}</span>
          </span>

          <Link href={`/events/${event.slug}`}>
            <button className="px-5 py-2.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#7C6FE8]/30 transition-all cursor-pointer">
              <span>XEM CHI TIẾT ƯU ĐÃI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
