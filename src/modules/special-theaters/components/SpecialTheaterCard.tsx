'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, MapPin, Ticket, ArrowRight, Sparkles } from 'lucide-react';
import { SpecialTheaterSpec } from '../types/special-theaters.types';

interface SpecialTheaterCardProps {
  spec: SpecialTheaterSpec;
}

export const SpecialTheaterCard: React.FC<SpecialTheaterCardProps> = ({ spec }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all grid grid-cols-1 lg:grid-cols-12 items-stretch mb-10 group"
    >
      {/* Left Image Box (lg:col-span-6) */}
      <div className="lg:col-span-6 relative aspect-video lg:aspect-auto w-full overflow-hidden bg-slate-900 shrink-0">
        <img
          src={spec.imageUrl}
          alt={spec.formatName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        <span
          className={`absolute top-4 left-4 px-3.5 py-1.5 rounded-full text-white font-extrabold text-xs uppercase tracking-wider shadow-md ${spec.badgeColor}`}
        >
          {spec.badgeText}
        </span>
      </div>

      {/* Right Details Box (lg:col-span-6) */}
      <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-5 bg-white">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#7C6FE8] uppercase tracking-wider">
              {spec.format} FORMAT
            </span>
            <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {spec.priceRange}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-[#7C6FE8] transition-colors leading-tight">
            {spec.formatName}
          </h2>

          <p className="text-xs font-bold text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200/60">
            ✨ {spec.tagline}
          </p>

          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {spec.description}
          </p>
        </div>

        {/* Tech Specs Badges */}
        <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            THÔNG SỐ KỸ THUẬT NỔI BẬT:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {spec.specs.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#7C6FE8] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Applicable Cinema Locations */}
        <div className="flex flex-col gap-1.5 text-xs text-slate-500 font-semibold pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1 text-slate-700 font-extrabold">
            <MapPin className="w-3.5 h-3.5 text-[#7C6FE8]" />
            <span>Phòng chiếu khả dụng tại:</span>
          </div>
          <ul className="flex flex-col gap-1 text-[11px] text-slate-600 pl-5 list-disc">
            {spec.applicableCinemas.map((cinema, idx) => (
              <li key={idx}>{cinema}</li>
            ))}
          </ul>
        </div>

        {/* CTA Booking Button */}
        <div className="pt-2">
          <Link href="/movies">
            <button className="w-full py-3.5 rounded-full bg-[#7C6FE8] hover:bg-[#685bc7] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#7C6FE8]/30 transition-all cursor-pointer">
              <Ticket className="w-4 h-4" />
              <span>{spec.ctaText}</span>
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
