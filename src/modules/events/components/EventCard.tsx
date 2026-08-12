'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import { CineDotEvent } from '../types/events.types';

interface EventCardProps {
  event: CineDotEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <Link href={`/events/${event.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
        className="w-full bg-white rounded-3xl p-4 border border-gray-100 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between gap-4 group cursor-pointer h-full"
      >
        {/* Image Box 16:9 */}
        <div className="flex flex-col gap-3">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 shadow-xs">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {event.badgeText && (
              <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold uppercase shadow-sm">
                {event.badgeText}
              </span>
            )}

            {event.discountValue && (
              <span className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#7C6FE8] text-white text-[10px] font-extrabold shadow-sm">
                {event.discountValue}
              </span>
            )}
          </div>

          {/* Event Content Info */}
          <div className="flex flex-col gap-1.5 px-1">
            <span className="text-[10px] font-extrabold text-[#7C6FE8] uppercase tracking-wider">
              {event.categoryName}
            </span>

            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-[#7C6FE8] transition-colors line-clamp-2 leading-snug">
              {event.title}
            </h3>

            <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
              {event.summary}
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 px-1 mt-auto text-xs">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#7C6FE8]" />
            <span>Hạn đến {event.endDate}</span>
          </span>

          <span className="text-[#7C6FE8] font-extrabold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Chi tiết</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </motion.div>
    </Link>
  );
};
